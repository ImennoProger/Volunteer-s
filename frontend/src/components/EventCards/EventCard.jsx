import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Snackbar, useMediaQuery, useTheme, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

function EventCard({ event }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage] = useState('');

  const navigate = useNavigate();

  const handleDetails = () => {
    navigate(`/event/${event.id}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Дата не указана';

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Дата не указана';

    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Card 
        sx={{ 
          maxWidth: isMobile ? '100%' : 345, 
          mb: 3, 
          position: 'relative', 
          overflow: 'hidden',
          '&:hover': { cursor: 'pointer' }
        }}
        onClick={handleDetails}
      >
        <CardMedia
          component="img"
          alt={event.name}
          image={event.imageUrl}
          sx={{ 
            objectFit: 'cover', 
            aspectRatio: '1 / 1', 
            transition: 'opacity 0.3s ease-in-out',
            '&:hover': {
              opacity: 0.7
            }
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            color: 'white', 
            opacity: 0, 
            transition: 'opacity 0.3s ease-in-out',
            '&:hover': {
              opacity: 1
            }
          }}
        >
          <Typography variant="h6">Подробнее</Typography>
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {event.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PlaceIcon sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">{event.city}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </Typography>
          </Box>
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
