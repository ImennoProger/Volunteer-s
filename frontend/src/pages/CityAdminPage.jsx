import React from 'react';
import { Container, Grid, Paper } from '@mui/material';
import CityAdminProfileSettings from '../components/CityAdmin/CityAdminProfile';
import CityAdminAccordion from '../components/CityAdmin/CityAdminAccordion';

const CityAdminPage = () => {
  return (
    <Container>
      <Grid container spacing={4}>
        {/* Профиль администратора города слева */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <CityAdminProfileSettings />
          </Paper>
        </Grid>
        {/* Аккордеоны справа */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <CityAdminAccordion />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CityAdminPage;
