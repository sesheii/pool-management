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
  const [success, setSuccess] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
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

    const fetchCheckinStatus = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/check-in-status/', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            email: email
          }
        });

        if (response.status === 200) {
          setIsCheckedIn(response.data.checked_in);
        } else {
          setError('Не вдалося отримати статус check-in користувача');
          setShowError(true);
        }
      } catch (error) {
        setError('Помилка запиту: ' + error.message);
        setShowError(true);
      }
    };

    fetchUserDetails();
    fetchSubscriptionTypes();
    fetchCheckinStatus();
  }, [email, token]);

  const handleCheckinToggle = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/toggle-check-in-status/', {
        email: email
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setIsCheckedIn(prev => !prev);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError('Не вдалося змінити статус check-in користувача');
        setShowError(true);
      }
    } catch (error) {
      setError('Помилка запиту: ' + error.message);
      setShowError(true);
    }
  };


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
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
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

  const getActiveSubscriptionType = () => {
    if (userData.subscription && subscriptionTypes.length > 0) {
      // Шукаємо тип підписки користувача серед отриманих типів підписок
      return subscriptionTypes.find(type => type.id === userData.subscription.subscription_type.id);
    }
    return null;
  };


  const isActiveTime = () => {
    const activeSubscription = getActiveSubscriptionType();
    if (activeSubscription) {
      // Отримуємо поточний час
      const currentTime = new Date().getTime();
      // Отримуємо початковий та кінцевий час активного типу підписки
      const startTime = new Date(currentTime).setHours(activeSubscription.start_time.split(':')[0], activeSubscription.start_time.split(':')[1]);
      const endTime = new Date(currentTime).setHours(activeSubscription.end_time.split(':')[0], activeSubscription.end_time.split(':')[1]);
      // Перевіряємо, чи поточний час знаходиться в межах визначеного часового діапазону
      return currentTime >= startTime && currentTime <= endTime;
    }
    return false;
  };


  const renderCheckInButton = () => {
    const hasSubscription = userData.subscription.price !== null;
    const subscriptionExpired = new Date(userData.subscription.end_date) < new Date();
    const activeSubscription = getActiveSubscriptionType(); // Отримуємо активний тип підписки

    if (!hasSubscription || subscriptionExpired || !isActiveTime()) {
      // Якщо немає підписки, або підписка закінчилася, або час не відповідає діапазону активності, кнопка Check In має бути сірою та неактивною
      return (
        <button className="btn btn-secondary" disabled>Check In</button>
      );
    } else {
      // Якщо є активний тип підписки і час відповідає діапазону, кнопка Check In має бути активною
      return (
        <button onClick={handleCheckinToggle} className={`btn ${isCheckedIn ? 'btn-danger' : 'btn-success'}`}>
          {isCheckedIn ? 'Check Out' : 'Check In'}
        </button>
      );
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
      {success && (
        <div className="alert alert-success" role="alert">
          Підписка успішно оновлена!
        </div>
      )}
      <div className="Container4">
        <div className="ContentContainer4">
          <h2>Деталі користувача</h2>
          {userData && (
            <div className="user-details">
              <p><strong>Ім'я:</strong> {userData.user.first_name} {userData.user.last_name}</p>
              <p><strong>Email:</strong> {userData.user.email}</p>
              <p><strong>Дата народження:</strong> {userData.user.age}</p>

              <h3>Інформація про підписку</h3>
              {userData.subscription.price === null ? (
                <div className="subscription-card empty">
                  <p>Немає підписки</p>
                </div>
              ) : (
                <div className={`subscription-card ${new Date(userData.subscription.end_date) < new Date() ? 'expired' : ''}`}>
                  <p><strong>Тип підписки:</strong> {userData.subscription.subscription_type.name}</p>
                  <p><strong>Дата початку:</strong> {userData.subscription.start_date}</p>
                  <p><strong>Дата закінчення:</strong> {userData.subscription.end_date}</p>
                  <p><strong>Ціна:</strong> {userData.subscription.price} грн</p>
                </div>
              )}


              {renderCheckInButton()}
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
              <div className="spacer" />
              <div className="price-display">
                <strong>Ціна: {price} грн</strong>
              </div>
              <div className="spacer" />
              <button onClick={handleSubscriptionChange} className="btn btn-primary">Оновити</button>
              <div className="spacer" />
            </div>
          )}
        </div>
      </div>
      <GlobalFooter />
    </div>  
  );
};

export default UserDetails;
