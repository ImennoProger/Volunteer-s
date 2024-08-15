import React from 'react';
import { Container, Grid, Paper } from '@mui/material';
import RegionAdminProfile from '../components/RegionAdmin/RegionAdminProfile';
import RegionAdminAccordion from '../components/RegionAdmin/RegionAdminAccordion';

const RegionAdminPage = () => {
  return (
    <Container sx={{ marginTop: '40px' }}> 
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <RegionAdminProfile />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <RegionAdminAccordion />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RegionAdminPage;
