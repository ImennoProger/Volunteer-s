import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { Box, Typography, Button, CircularProgress, Card, CardMedia, Snackbar } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventCard from '../components/EventCards/EventCard';
import EventMap from '../components/Map/EventMap';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

function EventDetails() {
  const { id } = useParams(); 
  const [event, setEvent] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const [eventResponse, registrationResponse] = await Promise.all([
          // Получаем детали события
          axios.get(`${apiBaseUrl}/events/${id}/`),
          // Проверяем статус регистрации, если пользователь авторизован
          localStorage.getItem('token') ? axios.get(`${apiBaseUrl}/event-register/check/${id}/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }) : Promise.resolve({ data: { is_registered: false } })
        ]);

        setEvent(eventResponse.data);
        setIsRegistered(registrationResponse.data.is_registered);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      }
    };

    const fetchRecommendedEvents = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/events/`);
        const eventData = response.data.map(event => ({
          id: event.event_id,
          name: event.event_name,
          description: event.full_description,
          shortDescription: event.short_description,
          requiredPeople: event.required_volunteers,
          registeredPeople: event.registered_volunteers,
          points: event.participation_points,
          awards: event.rewards,
          startDate: event.start_date,
          endDate: event.end_date,
          country: event.country_name,  
          city: event.city_name,        
          category: event.category_name,
          imageUrl: event.image, 
          latitude: event.latitude,
          longitude: event.longitude,
        }));
        setRecommendedEvents(eventData);

      } catch (error) {
        console.error('Ошибка при загрузке рекомендованных событий:', error);
      }
    };

    fetchEventDetails();
    fetchRecommendedEvents();
  }, [id]);

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${apiBaseUrl}/event-register/`, {
        event_id: event.event_id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Обновляем статус регистрации после успешной записи
      const registrationStatus = await axios.get(`${apiBaseUrl}/event-register/check/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setIsRegistered(registrationStatus.data.is_registered);
      setSnackbarMessage('Вы успешно записались на мероприятие');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Ошибка при записи на мероприятие:', error);
      setSnackbarMessage('Ошибка при записи на мероприятие');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <Button
        onClick={onClick}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '0px',
          transform: 'translate(50%, -50%)',
          zIndex: 10,
          backgroundColor: '#fff',
          '&:hover': {
            backgroundColor: '#ddd',
          },
        }}
      >
        &gt;
      </Button>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <Button
        onClick={onClick}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '0px',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          backgroundColor: '#fff',
          '&:hover': {
            backgroundColor: '#ddd',
          },
        }}
      >
        &lt;
      </Button>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1300px', margin: 'auto' }}>
      {/* Левый блок с картинкой и информацией */}
      <Box sx={{ flex: 1, borderRadius: '8px', overflow: 'hidden', marginRight: 2, display: 'flex', flexDirection: 'column', height: 'auto' }}>
        <Card>
          <CardMedia
            component="img"
            alt={event.event_name}
            height="300"
            image={event.image || 'https://via.placeholder.com/500'}
            sx={{ objectFit: 'cover' }}
          />
        </Card>
        <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#f9f9f9', borderTop: '1px solid #ddd' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Требуется:</strong> {event.required_volunteers} человек
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Зарегистрировано:</strong> {event.registered_volunteers} человек
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button 
              variant={isRegistered ? "outlined" : "contained"}
              color={isRegistered ? "success" : "primary"}
              onClick={handleRegister}
              disabled={isRegistered}
            >
              {isRegistered ? 'Вы записаны' : 'Записаться'}
            </Button>
            <Button variant="outlined" color="primary" onClick={handleBack}>
              Назад
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Правый блок с основной информацией */}
      <Box sx={{ flex: 2 }}>
        <Typography variant="h4" sx={{ mb: 2, color: '#fff' }}>{event.event_name}</Typography>

        <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Основная информация</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Краткое описание:</strong> {event.short_description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PlaceIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="body1">{event.country_name}, {event.city_name}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="body1">
              {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <EventMap events={[{
            id: event.event_id,
            name: event.event_name,
            description: event.full_description,
            latitude: event.latitude,
            longitude: event.longitude,
          }]} />
        </Box>
        <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Описание</Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Полное описание:</strong> {event.full_description}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Очки:</strong> {event.participation_points}
          </Typography>
          <Typography variant="body1">
            <strong>Награды:</strong> {event.rewards}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default EventDetails;
