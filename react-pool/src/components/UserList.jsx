import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  const fetchUsers = async (email = '') => {
    let endpoint = 'http://127.0.0.1:8000/api/pool-users-filter/';
    if (email.trim() !== '') {
      endpoint += `?email=${email.trim()}`;
    }

    try {
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data;
        const totalUsers = data.length;
        setTotalPages(Math.ceil(totalUsers / usersPerPage));

        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        if (email.trim() === '') {
          try {
            setUsers(data.slice(startIndex, endIndex));
          } catch(error) {
            console.log(0);
          }
        } else {
          setSearchResults(data);
        }
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      //не розкоментовувати
      // console.error('Помилка запиту:', error);
    }
  };

  useEffect(() => {
    fetchUsers(searchEmail);
  }, [token, currentPage, usersPerPage, searchEmail]);

  const handleSearchChange = (e) => {
    setSearchEmail(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(searchEmail);
  };

  const handleDeleteUser = async (email) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/users/delete/${email}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204) {
        fetchUsers(searchEmail);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Помилка видалення користувача:', error);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDetails = (email) => {
    navigate(`/user-details/${email}`);
  };

  return (
    <div>
      <GlobalHeader />
      <div className='Container2'>
        <div className='ContentContainer2'>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={searchEmail}
              onChange={handleSearchChange}
              placeholder="Введіть email для пошуку"
              className='search-input'
            />
          </form>
          <div className="user-list">
            {(searchEmail.trim() === '' ? users : searchResults).map(user => (
              <div key={user.id} className="user-card">
                <div className="user-card-content">
                  <p><strong>Ім'я:</strong> {user.first_name} {user.last_name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>д.н.:</strong> {user.age}</p>
                  <button className="delete-button" onClick={() => handleDeleteUser(user.email)}>Видалити</button>
                  <button className="details-button" onClick={() => handleViewDetails(user.email)}>Деталі</button>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Назад</button>
            <span className='white-text'>Сторінка {currentPage} з {totalPages}</span>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Далі</button>
          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default UserList;
