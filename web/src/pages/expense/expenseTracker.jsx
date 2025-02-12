import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import Categories from './Categories';
import Reports from './Reports';
import './expenseTracker.css';

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderComponent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'transactions':
                return <Transactions />;
            case 'categories':
                return <Categories />;
            case 'reports':
                return <Reports />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="app">
            <aside className="sidebar">
                <h1>Expense Tracker</h1>
                <nav>
                    <ul>
                        <li>
                            <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab('transactions')}>Transactions</button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab('categories')}>Categories</button>
                        </li>
                        <li>
                            <button onClick={() => setActiveTab('reports')}>Reports</button>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="content">
                {renderComponent()}
            </main>
        </div>
    );
}
