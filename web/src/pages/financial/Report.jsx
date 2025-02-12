import React, { useState, useEffect } from 'react'

export default function Report() {
  const [budget, setBudget] = useState({ income: 0, expenses: {} })
  const [goals, setGoals] = useState([])
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const budgetResponse = await fetch('http://localhost:5000/api/budget')
      const budgetData = await budgetResponse.json()
      setBudget(budgetData)

      const goalsResponse = await fetch('http://localhost:5000/api/goals')
      const goalsData = await goalsResponse.json()
      setGoals(goalsData)

      const expensesResponse = await fetch('http://localhost:5000/api/expenses')
      const expensesData = await expensesResponse.json()
      setExpenses(expensesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const calculateSavings = () => {
    const totalExpenses = Object.values(budget.expenses).reduce((total, expense) => total + expense, 0)
    return budget.income - totalExpenses
  }

  const provideFinancialAdvice = () => {
    const savings = calculateSavings()
    const totalExpenses = Object.values(budget.expenses).reduce((total, expense) => total + expense, 0)

    let advice = []

    if (savings < 0) {
      advice.push("You are spending more than you earn. Consider reducing non-essential expenses to avoid debt.")
    } else if (savings > 0 && savings < 0.2 * budget.income) {
      advice.push("Your savings are positive but could be higher. Aim to save at least 20% of your income for financial security.")
    } else {
      advice.push("You are saving a good portion of your income. Keep up the good work!")
    }

    const nearGoal = goals.find(goal => {
      const timeLeft = new Date(goal.deadline) - new Date()
      return timeLeft < 30 * 24 * 60 * 60 * 1000 && goal.amount > savings
    })

    if (nearGoal) {
      advice.push(`You have a goal coming up soon (${nearGoal.name}). Consider allocating more savings towards it to meet the deadline.`)
    }

    if (totalExpenses > 0.7 * budget.income) {
      advice.push("Your expenses are consuming over 70% of your income. Try reducing discretionary spending to increase savings.")
    }

    if (!advice.length) {
      advice.push("Your finances look balanced. Keep monitoring your goals and spending.")
    }

    return advice
  }

  // Function to calculate percentage for a bar
  const getPercentage = (value, total) => {
    return total > 0 ? Math.min((value / total) * 100, 100) : 0
  }

  const totalExpenses = Object.values(budget.expenses).reduce((total, expense) => total + expense, 0)
  const savings = calculateSavings()
  const expensePercentage = getPercentage(totalExpenses, budget.income)
  const savingsPercentage = getPercentage(savings, budget.income)

  return (
    <div className="card">
      <h2 className="card-title">Financial Report</h2>
      
      {/* Summary Section */}
      <div className="report-section">
        <h3>Summary:</h3>
        <p><strong>Monthly Income:</strong> ${budget.income}</p>
        <p><strong>Monthly Expenses:</strong> ${totalExpenses}</p>
        <p><strong>Monthly Savings:</strong> ${savings}</p>

        {/* Expense Bar */}
        <div className="progress-bar">
          <span>Expenses:</span>
          <div className="progress">
            <div className="progress-fill expenses" style={{ width: `${expensePercentage}%` }}></div>
          </div>
          <span>{expensePercentage.toFixed(2)}%</span>
        </div>

        {/* Savings Bar */}
        <div className="progress-bar">
          <span>Savings:</span>
          <div className="progress">
            <div className="progress-fill savings" style={{ width: `${savingsPercentage}%` }}></div>
          </div>
          <span>{savingsPercentage.toFixed(2)}%</span>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="report-section">
        <h3>Goals Progress:</h3>
        <ul>
          {goals.map((goal) => {
            const goalProgress = getPercentage(savings, goal.amount)
            return (
              <li key={goal._id}>
                {goal.name}: ${goal.amount} needed by {goal.deadline}
                <div className="progress-bar">
                  <div className="progress">
                    <div className="progress-fill goal" style={{ width: `${goalProgress}%` }}></div>
                  </div>
                  <span>{goalProgress.toFixed(2)}%</span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Recent Expenses */}
      <div className="report-section">
        <h3>Recent Expenses:</h3>
        <ul>
          {expenses.slice(0, 5).map((expense) => (
            <li key={expense._id}>
              {expense.name}: ${expense.amount} on {expense.date}
            </li>
          ))}
        </ul>
      </div>

      {/* Financial Advice Section */}
      <div className="report-section">
        <h3>Financial Advice:</h3>
        <ul>
          {provideFinancialAdvice().map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
