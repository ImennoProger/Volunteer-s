import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Modal, useMediaQuery, useTheme, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

function EventCard({ event }) {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const isLoggedIn = false; // замени на состояние авторизации
  const navigate = useNavigate(); 

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRegister = () => {
    if (isLoggedIn) {
      setSnackbarMessage('Вы записаны на мероприятие');
      setSnackbarOpen(true);
    } else {
      navigate('/login'); 
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Дата не указана';

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Дата не указана';

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
  };

  // Используем тему для адаптации размеров
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Card sx={{ maxWidth: isMobile ? '100%' : 345, mb: 3 }}>
        <CardMedia
          component="img"
          alt={event.name}
          height={isMobile ? 200 : 140}
          image={event.imageUrl}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {event.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {event.shortDescription}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Дата начала:</strong> {formatDate(event.startDate)}<br />
              <strong>Дата окончания:</strong> {formatDate(event.endDate)}<br />
              <strong>Требуется:</strong> {event.requiredPeople} человек<br />
              <strong>Зарегистрировано:</strong> {event.registeredPeople} человек<br />
              <strong>Очки:</strong> {event.points}
            </Typography>
          </Box>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleRegister}>
            Записаться
          </Button>
          <Button variant="outlined" color="primary" sx={{ mt: 2, ml: 1 }} onClick={handleOpen}>
            Подробнее
          </Button>
        </CardContent>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ 
          position: 'relative', 
          width: isMobile ? '90%' : 500, 
          maxWidth: '90%', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4, 
          borderRadius: 2 
        }}>
          <Typography id="modal-title" variant="h6" component="h2">
            {event.name}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            <strong>Описание:</strong> {event.description}<br />
            <strong>Краткое описание:</strong> {event.shortDescription}<br />
            <strong>Дата начала:</strong> {formatDate(event.startDate)}<br />
            <strong>Дата окончания:</strong> {formatDate(event.endDate)}<br />
            <strong>Требуется:</strong> {event.requiredPeople} человек<br />
            <strong>Зарегистрировано:</strong> {event.registeredPeople} человек<br />
            <strong>Очки:</strong> {event.points}<br />
            <strong>Награды:</strong> {event.awards}<br />
            <strong>Страна:</strong> {event.country}<br />
            <strong>Город:</strong> {event.city}<br />
            <strong>Регион:</strong> {event.region}<br />
            <strong>Категория:</strong> {event.category}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button onClick={handleClose} variant="outlined">
              Закрыть
            </Button>
            <Button 
              onClick={handleRegister}
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
            >
              Записаться
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <Button color="inherit" onClick={() => setSnackbarOpen(false)}>
            Закрыть
          </Button>
        }
      />
    </>
  );
}

export default EventCard;
