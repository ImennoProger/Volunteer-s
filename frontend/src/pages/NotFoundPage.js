import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div>
      <h1>404 - Страница не найдена</h1>
      <p>К сожалению, запрашиваемая страница не существует.</p>
      <p>
        Вернуться на <Link to="/">главную страницу</Link>.
      </p>
    </div>
  );
}

export default NotFoundPage;
