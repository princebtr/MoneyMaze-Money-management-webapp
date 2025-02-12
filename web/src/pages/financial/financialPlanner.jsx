import React, { useState } from 'react'
import Goals from './Goals'
import Budget from './Budget'
import Expenses from './Expenses'
import Forecast from './Forecast'
import Report from './Report'
import './financialPlanner.css'

export default function MoneyMaze() {
  const [activeTab, setActiveTab] = useState('goals')
  const user = {
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "/placeholder.svg?height=64&width=64",
  };

  const renderComponent = () => {
    switch (activeTab) {
      case 'goals':
        return <Goals />
      case 'budget':
        return <Budget />
      case 'expenses':
        return <Expenses />
      case 'forecast':
        return <Forecast />
      case 'report':
        return <Report />
      default:
        return <Goals />
    }
  }

  return (
    <div className="moneymaze-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-title">MONEYMAZE</h1>
        </div>
        <div className="user-profile">
          <img src="https://cdn4.iconfinder.com/data/icons/pop-avatars/1000/animals_accounts_avatars___user_account_avatar_duck_farm_animal_bird-512.png" alt={user.name} className="user-avatar" />
          <div className="user-info">
            <h2 className="user-name">{user.name}</h2>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {/* Add Dashboard button */}
          <button
            className="sidebar-button"
            onClick={() => window.location.href = '/dashboard2'}
          >
            Dashboard
          </button>
          <button
            className={`sidebar-button ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            Goals
          </button>
          <button
            className={`sidebar-button ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            Budget
          </button>
          <button
            className={`sidebar-button ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            Expenses
          </button>
          <button
            className={`sidebar-button ${activeTab === 'forecast' ? 'active' : ''}`}
            onClick={() => setActiveTab('forecast')}
          >
            Forecast
          </button>
          <button
            className={`sidebar-button ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            Report
          </button>
        </nav>
      </aside>
      <main className="main-content">
        {renderComponent()}
      </main>
    </div>
  )
}
