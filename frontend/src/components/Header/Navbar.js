import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './logo192.png';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button, useMediaQuery, useTheme, Badge, Box, Tooltip, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MessageIcon from '@mui/icons-material/Message';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ChatIcon from '@mui/icons-material/Chat';
import './Navbar.css';
import { useAuth } from '../Auth/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [messageAnchorEl, setMessageAnchorEl] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  const open = Boolean(anchorEl);
  const openMessages = Boolean(messageAnchorEl);
  const openProfileMenu = Boolean(profileAnchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleMessageMenuOpen = (event) => {
    setMessageAnchorEl(event.currentTarget);
  };

  const handleMessageMenuClose = () => {
    setMessageAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const messages = [
    'Сообщение 1',
    'Сообщение 2',
    'Сообщение 3',
  ];

  return (
    <AppBar position="static" className="nav-wrapper">
      <Toolbar>
        <Link to="/" className="brand-logo">
          <img src={logoImage} alt="Logo" style={{ height: '56px' }} />
        </Link>
        <Typography variant="h6" className="brand-name">
          Волонтёрский портал
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        
        <Tooltip title="Баланс">
          <IconButton
            color="inherit"
            aria-label="balance"
            sx={{ ml: 2 }}
          >
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
              <AttachMoneyIcon sx={{ fontSize: 28 }}/>
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
            <ChatIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Сообщения">
          <IconButton
            color="inherit"
            aria-label="messages"
            onClick={handleMessageMenuOpen}
            sx={{ ml: 2 }}
          >
            <Badge
              badgeContent={5}
              color="error"
              showZero
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MessageIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={messageAnchorEl}
          open={openMessages}
          onClose={handleMessageMenuClose}
          PaperProps={{ sx: { width: 300 } }}
          sx={{ mt: '45px' }}
        >
          {messages.length === 0 ? (
            <MenuItem disabled>No new messages</MenuItem>
          ) : (
            messages.map((message, index) => (
              <MenuItem key={index} onClick={handleMessageMenuClose}>
                {message}
              </MenuItem>
            ))
          )}
        </Menu>

        {isAuthenticated ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
              sx={{ ml: 2 }}
            >
              <Avatar alt="User Avatar" />
            </IconButton>
            <Menu
              anchorEl={profileAnchorEl}
              open={openProfileMenu}
              onClose={handleProfileMenuClose}
              sx={{ mt: '45px' }}
            >
              <MenuItem onClick={handleProfileMenuClose}><Link to="/volunteer" className="menu-link">Настройки профиля</Link></MenuItem>
              <MenuItem onClick={handleLogout}>Выйти</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <div className="nav-buttons">
              <Button color="inherit" component={Link} to="/login">
                Войти
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Зарегистрироваться
              </Button>
            </div>
          </>
        )}

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
              <MenuItem onClick={handleMenuClose}><Link to="/" className="menu-link">Главная</Link></MenuItem>
              <MenuItem onClick={handleMenuClose}><Link to="/volunteer" className="menu-link">Волонтер</Link></MenuItem>
              <MenuItem onClick={handleMenuClose}><Link to="/city-admin" className="menu-link">Адм.гор</Link></MenuItem>
              <MenuItem onClick={handleMenuClose}><Link to="/region-admin" className="menu-link">Адм.рег</Link></MenuItem>
              <MenuItem onClick={handleMenuClose}><Link to="/superuser" className="menu-link">SU</Link></MenuItem>
              {!isAuthenticated && (
                <>
                  <MenuItem onClick={handleMenuClose}><Link to="/login" className="menu-link">Войти</Link></MenuItem>
                  <MenuItem onClick={handleMenuClose}><Link to="/register" className="menu-link">Зарегистрироваться</Link></MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <>
            <div className="nav-menu">
              <Button
                color="inherit"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                Меню
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                sx={{ mt: '45px' }}
              >
                <MenuItem onClick={handleMenuClose}><Link to="/volunteer" className="menu-link">Волонтер</Link></MenuItem>
                <MenuItem onClick={handleMenuClose}><Link to="/city-admin" className="menu-link">Адм.гор</Link></MenuItem>
                <MenuItem onClick={handleMenuClose}><Link to="/region-admin" className="menu-link">Адм.рег</Link></MenuItem>
                <MenuItem onClick={handleMenuClose}><Link to="/superuser" className="menu-link">SU</Link></MenuItem>
                {!isAuthenticated && (
                  <>
                    <MenuItem onClick={handleMenuClose}><Link to="/login" className="menu-link">Войти</Link></MenuItem>
                    <MenuItem onClick={handleMenuClose}><Link to="/register" className="menu-link">Зарегистрироваться</Link></MenuItem>
                  </>
                )}
              </Menu>
            </div>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
