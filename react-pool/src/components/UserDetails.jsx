// UserDetails.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';
import './UserDetails.css';

const UserDetails = ({ email }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
          setUserDetails(response.data);
        } else {
          setError('Не вдалося завантажити дані користувача');
        }
      } catch (err) {
        setError('Помилка завантаження даних');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [email, token]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <GlobalHeader />
      <div className='Container'>
        <div className='ContentContainer'>
          {userDetails && (
            <div className="user-card">
              <div className="user-card-content">
                <p><strong>Ім'я:</strong> {userDetails.user.first_name} {userDetails.user.last_name}</p>
                <p><strong>Email:</strong> {userDetails.user.email}</p>
                <p><strong>Вік:</strong> {userDetails.user.age}</p>
                {userDetails.subscription && (
                  <div className="subscription-card">
                    <h3>Підписка</h3>
                    <p><strong>Тип:</strong> {userDetails.subscription.subscription_type.name}</p>
                    <p><strong>Початок:</strong> {userDetails.subscription.start_date}</p>
                    <p><strong>Кінець:</strong> {userDetails.subscription.end_date}</p>
                  </div>
                )}
                {userDetails.checkins.length > 0 && (
                  <div className="checkin-list">
                    <h3>Чекіни</h3>
                    {userDetails.checkins.map(checkin => (
                      <div key={checkin.id} className="checkin-card">
                        <p><strong>Час входу:</strong> {checkin.checkin_time}</p>
                        <p><strong>Час виходу:</strong> {checkin.checkout_time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default UserDetails;
