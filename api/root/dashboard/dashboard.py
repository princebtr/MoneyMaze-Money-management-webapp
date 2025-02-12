from flask_restful import Resource
from flask import request, jsonify
from bson.objectid import ObjectId
from datetime import datetime
from root.db import get_recurring_transactions_collection  # Import collection helper

# Access the recurring transactions collection
recurring_transactions = get_recurring_transactions_collection()

# Resource for Testing route
class Testing(Resource):
    def get(self):
        return {
            "status": 1,
            "cls": "success",
            "msg": "Test successfully completed",
            "payload": {}
        }

# Resource for managing recurring transactions
class RecurringTransaction(Resource):
    def post(self):
        """
        Add a new recurring transaction.
        """
        data = request.get_json()

        # Extract and validate input data
        amount = data.get("amount")
        recurrence_pattern = data.get("recurrence_pattern")  # e.g., daily, weekly, monthly
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        # Check if required fields are present
        if not all([amount, recurrence_pattern, start_date]):
            return {"status": 0, "cls": "error", "msg": "Missing required fields"}, 400

        try:
            # Convert dates to datetime objects
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
            if end_date:
                end_date = datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            return {"status": 0, "cls": "error", "msg": "Invalid date format"}, 400

        # Create the transaction object
        new_transaction = {
            "amount": amount,
            "recurrence_pattern": recurrence_pattern,
            "start_date": start_date,
            "end_date": end_date if end_date else None,
            "status": "active",
            "created_at": datetime.utcnow()
        }

        # Insert the new transaction into the database
        result = recurring_transactions.insert_one(new_transaction)

        return {
            "status": 1,
            "cls": "success",
            "msg": "Recurring transaction added successfully",
            "transaction_id": str(result.inserted_id)
        }, 201

    def patch(self, transaction_id):
        """
        Update a recurring transaction's status (e.g., active, paused, canceled).
        """
        data = request.get_json()
        status = data.get("status")  # e.g., active, paused, canceled

        # Validate the status
        if status not in ["active", "paused", "canceled"]:
            return {"status": 0, "cls": "error", "msg": "Invalid status"}, 400

        # Update the transaction in the database
        result = recurring_transactions.update_one(
            {"_id": ObjectId(transaction_id)},
            {"$set": {"status": status}}
        )

        if result.matched_count == 0:
            return {"status": 0, "cls": "error", "msg": "Transaction not found"}, 404

        return {
            "status": 1,
            "cls": "success",
            "msg": "Transaction status updated successfully"
        }, 200

    def get(self):
        """
        Retrieve all recurring transactions, with optional filtering by status.
        """
        # Optional filter by status (e.g., active, paused)
        status = request.args.get("status")

        # Build the query based on the status filter
        query = {}
        if status:
            query["status"] = status

        transactions = list(recurring_transactions.find(query))

        # Convert ObjectId and dates to readable format
        for transaction in transactions:
            transaction["_id"] = str(transaction["_id"])
            transaction["start_date"] = transaction["start_date"].isoformat()
            if transaction.get("end_date"):
                transaction["end_date"] = transaction["end_date"].isoformat()

        return jsonify(transactions), 200
