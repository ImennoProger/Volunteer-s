import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Функция для верификации токена
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        console.warn('Token not found, redirecting to login page');
        navigate('/'); // Перенаправление на страницу входа, если токена нет
        return;
      }

      try {
        const response = await fetch(`https://185.242.118.144:8000/protected`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Token verification failed');
        } else {
          console.log('Token is valid');
        }
      } catch (error) {
        console.error('Error during token verification:', error);
        localStorage.removeItem('token');
        navigate('/'); // Перенаправление на страницу входа в случае ошибки
      }
    };

    verifyToken(); // Проверка токена при монтировании компонента

    // Установка интервала для периодической проверки токена
    const intervalId = setInterval(verifyToken, 5 * 60 * 1000); // Проверка токена каждые 5 минут

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [navigate]);

  return <div>Защищённая страница, видят только авторизированные пользователи</div>;
}

export default ProtectedPage;
