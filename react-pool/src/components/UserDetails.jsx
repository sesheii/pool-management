import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';
import './UserDetails.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserDetails = () => {
  const { email } = useParams();
  const [userData, setUserData] = useState(null);
  const [subscriptionTypes, setSubscriptionTypes] = useState([]);
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [price, setPrice] = useState(0);
  const token = localStorage.getItem('access');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/user-details/${email}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setUserData(response.data);
        } else {
          setError('Не вдалося завантажити дані користувача');
          setShowError(true);
        }
      } catch (error) {
        setError('Помилка запиту: ' + error.message);
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchSubscriptionTypes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/list-subscription-types/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setSubscriptionTypes(response.data);
        } else {
          setError('Не вдалося завантажити типи підписок');
          setShowError(true);
        }
      } catch (error) {
        setError('Помилка запиту: ' + error.message);
        setShowError(true);
      }
    };

    fetchUserDetails();
    fetchSubscriptionTypes();
  }, [email, token]);

  const handleSubscriptionChange = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/update-subscription/${email}/`, {
        subscription_type_id: selectedSubscriptionType,
        start_date: startDate,
        end_date: endDate
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setUserData(prevData => ({
          ...prevData,
          subscription: response.data
        }));
      } else {
        setError('Не вдалося оновити підписку');
        setShowError(true);
      }
    } catch (error) {
      setError('Помилка запиту: ' + error.message);
      setShowError(true);
    }
  };

  const calculatePrice = () => {
    if (selectedSubscriptionType && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const subscriptionType = subscriptionTypes.find(type => type.id === parseInt(selectedSubscriptionType));
      if (subscriptionType) {
        setPrice(diffDays * subscriptionType.daily_price);
      }
    } else {
      setPrice(0);
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [selectedSubscriptionType, startDate, endDate]);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  if (loading) return <div>Завантаження...</div>;

  return (
    <div>
      <GlobalHeader />
      {showError && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="Container4">
        <div className="ContentContainer4">
          <h2>Деталі користувача</h2>
          {userData && (
            <div className="user-details">
              <h3>Інформація про користувача</h3>
              <p><strong>Ім'я:</strong> {userData.user.first_name} {userData.user.last_name}</p>
              <p><strong>Email:</strong> {userData.user.email}</p>
              <p><strong>Дата народження:</strong> {userData.user.age}</p>

              <h3>Інформація про підписку</h3>
              <div className={`subscription-card ${new Date(userData.subscription.end_date) < new Date() ? 'expired' : ''}`}>
                <p><strong>Тип підписки:</strong> {userData.subscription.subscription_type.name}</p>
                <p><strong>Дата початку:</strong> {userData.subscription.start_date}</p>
                <p><strong>Дата закінчення:</strong> {userData.subscription.end_date}</p>
                <p><strong>Ціна:</strong> {userData.subscription.price} грн</p>
              </div>

              <h3>Оновити підписку</h3>
              <select
                value={selectedSubscriptionType}
                onChange={(e) => setSelectedSubscriptionType(e.target.value)}
                className="form-control"
              >
                <option value="">Оберіть тип підписки</option>
                {subscriptionTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control"
                min={new Date().toISOString().split('T')[0]}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control"
              />
              <div className='spacer'/>
              <div className="price-display">
                <strong>Ціна: {price} грн</strong>
              </div>
              <div className='spacer'/>
              <button onClick={handleSubscriptionChange} className="btn btn-primary">Оновити</button>
            </div>
          )}
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default UserDetails;
