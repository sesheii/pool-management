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

  const handleCreateSubscriptionTypeRedirect = () => {
    navigate('/createsub-scription-type');
  }; 
  
  const handleAssignSubscriptionRedirect = () => {
    navigate('/assign-subscription');
  }; 

  return (
    <div>
      <GlobalHeader />
      <div className='HomePageContainer3'>
        <div className='ContentContainer3'>
          <button className='transparent-button' onClick={handleUserListRedirect}>User List</button>
          <button className='transparent-button' onClick={handleCreatePoolUserRedirect}>Create User</button>
          <button className='transparent-button' onClick={handleCreateSubscriptionTypeRedirect}>Subscription Type</button>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
}
 
export default HomePage;
