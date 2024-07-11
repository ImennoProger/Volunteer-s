import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import Navbar from './components/Navbar';
import Home from './components/Home';  // Импортируем компонент домашней страницы
import ProtectedPage from './components/Protected'

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />               {/* Добавляем маршрут для домашней страницы */}
          <Route path="/login" element={<Login />} />
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
