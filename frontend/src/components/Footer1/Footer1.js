import React from 'react';
import './Footer1.css';

const Footer1 = () => (
  <footer className="footer">
    <h2>Волонтерский портал</h2>
    <div className="footer_info">
      <div className="gr1">
        <p>Подпишитесь на нашу рассылку и узнавайте о новостях первыми!</p>
        <p>О платформе</p>
        <p>Пользовательское соглашение</p>
      </div>
      <div className="gr2">
        <input type="text" placeholder="Email" />
        <p>Мероприятия</p>
        <p>Политика конфиденциальности</p>
      </div>
    </div>
  </footer>
);

export default Footer1;
