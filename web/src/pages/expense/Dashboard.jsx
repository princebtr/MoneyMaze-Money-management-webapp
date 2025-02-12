import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [summary, setSummary] = useState({
        totalExpenses: 0,
        thisMonth: 0,
        thisWeek: 0,
    });

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const response = await axios.get('http://localhost:5000/reports/summary'); // Endpoint to get summary data
            setSummary(response.data);
        } catch (error) {
            console.error("Error fetching summary", error);
        }
    };

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <div className="dashboard-summary">
                <div className="summary-card">
                    <h3>Total Expenses</h3>
                    <p className="amount">${summary.totalExpenses}</p>
                </div>
                <div className="summary-card">
                    <h3>This Month</h3>
                    <p className="amount">${summary.thisMonth}</p>
                </div>
                <div className="summary-card">
                    <h3>This Week</h3>
                    <p className="amount">${summary.thisWeek}</p>
                </div>
            </div>
        </div>
    );
}
