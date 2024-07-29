import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

function EventCard({ event }) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt={event.name}
        height="140"
        image={event.imageUrl}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {event.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Требуется: {event.requiredPeople} человек<br />
          Зарегистрировано: {event.registeredPeople} человек<br />
          Очки: {event.points}<br />
          {event.shortDescription}
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Записаться
        </Button>
        <Button variant="outlined" color="primary" sx={{ mt: 2, ml: 1 }}>
          Подробнее
        </Button>
      </CardContent>
    </Card>
  );
}

export default EventCard;
