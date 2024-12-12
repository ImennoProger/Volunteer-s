import React from 'react';
import { Typography, Box, useTheme, Grid, Card, CardContent, CardMedia, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';

const Groups = () => {
  const theme = useTheme();

  // Имитация данных групп
  const groups = [
    {
      id: 1,
      name: "Защитники природы",
      members: 128,
      type: "Экология",
      imageUrl: "https://ui-avatars.com/api/?name=Nature&size=256&background=2E7D32&color=fff"
    },
    {
      id: 2,
      name: "Помощь детям",
      members: 256,
      type: "Социальная помощь",
      imageUrl: "https://ui-avatars.com/api/?name=Kids&size=256&background=1976D2&color=fff"
    },
    {
      id: 3,
      name: "Городские события",
      members: 312,
      type: "Организация мероприятий",
      imageUrl: "https://ui-avatars.com/api/?name=City&size=256&background=9C27B0&color=fff"
    },
    {
      id: 4,
      name: "Спортивные волонтеры",
      members: 184,
      type: "Спорт",
      imageUrl: "https://ui-avatars.com/api/?name=Sport&size=256&background=ED6C02&color=fff"
    },
    {
      id: 5,
      name: "Помощь животным",
      members: 145,
      type: "Защита животных",
      imageUrl: "https://ui-avatars.com/api/?name=Animals&size=256&background=D32F2F&color=fff"
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
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Группы
      </Typography>

      <Grid container spacing={2}>
        {groups.map((group) => (
          <Grid item xs={12} key={group.id}>
            <Card 
              sx={{ 
                display: 'flex',
                backgroundColor: 'white',
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                  transition: 'all 0.2s'
                }
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: 140 }}
                image={group.imageUrl}
                alt={group.name}
              />
              <CardContent sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" component="div">
                    {group.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                    <PeopleIcon sx={{ mr: 1, fontSize: 'small', color: theme.palette.text.secondary }} />
                    <Typography variant="body2" color="text.secondary">
                      {group.members} участников
                    </Typography>
                  </Box>
                  <Chip 
                    label={group.type}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Groups;
