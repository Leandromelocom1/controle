import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.length > 0) {
        try {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
          const response = await axios.get(`${apiUrl}/search?query=${searchTerm}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error('Erro ao buscar resultados:', error);
        }
      } else {
        setSearchResults([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300); // Aguarda 300ms após o usuário parar de digitar

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchClick = (item) => {
    setSearchTerm(item.nome);
    setSearchResults([]);
    history.push(`/search?query=${item.nome}`);
  };

  return (
    <header>
      <div className="header-content">
        <h1>Meu Sistema</h1>
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar..."
            className="form-control"
          />
          {searchResults.length > 0 && (
            <ul className="list-group search-results">
              {searchResults.map((item) => (
                <li key={item._id} className="list-group-item" onClick={() => handleSearchClick(item)}>
                  {item.nome}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
