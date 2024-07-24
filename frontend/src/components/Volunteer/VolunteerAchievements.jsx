import React from 'react';
import { Typography, Chip, Box } from '@mui/joy';

const VolunteerAchievements = ({ rank, points, awards, completedEvents }) => {
  return (
    <div>
      <Typography>Ранг: {rank}</Typography>
      <Typography>Баллы: {points}</Typography>
      <Typography>Награды:</Typography>
      {awards.map((award, index) => (
        <Chip key={index} color="primary" variant="soft">{award}</Chip>
      ))}
      <Typography>Пройденные мероприятия:</Typography>
      <Box>
        {completedEvents.map((event, index) => (
          <Chip key={index} color="success" variant="soft">{event}</Chip>
        ))}
      </Box>
    </div>
  );
};

export default VolunteerAchievements;
