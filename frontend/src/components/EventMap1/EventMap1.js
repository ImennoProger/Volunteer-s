// src/components/EventMap1/EventMap1.js
import React, { useState } from 'react';
import EventMap from '../Map/EventMap'; // Импорт нужного компонента карты
import '../../style/style.css';

const EventMap1 = ({ events }) => {
  const [coordinates, setCoordinates] = useState(null); // для компонента EventMapCreate, если нужно

  return (
    <section className="event_map_main">
      <div className="event_map container">
        <h2>Мероприятия на карте</h2>
        <div className="select_map">
          <div className="select">
            <select id="country" name="country"><option>Страна</option></select>
            <select id="region" name="region"><option>Регион</option></select>
            <select id="city" name="city"><option>Город</option></select>
            <select id="category" name="category"><option>Категория</option></select>
            <input type="date" />
            <input type="date" />
            <button>Применить</button>
          </div>
          
          {/* Замените img на компонент карты */}
          <EventMap events={events} /> {/* Используйте EventMap для отображения маркеров */}
          {/* или EventMapCreate, если вам нужна карта с выбором координат */}
          {/* <EventMapCreate setCoordinates={setCoordinates} /> */}
        </div>
      </div>
    </section>
  );
};

export default EventMap1;
