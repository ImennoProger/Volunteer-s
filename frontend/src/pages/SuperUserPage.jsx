import React from 'react';
import { Container, Grid, Paper } from '@mui/material';
import SuperUserProfileSettings from '../components/SuperUser/SuperUserProfile';
import SuperUserAccordion from '../components/SuperUser/SuperUserAccordion';

const SuperUserPage = () => {
  return (
    <Container sx={{ marginTop: '40px' }}> 
      <Grid container spacing={4}>
        {/* Профиль суперпользователя слева */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <SuperUserProfileSettings />
          </Paper>
        </Grid>
        {/* Аккордеоны справа */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <SuperUserAccordion />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SuperUserPage;
