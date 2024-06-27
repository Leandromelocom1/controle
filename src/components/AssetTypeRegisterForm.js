// src/components/AssetTypeRegisterForm.js
import React, { useState, useContext } from 'react';
import AssetTypeContext from '../context/AssetTypeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const AssetTypeRegisterForm = () => {
  const [assetType, setAssetType] = useState('');
  const { addAssetType } = useContext(AssetTypeContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    addAssetType(assetType);
    console.log('Tipo de Ativo registrado:', assetType);
    // Resetar o formulário
    setAssetType('');
  };

  return (
    <form onSubmit={handleSubmit} className="container asset-type-register-form">
      <h2>Cadastro de Tipo de Ativo</h2>
      <div className="form-group">
        <label>Tipo de Ativo:</label>
        <input
          type="text"
          className="form-control"
          value={assetType}
          onChange={(e) => setAssetType(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Registrar Tipo de Ativo</button>
    </form>
  );
};

export default AssetTypeRegisterForm;
