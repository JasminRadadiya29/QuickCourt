'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';

// Component to handle map clicks and marker placement
function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition(lat, lng);
    },
  });

  return position[0] !== 0 || position[1] !== 0 ? (
    <Marker position={position}>
      <Popup>Facility location</Popup>
    </Marker>
  ) : null;
}

// Wrapper component to handle map reinitialization
function MapWrapper({ location, onLocationChange, mapId }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Cleanup function to properly destroy the map instance
  useEffect(() => {
    return () => {
      // Use the stored map instance reference for cleanup
      if (mapInstanceRef.current && mapInstanceRef.current._container) {
        try {
          // Properly remove the map to prevent the "already initialized" error
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (e) {
          console.error('Error cleaning up map:', e);
        }
      }
    };
  }, []);
  
  return (
    <MapContainer 
      key={mapId} // Use the stable key from parent
      center={[location.lat || 0, location.lng || 0]} 
      zoom={13} 
      style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
      whenReady={(map) => {
        mapRef.current = map;
        mapInstanceRef.current = map.target;
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker 
        position={[location.lat, location.lng]} 
        setPosition={(lat, lng) => onLocationChange(lat, lng)} 
      />
    </MapContainer>
  );
}

// Use a client-only component to avoid hydration issues
export default function MapClient({ location, onLocationChange }) {
  // Use a ref instead of state to avoid hydration mismatches
  const mapIdRef = useRef(`map-${Math.random().toString(36).substring(2, 9)}`);
  const [isClient, setIsClient] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  
  useEffect(() => {
    // Set client-side rendering flag
    setIsClient(true);
    
    // Force remount of map component when hot reloading occurs
    const handleBeforeUnload = () => {
      setMapKey(prev => prev + 1);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Add Leaflet CSS only once
    const linkId = 'leaflet-css';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Only render the map on the client side to avoid hydration issues
  if (!isClient) {
    return <div style={{ height: '100%', width: '100%', borderRadius: '0.375rem', background: '#f0f0f0' }}>Loading map...</div>;
  }

  return (
    <div key={mapKey} className="map-container" style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapWrapper location={location} onLocationChange={onLocationChange} mapId={mapIdRef.current} />
    </div>
  );
}