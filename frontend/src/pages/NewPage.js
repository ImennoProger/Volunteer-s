import React, { useState, useEffect } from 'react';
import Header1 from '../components/Header1/Header1';
import Mission1 from '../components/Mission1/Mission1';
import EventMap1 from '../components/EventMap1/EventMap1';
import EventList1 from '../components/EventList1/EventList1';
import AboutUs1 from '../components/AboutUs1/AboutUs1';
import Footer1 from '../components/Footer1/Footer1';
import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const NewPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/events/`);
        const eventData = response.data.map(event => ({
          id: event.event_id,
          name: event.event_name,
          description: event.full_description,
          shortDescription: event.short_description,
          latitude: event.latitude,
          longitude: event.longitude,
          imageUrl: event.image,
          city: event.city_name || 'Не указано',
          startDate: event.start_date,
          endDate: event.end_date,
        }));
        console.log('Events received:', eventData); // Логируем события
        setEvents(eventData);
      } catch (error) {
        console.error('Ошибка при получении событий:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <Header1 />
      <Mission1 />
      <EventMap1 events={events} />
      <EventList1 events={events} />
      <AboutUs1 />
      <Footer1 />
    </div>
  );
};

export default NewPage;
