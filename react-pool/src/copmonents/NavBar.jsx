import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <div className="logo">
        <Link to="/">Мій Сайт</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/login">Увійти</Link></li>
        <li><Link to="/about">Про нас</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
