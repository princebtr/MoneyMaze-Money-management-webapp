import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const BarChart = () => <div className="chart bar-chart">Bar Chart</div>;
const PieChartComponent = () => <div className="chart pie-chart">Pie Chart</div>;

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [widgetConfig, setWidgetConfig] = useState({
    showBalance: true,
    showIncome: true,
    showExpenses: true,
    showSavings: true,
  });

  const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  const [financialData, setFinancialData] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
  });

  useEffect(() => {
    // Fetch user data
    fetch('/api/user')
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));

    // Fetch financial data
    fetch('/api/financial')
      .then(response => response.json())
      .then(data => setFinancialData(data))
      .catch(error => console.error('Error fetching financial data:', error));
  }, []);

  const toggleWidget = (widget) => {
    setWidgetConfig((prev) => ({ ...prev, [widget]: !prev[widget] }));
  };

  const navItems = [
    { icon: "🏠", label: "Overview", value: "overview" },
    { icon: "💳", label: "Financial Tools", value: "financial", path: "/financial" },
    { icon: "👛", label: "Financial Dashboard", value: "accounts", path: "/dashboard" },
    { icon: "📊", label: "Debt Management", value: "budget", path: "/debt" },
    { icon: "📈", label: "Recurring Transactions", value: "transactions", path: "/transaction" },
  ];

  const handleTabClick = (value, path) => {
    setActiveTab(value);
    navigate(path);
  };

  return (
    <div className="finance-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-title">MONEYMAZE</h1>
        </div>
        <div className="user-profile">
          <div className="user-info">
            <h2 className="user-name">{user.name}</h2>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.value}>
                <button
                  className={`nav-button ${activeTab === item.value ? "active" : ""}`}
                  onClick={() => handleTabClick(item.value, item.path)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="settings-button" onClick={() => setActiveTab("settings")}>
            ⚙️ Settings
          </button>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === "overview" && (
          <div className="overview">
            <div className="widget-grid">
              {widgetConfig.showBalance && (
                <div className="widget">
                  <h3 className="widget-title">Total Balance</h3>
                  <p className="widget-value">${financialData.balance.toFixed(2)}</p>
                </div>
              )}
              {widgetConfig.showIncome && (
                <div className="widget">
                  <h3 className="widget-title">Income</h3>
                  <p className="widget-value">${financialData.income.toFixed(2)}</p>
                </div>
              )}
              {widgetConfig.showExpenses && (
                <div className="widget">
                  <h3 className="widget-title">Expenses</h3>
                  <p className="widget-value">${financialData.expenses.toFixed(2)}</p>
                </div>
              )}
              {widgetConfig.showSavings && (
                <div className="widget">
                  <h3 className="widget-title">Savings</h3>
                  <p className="widget-value">${financialData.savings.toFixed(2)}</p>
                </div>
              )}
            </div>
            <div className="chart-grid">
              <div className="chart-container">
                <h3 className="chart-title">Income vs Expenses</h3>
                <BarChart />
              </div>
              <div className="chart-container">
                <h3 className="chart-title">Expense Breakdown</h3>
                <PieChartComponent />
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings">
            <h2 className="section-title">Dashboard Settings</h2>
            <p className="section-description">Customize your dashboard layout</p>
            <div className="widget-settings">
              {Object.entries(widgetConfig).map(([key, value]) => (
                <div key={key} className="setting-item">
                  <label htmlFor={key} className="setting-label">
                    <input
                      id={key}
                      type="checkbox"
                      checked={value}
                      onChange={() => toggleWidget(key)}
                      className="setting-checkbox"
                    />
                    <span className="setting-text">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </label>
                </div>
              ))}
            </div>
            <button className="save-settings-button">Save Settings</button>
          </div>
        )}
      </main>
    </div>
  );
}
