from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid

app = Flask(__name__)
CORS(app)

# In-memory storage for debts
debts = []

@app.route('/api/debts', methods=['GET'])
def get_debts():
    return jsonify(debts)

@app.route('/api/debts', methods=['POST'])
def add_debt():
    data = request.json
    new_debt = {
        '_id': str(uuid.uuid4()),
        'name': data['name'],
        'amount': float(data['amount']),
        'interestRate': float(data['interestRate']),
        'dueDate': data['dueDate'],
        'initialAmount': float(data['amount'])
    }
    debts.append(new_debt)
    return jsonify(new_debt), 201

@app.route('/api/debts/<string:debt_id>', methods=['DELETE'])
def delete_debt(debt_id):
    global debts
    debts = [debt for debt in debts if debt['_id'] != debt_id]
    return jsonify({'success': True, 'message': 'Debt deleted successfully'}), 200

@app.route('/api/debts/<string:debt_id>/payment', methods=['PATCH'])
def make_payment(debt_id):
    data = request.json
    payment_amount = float(data['paymentAmount'])

    for debt in debts:
        if debt['_id'] == debt_id:
            # Ensure the payment does not exceed the amount owed
            if payment_amount < 0:
                return jsonify({'success': False, 'message': 'Payment amount must be positive'}), 400

            debt['amount'] = max(0, debt['amount'] - payment_amount)
            return jsonify(debt), 200

    return jsonify({'success': False, 'message': 'Debt not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
