import React from 'react';
import { useTable } from 'react-table';
import Button from '@mui/material/Button';
import './styles.css';

const DataTable = ({ data, onEdit }) => {
  const columns = React.useMemo(() => [
    { Header: 'Date', accessor: 'date' },
    { Header: 'Revenue', accessor: 'revenue' },
    { Header: 'Expenses', accessor: 'expenses' },
    { Header: 'Profit', accessor: 'profit' },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="actions-button">
          <Button variant="contained" color="primary" onClick={() => onEdit(row.original)}>
            Edit
          </Button>
        </div>
      ),
    },
  ], []);

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <table {...getTableProps()} className="data-table">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;
