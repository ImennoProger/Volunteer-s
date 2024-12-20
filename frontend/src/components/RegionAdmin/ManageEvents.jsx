import React, { useState } from 'react';
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
  });

  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewEvent({ ...newEvent, imageUrl: e.target.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    setEvents((prev) => [
      ...prev,
      { ...newEvent, id: prev.length + 1 },
    ]);
    setNewEvent({
      name: '',
      shortDescription: '',
      fullDescription: '',
      requiredPeople: '',
      points: '',
      awards: '',
      imageUrl: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
      Управление мероприятиями
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={event.imageUrl}
                alt={event.name}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.shortDescription}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.fullDescription}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Количество участников: {event.requiredPeople}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Баллы: {event.points}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Награды: {event.awards}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Дата начала: {event.startDate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Дата окончания: {event.endDate}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteEvent(event.id)}
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
