import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('access');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/pool-users/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setUsers(response.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Помилка запиту:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleDeleteUser = async (email) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/users/delete/${email}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204) {
        // Оновлюємо список користувачів після видалення
        fetchUsers();
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Помилка видалення користувача:', error);
    }
  };

  return (
    <div>
      <GlobalHeader />
      <div className='Container'>
        <div className='ContentContainer'>
          <form onSubmit={handleSubmit}>
            <button className='transparent-button' type="submit">Завантажити користувачів</button>
          </form>
          <div className="user-list">
            {/* <h2>Список користувачів</h2> */}
            {users.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-card-content">
                  <p><strong>Ім'я:</strong> {user.first_name} {user.last_name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Вік:</strong> {user.age}</p>
                  <button className="delete-button" onClick={() => handleDeleteUser(user.email)}>Видалити</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default UserList;
