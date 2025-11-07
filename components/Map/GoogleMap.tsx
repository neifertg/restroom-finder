'use client';

import { useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Restroom } from '@/types';

interface GoogleMapComponentProps {
  center: { lat: number; lng: number };
  restrooms: Restroom[];
  selectedRestroom: Restroom | null;
  onMarkerClick: (restroom: Restroom) => void;
  onInfoWindowClose: () => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

export default function GoogleMapComponent({
  center,
  restrooms,
  selectedRestroom,
  onMarkerClick,
  onInfoWindowClose,
}: GoogleMapComponentProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-full min-h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Google Maps API key not configured</p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        options={mapOptions}
      >
        {/* User Location Marker */}
        <Marker
          position={center}
          icon={{
            path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
            scale: 8,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          }}
        />

        {/* Restroom Markers */}
        {restrooms.map((restroom) => (
          <Marker
            key={restroom.id}
            position={{ lat: restroom.latitude, lng: restroom.longitude }}
            onClick={() => onMarkerClick(restroom)}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${restroom.is_accessible ? '#10B981' : '#6366F1'}">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        ))}

        {/* Info Window */}
        {selectedRestroom && (
          <InfoWindow
            position={{
              lat: selectedRestroom.latitude,
              lng: selectedRestroom.longitude,
            }}
            onCloseClick={onInfoWindowClose}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-gray-900 mb-1">
                {selectedRestroom.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{selectedRestroom.address}</p>
              <div className="flex gap-2 mb-2">
                {selectedRestroom.is_accessible && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">
                    Accessible
                  </span>
                )}
                {selectedRestroom.is_gender_neutral && (
                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                    Gender Neutral
                  </span>
                )}
              </div>
              {selectedRestroom.distance && (
                <p className="text-xs text-gray-500">
                  {selectedRestroom.distance < 0.1
                    ? `${Math.round(selectedRestroom.distance * 5280)} ft`
                    : `${selectedRestroom.distance.toFixed(1)} mi`} away
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
