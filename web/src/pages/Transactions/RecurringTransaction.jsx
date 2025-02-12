import  { useState, useEffect } from 'react'

export default function Component() {
  const [transactions, setTransactions] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState('monthly')
  const [category, setCategory] = useState('')
  const [nextDueDate, setNextDueDate] = useState('')
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState('list')

  useEffect(() => {
    // Mock data initialization
    const mockTransactions = [
      {
        id: '1',
        name: 'Netflix Subscription',
        amount: 12.99,
        frequency: 'monthly',
        nextDueDate: new Date(2023, 5, 15),
        category: 'Entertainment'
      },
      {
        id: '2',
        name: 'Gym Membership',
        amount: 50,
        frequency: 'monthly',
        nextDueDate: new Date(2023, 5, 1),
        category: 'Health'
      }
    ]
    setTransactions(mockTransactions)
  }, [])

  useEffect(() => {
    const mockHistory = transactions.flatMap(transaction => 
      Array.from({ length: 5 }, (_, i) => ({
        id: `${transaction.id}-${i}`,
        transactionId: transaction.id,
        date: new Date(transaction.nextDueDate.getTime() - i * 30 * 24 * 60 * 60 * 1000),
        amount: transaction.amount
      }))
    )
    setHistory(mockHistory)
  }, [transactions])

  const addTransaction = (e) => {
    e.preventDefault()
    const newTransaction = {
      id: Date.now().toString(),
      name,
      amount: parseFloat(amount),
      frequency,
      category,
      nextDueDate: new Date(nextDueDate)
    }
    setTransactions([...transactions, newTransaction])
    // Reset form
    setName('')
    setAmount('')
    setFrequency('monthly')
    setCategory('')
    setNextDueDate('')
  }

  const updateTransaction = (updatedTransaction) => {
    setTransactions(transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ))
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const RecurringTransactionsList = () => (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border p-2 text-left">Name</th>
          <th className="border p-2 text-left">Amount</th>
          <th className="border p-2 text-left">Frequency</th>
          <th className="border p-2 text-left">Category</th>
          <th className="border p-2 text-left">Next Due Date</th>
          <th className="border p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td className="border p-2">{transaction.name}</td>
            <td className="border p-2">${transaction.amount.toFixed(2)}</td>
            <td className="border p-2">{transaction.frequency}</td>
            <td className="border p-2">{transaction.category}</td>
            <td className="border p-2">{transaction.nextDueDate.toLocaleDateString()}</td>
            <td className="border p-2">
              <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => updateTransaction(transaction)}>Edit</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteTransaction(transaction.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const AddRecurringTransaction = () => (
    <form onSubmit={addTransaction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1">Transaction Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded" />
      </div>
      <div>
        <label htmlFor="amount" className="block mb-1">Amount</label>
        <input id="amount" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full p-2 border rounded" />
      </div>
      <div>
        <label htmlFor="frequency" className="block mb-1">Frequency</label>
        <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full p-2 border rounded">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div>
        <label htmlFor="category" className="block mb-1">Category</label>
        <input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full p-2 border rounded" />
      </div>
      <div>
        <label htmlFor="nextDueDate" className="block mb-1">Next Due Date</label>
        <input id="nextDueDate" type="date" value={nextDueDate} onChange={(e) => setNextDueDate(e.target.value)} required className="w-full p-2 border rounded" />
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Recurring Transaction</button>
    </form>
  )

  const RecurringTransactionReminders = () => {
    const today = new Date()
    const upcomingTransactions = transactions.filter(t => {
      const daysUntilDue = Math.ceil((t.nextDueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
      return daysUntilDue <= 7 && daysUntilDue > 0
    })

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Upcoming Transactions</h2>
        {upcomingTransactions.map(transaction => (
          <div key={transaction.id} className="border p-4 rounded">
            <h3 className="font-bold">{transaction.name}</h3>
            <p>Due in {Math.ceil((transaction.nextDueDate.getTime() - today.getTime()) / (1000 * 3600 * 24))} days</p>
            <p>Amount: ${transaction.amount.toFixed(2)}</p>
            <p>Category: {transaction.category}</p>
          </div>
        ))}
        {upcomingTransactions.length === 0 && <p>No upcoming transactions in the next 7 days.</p>}
      </div>
    )
  }

  const RecurringTransactionHistory = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 text-left">Transaction</th>
            <th className="border p-2 text-left">Date</th>
            <th className="border p-2 text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => {
            const transaction = transactions.find(t => t.id === entry.transactionId)
            return (
              <tr key={entry.id}>
                <td className="border p-2">{transaction?.name}</td>
                <td className="border p-2">{entry.date.toLocaleDateString()}</td>
                <td className="border p-2">${entry.amount.toFixed(2)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Recurring Transactions</h1>
        <p className="text-gray-600">Manage your recurring income and expenses</p>
      </div>
      <div className="mb-4">
        <div className="flex border-b">
          {['list', 'add', 'reminders', 'history'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div>
        {activeTab === 'list' && <RecurringTransactionsList />}
        {activeTab === 'add' && <AddRecurringTransaction />}
        {activeTab === 'reminders' && <RecurringTransactionReminders />}
        {activeTab === 'history' && <RecurringTransactionHistory />}
      </div>
    </div>
  )
}