import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthChange } from './services/authService';

import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import LocationsPage from './pages/LocationsPage';
import SchedulePage from './pages/SchedulePage';
import AccountPage from './pages/AccountPage';
import BottomNav from './components/BottomNav';
import InstallBanner from './components/InstallBanner';
import Toast from './components/Toast';

export const AuthContext = createContext(null);
export const ToastContext = createContext(null);

export function useAuth() { return useContext(AuthContext); }
export function useToast() { return useContext(ToastContext); }

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading StudySquad...</p>
    </div>
  );
  return user ? children : <Navigate to="/auth" replace />;
}

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <div className="page-content">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const unsub = onAuthChange(u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const showToast = (message, type = 'default', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <ToastContext.Provider value={{ showToast }}>
        <BrowserRouter>
          <InstallBanner />
          {toast && <Toast toast={toast} />}
          <Routes>
            <Route path="/auth" element={user && !loading ? <Navigate to="/" replace /> : <AuthPage />} />

            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout><HomePage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/groups" element={
              <ProtectedRoute>
                <AppLayout><GroupsPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/groups/:groupId" element={
              <ProtectedRoute>
                <AppLayout><GroupDetailPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/locations" element={
              <ProtectedRoute>
                <AppLayout><LocationsPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/schedule" element={
              <ProtectedRoute>
                <AppLayout><SchedulePage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/account" element={
              <ProtectedRoute>
                <AppLayout><AccountPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
}
