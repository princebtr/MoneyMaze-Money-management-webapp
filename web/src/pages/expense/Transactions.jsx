import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [newTransaction, setNewTransaction] = useState({
        name: '',
        amount: '',
        category: '',
        isRecurring: false,
        frequency: 'monthly'
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewTransaction(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddTransaction = async () => {
        try {
            const response = await axios.post('http://localhost:5000/transactions', newTransaction);
            setTransactions(prev => [...prev, response.data]);
            setNewTransaction({ name: '', amount: '', category: '', isRecurring: false, frequency: 'monthly' });
        } catch (error) {
            console.error("Error adding transaction", error);
        }
    };

    return (
        <div className="transactions">
            <h2>Transactions</h2>
            <div className="add-transaction">
                <h3>Add New Transaction</h3>
                <div className="form-grid">
                    <input
                        name="name"
                        value={newTransaction.name}
                        onChange={handleInputChange}
                        placeholder="Transaction Name"
                    />
                    <input
                        name="amount"
                        type="number"
                        value={newTransaction.amount}
                        onChange={handleInputChange}
                        placeholder="Amount"
                    />
                    <input
                        name="category"
                        value={newTransaction.category}
                        onChange={handleInputChange}
                        placeholder="Category"
                    />
                    <label>
                        <input
                            type="checkbox"
                            name="isRecurring"
                            checked={newTransaction.isRecurring}
                            onChange={handleInputChange}
                        />
                        Recurring Transaction
                    </label>
                    {newTransaction.isRecurring && (
                        <select
                            name="frequency"
                            value={newTransaction.frequency}
                            onChange={handleInputChange}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    )}
                    <button onClick={handleAddTransaction}>Add Transaction</button>
                </div>
            </div>
            <div className="transaction-list">
                <h3>Recent Transactions</h3>
                <ul>
                    {transactions.map(transaction => (
                        <li key={transaction._id} className="transaction-item">
                            <span className="transaction-name">{transaction.name}</span>
                            <span className="transaction-amount">${transaction.amount}</span>
                            <span className="transaction-category">{transaction.category}</span>
                            {transaction.isRecurring && <span className="transaction-recurring">Recurring ({transaction.frequency})</span>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
