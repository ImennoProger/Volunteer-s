import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from './logo192.png';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Button, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './Navbar.css';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className="nav-wrapper">
      <Toolbar>
        <Link to="/" className="brand-logo">
          <img src={logoImage} alt="Logo" style={{ height: '64px' }} />
        </Link>
        <Typography variant="h6" className="brand-name">
          Волонтерский портал
        </Typography>
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
              <MenuItem onClick={handleMenuClose}><Link to="/login" className="menu-link">Войти</Link></MenuItem>
              <MenuItem onClick={handleMenuClose}><Link to="/register" className="menu-link">Зарегистрироваться</Link></MenuItem>
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
              </Menu>
            </div>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
