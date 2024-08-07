// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './setupAxios'; // Importando a configuração do axios

// Definir process.env.NODE_ENV manualmente
window.process = {
  env: {
    NODE_ENV: 'development',
  },
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
