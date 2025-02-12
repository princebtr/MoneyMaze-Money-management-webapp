from config import MONGO_URI, MONGO_DATABASE
from pymongo import MongoClient

# Establish MongoDB connection
def connect_mongodb(uri, db_name):
    client = MongoClient(uri)
    db = client[db_name]
    return db

# Get the MongoDB database object
mdb = connect_mongodb(MONGO_URI, MONGO_DATABASE)

# Helper functions to access collections
def get_users_collection():
    return mdb['users']

def get_recurring_transactions_collection():
    return mdb['recurring_transactions']

def get_transactions_collection():
    return mdb['transactions']
