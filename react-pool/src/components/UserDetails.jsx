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
              <p><strong>Вік:</strong> {userData.user.age}</p>

              <h3>Інформація про підписку</h3>
              <p><strong>Тип підписки:</strong> {userData.subscription.subscription_type.name}</p>
              <p><strong>Дата початку:</strong> {userData.subscription.start_date}</p>
              <p><strong>Дата закінчення:</strong> {userData.subscription.end_date}</p>

              <h3>Чекіни</h3>
              <div className="checkin-cards">
                {userData.checkins.map((checkin, index) => (
                  <div key={index} className="checkin-card">
                    <p><strong>Дата:</strong> {checkin.date}</p>
                    <p><strong>Локація:</strong> {checkin.location}</p>
                  </div>
                ))}
              </div>

              <h3>Оновити підписку</h3>
              <select
                value={selectedSubscriptionType}
                onChange={(e) => setSelectedSubscriptionType(e.target.value)}
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
                className='form-control'
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='form-control'
              />
              <button onClick={handleSubscriptionChange}>Оновити</button>
            </div>
          )}
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default UserDetails;
