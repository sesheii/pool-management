import React, { useState } from 'react';
import './GlobalHeader.css'
import { useNavigate } from 'react-router-dom';


const GlobalHeader = () => {
  const navigate = useNavigate()

  const handleLogoutClick = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login')
  };

  const isLoggedIn = !!localStorage.getItem('access');

  const hangleLogoClick = () => {
    navigate('/')
  }

  const hangleHomeClick = () => {
    navigate('/home')
  }

  return (
    <div className="WhiteText1 GlobalHeader1 d-flex justify-content-between align-items-center">
      <div className="header-left">
        <h1 onClick={hangleLogoClick}>Pool Management</h1>
      </div>
      <div className="header-right">
        <nav>
          <ul className="d-flex">

            <li>
              {isLoggedIn && (
                <button className="transparent-button1" onClick={hangleHomeClick}>
                  Home
                </button>
              )}
            </li>
            <div className="spacer1"></div>
            <li>
              {isLoggedIn && (
                <button className="transparent-button1" onClick={handleLogoutClick}>
                  Sign out
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default GlobalHeader;
