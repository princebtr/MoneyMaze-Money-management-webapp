import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './styles.css';

const FilterBar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="filter-bar">
      <TextField
        label="From"
        type="date"
        name="from"
        value={filters.from}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="To"
        type="date"
        name="to"
        value={filters.to}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" onClick={() => setFilters({ from: '', to: '' })}>
        Clear Filters
      </Button>
    </div>
  );
};

export default FilterBar;
