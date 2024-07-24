import React, { useState } from 'react';
import {
  Container,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VolunteerProfile from '../components/Volunteer/VolunteerProfile';
import VolunteerAchievements from '../components/Volunteer/VolunteerAchievements';
import EventFilters from '../components/Filters/EventFilters';
import EventMap from '../components/Map/EventMap';
import EventCard from '../components/EventCards/EventCard';
import Friends from '../components/Volunteer/Friends';
import Groups from '../components/Volunteer/Groups';
import Messages from '../components/Volunteer/VolunteerMessages';
import Balance from '../components/Volunteer/Balance';

const VolunteerPage = () => {
  // Пример данных
  const mockEvents = [
    {
      id: 1,
      name: 'Концерт в парке',
      description: 'Музыкальное мероприятие под открытым небом',
      shortDescription: 'Приходите насладиться живой музыкой!',
      requiredPeople: 100,
      registeredPeople: 50,
      points: 10,
      imageUrl: 'https://via.placeholder.com/150',
      latitude: 55.751244,
      longitude: 37.618423,
    },
    {
      id: 2,
      name: 'Спортивное соревнование',
      description: 'Соревнование по бегу на длинные дистанции',
      shortDescription: 'Примите участие в забеге и получите призы!',
      requiredPeople: 200,
      registeredPeople: 180,
      points: 15,
      imageUrl: 'https://via.placeholder.com/150',
      latitude: 55.755826,
      longitude: 37.6173,
    },
  ];

  const [filteredEvents, setFilteredEvents] = useState(mockEvents);

  const handleFilterChange = (filters) => {
    // Логика фильтрации мероприятий
    const filtered = mockEvents.filter((event) => {
      const matchCountry = filters.country
        ? event.country === filters.country
        : true;
      const matchCity = filters.city ? event.city === filters.city : true;
      const matchRegion = filters.region ? event.region === filters.region : true;
      const matchCategory = filters.category
        ? event.category === filters.category
        : true;
      const matchFromDate = filters.fromDate
        ? new Date(event.date) >= new Date(filters.fromDate)
        : true;
      const matchToDate = filters.toDate
        ? new Date(event.date) <= new Date(filters.toDate)
        : true;

      return (
        matchCountry &&
        matchCity &&
        matchRegion &&
        matchCategory &&
        matchFromDate &&
        matchToDate
      );
    });

    setFilteredEvents(filtered);
  };

  const friends = [{ id: 1, name: 'Friend 1' }];
  const groups = [{ id: 1, name: 'Group 1' }];
  const messages = [{ id: 1, content: 'Message 1' }];
  const coins = 200;
  const rank = 'Gold';
  const points = 1500;
  const awards = ['Award 1', 'Award 2'];
  const completedEvents = ['Event 1', 'Event 2'];

  return (
    <Container sx={{ mt: 4 }}>
      {/* Аккордеон для профиля волонтёра */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="volunteer-profile-content"
          id="volunteer-profile-header"
          sx={{ bgcolor: '#f5f5f5' }}  // Фоновый цвет заголовка аккордеона
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            Настройки профиля
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <VolunteerProfile />
        </AccordionDetails>
      </Accordion>

      {/* Аккордеон для достижений волонтёра */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="volunteer-achievements-content"
          id="volunteer-achievements-header"
          sx={{ bgcolor: '#f5f5f5' }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            Достижения
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <VolunteerAchievements
            rank={rank}
            points={points}
            awards={awards}
            completedEvents={completedEvents}
          />
        </AccordionDetails>
      </Accordion>

      {/* Аккордеон для фильтров и карты мероприятий */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="event-map-filters-content"
          id="event-map-filters-header"
          sx={{ bgcolor: '#f5f5f5' }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            Фильтр, карта и мероприятия
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <EventFilters onFilterChange={handleFilterChange} />
          </Box>
          <EventMap events={filteredEvents} />
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Аккордеон для друзей */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="friends-content"
          id="friends-header"
          sx={{ bgcolor: '#f5f5f5' }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            Друзья
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Friends friends={friends} />
        </AccordionDetails>
      </Accordion>

      {/* Аккордеон для групп */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="groups-content"
          id="groups-header"
          sx={{ bgcolor: '#f5f5f5' }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            Группы
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Groups groups={groups} />
        </AccordionDetails>
      </Accordion>

      {/* Аккордеон для сообщений */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="messages-content"
          id="messages-header"
          sx={{ bgcolor: '#f5f5f5' }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            Сообщения
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Messages messages={messages} />
        </AccordionDetails>
      </Accordion>

      {/* Аккордеон для баланса */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="balance-content"
          id="balance-header"
          sx={{ bgcolor: '#f5f5f5' }}
        >
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            Баланс
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Balance coins={coins} />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};

export default VolunteerPage;
