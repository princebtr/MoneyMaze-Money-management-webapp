import  { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const FinancialReports = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
          label: 'Monthly Revenue',
          data: [12000, 19000, 15000, 21000, 18000, 24000],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue ($)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const generateReport = () => {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // In a real application, you would fetch data from an API here
    const reportData = {
      type: reportType,
      startDate: startDate,
      endDate: endDate,
      totalRevenue: 109000,
      totalExpenses: 76000,
      netProfit: 33000
    };

    document.getElementById('reportResults').innerHTML = `
      <h3>Financial Report</h3>
      <p>Type: ${reportData.type}</p>
      <p>Period: ${reportData.startDate} to ${reportData.endDate}</p>
      <p>Total Revenue: $${reportData.totalRevenue}</p>
      <p>Total Expenses: $${reportData.totalExpenses}</p>
      <p>Net Profit: $${reportData.netProfit}</p>
    `;
  };

  return (
    <div className="financial-reports">
      <h1>Financial Reports</h1>
      
      <div className="report-form">
        <h2>Generate Report</h2>
        <div>
          <label htmlFor="reportType">Report Type:</label>
          <select id="reportType">
            <option value="income">Income Statement</option>
            <option value="balance">Balance Sheet</option>
            <option value="cashflow">Cash Flow Statement</option>
          </select>
        </div>
        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input type="date" id="startDate" />
        </div>
        <div>
          <label htmlFor="endDate">End Date:</label>
          <input type="date" id="endDate" />
        </div>
        <button onClick={generateReport}>Generate Report</button>
      </div>

      <div id="reportResults"></div>

      <div className="chart-container">
        <h2>Monthly Revenue</h2>
        <canvas ref={chartRef} width="400" height="200"></canvas>
      </div>

      <style>{`
        .financial-reports {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .report-form {
          background-color: #f0f0f0;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .report-form div {
          margin-bottom: 10px;
        }
        .report-form label {
          display: inline-block;
          width: 100px;
        }
        .report-form select, .report-form input {
          width: 200px;
          padding: 5px;
        }
        .report-form button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .report-form button:hover {
          background-color: #45a049;
        }
        #reportResults {
          background-color: #e9e9e9;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .chart-container {
          margin-top: 40px;
        }
      `}</style>
    </div>
  );
};

export default FinancialReports;