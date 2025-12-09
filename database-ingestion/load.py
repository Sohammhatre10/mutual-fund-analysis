import yfinance as yf
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from extract import extract_constituents

def load_data_to_mongodb(df, collection):
    """
    Loads a pandas DataFrame into a MongoDB collection.
    """
    if df is None or df.empty:
        print("No data to load into MongoDB.")
        return

    records = df.to_dict(orient='records')
    try:
        collection.insert_many(records)
        print(f"Successfully loaded {len(records)} records into MongoDB collection '{collection.name}'.")
    except Exception as e:
        print(f"An error occurred during MongoDB insertion: {e}")


if __name__ == "__main__":
    load_dotenv()

    MONGO_URI = os.getenv("MONGODB_URI")
    if not MONGO_URI:
        print("Error: MONGO_URI not found in environment variables.")
        exit(1)

    client = MongoClient(MONGO_URI)
    db = client["mutual-fund-data"]
    collection = db["mutual-fund-data"]

    # Extract data
    constituents_df = extract_constituents()

    # Load data into MongoDB
    load_data_to_mongodb(constituents_df, collection)

    client.close()
    print("MongoDB connection closed.")