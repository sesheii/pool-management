import React, { useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Тут можна додати логіку для перевірки даних логіну
    console.log('Submitted:', { username, password });
    // Очищаємо поля після відправки
    setUsername('');
    setPassword('');
  };

  return (
    <div>
      <h2>Увійти</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Ім'я користувача:
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
        </div>
        <div>
          <label>
            Пароль:
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <button type="submit">Увійти</button>
      </form>
    </div>
  );
};

export default LoginForm;
