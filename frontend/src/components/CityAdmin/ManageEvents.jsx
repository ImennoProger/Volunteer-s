import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Paper,
} from '@mui/material';
import axios from 'axios';
import EventMapCreate from '../Map/EventMapCreate.jsx';


const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    requiredPeople: '',
    points: '',
    awards: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    category: '',
    image: '',
    latitude: '',
    longitude: ''
  });
  const [imagePreview, setImagePreview] = useState(''); // Для хранения URL предварительного просмотра изображения

   useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/events/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEvents(response.data || []);
      } catch (error) {
        console.error('Ошибка при загрузке мероприятий:', error.response?.data || error.message);
      }
    };

    fetchEvents(); // Вызов функции загрузки данных
  }, []); // Пустой массив зависимостей для вызова только при монтировании

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewEvent({ ...newEvent, image: e.target.result });
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/events/', {
        event_name: newEvent.name,
        short_description: newEvent.shortDescription,
        full_description: newEvent.fullDescription,
        start_date: newEvent.startDate,
        end_date: newEvent.endDate,
        category_name: newEvent.category,
        required_volunteers: newEvent.requiredPeople,
        participation_points: newEvent.points,
        rewards: newEvent.awards,
        image: newEvent.image,
        latitude: newEvent.latitude,
        longitude: newEvent.longitude
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const response = await axios.get('http://localhost:8000/events/');
      setEvents(response.data);
  
      setNewEvent({
        name: '',
        shortDescription: '',
        fullDescription: '',
        requiredPeople: '',
        points: '',
        awards: '',
        image: '',
        startDate: '',
        endDate: '',
        category: '',
        latitude: '',
        longitude: ''
      });
      setImagePreview('');
    } catch (error) {
      console.error('Ошибка при создании мероприятия:', error.response?.data || error.message);
    }
  };
  
  
  const handleCoordinatesChange = (coords) => {
    setNewEvent(prev => ({
      ...prev,
      latitude: coords.latitude,
      longitude: coords.longitude
    }));
  };

  const handleDeleteEvent = async (id) => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:8000/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Обновление состояние после успешного удаления
      setEvents((prev) => prev.filter((event) => event.event_id !== id));
    } catch (error) {
      console.error('Ошибка при удалении мероприятия:', error.response?.data || error.message);
    }
  };
  
 
  return (
    <Paper elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.event_id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={event.image || ''}
                  alt={event.event_name}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {event.event_name || 'Без названия'} 
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.short_description || 'Краткое описание отсутствует'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {event.full_description || 'Полное описание отсутствует'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Количество участников: {event.required_volunteers || 'Не указано'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Баллы: {event.participation_points || 'Не указано'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Награды: {event.rewards || 'Не указано'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Дата начала: {event.start_date || 'Не указана'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Дата окончания: {event.end_date || 'Не указана'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteEvent(event.event_id)}
                  >
                    Удалить
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      <Box component="form" onSubmit={handleCreateEvent} sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
          Создать новое мероприятие
        </Typography>
        <TextField
          fullWidth
          label="Название"
          name="name"
          value={newEvent.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Краткое описание"
          name="shortDescription"
          value={newEvent.shortDescription}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Полное описание"
          name="fullDescription"
          value={newEvent.fullDescription}
          onChange={handleChange}
          sx={{ mb: 2 }}
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          label="Количество участников"
          name="requiredPeople"
          type="number"
          value={newEvent.requiredPeople}
          onChange={handleChange}
          inputProps={{ min: 0 }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Баллы"
          name="points"
          type="number"
          value={newEvent.points}
          onChange={handleChange}
          inputProps={{ min: 0 }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Награды"
          name="awards"
          value={newEvent.awards}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Дата начала"
          name="startDate"
          type="date"
          value={newEvent.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Дата окончания"
          name="endDate"
          type="date"
          value={newEvent.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Категория"
          name="category"
          value={newEvent.category}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <div>
        <Typography variant="subtitle1">Выберите местоположение на карте:</Typography>
        <EventMapCreate setCoordinates={handleCoordinatesChange} />
        </div>
        {imagePreview && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Предварительный просмотр:</Typography>
            <img src={imagePreview} alt="Предварительный просмотр" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
          </Box>
        )}
        <div>
          <Button variant="contained" component="label" sx={{ mb: 2 }}>
            Загрузить изображение
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </div>
        <Button variant="contained" color="primary" type="submit">
          Создать мероприятие
        </Button>
      </Box>
    </Paper>
  );
};

export default ManageEvents;
