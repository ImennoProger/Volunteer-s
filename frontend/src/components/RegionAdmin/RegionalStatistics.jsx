import React from 'react';
import { Typography, Box } from '@mui/material';

const RegionalStatistics = () => {
  // Пример данных для статистики
  const statistics = {
    totalVolunteers: 150,
    totalEvents: 30,
    completedEvents: 25,
  };

  return (
    <Box>
      <Typography>Общее количество волонтеров: {statistics.totalVolunteers}</Typography>
      <Typography>Общее количество мероприятий: {statistics.totalEvents}</Typography>
      <Typography>Пройденные мероприятия: {statistics.completedEvents}</Typography>
    </Box>
  );
};

export default RegionalStatistics;
