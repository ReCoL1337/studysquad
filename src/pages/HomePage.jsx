import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { subscribeToGroups, subscribeToSessions, getGroupColor } from '../services/firestoreService';
import { useGeolocation } from '../hooks/useGeolocation';
import MapWidget from '../components/MapWidget';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [sessions, setSessions] = useState([]);
  const { location } = useGeolocation();

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToGroups(user.uid, setGroups);
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!groups.length) return;
    const groupIds = groups.map(g => g.id);
    const unsub = subscribeToSessions(groupIds, setSessions);
    return unsub;
  }, [groups]);

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const upcomingSessions = sessions
    .filter(s => {
      const d = s.date?.toDate ? s.date.toDate() : new Date(s.date);
      return d >= new Date();
    })
    .slice(0, 4);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Student';

  return (
    <div className="fade-in">
      {}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Welcome back!</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4, marginBottom: 0, fontSize: 14 }}>
            {displayName}
          </p>
        </div>
        <button className="profile-btn" onClick={() => navigate('/account')}>
          <i className="bi bi-person-circle"></i>
        </button>
      </div>

      {}
      <div className="section-label">Groups</div>
      {groups.length === 0 ? (
        <div className="empty-state" style={{ padding: '24px 20px' }}>
          <i className="bi bi-people" style={{ fontSize: 32 }}></i>
          <p>No groups yet. <button
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0 }}
            onClick={() => navigate('/groups')}
          >Create one</button></p>
        </div>
      ) : (
        <div>
          {groups.slice(0, 3).map(group => (
            <div
              key={group.id}
              className="group-item"
              onClick={() => navigate(`/groups/${group.id}`)}
            >
              <div className="group-avatar" style={{ background: group.color || getGroupColor(group.name) }}>
                {group.name.charAt(0).toUpperCase()}
              </div>
              <div className="group-info">
                <p className="group-name">{group.name}</p>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                {group.memberCount || 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {}
      <div className="section-label" style={{ marginTop: 8 }}>Planned Sessions</div>
      {upcomingSessions.length === 0 ? (
        <div style={{ padding: '12px 20px', color: 'var(--text-muted)', fontSize: 14 }}>
          No upcoming sessions. <button
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0 }}
            onClick={() => navigate('/schedule')}
          >Schedule one</button>
        </div>
      ) : (
        upcomingSessions.map(session => (
          <div key={session.id} className="session-item">
            <span className="session-name">{session.name}</span>
            <span className="session-date">{formatDate(session.date)}</span>
          </div>
        ))
      )}

      {}
      <div className="section-label" style={{ marginTop: 8 }}>Nearby Locations</div>
      <MapWidget location={location} compact />

      <div style={{ height: 20 }} />
    </div>
  );
}
