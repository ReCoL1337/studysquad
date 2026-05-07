import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const tabs = [
    { path: '/groups', icon: 'bi-people-fill', iconOff: 'bi-people', label: 'Groups' },
    { path: '/', icon: 'bi-house-fill', iconOff: 'bi-house', label: 'Home' },
    { path: '/locations', icon: 'bi-geo-alt-fill', iconOff: 'bi-geo-alt', label: 'Nearby' },
    { path: '/schedule', icon: 'bi-calendar-week-fill', iconOff: 'bi-calendar-week', label: 'Schedule' },
  ];

  const isActive = (tabPath) => {
    if (tabPath === '/') return path === '/';
    return path.startsWith(tabPath);
  };

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.path}
          className={`nav-item ${isActive(tab.path) ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          <i className={`bi ${isActive(tab.path) ? tab.icon : tab.iconOff}`}></i>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
