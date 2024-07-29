import React from 'react';
import { Typography, Chip, Box, Paper } from '@mui/material';

const VolunteerAchievements = ({ rank, points, awards, completedEvents }) => {
  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      
      <Typography sx={{ mb: 2 }}>Ранг: {rank}</Typography>
      <Typography sx={{ mb: 2 }}>Баллы: {points}</Typography>
      <Typography sx={{ mb: 2 }}>Награды:</Typography>
      <Box sx={{ mb: 2 }}>
        {awards.map((award, index) => (
          <Chip key={index} color="primary" variant="outlined" sx={{ mr: 1 }}>
            {award}
          </Chip>
        ))}
      </Box>
      <Typography sx={{ mb: 2 }}>Пройденные мероприятия:</Typography>
      <Box>
        {completedEvents.map((event, index) => (
          <Chip key={index} color="success" variant="outlined" sx={{ mr: 1 }}>
            {event}
          </Chip>
        ))}
      </Box>
    </Paper>
  );
};

export default VolunteerAchievements;
