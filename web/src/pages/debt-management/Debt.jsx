import React, { useState, useEffect, useRef } from 'react';

const styles = `
 :root {
  --primary-color: #1d72b8;
  --secondary-color: #27ae60;
  --background-color: #f4f6f9;
  --card-background: #ffffff;
  --text-color: #4a4a4a;
  --border-radius: 10px;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --button-hover: #125e92;
  --transition-duration: 0.3s;
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

.container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: var(--primary-color);
  padding: 20px;
  color: #fff;
}

.sidebar-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
}

.nav-button {
  display: block;
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  background-color: transparent;
  border: none;
  border-radius: var(--border-radius);
  color: white;
  cursor: pointer;
  text-align: left;
  transition: background-color var(--transition-duration) ease;
  font-weight: 500;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.active-nav-button {
  background-color: #125e92;
}

.content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.card {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 25px;
  margin-bottom: 30px;
  transition: box-shadow var(--transition-duration);
}

.card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

.input {
  margin: 12px 0;
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  outline: none;
  transition: border-color var(--transition-duration);
}

.input:focus {
  border-color: var(--primary-color);
}

.button {
  background-color: var(--primary-color);
  color: white;
  padding: 12px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 16px;
  transition: background-color var(--transition-duration);
}

.button:hover {
  background-color: var(--button-hover);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
}

.th, .td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.th {
  background-color: var(--primary-color);
  color: white;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 15px;
}

.progress-fill {
  height: 25px;
  background-color: var(--secondary-color);
  transition: width 0.5s ease-in-out;
}

.chart-container {
  width: 100%;
  height: 300px;
  margin-bottom: 25px;
}

p {
  font-size: 18px;
}

`;

