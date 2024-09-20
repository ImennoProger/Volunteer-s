import React, { useState, useEffect } from 'react';
import { Box, Grid, Container } from '@mui/material';
import EventFilters from '../Filters/EventFilters';
import EventMap from '../Map/EventMap';
import EventCard from '../EventCards/EventCard';
import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const VolunteerEvents = () => {
  const [volunteerEvents, setVolunteerEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/my-events/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
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
        if (response.data.message === "Вы уже записаны на это мероприятие") {
        } else {
        }
        setVolunteerEvents(eventData || []);
        setFilteredEvents(eventData)
      } catch (error) {
        console.error('Ошибка при загрузке мероприятий:', error.response?.data || error.message);
      }
    };
    fetchEvents();
  }, []);

  const handleFilterChange = (filters) => {
    console.log('Filter change:', filters);

    const filtered = volunteerEvents.filter((event) => {
      const matchCountry = filters.country ? event.country_name === filters.country_name : true;
      const matchCity = filters.city ? event.city === filters.city : true;
      const matchRegion = filters.region ? event.region === filters.region : true;
      const matchCategory = filters.category ? event.category === filters.category : true;
      const matchFromDate = filters.fromDate ? new Date(event.startDate) >= new Date(filters.fromDate) : true;
      const matchToDate = filters.toDate ? new Date(event.endDate) <= new Date(filters.toDate) : true;
      
      return (
        matchCountry && matchCity && matchRegion &&
        matchCategory && matchFromDate && matchToDate
      );
    });

    setFilteredEvents(filtered);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 2 }}>
        <EventFilters onFilterChange={handleFilterChange} />
      </Box>
      <Box sx={{ mt: 2 }}>
        <EventMap events={filteredEvents} />
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {filteredEvents.map((event) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <EventCard event={event} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default VolunteerEvents;
