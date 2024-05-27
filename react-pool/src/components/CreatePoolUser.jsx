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

  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

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
        setAlertMessage('Користувач успішно створений!');
        setAlertType('success');
      } else {
        setAlertMessage(response.data.message);
        setAlertType('danger');
      }
    } catch (error) {
      setAlertMessage('Помилка запиту: ' + error.message);
      setAlertType('danger');
    }

    // Очистити повідомлення через 5 секунд
    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 5000);
  };

  return (
    <div>
      <GlobalHeader />
      <div className='Container1'>
        <div className='ContentContainer1 d-flex flex-column'>
          <h2>Створення нового користувача</h2>
          {alertMessage && (
            <div className={`alert alert-${alertType}`} role="alert">
              {alertMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className='create-form'>
            <div className='form-group'>
              <label htmlFor='first_name'>Ім'я:</label>
              <input
                type='text'
                id='first_name'
                name='first_name'
                value={formData.first_name}
                onChange={handleChange}
                className='form-control'
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
                className='form-control'
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
                className='form-control'
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='age'>Вік:</label>
              <input
                type='date'
                id='age'
                name='age'
                value={formData.age}
                onChange={handleChange}
                className='form-control'
                required
              />
            </div>
            <button type='submit' className='btn btn-primary'>Створити користувача</button>
          </form>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default CreatePoolUser;
