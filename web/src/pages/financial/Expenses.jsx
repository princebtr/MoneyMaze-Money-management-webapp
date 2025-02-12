import React, { useState, useEffect } from 'react'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses')
      const data = await response.json()
      setExpenses(data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    const newExpense = {
      name: e.target.expenseName.value,
      amount: parseFloat(e.target.expenseAmount.value),
      date: e.target.expenseDate.value,
      category: e.target.expenseCategory.value
    }
    try {
      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExpense),
      })
      const data = await response.json()
      setExpenses([...expenses, data])
      e.target.reset()
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">Expense Tracker</h2>
      <form onSubmit={handleAddExpense} className="form">
        <div className="form-group">
          <label htmlFor="expenseName">Expense Name</label>
          <input id="expenseName" type="text" required />
        </div>
        <div className="form-group">
          <label htmlFor="expenseAmount">Amount</label>
          <input id="expenseAmount" type="number" min="0" step="0.01" required />
        </div>
        <div className="form-group">
          <label htmlFor="expenseDate">Date</label>
          <input id="expenseDate" type="date" required />
        </div>
        <div className="form-group">
          <label htmlFor="expenseCategory">Category</label>
          <select id="expenseCategory" required>
            <option value="">Select a category</option>
            <option value="housing">Housing</option>
            <option value="transportation">Transportation</option>
            <option value="food">Food</option>
            <option value="utilities">Utilities</option>
            <option value="healthcare">Healthcare</option>
            <option value="personal">Personal</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit" className="btn">Add Expense</button>
      </form>
      <div className="expenses-list">
        <h3>Recent Expenses:</h3>
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id} className="expense-item">
              <span className="expense-name">{expense.name}</span>
              <span className="expense-amount">${expense.amount}</span>
              <span className="expense-date">on {expense.date}</span>
              <span className="expense-category">{expense.category}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}