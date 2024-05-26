import React from 'react';
import GlobalHeader from './GlobalHeader';
import GlobalFooter from './GlobalFooter';
import './HomePage.css'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

  const navigate = useNavigate();

  const handleUserListRedirect = () => {
    navigate('/user-list');
  };

  const handleCreatePoolUserRedirect = () => {
    navigate('/create-pool-user');
  };

  return (
    <div>
      <GlobalHeader />
      <div className='HomePageContainer'>
        <div className='ContentContainer'>
          <button className='transparent-button' onClick={handleUserListRedirect}>User List</button>
          <button className='transparent-button' onClick={handleCreatePoolUserRedirect}>Create User</button>

        </div>
      </div>
      <GlobalFooter />
    </div>
  );
}
 
export default HomePage;
