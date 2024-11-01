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
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import EventMapCreate from '../Map/EventMapCreate.jsx';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

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
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/events/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEvents(response.data || []);
      } catch (error) {
        console.error('Ошибка при загрузке мероприятий:', error.response?.data || error.message);
      }
    };

    fetchEvents();
  }, []);

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

  const validateFields = () => {
    const newErrors = {};
    if (!newEvent.name || newEvent.name.length < 2) {
      newErrors.name = 'Название должно содержать не менее 2 символов';
    }
    if (!newEvent.shortDescription || newEvent.shortDescription.length < 10) {
      newErrors.shortDescription = 'Краткое описание должно быть не менее 10 символов';
    }
    if (!newEvent.fullDescription || newEvent.fullDescription.length < 20) {
      newErrors.fullDescription = 'Полное описание должно быть не менее 20 символов';
    }
    if (!newEvent.requiredPeople || newEvent.requiredPeople <= 0) {
      newErrors.requiredPeople = 'Укажите количество участников больше нуля';
    }
    if (!newEvent.points || newEvent.points <= 0) {
      newErrors.points = 'Баллы должны быть больше нуля';
    }
    if (!newEvent.awards) {
      newErrors.awards = 'Укажите награды';
    }
    if (!newEvent.category) {
      newErrors.category = 'Категория обязательна';
    }
    if (!newEvent.startDate) {
      newErrors.startDate = 'Дата начала обязательна';
    }
    if (!newEvent.endDate || newEvent.endDate < newEvent.startDate) {
      newErrors.endDate = 'Дата окончания должна быть позже даты начала';
    }
    return newErrors;
  };


  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const fieldErrors = validateFields();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setErrorMessage('Исправьте ошибки перед отправкой');
      setOpenSnackbar(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiBaseUrl}/events/`, {
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

      const response = await axios.get(`${apiBaseUrl}/events/`);
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

      await axios.delete(`${apiBaseUrl}/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEvents((prev) => prev.filter((event) => event.event_id !== id));
    } catch (error) {
      console.error('Ошибка при удалении мероприятия:', error.response?.data || error.message);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Управление мероприятиями
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box
            component="form"
            onSubmit={handleCreateEvent}
            sx={{
              p: 2,
              border: '1px solid #ddd',
              borderRadius: '8px',
              width: '100%'
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Создать новое мероприятие
            </Typography>
            <TextField
              fullWidth
              label="Название"
              name="name"
              value={newEvent.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Краткое описание"
              name="shortDescription"
              value={newEvent.shortDescription}
              onChange={handleChange}
              error={Boolean(errors.shortDescription)}
              helperText={errors.shortDescription}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Полное описание"
              name="fullDescription"
              value={newEvent.fullDescription}
              onChange={handleChange}
              error={Boolean(errors.fullDescription)}
              helperText={errors.fullDescription}
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
              error={Boolean(errors.requiredPeople)}
              helperText={errors.requiredPeople}
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
              error={Boolean(errors.points)}
              helperText={errors.points}
              inputProps={{ min: 0 }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Награды"
              name="awards"
              value={newEvent.awards}
              onChange={handleChange}
              error={Boolean(errors.awards)}
              helperText={errors.awards}
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
              error={Boolean(errors.startDate)}
              helperText={errors.startDate}
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
              error={Boolean(errors.endDate)}
              helperText={errors.endDate}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Категория"
              name="category"
              value={newEvent.category}
              onChange={handleChange}
              error={Boolean(errors.category)}
              helperText={errors.category}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Выберите местоположение на карте:</Typography>
              <EventMapCreate setCoordinates={handleCoordinatesChange} />
            </Box>
            {imagePreview && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Предварительный просмотр:</Typography>
                <img
                  src={imagePreview}
                  alt="Предварительный просмотр"
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }}
                />
              </Box>
            )}
            <Button variant="contained" component="label" sx={{ mb: 2, width: '100%' }}>
              Загрузить изображение
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            <Button variant="contained" type="submit" sx={{ width: '100%' }}>
              Создать мероприятие
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Список мероприятий
          </Typography>
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.event_id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={event.image || 'https://via.placeholder.com/150'}
                    alt={event.event_name}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
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
                    <Button size="small" color="error" onClick={() => handleDeleteEvent(event.event_id)}>
                      Удалить
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={errorMessage}
      />
    </Paper>
  );
};

export default ManageEvents;
