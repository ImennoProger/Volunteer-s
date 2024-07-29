import { Link } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Подключаем файл стилей для страницы регистрации

function Register () {

  const [username, setUsername] = useState(''); //username - email
  const [hashed_password, setHashed_password] = useState('');
  const [user_surname, setUser_surname] = useState('');
  const [user_name, setUser_name] = useState('');
  const [user_patronymic, setUser_patronymic] = useState('');
  const [age, setAge] = useState('');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://185.242.118.144:8000/countries/')  // Полный URL-адрес
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw new Error('Ошибка HTTP ' + response.status);
        }
        return response.json();
      })
      .then(data => setCountries(data))
      .catch(error => console.error('Ошибка при загрузке стран:', error));
  }, []);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setCity(''); // Сбрасываем выбранный город при изменении страны

    // Загрузка списка городов для выбранной страны
    fetch(`http://185.242.118.144:8000/cities/${selectedCountry}`)
      .then(response => response.json())
      .then(data => setCities(data))
      .catch(error => console.error('Ошибка при загрузке городов:', error));
  };

  const validateForm = () => {
    if (!username || !hashed_password || !user_surname || !user_name || !user_patronymic || !age || !country || !city) {
      setError('Заполните все поля!');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      
      const response = await fetch('http://185.242.118.144:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, hashed_password, user_surname, user_name, user_patronymic, age, country, city }),
      });

      setLoading(false);
      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Authentication failed!');
      }
    } catch (error) {
      setLoading(false);
      setError('Произошла ошибка. Попробуйте позже.');
    }
  };


  return (
    <div className="page-container">
      <div className="card-container">
        <div className="card">
          <h2 className="card-title">Регистрация</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <input
                id="email"
                type="email"
                className="validate"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="email">Электронная почта</label>
            </div>
            <div className="input-field">
              <input
                id="hashed_password"
                type="password"
                className="validate"
                value={hashed_password}
                onChange={(e) => setHashed_password(e.target.value)}
              />
              <label htmlFor="hashed_password">Пароль</label>
            </div>
            <div className="input-field">
              <input
                id="user_surname"
                type="text"
                className="validate"
                value={user_surname}
                onChange={(e) => setUser_surname(e.target.value)}
              />
              <label htmlFor="user_surname">Фамилия</label>
            </div>
            <div className="input-field">
              <input
                id="user_name"
                type="text"
                className="validate"
                value={user_name}
                onChange={(e) => setUser_name(e.target.value)}
              />
              <label htmlFor="user_name">Имя</label>
            </div>
            <div className="input-field">
              <input
                id="user_patronymic"
                type="text"
                className="validate"
                value={user_patronymic}
                onChange={(e) => setUser_patronymic(e.target.value)}
              />
              <label htmlFor="user_patronymic">Отчество</label>
            </div>
            <div className="input-field">
              <input
                id="age"
                type="number"
                className="validate"
                min="0"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <label htmlFor="age">Возраст</label>
            </div>
            <div className="input-field">
              <select
                id="country"
                value={country}
                onChange={handleCountryChange}
              >
                <option value="" disabled>Выберите вашу страну</option>
                {countries.map(country => (
                  <option key={country.country_id} value={country.country_id}>
                    {country.country_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field">
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!country} // Отключаем выбор города, если не выбрана страна
              >
                <option value="">Выберите ваш город</option>
                {cities.map(city => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="btn waves-effect waves-light btn-register"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
