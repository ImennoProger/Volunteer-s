// src/components/EventMap1/EventMap1.js
import React, { useState, useEffect } from 'react';
import EventMap from '../Map/EventMap'; // Импорт нужного компонента карты
import '../../style/style.css';
import EventFilters from '../Filters/EventFilters';

const EventMap1 = ({ events, onFilterChange = () => {} }) => {
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const handleFilterChange = (newFilteredEvents) => {
    setFilteredEvents(newFilteredEvents);
    if (onFilterChange) {
      onFilterChange(newFilteredEvents);
    }
  };

  return (
    <section className="event_map_main" style={{
      minHeight: '600px',
      padding: '20px 0 40px 0'
    }}>
      <div className="event_map container">
        <h2 style={{
          position: 'relative',
          zIndex: 2,
          marginBottom: '30px'
        }}>
          Мероприятия на карте
        </h2>
        <div className="select_map" style={{
          position: 'relative',
          minHeight: '400px',
          display: 'flex',
          gap: '20px'
        }}>
          <EventFilters 
            onFilterChange={handleFilterChange} 
            events={events}
          />
          <EventMap 
            events={filteredEvents}
            style={{ flexGrow: 1 }}
          />
        </div>
      </div>
    </section>
  );
};

export default EventMap1;
