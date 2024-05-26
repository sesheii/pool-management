import React from 'react';
import GlobalHeader from './GlobalHeader';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      <GlobalHeader/>
      <h2>Вжух і ви приземлилися</h2>
      
    </div>
  );
}
 
export default LandingPage;
