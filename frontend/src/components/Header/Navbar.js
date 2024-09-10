import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './logo192.png';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button, Box, Tooltip, Avatar, useMediaQuery, useTheme, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import './Navbar.css';
import './themes.css';
import '../../pages/globalStyless.css';
import { useAppTheme } from './ThemeContext';
import ChatIcon from '@mui/icons-material/Chat';
import { useAuth } from '../Auth/AuthContext';
import io from 'socket.io-client';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useAppTheme();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const open = Boolean(anchorEl);
  const openProfileMenu = Boolean(profileAnchorEl);
  const themeIcon = theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />;
  const themeIconTitle = theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  
  const themeObject = useTheme();
  const isMobile = useMediaQuery(themeObject.breakpoints.down('md'));

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

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
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
        {isAuthenticated ? (
          <>
            <IconButton color="inherit" onClick={handleProfileMenuOpen} sx={{ ml: 2, p: 1 }}>
              <Avatar alt="User Avatar" />
            </IconButton>
            <Menu
              anchorEl={profileAnchorEl}
              open={openProfileMenu}
              onClose={handleProfileMenuClose}
              sx={{ mt: '45px' }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <Link to="/volunteer" className="menu-link">Настройки профиля</Link>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Выйти</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }} />
        )}

        {/* Мобильное меню */}
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{ ml: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              keepMounted
              sx={{ mt: '45px' }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Link to="/" className="menu-link">Главная</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/volunteer" className="menu-link">Волонтер</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/city-admin" className="menu-link">Адм.гор</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/region-admin" className="menu-link">Адм.рег</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/superuser" className="menu-link">SU</Link>
              </MenuItem>
              {!isAuthenticated && (
                <>
                  <MenuItem onClick={handleMenuClose}>
                    <Link to="/login" className="menu-link">Войти</Link>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Link to="/register" className="menu-link">Зарегистрироваться</Link>
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              sx={{ ml: 'auto' }}
            >
              Меню
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              sx={{ mt: '45px' }}
            >
              <MenuItem onClick={handleMenuClose}>
                <Link to="/" className="menu-link">Главная</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/volunteer" className="menu-link">Волонтер</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/city-admin" className="menu-link">Адм.гор</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/region-admin" className="menu-link">Адм.рег</Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/superuser" className="menu-link">SU</Link>
              </MenuItem>
              {!isAuthenticated && (
                <>
                  <MenuItem onClick={handleMenuClose}>
                    <Link to="/login" className="menu-link">Войти</Link>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <Link to="/register" className="menu-link">Зарегистрироваться</Link>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
