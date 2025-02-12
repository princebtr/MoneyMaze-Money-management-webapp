import React, { useState, useEffect } from 'react'

export default function Goals() {
  const [goals, setGoals] = useState([])

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/goals')
      const data = await response.json()
      setGoals(data)
    } catch (error) {
      console.error('Error fetching goals:', error)
    }
  }

  const handleAddGoal = async (e) => {
    e.preventDefault()
    const newGoal = {
      name: e.target.goalName.value,
      amount: parseFloat(e.target.goalAmount.value),
      deadline: e.target.goalDeadline.value,
      category: e.target.goalCategory.value
    }
    try {
      const response = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGoal),
      })
      const data = await response.json()
      setGoals([...goals, data])
      e.target.reset()
    } catch (error) {
      console.error('Error adding goal:', error)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">Financial Goals</h2>
      <form onSubmit={handleAddGoal} className="form">
        <div className="form-group">
          <label htmlFor="goalName">Goal Name</label>
          <input id="goalName" type="text" required />
        </div>
        <div className="form-group">
          <label htmlFor="goalAmount">Amount</label>
          <input id="goalAmount" type="number" min="0" step="0.01" required />
        </div>
        <div className="form-group">
          <label htmlFor="goalDeadline">Deadline</label>
          <input id="goalDeadline" type="date" required />
        </div>
        <div className="form-group">
          <label htmlFor="goalCategory">Category</label>
          <select id="goalCategory" required>
            <option value="">Select a category</option>
            <option value="savings">Savings</option>
            <option value="investment">Investment</option>
            <option value="debt">Debt Repayment</option>
            <option value="purchase">Major Purchase</option>
            <option value="education">Education</option>
            <option value="travel">Travel</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit" className="btn">Add Goal</button>
      </form>
      <div className="goals-list">
        <h3>Your Goals:</h3>
        <ul>
          {goals.map((goal) => (
            <li key={goal._id} className="goal-item">
              <span className="goal-name">{goal.name}</span>
              <span className="goal-amount">${goal.amount}</span>
              <span className="goal-deadline">by {goal.deadline}</span>
              <span className="goal-category">{goal.category}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}