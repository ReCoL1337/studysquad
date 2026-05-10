import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../App';
import {
  subscribeToGroups, createSession, subscribeToSessions, deleteSession, getGroupColor
} from '../services/firestoreService';
import { useVibration } from '../hooks/useVibration';

export default function SchedulePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { vibrateSuccess } = useVibration();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [groups, setGroups] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionName, setSessionName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const MONTHS = ['January','February','March','April','May','June',
    'July','August','September','October','November','December'];
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToGroups(user.uid, grps => {
      setGroups(grps);
      if (grps.length > 0 && !selectedGroupId) setSelectedGroupId(grps[0].id);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!groups.length) return;
    const ids = groups.map(g => g.id);
    const unsub = subscribeToSessions(ids, setSessions);
    return unsub;
  }, [groups]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, type: 'prev' });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: 'current' });
  }

  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, type: 'next' });
  }

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isSelected = (d) => d === selectedDay;

  const hasSessions = (d) => sessions.some(s => {
    const date = s.date?.toDate ? s.date.toDate() : new Date(s.date);
    return date.getDate() === d && date.getMonth() === month && date.getFullYear() === year;
  });

  const selectedDate = new Date(year, month, selectedDay);
  const selectedSessions = sessions.filter(s => {
    const d = s.date?.toDate ? s.date.toDate() : new Date(s.date);
    return d.getDate() === selectedDay && d.getMonth() === month && d.getFullYear() === year;
  });

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Delete this session?')) return;
    try {
      await deleteSession(sessionId);
      showToast('Session deleted', 'success');
    } catch {
      showToast('Failed to delete session', 'error');
    }
  };

  const handleCreate = async () => {
    if (!sessionName.trim()) { showToast('Enter a session name', 'error'); return; }
    if (!selectedGroupId) { showToast('Select a group', 'error'); return; }
    setLoading(true);
    try {
      const group = groups.find(g => g.id === selectedGroupId);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      await createSession(sessionName.trim(), dateStr, selectedGroupId, group?.name, user.uid);
      vibrateSuccess();
      showToast('Session scheduled! 📅', 'success');
      setSessionName('');
      setShowForm(false);
    } catch (e) {
      showToast('Failed to create session', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      {}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Schedule a Learning Session</h1>
        <button className="profile-btn" onClick={() => navigate('/account')}>
          <i className="bi bi-person-circle"></i>
        </button>
      </div>

      {}
      <div style={{ margin: '0 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {}
        <div className="cal-nav">
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)', padding: 4 }}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{
              padding: '6px 14px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', fontSize: 14, fontWeight: 500, cursor: 'pointer'
            }}>
              {MONTHS[month].slice(0, 3)}
              <i className="bi bi-chevron-down" style={{ marginLeft: 6, fontSize: 11 }}></i>
            </span>
            <span style={{
              padding: '6px 14px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', fontSize: 14, fontWeight: 500
            }}>
              {year}
              <i className="bi bi-chevron-down" style={{ marginLeft: 6, fontSize: 11 }}></i>
            </span>
          </div>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)', padding: 4 }}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        {}
        <div className="calendar-grid" style={{ paddingTop: 0, paddingBottom: 4 }}>
          {DAYS.map(d => (
            <div key={d} className="cal-header">{d}</div>
          ))}
        </div>

        {}
        <div className="calendar-grid" style={{ paddingTop: 0 }}>
          {cells.map((cell, i) => (
            <div
              key={i}
              className={`cal-day ${cell.type !== 'current' ? 'other-month' : ''} ${cell.type === 'current' && isToday(cell.day) && !isSelected(cell.day) ? 'today' : ''} ${cell.type === 'current' && isSelected(cell.day) ? 'selected' : ''}`}
              onClick={() => cell.type === 'current' && setSelectedDay(cell.day)}
              style={{ position: 'relative' }}
            >
              {cell.day}
              {cell.type === 'current' && hasSessions(cell.day) && !isSelected(cell.day) && (
                <div style={{
                  position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {}
      {selectedSessions.length > 0 && (
        <div style={{ margin: '16px 16px 0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Sessions on {selectedDay} {MONTHS[month]}
          </div>
          {selectedSessions.map(s => {
            const g = groups.find(gr => gr.id === s.groupId);
            return (
              <div key={s.id} style={{
                padding: '12px 16px', borderRadius: 'var(--radius-md)',
                background: 'var(--primary-pale)', marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                {g && (
                  <div className="group-avatar" style={{
                    background: g.color || getGroupColor(g.name),
                    width: 32, height: 32, fontSize: 13, borderRadius: 8
                  }}>
                    {g.name.charAt(0)}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                  {g && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{g.name}</div>}
                </div>
                {s.createdBy === user?.uid && (
                  <button
                    onClick={() => handleDeleteSession(s.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: 'var(--text-muted)', fontSize: 16 }}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {}
      <div style={{ padding: '16px 16px 0' }}>
        {!showForm ? (
          <button
            className="btn-primary-custom"
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-plus-lg"></i>
            Schedule for {selectedDay} {MONTHS[month].slice(0, 3)}
          </button>
        ) : (
          <div style={{
            border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
            padding: 16, display: 'flex', flexDirection: 'column', gap: 12
          }}>
            <input
              className="input-custom"
              placeholder="Session name (e.g. Mobile System Design)"
              value={sessionName}
              onChange={e => setSessionName(e.target.value)}
              autoFocus
            />

            {groups.length > 0 && (
              <select
                className="input-custom"
                value={selectedGroupId}
                onChange={e => setSelectedGroupId(e.target.value)}
                style={{ appearance: 'none', cursor: 'pointer' }}
              >
                <option value="">Select group</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="btn-primary-custom"
                onClick={handleCreate}
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Saving...' : 'Create'}
              </button>
              <button
                className="btn-outline-custom"
                onClick={() => setShowForm(false)}
                style={{ width: 'auto', padding: '14px 20px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}
