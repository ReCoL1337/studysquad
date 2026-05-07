import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../App';
import { subscribeToGroups, createGroup, joinGroup, getGroupColor } from '../services/firestoreService';
import { useVibration } from '../hooks/useVibration';

export default function GroupsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { vibrateSuccess } = useVibration();

  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [joinId, setJoinId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToGroups(user.uid, setGroups);
    return unsub;
  }, [user]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) { showToast('Enter a group name', 'error'); return; }
    setLoading(true);
    try {
      const displayName = user.displayName || user.email?.split('@')[0] || 'Student';
      await createGroup(groupName.trim(), groupDesc.trim(), user.uid, displayName);
      vibrateSuccess();
      showToast(`Group "${groupName}" created! 🎉`, 'success');
      setGroupName(''); setGroupDesc(''); setShowModal(false);
    } catch (e) {
      showToast('Failed to create group', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinId.trim()) { showToast('Enter a group ID', 'error'); return; }
    setLoading(true);
    try {
      const displayName = user.displayName || user.email?.split('@')[0] || 'Student';
      await joinGroup(joinId.trim(), user.uid, displayName);
      vibrateSuccess();
      showToast('Joined group!', 'success');
      setJoinId(''); setShowModal(false);
    } catch (e) {
      showToast('Could not join group. Check the ID.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      {}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">Groups</h1>
        <button className="profile-btn" onClick={() => navigate('/account')}>
          <i className="bi bi-person-circle"></i>
        </button>
      </div>

      {}
      {groups.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-people"></i>
          <p>You haven't joined any groups yet.</p>
          <button
            className="btn-primary-custom"
            style={{ width: 'auto', marginTop: 8 }}
            onClick={() => { setModalMode('create'); setShowModal(true); }}
          >
            Create your first group
          </button>
        </div>
      ) : (
        groups.map(group => (
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
              {group.description && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
                  {group.description}
                </p>
              )}
            </div>
            <div className="group-meta">
              <i className="bi bi-people-fill" style={{ fontSize: 13 }}></i>
              <span>{group.memberCount || 1}</span>
            </div>
            <i className="bi bi-chevron-right group-chevron" style={{ marginLeft: 4 }}></i>
          </div>
        ))
      )}

      {}
      <div style={{ padding: '20px 20px 0', display: 'flex', gap: 10 }}>
        <button
          className="btn-primary-custom"
          onClick={() => { setModalMode('create'); setShowModal(true); }}
        >
          <i className="bi bi-plus-lg"></i> New Group
        </button>
        <button
          className="btn-outline-custom"
          style={{ width: 'auto', padding: '14px 20px', flexShrink: 0 }}
          onClick={() => { setModalMode('join'); setShowModal(true); }}
        >
          <i className="bi bi-link-45deg"></i> Join
        </button>
      </div>

      {}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-sheet">
            <div className="modal-handle"></div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['create', 'join'].map(m => (
                <button
                  key={m}
                  onClick={() => setModalMode(m)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
                    border: '1.5px solid',
                    borderColor: modalMode === m ? 'var(--primary)' : 'var(--border)',
                    background: modalMode === m ? 'var(--primary-pale)' : 'white',
                    color: modalMode === m ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: 600, cursor: 'pointer', fontSize: 14
                  }}
                >
                  {m === 'create' ? '✨ Create Group' : '🔗 Join Group'}
                </button>
              ))}
            </div>

            {modalMode === 'create' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  className="input-custom"
                  placeholder="Group name (e.g. Math Masters)"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  autoFocus
                />
                <input
                  className="input-custom"
                  placeholder="Description (optional)"
                  value={groupDesc}
                  onChange={e => setGroupDesc(e.target.value)}
                />
                <button className="btn-primary-custom" onClick={handleCreateGroup} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
                  Ask a group admin for the Group ID to join their study group.
                </p>
                <input
                  className="input-custom"
                  placeholder="Paste Group ID here"
                  value={joinId}
                  onChange={e => setJoinId(e.target.value)}
                  autoFocus
                />
                <button className="btn-primary-custom" onClick={handleJoinGroup} disabled={loading}>
                  {loading ? 'Joining...' : 'Join Group'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
