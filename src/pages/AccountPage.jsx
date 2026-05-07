import { useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../App';
import { logout } from '../services/authService';
import { useVibration } from '../hooks/useVibration';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { vibrateOnce } = useVibration();

  const handleLogout = async () => {
    vibrateOnce(80);
    try {
      await logout();
      navigate('/auth');
    } catch (e) {
      showToast('Logout failed', 'error');
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Student';
  const email = user?.email || '';
  const isGoogle = user?.providerData?.[0]?.providerId === 'google.com';

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Account</h1>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {}
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }}
          />
        ) : (
          <div className="account-avatar">
            <i className="bi bi-person-fill"></i>
          </div>
        )}

        <h2 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 22, marginBottom: 4 }}>
          {displayName}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>{email}</p>

        {isGoogle && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 'var(--radius-full)',
            background: 'var(--secondary)', marginBottom: 24,
            fontSize: 13, color: 'var(--text-secondary)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Signed in with Google
          </div>
        )}

        <button
          className="btn-primary-custom"
          onClick={handleLogout}
          style={{ maxWidth: 200 }}
        >
          Logout
        </button>
      </div>

      {}
      <div style={{ padding: '0 20px' }}>
        <div style={{
          background: 'var(--secondary)', borderRadius: 'var(--radius-md)',
          padding: 16, marginBottom: 12
        }}>
          <h4 style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>📱 Device Features Active</h4>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>GPS Location for nearby study spots</li>
            <li>Camera & Gallery for note uploads</li>
            <li>Vibration on notifications & actions</li>
          </ul>
        </div>

        <div style={{
          background: 'var(--secondary)', borderRadius: 'var(--radius-md)',
          padding: 16, marginBottom: 12
        }}>
          <h4 style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>☁️ Firebase Services</h4>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2 }}>
            <li>Authentication (Email + Google)</li>
            <li>Cloud Firestore (groups, sessions, messages, notes)</li>
            <li>Firebase Storage (note files)</li>
          </ul>
        </div>

        <div style={{
          border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
          padding: 16
        }}>
          <h4 style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>UID (for debugging)</h4>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', wordBreak: 'break-all', margin: 0 }}>
            {user?.uid}
          </p>
        </div>
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}
