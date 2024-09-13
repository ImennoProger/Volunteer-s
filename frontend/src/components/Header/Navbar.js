import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from './logo192.png';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Tooltip, Avatar, useMediaQuery, useTheme, Badge } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import ChatIcon from '@mui/icons-material/Chat';
import { useAppTheme } from './ThemeContext';
import { useAuth } from '../Auth/AuthContext';
import io from 'socket.io-client';
import './Navbar.css';
import './themes.css';
import '../../pages/globalStyless.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useAppTheme();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const themeIcon = theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />;
  const themeIconTitle = theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';

  const themeObject = useTheme();
  const isMobile = useMediaQuery(themeObject.breakpoints.down('md'));
  const navigate = useNavigate(); // To navigate after logout
  const token = localStorage.getItem('token'); // Check if token exists
  const isLoggedIn = !!token; // User authentication status

  useEffect(() => {
    const token = localStorage.getItem('token');
    const socket = io(process.env.REACT_APP_API_BASE_URL, {
      query: { token }
    });
    socket.on('connect', () => {
      console.log('Connected to socket from navbar');
    });
    
    socket.on('unread_messages_count', (data) => {
      console.log(`Unread messages count received: ${data.count}`);
      setUnreadMessagesCount(data.count);
    });

    return () => {
      socket.off('unread_messages_count');
    };
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:8000/logout', { 
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        localStorage.removeItem('token'); 
        navigate('/login'); // Redirect to login after logout
      } else {
        alert('Failed to log out.');
      }
    })
    .catch(error => {
      console.error('Error logging out:', error);
      alert('Failed to log out.');
    });
  };

  return (
    <AppBar position="static" className="nav-wrapper">
      <Toolbar>
        <Link to="/" className="brand-logo">
          <img src={logoImage} alt="Logo" className="logo-image" />
        </Link>
        <Typography variant="h6" className="brand-name">
          Волонтёрский портал
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Баланс">
            <IconButton color="inherit" aria-label="balance" sx={{ ml: 2, p: 1 }}>
              <Badge
                badgeContent={1500}
                color="secondary"
                max={10000}
                showZero
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
              >
                <AttachMoneyIcon sx={{ fontSize: 28 }} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Чат">
            <IconButton
              color="inherit"
              aria-label="chat"
              component={Link}
              to="/chatpage"
              sx={{ ml: 2 }}
            >
              <Badge
                badgeContent={unreadMessagesCount > 0 ? unreadMessagesCount : null}
                color="error"
                max={99}
                showZero
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <ChatIcon sx={{ fontSize: 28 }} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title={themeIconTitle}>
            <IconButton color="inherit" onClick={toggleTheme} className="theme-switcher" sx={{ ml: 2, p: 1, zIndex: 1 }}>
              {themeIcon}
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={Link} to="/profile">
                Профиль
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Войти
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Зарегистрироваться
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;