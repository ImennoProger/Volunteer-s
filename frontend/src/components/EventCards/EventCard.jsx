import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

function EventCard({ event }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const isLoggedIn = false; // замени на состояние авторизации
  const navigate = useNavigate();

  const handleRegister = () => {
    if (isLoggedIn) {
      setSnackbarMessage('Вы записаны на мероприятие');
      setSnackbarOpen(true);
    } else {
      navigate('/login'); 
    }
  };

  const handleDetails = () => {
    navigate(`/event/${event.id}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Дата не указана';

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Дата не указана';

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
  };

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
          <Button variant="outlined" color="primary" sx={{ mt: 2, ml: 1 }} onClick={handleDetails}>
            Подробнее
          </Button>
        </CardContent>
      </Card>

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
