import React from 'react';

const ToolFilter = ({ filterTools }) => {
  const handleFilterChange = (e) => {
    filterTools(e.target.value);
  };

  const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';

  return (
    <div>
      <p>API URL: {apiUrl}</p> {/* Apenas para demonstração */}
      <select onChange={handleFilterChange} className="form-select">
        <option value="All">Todos</option>
        <option value="Em aberto">Em aberto</option>
        <option value="Defeito">Defeito</option>
        <option value="Baixada">Baixada</option>
      </select>
    </div>
  );
};

export default ToolFilter;
