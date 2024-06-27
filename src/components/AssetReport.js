// src/components/AssetReport.js
import React, { useContext } from 'react';
import AssetContext from '../context/AssetContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const AssetReport = () => {
  const { assets } = useContext(AssetContext);

  return (
    <div className="container asset-report">
      <h2>Relatório de Ativos</h2>
      <p>Total de Ativos: {assets.length}</p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Ano</th>
            <th>Departamento</th>
            <th>Condição</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset._id}>
              <td>{asset.nome}</td>
              <td>{asset.tipo}</td>
              <td>{asset.marca}</td>
              <td>{asset.modelo}</td>
              <td>{asset.ano}</td>
              <td>{asset.departamento}</td>
              <td>{asset.condicao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetReport;
