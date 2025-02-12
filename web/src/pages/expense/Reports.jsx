import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Reports() {
    const [reportType, setReportType] = useState('monthly');
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [reportType]);

    const fetchData = async () => {
        const endpoint = reportType === 'monthly' ? '/reports/monthly' : '/categories';
        try {
            const response = await fetch(`http://localhost:5000${endpoint}`);
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="reports">
            <h2>Financial Reports</h2>
            <div className="report-controls">
                <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option value="monthly">Monthly Expenses</option>
                    <option value="category">Expenses by Category</option>
                </select>
            </div>
            <div className="report-chart">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id.month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
