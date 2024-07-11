import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../components/logo192.png'; 
import './styles/Navbar.css'

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
          <li><Link to="/login">Войти</Link></li>
          <li><Link to="/register">Зарегистрироваться</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
