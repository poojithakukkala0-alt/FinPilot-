"""
MongoDB Database Connection & Index Management for FinPilot
"""

import os

from dotenv import load_dotenv
from pymongo import ASCENDING, DESCENDING, MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

# Load environment variables (supports running from root or backend/)
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "")
DB_NAME = "finpilot"

_client: MongoClient | None = None
_db: Database | None = None

def get_mongo_client() -> MongoClient:
    global _client
    if _client is None:
        uri = os.getenv("MONGODB_URI") or MONGODB_URI
        if not uri:
            # Fallback: recheck .env explicitly
            load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))
            uri = os.getenv("MONGODB_URI", "")
        if not uri:
            raise ValueError("MONGODB_URI is not set in environment or .env file.")
        _client = MongoClient(
            uri,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
            socketTimeoutMS=10000,
        )
    return _client

def get_database() -> Database:
    global _db
    if _db is None:
        client = get_mongo_client()
        _db = client[DB_NAME]
    return _db

# Collection Getters
def get_users_col() -> Collection:
    return get_database()["users"]

def get_transactions_col() -> Collection:
    return get_database()["transactions"]

def get_recurring_col() -> Collection:
    return get_database()["recurring_payments"]

def get_budgets_col() -> Collection:
    return get_database()["budgets"]

def get_goals_col() -> Collection:
    return get_database()["goals"]

def init_indexes():
    """Create optimal indexes for FinPilot queries."""
    db = get_database()

    # users.email (unique)
    db["users"].create_index([("email", ASCENDING)], unique=True, sparse=True)
    db["users"].create_index([("id", ASCENDING)], unique=True, sparse=True)

    # transactions
    db["transactions"].create_index([("user_id", ASCENDING)])
    db["transactions"].create_index([("date", DESCENDING)])
    db["transactions"].create_index([("category", ASCENDING)])
    db["transactions"].create_index([("type", ASCENDING)])
    db["transactions"].create_index([("user_id", ASCENDING), ("date", DESCENDING)])
    db["transactions"].create_index([("transaction_id", ASCENDING)], unique=True, sparse=True)

    # recurring_payments
    db["recurring_payments"].create_index([("user_id", ASCENDING)])

    # budgets
    db["budgets"].create_index([("user_id", ASCENDING)])
    db["budgets"].create_index([("user_id", ASCENDING), ("category", ASCENDING)])

    # goals
    db["goals"].create_index([("user_id", ASCENDING)])

def test_connection() -> bool:
    """Startup connection test."""
    try:
        client = get_mongo_client()
        client.admin.command("ping")
        init_indexes()
        return True
    except Exception as e:  # noqa: BLE001
        print(f"MongoDB connection check failed: {type(e).__name__}")
        return False

if __name__ == "__main__":
    print("Testing FinPilot MongoDB connection...")
    if test_connection():
        print(f"Connected to MongoDB Atlas successfully! Database: {get_database().name}")
    else:
        print("Failed to connect to MongoDB Atlas.")
