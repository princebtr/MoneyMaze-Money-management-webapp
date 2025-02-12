import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AddDebt = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

  const handleAddDebt = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/debts', { name, amount, dueDate });
      navigate('/');
    } catch (error) {
      console.error('Error adding debt', error);
    }
  };

  return (
    <div>
      <h2>Add New Debt</h2>
      <form onSubmit={handleAddDebt}>
        <input
          type="text"
          placeholder="Debt Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Debt</button>
      </form>
    </div>
  );
};

export default AddDebt;
