import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventFilters from '../components/Filters/EventFilters';
import EventMap from '../components/Map/EventMap';
import EventCard from '../components/EventCards/EventCard';
import { Container, Grid, Box, CircularProgress } from '@mui/material';

function GuestPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/events/');
        const eventData = response.data.map(event => ({
          id: event.event_id,
          name: event.event_name,
          description: event.full_description,
          shortDescription: event.short_description,
          requiredPeople: event.required_volunteers,
          registeredPeople: event.registered_volunteers,
          points: event.participation_points,
          awards: event.rewards,
          startDate: event.start_date,
          endDate: event.end_date,
          country: event.country_name,  
          city: event.city_name,        
          category: event.category_name,
          imageUrl: event.image, 
          latitude: event.latitude,
          longitude: event.longitude,
        }));
        setEvents(eventData); 
        setFilteredEvents(eventData); 
        setLoading(false); 
      } catch (error) {
        console.error('Ошибка при получении событий:', error);
        setLoading(false); 
      }
    };

    fetchEvents();
  }, []);

  // Функция фильтрации событий
  const handleFilterChange = (filters) => {
    console.log('Filter change:', filters);

    const filtered = events.filter((event) => {
      const matchCountry = filters.country ? event.country === filters.country : true;
      const matchCity = filters.city ? event.city === filters.city : true;
      const matchCategory = filters.category ? event.category === filters.category : true;
      const matchFromDate = filters.fromDate ? new Date(event.startDate) >= new Date(filters.fromDate) : true;
      const matchToDate = filters.toDate ? new Date(event.endDate) <= new Date(filters.toDate) : true;

      return (
        matchCountry && matchCity &&
        matchCategory && matchFromDate && matchToDate
      );
    });

    setFilteredEvents(filtered);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: '64px' }}>
      <Box sx={{ mb: 2 }}>
        <EventFilters onFilterChange={handleFilterChange} />
      </Box>
      <Box sx={{ mt: 2 }}>
        <EventMap events={filteredEvents} />
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {filteredEvents.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default GuestPage;
