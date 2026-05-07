import { useState, useEffect } from 'react';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="install-banner">
      <span>📚 Install StudySquad for easy access</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleInstall}>Install</button>
        <button className="close-btn" onClick={() => setShow(false)}>
          <i className="bi bi-x"></i>
        </button>
      </div>
    </div>
  );
}
