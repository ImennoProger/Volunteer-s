import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { useAppTheme } from '../Header/ThemeContext';
import '../../style/style.css';
import logo from '../../assets/images/logo.svg';
import emailIcon from '../../assets/images/email.svg';
import walletIcon from '../../assets/images/wallet.svg';
import sunIcon from '../../assets/images/sun.svg';

const Header1 = ({ unreadMessagesCount = 0 }) => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useAppTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Убираем position absolute при монтировании компонента
    const headdElement = document.querySelector('.headd');
    if (headdElement) {
      headdElement.style.position = ''; // Применяем relative
    }

    return () => {
      // При размонтировании можно вернуть обратно
      if (headdElement) {
        headdElement.style.position = ''; // Убираем изменения
      }
    };
  }, []);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChatClick = () => {
    navigate('/chatpage');
  };

  return (
    <header>
      <div className="headd">
        <div className="head_logo">
          <img src={logo} alt="Логотип" />
          <h1>Волонтерский портал</h1>
        </div>
        <div className="head_navigat">
          <div className="ewt">
            <img
              className="email"
              src={emailIcon}
              alt="Email Icon"
              onClick={handleChatClick} // Привязка к переходу в чат
              style={{ cursor: 'pointer' }}
            />
            <img
              className="wallet"
              src={walletIcon}
              alt="Wallet Icon"
              onClick={() => alert('Баланс: 1500')} // Пример отображения баланса
              style={{ cursor: 'pointer' }}
            />
            <img
              className="sun"
              src={sunIcon}
              alt="Sun Icon"
              onClick={toggleTheme} // Переключение темы
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className="head_navigat_button">
            <button className="profile" onClick={handleProfileClick}>
              {isAuthenticated ? 'Профиль' : 'Войти'}
            </button>
            {isAuthenticated && (
              <button className="in-out_put" onClick={handleLogout}>
                Выйти
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header1;
