import React, { useState } from 'react';
import './LoginForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password
      });

      if (response.status === 200) {
        console.log(response.data.message);
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        navigate('/home');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      // console.error('Помилка запиту:', error);
      setError('Невдала спроба входу. Будь ласка, перевірте свої дані та спробуйте знову.');
    }
    setUsername('');
    setPassword('');
  };

  return (
    <div className="login-form-container d-flex flex-column">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <h2>LOG IN</h2>
        <hr />
        <div className="form-group">
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Ім'я користувача"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Пароль"
          />
        </div>
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export default LoginForm;
