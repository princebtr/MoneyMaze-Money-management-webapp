from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson import ObjectId
from bson.json_util import dumps
from flask_cors import CORS
from datetime import datetime, timedelta
import random
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable cross-origin resource sharing

# MongoDB configuration
app.config["MONGO_URI"] = os.getenv("MONGODB_URI") or "mongodb://localhost:27017/finance_db"
mongo = PyMongo(app)

# Additional connection for another collection (if needed)
client = MongoClient(app.config["MONGO_URI"])
db = client['finance_app']
debts_collection = db['debts']
overview_collection = db['overview']
transactions_collection = db['transactions']
reports_collection = db['reports']

# Helper: Convert MongoDB ObjectId to a string
def transaction_serializer(transaction):
    return {
        'id': str(transaction['_id']),
        'name': transaction['name'],
        'amount': transaction['amount'],
        'frequency': transaction['frequency'],
        'category': transaction['category'],
        'nextDueDate': transaction['nextDueDate'].isoformat()
    }

# Initial data insertion into MongoDB (for example purposes)
if overview_collection.count_documents({}) == 0:
    overview_data = [
        {"title": "Total Revenue", "value": "$45,231.89", "change": "+20.1% from last month"},
        {"title": "Expenses", "value": "$12,345.00", "change": "+4.75% from last month"},
        {"title": "Profit Margin", "value": "72.8%", "change": "+2.3% from last month"},
        {"title": "Active Projects", "value": "12", "change": "+2 from last month"},
    ]
    overview_collection.insert_many(overview_data)

# Generate Revenue Data
def generate_revenue_data():
    return [
        {"name": "Jan", "total": 1500},
        {"name": "Feb", "total": 1800},
        {"name": "Mar", "total": 2200},
        {"name": "Apr", "total": 2600},
        {"name": "May", "total": 2400},
        {"name": "Jun", "total": 2800},
    ]

# Recurring Transaction Endpoints
@app.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = mongo.db.transactions.find()
    return jsonify([transaction_serializer(transaction) for transaction in transactions])

@app.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.get_json()
    new_transaction = {
        'name': data['name'],
        'amount': data['amount'],
        'frequency': data['frequency'],
        'category': data['category'],
        'nextDueDate': datetime.fromisoformat(data['nextDueDate'])
    }
    result = mongo.db.transactions.insert_one(new_transaction)
    return jsonify({'id': str(result.inserted_id)}), 201

