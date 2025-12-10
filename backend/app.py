import fastapi
import uvicorn
from dotenv import load_dotenv
import os
from groq import Groq
from pymongo import MongoClient
import json
from datetime import datetime

from prompt import PROMPT_TEMPLATE
from yfinance_utils import fetch_yfinance_data

load_dotenv()

app = fastapi.FastAPI()

# Initialize Groq client
groq_client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

# Initialize MongoDB client
MONGO_URI = os.getenv("MONGODB_URI")
if not MONGO_URI:
    raise ValueError("MONGODB_URI not found in environment variables.")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["mutual-fund-data"]
collection = db["mutual-fund-data"]

# Initialize MongoDB client for session history
session_history_db = mongo_client["session-history"]
messages_collection = session_history_db["messages"]

# Helper function to manage user session history
def update_user_history(user_name: str, human_message: str, bot_message: dict):
    user_record = messages_collection.find_one({"user_name": user_name})
    if not user_record:
        messages_collection.insert_one({
            "user_name": user_name,
            "history": [
                {"type": "human", "content": human_message},
                {"type": "bot", "content": bot_message}
            ]
        })
    else:
        history = user_record.get("history", [])
        history.append({"type": "human", "content": human_message})
        history.append({"type": "bot", "content": bot_message})
        # Keep only the last 5 conversations (10 entries: 5 human, 5 bot)
        if len(history) > 10:
            history = history[-10:]
        messages_collection.update_one(
            {"user_name": user_name},
            {"$set": {"history": history}}
        )


def get_ticker_from_groq(user_query: str) -> str | None:
    """
    Uses Groq to extract a stock ticker from a user query.
    """
    chat_completion = groq_client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": PROMPT_TEMPLATE,
            },
            {
                "role": "user",
                "content": user_query,
            }
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

def search_mongodb_for_ticker(ticker: str):
    """
    Searches the MongoDB database for information related to the given stock ticker.
    """
    try:
        # Assuming 'Symbol' is the field storing the ticker in MongoDB
        result = collection.find_one({"Symbol": ticker})
        return result
    except Exception as e:
        print(f"An error occurred during MongoDB search: {e}")
        return None

@app.get("/user_history/")
async def get_user_history(user_name: str):
    user_record = messages_collection.find_one({"user_name": user_name})
    if not user_record:
        # Create new user if not exists
        messages_collection.insert_one({"user_name": user_name, "history": []})
        return {"user_name": user_name, "history": []}
    else:
        return {"user_name": user_name, "history": user_record.get("history", [])[-10:]}

@app.get("/search_stock/")
async def search_stock(user_name: str, query: str):
    """
    Endpoint to search for stock information based on a user query.
    """
    ticker = get_ticker_from_groq(query)
    if ticker:
        mongo_data = search_mongodb_for_ticker(ticker)
        if mongo_data:
            # Remove MongoDB's _id field for cleaner JSON response
            mongo_data.pop('_id', None)
            yfinance_data = fetch_yfinance_data(ticker)

            # Store interaction in session history
            # interaction_record = {
            #     "user_name": user_name,
            #     "query": query,
            #     "ticker": ticker,
            #     "yfinance_data": yfinance_data,
            #     "timestamp": datetime.now()
            # }
            # messages_collection.insert_one(interaction_record)
            
            bot_response = {"ticker": ticker, "mongo_data": mongo_data, "yfinance_data": yfinance_data}
            update_user_history(user_name, query, bot_response)

            return bot_response
        else:
            # Store interaction in session history even if no mongo_data
            # interaction_record = {
            #     "user_name": user_name,
            #     "query": query,
            #     "ticker": ticker,
            #     "mongo_data": None,
            #     "yfinance_data": fetch_yfinance_data(ticker),
            #     "timestamp": datetime.now()
            # }
            # messages_collection.insert_one(interaction_record)
            bot_response = {"ticker": ticker, "message": f"No data found for {ticker} in MongoDB."}
            update_user_history(user_name, query, bot_response)
            return bot_response
    else:
        # Store interaction if no ticker found
        # interaction_record = {
        #     "user_name": user_name,
        #     "query": query,
        #     "ticker": None,
        #     "mongo_data": None,
        #     "yfinance_data": None,
        #     "timestamp": datetime.now()
        # }
        # messages_collection.insert_one(interaction_record)
        bot_response = {"message": "No stock ticker found in the query."}
        update_user_history(user_name, query, bot_response)
        return bot_response

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
