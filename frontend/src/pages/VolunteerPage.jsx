// src/pages/VolunteerPage.jsx
import React from 'react';
import { Container, Grid, Paper } from '@mui/material';
import VolunteerProfile from '../components/Volunteer/VolunteerProfile';
import VolunteerAccordion from '../components/Volunteer/VolunteerAccordion';

const friends = [{ id: 1, name: 'Friend 1' }];
const groups = [{ id: 1, name: 'Group 1' }];
const messages = [{ id: 1, content: 'Message 1' }];
const coins = 200;
const rank = 'Gold';
const points = 1500;
const awards = ['Award 1', 'Award 2'];
const completedEvents = ['Event 1', 'Event 2'];

const VolunteerPage = () => {
  return (
    <Container>
      <Grid container spacing={4}>
        {/* Профиль волонтера слева */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <VolunteerProfile />
          </Paper>
        </Grid>
        {/* Аккордеоны справа */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <VolunteerAccordion
              rank={rank}
              points={points}
              awards={awards}
              completedEvents={completedEvents}
              friends={friends}
              groups={groups}
              messages={messages}
              coins={coins}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VolunteerPage;
