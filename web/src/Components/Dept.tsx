import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DebtTracker = () => {
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/debts');
        setDebts(response.data);
      } catch (error) {
        console.error('Error fetching debts', error);
      }
    };
    fetchDebts();
  }, []);

  return (
    <div>
      <h2>Debt Tracker</h2>
      <Link to="/add-debt">Add New Debt</Link>
      <ul>
        {debts.map((debt, index) => (
          <li key={index}>
            {debt.name}: ${debt.amount} (Due: {debt.dueDate})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DebtTracker;
