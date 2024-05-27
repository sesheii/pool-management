import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';
import './CreateSubscriptionType.css';

const CreateSubscriptionType = () => {
  const [formData, setFormData] = useState({
    name: '',
    daily_price: '',
    start_time: '',
    end_time: ''
  });

  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [subscriptionTypes, setSubscriptionTypes] = useState([]);

  const token = localStorage.getItem('access');

  useEffect(() => {
    fetchSubscriptionTypes();
  }, []);

  const fetchSubscriptionTypes = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/list-subscription-types/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSubscriptionTypes(response.data);
    } catch (error) {
      // console.error('Помилка запиту:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/create-subscription-type/', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        setAlertMessage('Тип підписки успішно створений!');
        setAlertType('success');
        fetchSubscriptionTypes();
      } else {
        setAlertMessage(response.data.message);
        setAlertType('danger');
      }
    } catch (error) {
      setAlertMessage('Помилка запиту: ' + error.message);
      setAlertType('danger');
    }

    setTimeout(() => {
      setAlertMessage(null);
      setAlertType(null);
    }, 5000);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/delete-subscription-type/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAlertMessage('Тип підписки успішно видалений!');
      setAlertType('success');
      fetchSubscriptionTypes();
    } catch (error) {
      setAlertMessage('Помилка запиту: ' + error.message);
      setAlertType('danger');
    }

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
          <h2>Створення нового типу підписки</h2>
          {alertMessage && (
            <div className={`alert alert-${alertType}`} role="alert">
              {alertMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className='create-form'>
            <div className='form-group'>
              <label htmlFor='name'>Назва:</label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='form-control'
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='daily_price'>Ціна за день:</label>
              <input
                type='number'
                id='daily_price'
                name='daily_price'
                value={formData.daily_price}
                onChange={handleChange}
                className='form-control'
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='start_time'>Час початку:</label>
              <input
                type='time'
                id='start_time'
                name='start_time'
                value={formData.start_time}
                onChange={handleChange}
                className='form-control'
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='end_time'>Час завершення:</label>
              <input
                type='time'
                id='end_time'
                name='end_time'
                value={formData.end_time}
                onChange={handleChange}
                className='form-control'
                required
              />
            </div>
            <button type='submit' className='btn btn-primary'>Створити тип підписки</button>
          </form>
          <div className='spacer'></div>
          <div className='spacer'></div>
          <div className='spacer'></div>
          <div className='spacer'></div>
          <h2>Список типів підписки</h2>
          <div className='subscription-list'>
            {subscriptionTypes.map((subscription) => (
              <div key={subscription.id} className='card'>
                <div className='card-body'>
                  <h5 className='card-title'>{subscription.name}</h5>
                  <p className='card-text'>Ціна за день: {subscription.daily_price} грн</p>
                  <p className='card-text'>Час початку: {subscription.start_time}</p>
                  <p className='card-text'>Час завершення: {subscription.end_time}</p>
                  <div className='spacer'></div>
                  <button
                    className='btn btn-danger'
                    onClick={() => handleDelete(subscription.id)}
                  >
                    Видалити
                  </button>
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

export default CreateSubscriptionType;
