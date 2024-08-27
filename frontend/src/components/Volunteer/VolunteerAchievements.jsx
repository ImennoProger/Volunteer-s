import React from 'react';
import { Typography, Chip, Box } from '@mui/material';

const VolunteerAchievements = ({ rank, points, awards, completedEvents }) => {
  return (
    <Box
      sx={{
        p: 2,
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        borderRadius: 1, 
        backgroundColor: '#fff' 
      }}
    >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Достижения
      </Typography>
      <Typography sx={{ mb: 2, fontWeight: 'bold' }}>Ранг: {rank}</Typography>
      <Typography sx={{ mb: 2, fontWeight: 'bold' }}>Баллы: {points}</Typography>
      <Typography sx={{ mb: 2, fontWeight: 'bold' }}>Награды:</Typography>
      <Box sx={{ mb: 2 }}>
        {awards.map((award, index) => (
          <Chip key={index} color="primary" variant="outlined" sx={{ mr: 1 }}>
            {award}
          </Chip>
        ))}
      </Box>
      <Typography sx={{ mb: 2, fontWeight: 'bold' }}>Пройденные мероприятия:</Typography>
      <Box>
        {completedEvents.map((event, index) => (
          <Chip key={index} color="success" variant="outlined" sx={{ mr: 1 }}>
            {event}
          </Chip>
        ))}
      </Box>
    </Box>
  );
};

export default VolunteerAchievements;
