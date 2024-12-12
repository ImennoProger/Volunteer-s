import React, { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import customMarkerImage from './marker.png';

function EventMap({ events }) {
  const mapRef = useRef();

  useEffect(() => {
    console.log('Events received:', events); 

    const vectorSource = new VectorSource({
      features: events.map(event => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([event.longitude, event.latitude])),
          name: event.name,
          description: event.description,
        });
        feature.setStyle(new Style({
          image: new Icon({
            src: customMarkerImage,
            scale: 0.1,
          }),
        }));
        return feature;
      }),
    });
    


    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSource,
        }),
      ],
      view: new View({
        center: fromLonLat([104.266711, 52.293212]),
        zoom: 10,
      }),
    });

    return () => map.setTarget(undefined);
  }, [events]);

  return <div>
    <div className="map-container" ref={mapRef} style={{ 
      height: '483px', 
      width: '1000px',
      borderRadius: '12px',
      border: '1px solid #e0e0e0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      position: 'relative',
    }}>
      <div className="map-overlay" style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '8px 12px',
        borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        fontSize: '14px',
        color: '#666',
        zIndex: 1000,
      }}>
        Всего мероприятий: {events.length}
      </div>
    </div>
  </div>;
}

export default EventMap;