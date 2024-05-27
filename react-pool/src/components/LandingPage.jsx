import React from 'react';
import GlobalHeader from './GlobalHeader';
import { useNavigate } from 'react-router-dom';
import GlobalFooter from './GlobalFooter';
import './LandingPage.css'

const LandingPage = () => {
  const navigate = useNavigate()

  const hangleLoginClick = () => {
    navigate('/login');
  }

  return (
    <div>
      <GlobalHeader/>
      <div className='text-container'>
        <div className='main-text'>Вас вітає додаток адміністрування басейном</div>
      </div>
      <div className='button-container442'>
        <button className='transparent-button122' onClick={hangleLoginClick}>Увійти</button>
      </div>
      <GlobalFooter/>
    </div>
  );
}
 
export default LandingPage;
