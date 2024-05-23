import React, { useState } from 'react';
import './LoginForm.css';
import Cookies from 'js-cookie'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

 
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
  	setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/validate-login/', {
        email,
        password
      });

      if (response.status === 200) {
        console.log(response.data.message);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);

        navigate('/success');
      }
      else {
        console.error(response.data.message);
      }
    } 
    catch (error) {
      console.error('Помилка запиту:', error);
    }
    
    // console.log(Cookies.get('email'))
    // console.log(Cookies.get('password'))
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <h2>Увійти</h2>
          <label htmlFor="email">Пошта:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export default LoginForm;
