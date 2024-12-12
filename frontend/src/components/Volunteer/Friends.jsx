import React from 'react';
import { Typography, Box, useTheme, Grid, Avatar, Button } from '@mui/material';

const Friends = () => {
  const theme = useTheme();

  // Список друзей с аватарками, генерируемыми из имен
  const friends = [
    { name: 'Иван Иванов', avatar: 'https://ui-avatars.com/api/?name=Иван+Иванов&background=random' },
    { name: 'Мария Петрова', avatar: 'https://ui-avatars.com/api/?name=Мария+Петрова&background=random' },
    { name: 'Алексей Смирнов', avatar: 'https://ui-avatars.com/api/?name=Алексей+Смирнов&background=random' },
    { name: 'Ольга Сидорова', avatar: 'https://ui-avatars.com/api/?name=Ольга+Сидорова&background=random' },
    { name: 'Дмитрий Козлов', avatar: 'https://ui-avatars.com/api/?name=Дмитрий+Козлов&background=random' },
    { name: 'Анна Морозова', avatar: 'https://ui-avatars.com/api/?name=Анна+Морозова&background=random' },
    { name: 'Сергей Волков', avatar: 'https://ui-avatars.com/api/?name=Сергей+Волков&background=random' },
    { name: 'Екатерина Новикова', avatar: 'https://ui-avatars.com/api/?name=Екатерина+Новикова&background=random' }
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
        Друзья
      </Typography>
      
      <Grid container spacing={2}>
        {friends.map((friend, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: 1,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={friend.avatar}
                  alt={friend.name}
                  sx={{ width: 50, height: 50, mr: 2 }}
                />
                <Typography>{friend.name}</Typography>
              </Box>
              <Button variant="contained" color="primary" size="small">
                Написать
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Friends;
