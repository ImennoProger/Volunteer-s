import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import Navbar from './components/Header/Navbar';
import Home from './pages/Home';
import ProtectedPage from './pages/Protected';
import VolunteerPage from './pages/VolunteerPage';
import CityAdminPage from './pages/CityAdminPage';
import RegionAdminPage from './pages/RegionAdminPage';
import SuperUserPage from './pages/SuperUserPage';
import EventDetailsPage from './pages/EventDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import ChatPage from './pages/ChatPage';
import { ThemeProvider } from './components/Header/ThemeContext';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const App = () => {
  useEffect(() => {
    const socket = io(apiBaseUrl, {
      query: { token: localStorage.getItem('token') }
    });

    socket.on('connect', () => {
      console.log('Подключено к серверу Socket.IO');
    });

    socket.emit('message', 'Привет с клиента');

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/protected" element={<ProtectedPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/city-admin" element={<CityAdminPage />} />
          <Route path="/region-admin" element={<RegionAdminPage />} />
          <Route path="/superuser" element={<SuperUserPage />} />
          <Route path="/event/:id" element={<EventDetailsPage />} />
          <Route path="/chatpage" element={<ChatPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
