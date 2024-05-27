import React from 'react';
import './GlobalFooter.css';
import { useNavigate } from 'react-router-dom';

const GlobalFooter = () => {
  return (
    <div>
      <div className='spacer12'></div>
      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 Artem. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default GlobalFooter;
