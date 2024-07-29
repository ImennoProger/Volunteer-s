import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from './logo192.png'; 
import './Navbar.css'

const Navbar = () => {
  return (
    <nav>
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo left">
          <img src={logoImage} alt="Logo" style={{ height: '64px' }} />
        </Link>
        <ul id="nav-mobile" className="center hide-on-med-and-down">
          <li><Link to="/" className="brand-logo center">Волонтерский портал</Link></li>
        </ul>
        <ul className="right hide-on-med-and-down">
          <li><Link to="/volunteer">Волонтер</Link></li>
          <li><Link to="/city-admin">Адм.гор</Link></li>
          <li><Link to="/region-admin">Адм.рег</Link></li>
          <li><Link to="/superuser">SU</Link></li>
          <li><Link to="/login">Войти</Link></li>
          <li><Link to="/register">Зарегистрироваться</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
