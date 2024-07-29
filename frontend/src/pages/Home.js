import React, { useState } from 'react';
import EventFilters from '../components/Filters/EventFilters';
import EventMap from '../components/Map/EventMap';
import EventCard from '../components/EventCards/EventCard';
import { Container, Grid } from '@mui/material';

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
  // Добавьте больше мероприятий
];

function GuestPage() {
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);

  const handleFilterChange = (filters) => {
    // Логика фильтрации мероприятий
    const filtered = mockEvents.filter(event => {
      const matchCountry = filters.country ? event.country === filters.country : true;
      const matchCity = filters.city ? event.city === filters.city : true;
      const matchRegion = filters.region ? event.region === filters.region : true;
      const matchCategory = filters.category ? event.category === filters.category : true;
      const matchFromDate = filters.fromDate ? new Date(event.date) >= new Date(filters.fromDate) : true;
      const matchToDate = filters.toDate ? new Date(event.date) <= new Date(filters.toDate) : true;

      return matchCountry && matchCity && matchRegion && matchCategory && matchFromDate && matchToDate;
    });

    setFilteredEvents(filtered);
  };

  return (
    <div>
      <Container sx={{ mt: 4 }}>
        <EventFilters onFilterChange={handleFilterChange} />
        <EventMap events={filteredEvents} />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {filteredEvents.map(event => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default GuestPage;