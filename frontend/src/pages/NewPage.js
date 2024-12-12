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
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    // Изменяем стиль только на этой странице
    const headdElement = document.querySelector('.headd');
    if (headdElement) {
      headdElement.style.position = 'absolute'; // Устанавливаем абсолютное позиционирование
    }

    // Получаем события
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/events/`);
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
          city: event.city_name  || 'Не указано',        
          category: event.category_name,
          imageUrl: event.image, 
          latitude: event.latitude,
          longitude: event.longitude,
          
        }));
        console.log('Events received:', eventData); // Логируем события
        setEvents(eventData);
        setFilteredEvents(eventData);
      } catch (error) {
        console.error('Ошибка при получении событий:', error);
      }
    };

    fetchEvents();

    // При размонтировании страницы, убираем изменения стиля
    return () => {
      if (headdElement) {
        headdElement.style.position = ''; // Сбрасываем стиль
      }
    };
  }, []); // Эффект срабатывает только один раз при монтировании компонента

  const handleFilterChange = (newFilteredEvents) => {
    setFilteredEvents(newFilteredEvents);
  };

  return (
    <div>
      <Header1 />
      <Mission1 />
      <EventMap1 events={events} onFilterChange={handleFilterChange} />
      <EventList1 events={filteredEvents} />
      <AboutUs1 />
      <Footer1 />
    </div>
  );
};

export default NewPage;
