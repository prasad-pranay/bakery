import os
from pymongo import MongoClient
from app.config import Config

_client = None
_db = None

def get_db():
    global _client, _db
    if _db is None:
        _client = MongoClient(Config.MONGODB_URI)
        _db = _client.get_default_database()
        if _db is None:
            # Fallback to database named 'bakery' if URI didn't specify path
            _db = _client['bakery']
    return _db

def init_db(app=None):
    db = get_db()
    # Create indexes matching Mongoose schemas
    db.users.create_index("email", unique=True)
    db.orders.create_index("orderId", unique=True)
    db.coupons.create_index("code", unique=True)
    db.conversations.create_index([("userId", 1)])
    db.conversations.create_index([("status", 1)])
    db.conversations.create_index([("updatedAt", -1)])
    db.conversations.create_index([("userId", 1), ("status", 1)])
    db.messages.create_index([("conversationId", 1)])
    db.messages.create_index([("conversationId", 1), ("createdAt", 1)])
    return db
