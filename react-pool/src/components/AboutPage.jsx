import React from 'react';
import aboutImage from './img/image.png'; // імпортуємо зображення

const AboutPage = () => {
  return (
    <div>
      <h1>Про нас</h1>
      <p>Ми - команда, яка створює цей додаток. Ми працюємо для того, щоб зробити ваш досвід користування максимально зручним і приємним.</p>
      <img src={aboutImage} alt="Зображення про нас" /> {/* Додаємо зображення */}
    </div>
  );
}
 
export default AboutPage;
