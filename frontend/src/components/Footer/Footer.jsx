import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, IconButton, TextField } from '@mui/material';
import { Telegram } from '@mui/icons-material';
import { FaVk } from 'react-icons/fa';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './Footer.css';

const Footer = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: 'rgb(199, 146, 234)', padding: '20px' }}>
      {/* Title */}
      <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '20px' }}>
        volunteers-portal
      </Typography>
      
      {/* Main Content */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Email Subscription */}
        <Box sx={{ flex: 1, minWidth: '200px', marginRight: '20px' }}>
          <Typography
            variant="body2" // Используем меньший размер шрифта
            sx={{ 
              marginBottom: '10px', 
              color: '#fff', // Белый цвет
              textAlign: 'center' // Центрирование текста
            }}
          >
            Подпишитесь на нашу рассылку и узнавайте о новостях первыми
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <TextField
              variant="outlined"
              placeholder="Ваша электронная почта"
              size="small"
              sx={{ 
                maxWidth: '425px', // Устанавливаем максимальную ширину
                width: '100%',
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#fff',
                zIndex: 1,
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Links */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px', marginRight: '20px' }}>
          <Button component={Link} to="/about" sx={{ color: '#fff', textDecoration: 'none', marginBottom: '10px' }}>
            О платформе
          </Button>
          <Button component={Link} to="/events" sx={{ color: '#fff', textDecoration: 'none', marginBottom: '10px' }}>
            Мероприятия
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '200px' }}>
          <Button component={Link} to="/terms" sx={{ color: '#fff', textDecoration: 'none', marginBottom: '10px' }}>
            Пользовательское соглашение
          </Button>
          <Button component={Link} to="/privacy" sx={{ color: '#fff', textDecoration: 'none' }}>
            Политика конфиденциальности
          </Button>
        </Box>
      </Box>
      
      {/* Social Media Icons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <IconButton component="a" href="https://vk.com" target="_blank" sx={{ color: '#fff', margin: '0 10px' }}>
          <FaVk />
        </IconButton>
        <IconButton component="a" href="https://t.me" target="_blank" sx={{ color: '#fff', margin: '0 10px' }}>
          <Telegram />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;