@app.route('/transactions/<transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    data = request.get_json()
    updated_transaction = {
        'name': data['name'],
        'amount': data['amount'],
        'frequency': data['frequency'],
        'category': data['category'],
        'nextDueDate': datetime.fromisoformat(data['nextDueDate'])
    }
    mongo.db.transactions.update_one({'_id': ObjectId(transaction_id)}, {"$set": updated_transaction})
    return jsonify({'message': 'Transaction updated successfully'})

@app.route('/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    mongo.db.transactions.delete_one({'_id': ObjectId(transaction_id)})
    return jsonify({'message': 'Transaction deleted successfully'})

# User and Financial Data Endpoints
@app.route('/api/user', methods=['GET'])
def get_user():
    user_collection = mongo.db.users
    user = user_collection.find_one({"email": "alice@example.com"})  # Example user
    if user:
        return dumps(user)
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/api/financial', methods=['GET'])
def get_financial_data():
    financial_collection = mongo.db.financials
    financial_data = financial_collection.find_one({"email": "alice@example.com"})  # Example financial record
    if financial_data:
        return dumps(financial_data)
    else:
        return jsonify({"error": "Financial data not found"}), 404

# Goals, Expenses, and Budget Endpoints
@app.route('/api/goals', methods=['GET', 'POST'])
def handle_goals():
    if request.method == 'GET':
        goals = list(db.goals.find())
        for goal in goals:
            goal['_id'] = str(goal['_id'])
        return jsonify(goals)
    elif request.method == 'POST':
        new_goal = request.json
        result = db.goals.insert_one(new_goal)
        new_goal['_id'] = str(result.inserted_id)
        return jsonify(new_goal), 201

# Current User and Debts Endpoints
@app.route('/api/currentUser', methods=['GET'])
def get_current_user():
    user = {"id": 1, "username": "testuser", "email": "test@example.com"}
    return jsonify(user)

@app.route('/api/debts', methods=['GET', 'POST'])
def handle_debts():
    if request.method == 'GET':
        debts = list(debts_collection.find({}, {'_id': 0}))  # Fetch debts without MongoDB _id
        return jsonify(debts)
    elif request.method == 'POST':
        data = request.json
        debt = {
            'name': data['name'],
            'amount': data['amount'],
            'interestRate': data['interestRate'],
        }
        result = debts_collection.insert_one(debt)
        debt['_id'] = str(result.inserted_id)
        return jsonify(debt), 201

@app.route('/api/debts/<id>/payment', methods=['PATCH'])
def make_payment(id):
    data = request.json
    payment_amount = data['paymentAmount']
    debt = debts_collection.find_one({'_id': ObjectId(id)})

    if debt:
        new_amount = max(0, debt['amount'] - payment_amount)
        debts_collection.update_one({'_id': ObjectId(id)}, {'$set': {'amount': new_amount}})
        debt['amount'] = new_amount  # Update the amount in the returned debt
        debt['_id'] = str(debt['_id'])  # Convert ObjectId to string for JSON response
        return jsonify(debt)  # Return the updated debt
    return jsonify({'error': 'Debt not found'}), 404

# Overview and Revenue Endpoints
@app.route('/api/overview', methods=['GET'])
def get_overview():
    overview = list(overview_collection.find({}, {"_id": 0}))  # Exclude the _id field from the result
    return jsonify(overview)

@app.route('/api/revenue', methods=['GET'])
def get_revenue():
    return jsonify(generate_revenue_data())

# Report Generation Endpoint
@app.route('/api/generate-report', methods=['POST'])
def generate_report():
    report_type = request.json.get('reportType')
    start_date = request.json.get('startDate')
    end_date = request.json.get('endDate')
    
    # Example report generation logic
    report_data = {
        "reportType": report_type,
        "startDate": start_date,
        "endDate": end_date,
        "data": [
            {"category": "Income", "amount": 50000},
            {"category": "Expenses", "amount": 30000},
            {"category": "Profit", "amount": 20000}
        ],
        "generatedAt": datetime.now().isoformat()
    }
    
    # Save report to MongoDB
    reports_collection.insert_one(report_data)
    
    return jsonify(report_data), 201

# Analytics Endpoint
@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    analytics_data = {
        "monthlyRevenue": [
            {"month": "Jan", "revenue": 30000},
            {"month": "Feb", "revenue": 35000},
            {"month": "Mar", "revenue": 40000},
            {"month": "Apr", "revenue": 38000},
            {"month": "May", "revenue": 42000},
            {"month": "Jun", "revenue": 45000}
        ],
        "topProducts": [
            {"name": "Product A", "sales": 1200},
            {"name": "Product B", "sales": 900},
            {"name": "Product C", "sales": 800}
        ],
        "customerAcquisition": {
            "newCustomers": 150,
            "churnRate": "2.5%"
        }
    }
    return jsonify(analytics_data)

# Insights Endpoint
@app.route('/api/insights', methods=['GET'])
def get_insights():
    insights_data = {
        "insights": [
            "Consider reducing expenses in the marketing department to increase profit margins.",
            "Sales have increased by 15% in the last quarter; focus on maintaining this momentum.",
            "Diversify revenue streams by exploring new product lines based on customer feedback."
        ],
        "recommendations": [
            "Review your pricing strategy; a slight increase could enhance revenue without affecting sales volume.",
            "Invest in customer retention programs to decrease churn and enhance lifetime value.",
            "Utilize data analytics to identify key market trends and adjust your strategy accordingly."
        ]
    }
    return jsonify(insights_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Specify port if needed