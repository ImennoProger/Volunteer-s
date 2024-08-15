import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, CircularProgress, Card, CardMedia, Snackbar } from '@mui/material';

function EventDetails() {
  const { id } = useParams(); // Получаем id события из URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://185.242.118.144:8000/events/${id}/`);
        setEvent(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных события:', error);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRegister = () => {
    const isLoggedIn = false; // замени на состояние авторизации

    if (isLoggedIn) {
      setSnackbarMessage('Вы записаны на мероприятие');
      setSnackbarOpen(true);
    } else {
      navigate('/login');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Мероприятие не найдено</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardMedia
          component="img"
          alt={event.event_name}
          height="200"
          image={event.imageUrl || 'https://via.placeholder.com/500'} 
          sx={{ objectFit: 'cover' }}
        />
      </Card>
      <Typography variant="h4">{event.event_name}</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        <strong>Описание:</strong> {event.full_description}<br />
        <strong>Краткое описание:</strong> {event.short_description}<br />
        <strong>Дата начала:</strong> {new Date(event.startDate).toLocaleDateString()}<br />
        <strong>Дата окончания:</strong> {new Date(event.endDate).toLocaleDateString()}<br />
        <strong>Требуется:</strong> {event.requiredPeople} человек<br />
        <strong>Зарегистрировано:</strong> {event.registeredPeople} человек<br />
        <strong>Очки:</strong> {event.points}<br />
        <strong>Награды:</strong> {event.awards}<br />
        <strong>Страна:</strong> {event.country}<br />
        <strong>Город:</strong> {event.city}<br />
        <strong>Регион:</strong> {event.region}<br />
        <strong>Категория:</strong> {event.category}
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={handleRegister}>
          Записаться
        </Button>
        <Button variant="outlined" color="primary" onClick={handleBack}>
          Назад
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <Button color="inherit" onClick={handleCloseSnackbar}>
            Закрыть
          </Button>
        }
      />
    </Box>
  );
}

export default EventDetails;
