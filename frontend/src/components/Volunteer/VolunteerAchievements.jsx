import React from 'react';
import { Typography, Chip, Box, useTheme, Grid, Card, CardContent, CardMedia } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const VolunteerAchievements = () => {
  const theme = useTheme();

  // Данные о ранге
  const rankData = {
    name: "Серебряный волонтер",
    points: 2750,
    image: "https://ui-avatars.com/api/?name=SV&size=128&background=silver&color=fff",
    awards: ["Помощь детям", "Защита природы", "Городские мероприятия"]
  };

  // Пример пройденных мероприятий
  const completedEvents = [
    {
      id: 1,
      name: "Марафон добра",
      city: "Москва",
      date: "15.03.2024",
      imageUrl: "https://ui-avatars.com/api/?name=Marathon&size=256&background=random"
    },
    {
      id: 2,
      name: "Посадка деревьев",
      city: "Санкт-Петербург",
      date: "20.02.2024",
      imageUrl: "https://ui-avatars.com/api/?name=Trees&size=256&background=random"
    },
    {
      id: 3,
      name: "Помощь приюту",
      city: "Казань",
      date: "10.01.2024",
      imageUrl: "https://ui-avatars.com/api/?name=Shelter&size=256&background=random"
    }
  ];

  return (
    <Box
      sx={{
        p: 2,
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      {/* Секция ранга */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4, 
        p: 2, 
        backgroundColor: theme.palette.grey[100],
        borderRadius: 2
      }}>
        <Box
          component="img"
          src={rankData.image}
          alt="Ранг"
          sx={{ 
            width: 100, 
            height: 100, 
            borderRadius: '50%',
            mr: 3,
            border: `3px solid ${theme.palette.primary.main}`
          }}
        />
        <Box>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
            {rankData.name}
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Очки: {rankData.points}
          </Typography>
          <Box>
            {rankData.awards.map((award, index) => (
              <Chip 
                key={index}
                label={award}
                color="primary"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Секция пройденных мероприятий */}
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Пройденные мероприятия
      </Typography>
      
      <Grid container spacing={3}>
        {completedEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card sx={{ 
              height: '100%',
              backgroundColor: 'white',
              '&:hover': { transform: 'scale(1.02)', transition: 'transform 0.2s' }
            }}>
              <CardMedia
                component="img"
                height="140"
                image={event.imageUrl}
                alt={event.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                  {event.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PlaceIcon sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.city}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2" color="text.secondary">
                    {event.date}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VolunteerAchievements;
