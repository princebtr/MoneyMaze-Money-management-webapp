"use client"

import { useState, useEffect } from 'react'
import { Line, LineChart, Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const generateMockData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map(month => ({
    month,
    income: Math.floor(Math.random() * 10000) + 5000,
    expenses: Math.floor(Math.random() * 5000) + 2000,
    savings: Math.floor(Math.random() * 3000) + 1000,
    investments: Math.floor(Math.random() * 2000) + 500
  }))
}

const generateExpenseData = () => {
  return [
    { name: 'Housing', value: 1500 },
    { name: 'Food', value: 500 },
    { name: 'Transportation', value: 300 },
    { name: 'Utilities', value: 200 },
    { name: 'Entertainment', value: 150 }
  ]
}

const generateInvestmentData = () => {
  return [
    { name: 'Stocks', value: 5000 },
    { name: 'Bonds', value: 3000 },
    { name: 'Real Estate', value: 7000 },
    { name: 'Crypto', value: 1000 },
    { name: 'Cash', value: 2000 }
  ]
}

export default function FinancialHealthDashboard() {
  const [financialData, setFinancialData] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const [investmentData, setInvestmentData] = useState([])

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    setFinancialData(generateMockData())
    setExpenseData(generateExpenseData())
    setInvestmentData(generateInvestmentData())
  }, [])

  const calculateNetWorth = () => {
    return financialData.reduce((total, month) => total + month.savings + month.investments, 0)
  }

  const calculateSavingsRate = () => {
    const totalIncome = financialData.reduce((total, month) => total + month.income, 0)
    const totalSavings = financialData.reduce((total, month) => total + month.savings, 0)
    return totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(2) : '0.00'
  }

  const getFinancialHealthStatus = () => {
    const savingsRate = parseFloat(calculateSavingsRate())
    if (savingsRate > 20) return 'Excellent'
    if (savingsRate > 15) return 'Good'
    if (savingsRate > 10) return 'Fair'
    return 'Needs Improvement'
  }

  if (financialData.length === 0 || expenseData.length === 0 || investmentData.length === 0) {
    return <div className="text-center p-4">Loading financial data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Net Worth</h3>
          <p className="text-3xl font-bold">${calculateNetWorth().toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Savings Rate</h3>
          <p className="text-3xl font-bold">{calculateSavingsRate()}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Financial Health</h3>
          <p className="text-3xl font-bold">{getFinancialHealthStatus()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Investments</h3>
          <p className="text-3xl font-bold">${investmentData.reduce((total, item) => total + item.value, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#8884d8" />
              <Line type="monotone" dataKey="expenses" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Savings and Investments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="savings" fill="#8884d8" />
              <Bar dataKey="investments" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Investment Portfolio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={investmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {investmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Financial Insights</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Your savings rate is {calculateSavingsRate()}%, which is {getFinancialHealthStatus().toLowerCase()}. {getFinancialHealthStatus() === 'Excellent' ? 'Keep up the great work!' : 'Consider increasing your savings to improve your financial health.'}</li>
          <li>Your largest expense category is {expenseData.reduce((max, item) => item.value > max.value ? item : max).name}. Look for ways to reduce spending in this area.</li>
          <li>Your investment portfolio is {investmentData.length > 1 ? 'diversified' : 'not diversified'}. {investmentData.length > 1 ? 'Good job spreading your risk!' : 'Consider diversifying your investments to reduce risk.'}</li>
          <li>Your net worth has {financialData[financialData.length - 1].savings + financialData[financialData.length - 1].investments > financialData[0].savings + financialData[0].investments ? 'increased' : 'decreased'} over the past year. {financialData[financialData.length - 1].savings + financialData[financialData.length - 1].investments > financialData[0].savings + financialData[0].investments ? 'Great progress!' : 'Focus on increasing your savings and investments.'}</li>
        </ul>
      </div>
    </div>
    
  )
}