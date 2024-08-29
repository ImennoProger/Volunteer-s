import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventFilters from '../components/Filters/EventFilters';
import EventMap from '../components/Map/EventMap';
import EventCard from '../components/EventCards/EventCard';
import { Box, Grid, CircularProgress } from '@mui/material';

function GuestPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://volunteers-portal.ru:8000/events/');
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
      const matchCountry = filters.country.length ? filters.country.includes(event.country) : true;
      const matchCity = filters.city.length ? filters.city.includes(event.city) : true;
      const matchCategory = filters.category.length ? filters.category.includes(event.category) : true;
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ marginTop: '64px', paddingLeft: 0, paddingRight: 0 }}>
      <Grid container spacing={2}>
        {/* Левый столбец с фильтрами */}
        <Grid item xs={12} sm={4} md={3} sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <Box sx={{ position: 'sticky', top: '80px', paddingLeft: 0, paddingRight: '16px' }}>
            <EventFilters onFilterChange={handleFilterChange} />
          </Box>
        </Grid>
        
        {/* Правый столбец с картой и карточками мероприятий */}
        <Grid item xs={12} sm={8} md={9} sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <Box sx={{ mb: 2 }}>
            <EventMap events={filteredEvents} />
          </Box>
          <Grid container spacing={2}>
            {filteredEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GuestPage;
