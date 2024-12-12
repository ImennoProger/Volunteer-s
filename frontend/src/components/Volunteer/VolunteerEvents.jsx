import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
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
        setVolunteerEvents(eventData || []);
        setFilteredEvents(eventData);
      } catch (error) {
        console.error('Ошибка при загрузке мероприятий:', error.response?.data || error.message);
      }
    };
    fetchEvents();
  }, []);

  const handleFilterChange = (newFilteredEvents) => {
    setFilteredEvents(newFilteredEvents);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 4,
      position: 'relative',
      ml: '0px',
      mr: '0px'
    }}>
      <Box sx={{ 
        flexGrow: 1,
        pr: 0,
        pl: 0,
        width: 'calc(100% - 390px)'
      }}>
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
      </Box>

      <Box sx={{ 
        width: '250px', 
        flexShrink: 0,
        p: 2,
        borderRadius: 1,
        height: 'fit-content',
        position: 'fixed',
        right: '100px',
        top: '44px'
      }}>
        <EventFilters 
          onFilterChange={handleFilterChange} 
          events={volunteerEvents}
        />
      </Box>
    </Box>
  );
};

export default VolunteerEvents;
