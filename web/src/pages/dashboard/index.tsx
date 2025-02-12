import React, { useState } from 'react';
import DataTable from './DataTable';
import FilterBar from './FilterBar';
import EditForm from './EditForm';
import './styles.css';  // Import your CSS file here

const initialData = [
  { id: 1, date: '2022-09-01', revenue: 1000, expenses: 500, profit: 500 },
  { id: 2, date: '2022-09-02', revenue: 1500, expenses: 700, profit: 800 },
  { id: 3, date: '2023-09-01', revenue: 1000, expenses: 500, profit: 500 },
  { id: 4, date: '2023-09-02', revenue: 1500, expenses: 700, profit: 800 },
  { id: 5, date: '2024-09-01', revenue: 1000, expenses: 500, profit: 500 },
  { id: 6, date: '2024-09-02', revenue: 1500, expenses: 700, profit: 800 },

  // More rows...
];

function Dashboard() {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState({ from: '', to: '' });
  const [editRow, setEditRow] = useState(null);

  const applyFilters = (filteredData) => {
    // Example filter by date range
    if (filters.from && filters.to) {
      return filteredData.filter(row => 
        new Date(row.date) >= new Date(filters.from) &&
        new Date(row.date) <= new Date(filters.to)
      );
    }
    return filteredData;
  };

  const handleEdit = (row) => {
    setEditRow(row);
  };

  const handleSaveEdit = (updatedRow) => {
    setData(data.map(row => (row.id === updatedRow.id ? updatedRow : row)));
    setEditRow(null);
  };

  return (
    <div className="dashboard-container">
      <h1>Financial Dashboard</h1>
      <FilterBar filters={filters} setFilters={setFilters} />
      <DataTable data={applyFilters(data)} onEdit={handleEdit} />
      {editRow && <EditForm row={editRow} onSave={handleSaveEdit} />}
    </div>
  );
}

export default Dashboard;
