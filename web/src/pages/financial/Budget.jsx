import React, { useState, useEffect } from 'react'

export default function Budget() {
  const [budget, setBudget] = useState({
    income: 0,
    expenses: {
      housing: 0,
      transportation: 0,
      food: 0,
      utilities: 0,
      healthcare: 0,
      personal: 0,
      entertainment: 0,
      other: 0
    }
  })

  useEffect(() => {
    fetchBudget()
  }, [])

  const fetchBudget = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/budget')
      const data = await response.json()
      if (data) {
        setBudget(data)
      }
    } catch (error) {
      console.error('Error fetching budget:', error)
    }
  }

  const handleUpdateBudget = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newBudget = {
      income: parseFloat(formData.get('income')),
      expenses: {
        housing: parseFloat(formData.get('housing')),
        transportation: parseFloat(formData.get('transportation')),
        food: parseFloat(formData.get('food')),
        utilities: parseFloat(formData.get('utilities')),
        healthcare: parseFloat(formData.get('healthcare')),
        personal: parseFloat(formData.get('personal')),
        entertainment: parseFloat(formData.get('entertainment')),
        other: parseFloat(formData.get('other'))
      }
    }
    try {
      const response = await fetch('http://localhost:5000/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBudget),
      })
      const data = await response.json()
      setBudget(data)
    } catch (error) {
      console.error('Error updating budget:', error)
    }
  }

  const calculateTotalExpenses = () => {
    return Object.values(budget.expenses).reduce((total, expense) => total + expense, 0)
  }

  const calculateSavings = () => {
    return budget.income - calculateTotalExpenses()
  }

  const getPercentage = (value, total) => {
    return total > 0 ? Math.min((value / total) * 100, 100) : 0
  }

  const totalExpenses = calculateTotalExpenses()
  const totalExpensesPercentage = getPercentage(totalExpenses, budget.income)

  return (
    <div className="card">
      <h2 className="card-title">Budget</h2>
      <form onSubmit={handleUpdateBudget} className="form">
        <div className="form-group">
          <label htmlFor="income">Monthly Income</label>
          <input id="income" name="income" type="number" min="0" step="0.01" required />
        </div>
        <h3>Monthly Expenses</h3>
        <div className="expenses-grid">
          {Object.keys(budget.expenses).map((category) => {
            const expense = budget.expenses[category]
            const percentage = getPercentage(expense, budget.income)
            return (
              <div key={category} className="form-group">
                <label htmlFor={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</label>
                <input id={category} name={category} type="number" min="0" step="0.01" required />
                <div className="progress-bar">
                  <div className="progress">
                    <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span>{percentage.toFixed(2)}%</span>
                </div>
              </div>
            )
          })}
        </div>
        <button type="submit" className="btn">Update Budget</button>
      </form>

      <div className="budget-summary">
        <p><strong>Monthly Income:</strong> ${budget.income.toFixed(2)}</p>
        <p><strong>Total Expenses:</strong> ${totalExpenses.toFixed(2)}</p>
        <div className="progress-bar">
          <span>Total Expenses:</span>
          <div className="progress">
            <div className="progress-fill" style={{ width: `${totalExpensesPercentage}%` }}></div>
          </div>
          <span>{totalExpensesPercentage.toFixed(2)}%</span>
        </div>
        <p><strong>Monthly Savings:</strong> ${calculateSavings().toFixed(2)}</p>
      </div>
    </div>
  )
}
