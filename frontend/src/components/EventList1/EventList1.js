// src/components/EventList1/EventList1.js
import React, { useState } from 'react';
import EventCard from '../EventCards/EventCard';
import '../../style/style.css';
import './EventList1.css';

const EventList1 = ({ events }) => {
  const [displayCount, setDisplayCount] = useState(5);
  
  const displayedEvents = events.slice(0, displayCount);

  const loadMoreEvents = () => {
    const remainingEvents = events.length - displayCount;
    const addCount = Math.min(5, remainingEvents);
    setDisplayCount(prevCount => prevCount + addCount);
  };

  return (
    <section className="events container" style={{ 
      marginTop: '0px',
      marginBottom: '10px',
      padding: '20px',
      position: 'relative',
      minHeight: 'fit-content',
      height: 'auto',
      overflow: 'visible'
    }}>
      <h2 style={{ 
        marginBottom: '60px',
        fontSize: '32px',
        position: 'relative',
        zIndex: 1
      }}>
        Актуальные события
      </h2>
      <div className="events_elem" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        gridAutoFlow: 'row',
        rowGap: '60px',
        width: '100%'
      }}>
        {displayedEvents.map((event, index) => (
          <div className="elem" key={event.id} style={{
            gridRow: `${Math.floor(index / 3) + 1}`,
            gridColumn: `${(index % 3) + 1}`,
            height: '100%',
            marginBottom: '0px',
            width: '85%'
          }}>
            <EventCard event={event} />
          </div>
        ))}
        {displayCount < events.length && (
          <div 
            className="elem_0" 
            onClick={loadMoreEvents}
            style={{
              gridRow: `${Math.floor(displayedEvents.length / 3) + 1}`,
              gridColumn: `${(displayedEvents.length % 3) + 1}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: '15px',
              padding: '30px',
              cursor: 'pointer',
              height: '100%',
              marginBottom: '0px',
              width: '85%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 123, 255, 0.3)',
              animation: 'pulse 2s infinite',
              ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 123, 255, 0.4)'
              }
            }}
          >
            <span style={{
              fontSize: '25px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              Показать больше
              <span style={{ marginLeft: '3px' }}>↓</span>
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventList1;
