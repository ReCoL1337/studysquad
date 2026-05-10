import { useEffect, useRef } from 'react';

export default function MapWidget({ location, groupLocations = [], compact = false }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const groupMarkersRef = useRef([]);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (mapInstance.current || !mapRef.current) return;

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!window.L) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const L = window.L;
      const lat = location?.lat || 50.0647;
      const lng = location?.lng || 19.9450;

      mapInstance.current = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);

      if (location) {
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:24px;height:24px;background:#4c3bc4;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(76,59,196,0.4)"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker([lat, lng], { icon }).addTo(mapInstance.current).bindPopup('You are here');
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        groupMarkersRef.current = [];
      }
    };
  }, [location]);

  useEffect(() => {
    if (!mapInstance.current || !window.L) return;
    const L = window.L;

    groupMarkersRef.current.forEach(m => m.remove());
    groupMarkersRef.current = [];

    groupLocations.forEach(group => {
      const color = group.color || '#4c3bc4';
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:white;border:2px solid ${color};border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.15)"><div style="width:8px;height:8px;background:${color};border-radius:50%"></div></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      const marker = L.marker([group.lat, group.lng], { icon })
        .addTo(mapInstance.current)
        .bindPopup(`${group.name}`);
      groupMarkersRef.current.push(marker);
    });
  }, [groupLocations]);

  useEffect(() => {
    if (mapInstance.current && location) {
      mapInstance.current.setView([location.lat, location.lng], 13);
    }
  }, [location]);

  return (
    <div
      ref={mapRef}
      style={{
        height: compact ? 200 : 300,
        width: '100%',
        background: '#f0f0f5',
        position: 'relative'
      }}
    />
  );
}
