// src/components/EventList1/EventList1.js
import React from 'react';
import EventCard from '../EventCards/EventCard';
import '../../style/style.css'; 

const EventList1 = ({ events }) => (
  <section className="events container">
    <h2>Актуальные события</h2>
    <div className="events_elem">
      {events.map((event) => (
        <div className="elem" key={event.id}>
          <EventCard className="elem_cen" event={event} /> {/* Используем EventCard для каждого события */}
        </div>
      ))}
      <div className="elem_0">
        <p>Больше мероприятий</p>
        <span>Здесь</span>
      </div>
    </div>
  </section>
);

export default EventList1;
