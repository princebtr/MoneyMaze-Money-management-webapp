from pymongo import MongoClient, ReturnDocument
from bson.objectid import ObjectId
from datetime import datetime

class Debt:
    def __init__(self, db):
        self.collection = db.debts
    
    def create(self, name, amount, due_date, status, category=None, priority=None, description=None):
        debt_document = {
            "name": name,
            "amount": amount,
            "due_date": due_date,
            "status": status,
            "category": category,
            "priority": priority,
            "description": description,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = self.collection.insert_one(debt_document)
        return result.inserted_id

    def find_all(self):
        return list(self.collection.find())

    def find_by_id(self, debt_id):
        return self.collection.find_one({"_id": ObjectId(debt_id)})

    def update(self, debt_id, **updates):
        updates["updated_at"] = datetime.utcnow()
        result = self.collection.find_one_and_update(
            {"_id": ObjectId(debt_id)},
            {"$set": updates},
            return_document=ReturnDocument.AFTER
        )
        return result

    def delete(self, debt_id):
        result = self.collection.delete_one({"_id": ObjectId(debt_id)})
        return result.deleted_count

class Payment:
    def __init__(self, db):
        self.collection = db.payments
    
    def create(self, debt_id, amount, payment_date, method, notes=None):
        payment_document = {
            "debt_id": ObjectId(debt_id),
            "amount": amount,
            "payment_date": payment_date,
            "method": method,
            "notes": notes,
            "created_at": datetime.utcnow()
        }
        result = self.collection.insert_one(payment_document)
        return result.inserted_id

    def find_by_debt_id(self, debt_id):
        return list(self.collection.find({"debt_id": ObjectId(debt_id)}))

    def find_by_id(self, payment_id):
        return self.collection.find_one({"_id": ObjectId(payment_id)})

    def update(self, payment_id, **updates):
        updates["created_at"] = datetime.utcnow()
        result = self.collection.find_one_and_update(
            {"_id": ObjectId(payment_id)},
            {"$set": updates},
            return_document=ReturnDocument.AFTER
        )
        return result

    def delete(self, payment_id):
        result = self.collection.delete_one({"_id": ObjectId(payment_id)})
        return result.deleted_count