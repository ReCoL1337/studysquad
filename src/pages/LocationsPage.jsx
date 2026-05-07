import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation, getDistance } from '../hooks/useGeolocation';
import MapWidget from '../components/MapWidget';

const STUDY_PLACE_TYPES = [
  { emoji: '🏛️', type: 'University / Campus' },
  { emoji: '☕', type: 'Café / Coffee Shop' },
  { emoji: '📚', type: 'Library' },
  { emoji: '🍕', type: 'Restaurant / Food' },
];

function generateNearbyPlaces(userLat, userLng) {

  return [
    {
      id: '1',
      name: 'Main University Library',
      type: 'Library',
      emoji: '📚',
      lat: userLat + 0.0027,
      lng: userLng - 0.0018,
    },
    {
      id: '2',
      name: 'Café & Study Lounge',
      type: 'Café',
      emoji: '☕',
      lat: userLat - 0.0019,
      lng: userLng + 0.0032,
    },
    {
      id: '3',
      name: 'Campus Study Hall',
      type: 'Campus',
      emoji: '🏛️',
      lat: userLat + 0.0008,
      lng: userLng + 0.0025,
    },
    {
      id: '4',
      name: 'City Public Library',
      type: 'Library',
      emoji: '📚',
      lat: userLat - 0.0045,
      lng: userLng - 0.0031,
    },
    {
      id: '5',
      name: 'The Study Corner Cafe',
      type: 'Café',
      emoji: '☕',
      lat: userLat + 0.0058,
      lng: userLng - 0.0012,
    },
    {
      id: '6',
      name: 'Co-working Study Space',
      type: 'Co-working',
      emoji: '💼',
      lat: userLat - 0.0033,
      lng: userLng + 0.0062,
    },
  ];
}

export default function LocationsPage() {
  const navigate = useNavigate();
  const { location, error, loading } = useGeolocation();
  const [places, setPlaces] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (location) {
      const nearby = generateNearbyPlaces(location.lat, location.lng)
        .map(p => ({
          ...p,
          distance: getDistance(location.lat, location.lng, p.lat, p.lng)
        }))
        .sort((a, b) => a.distance - b.distance);
      setPlaces(nearby);
    } else if (!loading) {

      const defaultLat = 50.0647;
      const defaultLng = 19.9450;
      const nearby = generateNearbyPlaces(defaultLat, defaultLng)
        .map(p => ({
          ...p,
          distance: getDistance(defaultLat, defaultLng, p.lat, p.lng)
        }))
        .sort((a, b) => a.distance - b.distance);
      setPlaces(nearby);
    }
  }, [location, loading]);

  const filters = ['All', 'Library', 'Café', 'Campus'];
  const filtered = filter === 'All' ? places : places.filter(p => p.type.includes(filter));

  const formatDistance = (m) => {
    if (!m) return '';
    if (m < 1000) return `${m}m away`;
    return `${(m / 1000).toFixed(1)}km away`;
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Studying Locations</h1>
          {location && (
            <p style={{ fontSize: 12, color: 'var(--success)', margin: 0, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className="bi bi-geo-alt-fill"></i> GPS active
            </p>
          )}
          {error && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>
              📍 Using default location
            </p>
          )}
        </div>
        <button className="profile-btn" onClick={() => navigate('/account')}>
          <i className="bi bi-person-circle"></i>
        </button>
      </div>

      {}
      <MapWidget location={location} />

      {}
      <div style={{ padding: '12px 20px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid',
              borderColor: filter === f ? 'var(--primary)' : 'var(--border)',
              background: filter === f ? 'var(--primary)' : 'white',
              color: filter === f ? 'white' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              whiteSpace: 'nowrap', flexShrink: 0
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {}
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
          <i className="bi bi-geo-alt" style={{ fontSize: 24, display: 'block', marginBottom: 8 }}></i>
          Getting your location...
        </div>
      )}

      {}
      {filtered.map(place => (
        <div key={place.id} className="location-item">
          <div className="location-info">
            <div className="location-icon">
              <span style={{ fontSize: 18 }}>{place.emoji}</span>
            </div>
            <div>
              <div className="location-name">{place.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{place.type}</div>
            </div>
          </div>
          <div className="location-distance">{formatDistance(place.distance)}</div>
        </div>
      ))}

      {filtered.length === 0 && !loading && (
        <div className="empty-state">
          <i className="bi bi-geo-alt"></i>
          <p>No {filter !== 'All' ? filter.toLowerCase() + 's' : 'locations'} found nearby.</p>
        </div>
      )}

      <div style={{ height: 20 }} />
    </div>
  );
}
