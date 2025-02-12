import React from 'react'

export default function Forecast() {
  const generateForecast = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map((month, index) => ({
      name: month,
      savings: 1000 * (index + 1), // Example data
      expenses: 800 * (index + 1)  // Example data
    }))
  }

  const forecast = generateForecast()

  return (
    <div className="card">
      <h2 className="card-title">6-Month Forecast</h2>
      <div className="forecast-chart">
        {forecast.map((month, index) => (
          <div key={index} className="forecast-bar">
            <div className="bar-label">{month.name}</div>
            <div className="bar-container">
              <div 
                className="bar savings" 
                style={{height: `${month.savings / 50}px`}}
                title={`Savings: $${month.savings}`}
              ></div>
              <div 
                className="bar expenses" 
                style={{height: `${month.expenses / 50}px`}}
                title={`Expenses: $${month.expenses}`}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="forecast-legend">
        <div className="legend-item">
          <div className="legend-color savings"></div>
          <span>Savings</span>
        </div>
        <div className="legend-item">
          <div className="legend-color expenses"></div>
          <span>Expenses</span>
        </div>
      </div>
    </div>
  )
}