import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventFilters from '../Filters/EventFilters';
import EventMap from '../Map/EventMap';
import EventCard from '../EventCards/EventCard';

const VolunteerEvents = () => {
  // Список мероприятий
  const mockEvents = [
    {
      id: 1,
      name: 'Концерт в парке',
      description: 'Музыкальное мероприятие под открытым небом',
      shortDescription: 'Приходите насладиться живой музыкой!',
      requiredPeople: 100,
      registeredPeople: 50,
      points: 10,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU3HFVnkYFJ_OIogo__Qv58bmhwRqZJcQhOA&s',
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
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU3HFVnkYFJ_OIogo__Qv58bmhwRqZJcQhOA&s',
      latitude: 55.755826,
      longitude: 37.6173,
    },
  ];

  const [filteredEvents, setFilteredEvents] = useState(mockEvents);

  const handleFilterChange = (filters) => {
    // Логика фильтрации мероприятий
    const filtered = mockEvents.filter((event) => {
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
  );
};

export default VolunteerEvents;
