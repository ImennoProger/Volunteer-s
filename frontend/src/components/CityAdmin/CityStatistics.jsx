import React from 'react';
import { Typography, Paper, Grid } from '@mui/material';

const CityStatistics = () => {
  const statistics = {
    totalVolunteers: 300,
    totalEvents: 50,
    completedEvents: 30,
    pendingEvents: 20,
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Всего волонтёров:
          </Typography>
          <Typography variant="body1">{statistics.totalVolunteers}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Всего мероприятий:
          </Typography>
          <Typography variant="body1">{statistics.totalEvents}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Завершённые мероприятия:
          </Typography>
          <Typography variant="body1">{statistics.completedEvents}</Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Ожидающие мероприятия:
          </Typography>
          <Typography variant="body1">{statistics.pendingEvents}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CityStatistics;
