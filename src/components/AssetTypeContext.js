// src/context/AssetTypeContext.js
import React, { createContext, useState } from 'react';
import '../App.css';

const AssetTypeContext = createContext();

export const AssetTypeProvider = ({ children }) => {
  const [assetTypes, setAssetTypes] = useState(['Máquinas', 'Veículos', 'Caminhão']); // Tipos de ativos iniciais

  const addAssetType = (type) => {
    if (!assetTypes.includes(type)) {
      setAssetTypes([...assetTypes, type]);
    }
  };

  return (
    <AssetTypeContext.Provider value={{ assetTypes, addAssetType }}>
      {children}
    </AssetTypeContext.Provider>
  );
};

export default AssetTypeContext;
