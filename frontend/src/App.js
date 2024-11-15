import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import io from 'socket.io-client';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import Navbar from './components/Header/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import ProtectedPage from './pages/Protected';
import VolunteerPage from './pages/VolunteerPage';
import CityAdminPage from './pages/CityAdminPage';
import RegionAdminPage from './pages/RegionAdminPage';
import SuperUserPage from './pages/SuperUserPage';
import EventDetailsPage from './pages/EventDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import ChatPage from './pages/ChatPage';
import NewPage from './pages/NewPage';
import { ThemeProvider } from './components/Header/ThemeContext';
import Header1 from './components/Header1/Header1';
import './style/globalStyles.css';


const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io(process.env.REACT_APP_API_BASE_URL, {
      query: { token }
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected App.js');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error("Invalid token", error);
        setUserRole(null);
        navigate('/login');
      }
    } else {
      setUserRole(null);
    }
  }, [navigate]);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwt_decode(token);
          setUserRole(decodedToken.role);
        } catch (error) {
          setUserRole(null);
          navigate('/login');  
        }
      } else {
        setUserRole(null);
        navigate('/login');  
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  const getProfilePage = () => {
    switch (userRole) {
      case 'volunteer':
        return <VolunteerPage />;
      case 'cityadm':
        return <CityAdminPage />;
      case 'regionadm':
        return <RegionAdminPage />;
      case 'superadm':
        return <SuperUserPage />;
      default:
        return <Navigate to="/" />;
    }
  };

  const isCustomPage = location.pathname === '/newpage';

  return (
    <ThemeProvider>
      {isCustomPage ? (
        // Отображаем только NewPage
        <NewPage />
      ) : (
        // Для всех остальных страниц
        <>
          <Header1 /> {/* Заменяем Navbar на Header1 */}
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/protected" element={<ProtectedPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile" element={getProfilePage()} />
              <Route path="/event/:id" element={<EventDetailsPage />} />
              <Route path="/chatpage" element={<ChatPage socket={socket} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
          <Footer />
        </>
      )}
    </ThemeProvider>
  );
};

export default App;
