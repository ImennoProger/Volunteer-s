import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Register.css'; // Подключаем файл стилей для страницы регистрации

const Register = () => {
  return (
    <div className="page-container">
      <div className="card-container">
        <div className="card">
          <h2 className="card-title">Регистрация</h2>
          <form>
            <div className="input-field">
              <input id="email" type="email" className="validate" />
              <label htmlFor="email">Электронная почта</label>
            </div>
            <div className="input-field">
              <input id="password" type="password" className="validate" />
              <label htmlFor="password">Пароль</label>
            </div>
            <div className="input-field">
              <input id="lastName" type="text" className="validate" />
              <label htmlFor="lastName">Фамилия</label>
            </div>
            <div className="input-field">
              <input id="firstName" type="text" className="validate" />
              <label htmlFor="firstName">Имя</label>
            </div>
            <div className="input-field">
              <input id="middleName" type="text" className="validate" />
              <label htmlFor="middleName">Отчество</label>
            </div>
            <div className="input-field">
              <input 
                id="age" 
                type="number" 
                className="validate" 
                min="0" 
                onInput={(e) => {
                  if (e.target.value < 0) e.target.value = 0;
                }} 
              />
              <label htmlFor="age">Возраст</label>
            </div>
            <div className="input-field">
              <select id="country">
                <option value="" disabled selected>Выберите вашу страну</option>
                <option value="country1">Country 1</option>
                <option value="country2">Country 2</option>
                <option value="country3">Country 3</option>
              </select>
            </div>
            <div className="input-field">
              <select id="city">
                <option value="" disabled selected>Выберите ваш город</option>
                <option value="city1">City 1</option>
                <option value="city2">City 2</option>
                <option value="city3">City 3</option>
              </select>
            </div>
            <button className="btn waves-effect waves-light btn-register" type="submit" name="action">
              Зарегистрироваться
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