export default function EnhancedDebtManager() {
  const [debts, setDebts] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [sortBy, setSortBy] = useState('amount');
  const [sortOrder, setSortOrder] = useState('asc');
  const [payoffStrategy, setPayoffStrategy] = useState('snowball');
  const [financialGoal, setFinancialGoal] = useState(0);
  const [activePage, setActivePage] = useState('dashboard');
  const chartRef = useRef(null);

  useEffect(() => {
    fetchDebts();
  }, []);

  useEffect(() => {
    if (activePage === 'dashboard' && debts.length > 0) {
      drawChart();
    }
  }, [activePage, debts]);

  const fetchDebts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/debts');
      if (!response.ok) throw new Error('Failed to fetch debts');
      const data = await response.json();
      setDebts(data);
    } catch (error) {
      console.error('Error fetching debts:', error);
    }
  };

  const addDebt = async (e) => {
    e.preventDefault();
    if (name && amount) {
      const newDebt = {
        name,
        amount: parseFloat(amount),
        interestRate: parseFloat(interestRate) || 0,
        dueDate,
      };
      try {
        const response = await fetch('http://localhost:5000/api/debts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newDebt),
        });
        if (!response.ok) throw new Error('Failed to add debt');
        const addedDebt = await response.json();
        setDebts([...debts, addedDebt]);
        setName('');
        setAmount('');
        setInterestRate('');
        setDueDate('');
      } catch (error) {
        console.error('Error adding debt:', error);
      }
    }
  };

  const deleteDebt = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/debts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete debt');
      setDebts(debts.filter(debt => debt._id !== id));
    } catch (error) {
      console.error('Failed to delete debt:', error);
    }
  };

  const makePayment = async (id, paymentAmount) => {
    try {
      const response = await fetch(`http://localhost:5000/api/debts/${id}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentAmount }),
      });
      if (!response.ok) throw new Error('Failed to make payment');
      const updatedDebt = await response.json();
      setDebts(debts.map(debt => (debt._id === id ? updatedDebt : debt)));
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };

  const toggleSort = (column) => {
    setSortBy(column);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedDebts = [...debts].sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    return sortOrder === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
  });

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  const averageInterestRate = debts.length
    ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / debts.length
    : 0;

  const getPayoffOrder = () => {
    return payoffStrategy === 'snowball'
      ? [...debts].sort((a, b) => a.amount - b.amount)
      : [...debts].sort((a, b) => b.interestRate - a.interestRate);
  };

  const calculateProgress = () => {
    const initialTotal = debts.reduce((sum, debt) => sum + debt.initialAmount, 0);
    return initialTotal > 0 ? ((initialTotal - totalDebt) / initialTotal) * 100 : 0;
  };

  const checkReminders = () => {
    const today = new Date();
    return debts.filter(debt => {
      const dueDate = new Date(debt.dueDate);
      const timeDiff = dueDate.getTime() - today.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      return daysDiff <= 7 && daysDiff > 0;
    });
  };

  const upcomingPayments = checkReminders();
  const drawChart = () => {
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    if (totalDebt === 0) {
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No debts to display', canvas.width / 2, canvas.height / 2);
      return;
    }
  
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
  
    let startAngle = 0;
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  
    debts.forEach((debt, index) => {
      const sliceAngle = (debt.amount / totalDebt) * 2 * Math.PI;
  
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
  
      const labelAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
  
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(debt.name, labelX, labelY);
  
      startAngle += sliceAngle;
    });
  
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`$${totalDebt.toFixed(2)}`, centerX, centerY);
  };
  
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div>
            <div className="card">
              <h2 className="card-title">Debt Overview</h2>
              <div className="chart-container">
                <canvas ref={chartRef} width="400" height="300"></canvas>
              </div>
            </div>
            <div className="card">
              <h2 className="card-title">Debt Summary</h2>
              <p>Total Debt: ${totalDebt.toFixed(2)}</p>
              <p>Number of Debts: {debts.length}</p>
              <p>Average Interest Rate: {averageInterestRate.toFixed(2)}%</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${calculateProgress()}%`}}></div>
              </div>
              <p>Progress: {calculateProgress().toFixed(2)}% paid off</p>
            </div>
            {upcomingPayments.length > 0 && (
              <div className="card">
                <h2 className="card-title">Upcoming Payments</h2>
                {upcomingPayments.map((debt) => (
                  <p key={debt._id}>{debt.name} due on {new Date(debt.dueDate).toLocaleDateString()}</p>
                ))}
              </div>
            )}
          </div>
        );
      case 'debts':
        return (
          <div className="card">
            <h2 className="card-title">Your Debts</h2>
            <table className="table">
              <thead>
                <tr>
                  <th className="th" onClick={() => toggleSort('name')}>Name</th>
                  <th className="th" onClick={() => toggleSort('amount')}>Amount</th>
                  <th className="th" onClick={() => toggleSort('interestRate')}>Interest Rate</th>
                  <th className="th" onClick={() => toggleSort('dueDate')}>Due Date</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedDebts.map((debt) => (
                  <tr key={debt._id}>
                    <td className="td">{debt.name}</td>
                    <td className="td">${debt.amount.toFixed(2)}</td>
                    <td className="td">{debt.interestRate}%</td>
                    <td className="td">{new Date(debt.dueDate).toLocaleDateString()}</td>
                    <td className="td">
                      <button
                        onClick={() => {
                          const payment = prompt(`Enter payment amount for ${debt.name}:`);
                          if (payment) makePayment(debt._id, parseFloat(payment));
                        }}
                        className="button"
                        style={{marginRight: '5px'}}
                      >
                        Pay
                      </button>
                      <button
                        onClick={() => deleteDebt(debt._id)}
                        className="button"
                        style={{backgroundColor: '#e74c3c'}}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'addDebt':
        return (
          <div className="card">
            <h2 className="card-title">Add New Debt</h2>
            <form onSubmit={addDebt} className="form">
              <input
                
                type="text"
                placeholder="Debt Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="input"
              />
              <input
                type="number"
                placeholder="Interest Rate (%)"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="input"
              />
              <input
                type="date"
                placeholder="Due Date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input"
              />
              <button type="submit" className="button">Add Debt</button>
            </form>
          </div>
        );
      case 'strategies':
        return (
          <div className="card">
            <h2 className="card-title">Debt Payoff Strategy</h2>
            <select
              value={payoffStrategy}
              onChange={(e) => setPayoffStrategy(e.target.value)}
              className="input"
            >
              <option value="snowball">Debt Snowball</option>
              <option value="avalanche">Debt Avalanche</option>
            </select>
            <h3 style={{marginTop: '20px'}}>Recommended Payoff Order:</h3>
            <ol>
              {getPayoffOrder().map((debt) => (
                <li key={debt._id}>{debt.name} - ${debt.amount.toFixed(2)}</li>
              ))}
            </ol>
          </div>
        );
      case 'goals':
        return (
          <div className="card">
            <h2 className="card-title">Financial Goals</h2>
            <input
              type="number"
              placeholder="Set Financial Goal"
              value={financialGoal || ''}
              onChange={(e) => setFinancialGoal(parseFloat(e.target.value))}
              className="input"
            />
            <p style={{marginTop: '10px'}}>
              Progress towards goal: {financialGoal > 0 ? ((totalDebt / financialGoal) * 100).toFixed(2) : 0}%
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="sidebar">
          <h1 className="sidebar-title">Debt Manager</h1>
          <nav>
            {['dashboard', 'debts', 'addDebt', 'strategies', 'goals'].map((page) => (
              <button
                key={page}
                onClick={() => setActivePage(page)}
                className={`nav-button ${activePage === page ? 'active-nav-button' : ''}`}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="content">
          <h2 style={{fontSize: '24px', marginBottom: '20px'}}>
            {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
          </h2>
          {renderContent()}
        </div>
      </div>
    </>
  );
}