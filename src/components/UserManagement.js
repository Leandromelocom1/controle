import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários', error);
      }
    };
    fetchUsers();
  }, []);

  const handlePermissionChange = async (id, permissions) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.patch(`${apiUrl}/users/${id}`, { permissions });
      setUsers(users.map(user => (user._id === id ? { ...user, permissions } : user)));
    } catch (error) {
      console.error('Erro ao atualizar permissões', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Usuários</h1>
      <ul className="list-group">
        {users.map(user => (
          <li key={user._id} className="list-group-item">
            <strong>Usuário:</strong> {user.username} <br />
            <strong>Permissões:</strong>
            <input
              type="text"
              value={user.permissions.join(', ')}
              onChange={e => handlePermissionChange(user._id, e.target.value.split(',').map(p => p.trim()))}
              className="form-control mt-2"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
