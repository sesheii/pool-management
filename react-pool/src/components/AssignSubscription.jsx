// AssignSubscription.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';
import './AssignSubscription.css';  

const AssignSubscription = () => {
  const [formData, setFormData] = useState({
    userId: '',
    subscription_type: '',
    start_date: '',
    end_date: ''
  });

  const [users, setUsers] = useState([]);
  const [subscriptionTypes, setSubscriptionTypes] = useState([]);
  const token = localStorage.getItem('access');

  useEffect(() => {
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

    const fetchSubscriptionTypes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/all-subscription-types/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          setSubscriptionTypes(response.data);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Помилка запиту:', error);
      }
    };

    fetchUsers();
    fetchSubscriptionTypes();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/assign-subscription/${formData.userId}/`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        console.log('Підписку успішно присвоєно користувачеві!');
        // Optionally handle success message or redirect to another page
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Помилка запиту:', error);
    }
  };

  return (
    <div>
      <GlobalHeader />
      <div className='Container'>
        <div className='ContentContainer'>
          <h2>Присвоєння підписки користувачу</h2>
          <form onSubmit={handleSubmit} className='assign-form'>
            <div className='form-group'>
              <label htmlFor='userId'>Користувач:</label>
              <select
                id='userId'
                name='userId'
                value={formData.userId}
                onChange={handleChange}
                required
              >
                <option value=''>Оберіть користувача</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{`${user.first_name} ${user.last_name}`}</option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='subscription_type'>Тип підписки:</label>
              <select
                id='subscription_type'
                name='subscription_type'
                value={formData.subscription_type}
                onChange={handleChange}
                required
              >
                <option value=''>Оберіть тип підписки</option>
                {subscriptionTypes.map(subscriptionType => (
                  <option key={subscriptionType.id} value={subscriptionType.id}>{subscriptionType.name}</option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='start_date'>Дата початку:</label>
              <input
                type='date'
                id='start_date'
                name='start_date'
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='end_date'>Дата закінчення:</label>
              <input
                type='date'
                id='end_date'
                name='end_date'
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
            <button type='submit'>Присвоїти підписку</button>
          </form>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default AssignSubscription;
