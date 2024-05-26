import React, { useState } from 'react';
import axios from 'axios';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';
import './CreatePoolUser.css';

const CreatePoolUser = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    age: ''
  });

  const token = localStorage.getItem('access');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/create-pool-user/', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        console.log('Користувач успішно створений!');
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
          <h2>Створення нового користувача</h2>
          <form onSubmit={handleSubmit} className='create-form'>
            <div className='form-group'>
              <label htmlFor='first_name'>Ім'я:</label>
              <input
                type='text'
                id='first_name'
                name='first_name'
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='last_name'>Прізвище:</label>
              <input
                type='text'
                id='last_name'
                name='last_name'
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email:</label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='age'>Вік:</label>
              <input
                type='number'
                id='age'
                name='age'
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <button type='submit'>Створити користувача</button>
          </form>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default CreatePoolUser;
