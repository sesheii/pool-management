import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SuccessPage = () => {
  const [userData, setUserData] = useState(null);
  const savedEmail = localStorage.getItem('email');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/users/${savedEmail}/`);

        setUserData(response.data);
      } catch (error) {
        console.error('Помилка при отриманні даних користувача:', error);
        // Додайте обробку помилок, наприклад, відображення повідомлення про помилку користувачу
      }
    };

    if (savedEmail) {
      fetchData();
    }
  }, [savedEmail]); // Виконувати запит лише при зміні savedEmail

  return (
    <div>
      {userData ? (
        <>
          <h2 className='Success-Page-Greet'>Успіх!</h2>
          <p className='Success-Page-Greet'>Ім'я: {userData.first_name}</p>
          <p className='Success-Page-Greet'>Прізвище: {userData.last_name}</p>
          {/* Відображення інших даних користувача */}
        </>
      ) : (
        <p>Завантаження даних користувача...</p>
      )}
    </div>
  );
};

export default SuccessPage;
