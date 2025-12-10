import fastapi
import uvicorn
from dotenv import load_dotenv
import os
from groq import Groq
from pymongo import MongoClient
import json
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

from prompt import PROMPT_TEMPLATE
from yfinance_utils import fetch_yfinance_data

load_dotenv()

app = fastapi.FastAPI()

# CORS middleware - supports both local development and production (Vercel)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
# Build list of allowed origins
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    FRONTEND_URL,
]
# Add https version if http is provided
if FRONTEND_URL.startswith("http://"):
    allowed_origins.append(FRONTEND_URL.replace("http://", "https://"))
elif FRONTEND_URL.startswith("https://"):
    allowed_origins.append(FRONTEND_URL.replace("https://", "http://"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client

API_KEY = os.environ.get("GROQ_API_KEY")
groq_client = Groq(
    api_key=API_KEY,
)
# Initialize MongoDB client
MONGO_URI = os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise ValueError("MONGODB_URI not found in environment variables.")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["mutual-fund-data"]
collection = db["mutual-fund-data"]

# Use a dedicated db for chat session history (messages)
session_history_db = mongo_client["session-history"]
messages_collection = session_history_db["messages"]

def update_user_history(user: str, user_msg: str, bot_resp: dict):
    user_record = messages_collection.find_one({"user": user})
    new_turn = [
        {"0": user_msg},
        {"1": bot_resp}
    ]
    if not user_record:
        messages_collection.insert_one({
            "user": user,
            "history": [new_turn]
        })
    else:
        history = user_record.get("history", [])
        history.append(new_turn)
        if len(history) > 5:
            history = history[-5:]
        messages_collection.update_one(
            {"user": user},
            {"$set": {"history": history}}
        )

@app.get("/user_history/")
async def get_user_history(user: str):
    user_record = messages_collection.find_one({"user": user})
    if not user_record:
        messages_collection.insert_one({"user": user, "history": []})
        return {"user": user, "history": []}
    else:
        # Always at most 5
        return {"user": user, "history": user_record.get("history", [])[-5:]}

def search_mongodb_for_ticker(ticker: str):
    try:
        result = collection.find_one({"Symbol": ticker})
        return result
    except Exception as e:
        print(f"An error occurred during MongoDB search: {e}")
        return None

def get_ticker_from_groq(user_query: str) -> str | None:
    chat_completion = groq_client.chat.completions.create(
        messages=[
            {"role": "system", "content": PROMPT_TEMPLATE},
            {"role": "user", "content": user_query}
        ],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
    )
    try:
        response_content = chat_completion.choices[0].message.content
        json_response = json.loads(response_content)
        return json_response.get("ticker")
    except (json.JSONDecodeError, AttributeError) as e:
        print(f"Error parsing Groq response: {e}")
        return None

@app.get("/search_stock/")
async def search_stock(user: str, query: str):
    ticker = get_ticker_from_groq(query)
    if ticker:
        mongo_data = search_mongodb_for_ticker(ticker)
        if mongo_data:
            mongo_data.pop('_id', None)
            yfinance_data = fetch_yfinance_data(ticker)
            bot_response = {"ticker": ticker, "mongo_data": mongo_data, "yfinance_data": yfinance_data}
            update_user_history(user, query, bot_response)
            return bot_response
        else:
            bot_response = {"ticker": ticker, "message": f"No data found for {ticker} in MongoDB."}
            update_user_history(user, query, bot_response)
            return bot_response
    else:
        bot_response = {"message": "No stock ticker found in the query."}
        update_user_history(user, query, bot_response)
        return bot_response

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
