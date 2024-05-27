import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import userIcon from './img/Untitled.png';

const HomePage = () => {
  const [checkedInUsersCount, setCheckedInUsersCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('access');

  useEffect(() => {
    const fetchCheckedInUsersCount = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/checked-in-count/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          setCheckedInUsersCount(response.data.checked_in_users_count);
        }
      } catch (error) {
        console.error('Error fetching checked in users count:', error);
      }
    };

    const fetchUserGroups = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user-groups/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          if (response.data.includes('system admin')) {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchCheckedInUsersCount();
    fetchUserGroups();
  }, []);

  const navigate = useNavigate();

  const handleUserListRedirect = () => {
    navigate('/user-list');
  };

  const handleCreatePoolUserRedirect = () => {
    navigate('/create-pool-user');
  };

  const handleCreateSubscriptionTypeRedirect = () => {
    navigate('/createsub-scription-type');
  }; 
  
  const handleAssignSubscriptionRedirect = () => {
    navigate('/assign-subscription');
  }; 

  const handleRegisterFormRedirect = () => {
    navigate('/register');
  };

  return (
    <div>
      <GlobalHeader />
      <div className='HomePageContainer3'>
        <div className='ContentContainer3'>
          <div className='Card'>
            <img src={userIcon} alt='User icon' className='UserIcon' />
            <div className='CardContent'>
              <h1 className='Black-Text'>Checked In Users: {checkedInUsersCount}</h1>
            </div>
          </div>
          <button className='transparent-button111' onClick={handleUserListRedirect}>User List</button>
          <button className='transparent-button111' onClick={handleCreatePoolUserRedirect}>Create User</button>
          {isAdmin && <button className='transparent-button111' onClick={handleCreateSubscriptionTypeRedirect}>Subscription Type</button>}
          {isAdmin && <button className='transparent-button111' onClick={handleRegisterFormRedirect}>Register a user</button>}
        </div>
      </div>
      <GlobalFooter />
    </div>
  );

}
 
export default HomePage;
