import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, registerWithEmail, signInWithGoogle } from '../services/authService';
import { useToast } from '../App';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailStep, setEmailStep] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleEmailContinue = () => {
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    setEmailStep(true);
  };

  const handleSubmit = async () => {
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!displayName.trim()) {
          showToast('Please enter your name', 'error');
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName.trim());
        showToast('Account created! Welcome to StudySquad 🎉', 'success');
      } else {
        await loginWithEmail(email, password);
        showToast('Welcome back!', 'success');
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err.code === 'auth/wrong-password' ? 'Incorrect password'
        : err.code === 'auth/user-not-found' ? 'No account found with this email'
        : err.code === 'auth/email-already-in-use' ? 'Email already in use'
        : 'Authentication failed. Please try again.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      console.error(err);
      showToast('Google sign-in failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {}
      <div className="auth-logo">
        Study<span>Squad</span>
      </div>

      {!emailStep ? (

        <>
          <h1 className="auth-title">
            {mode === 'register' ? 'Create an account' : 'Welcome back!'}
          </h1>
          <p className="auth-subtitle">
            Enter your email to {mode === 'register' ? 'sign up for' : 'sign in to'} this app
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              className="input-custom"
              type="email"
              placeholder="email@domain.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEmailContinue()}
              autoComplete="email"
            />
            <button className="btn-primary-custom" onClick={handleEmailContinue}>
              Continue
            </button>
          </div>

          <div className="divider">or</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {}
            <button className="btn-outline-custom" onClick={handleGoogle} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 14 }}
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <p className="auth-footer">
            By clicking continue, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </p>
        </>
      ) : (

        <>
          <h1 className="auth-title">
            {mode === 'register' ? 'Complete sign up' : 'Enter your password'}
          </h1>
          <p className="auth-subtitle" style={{ wordBreak: 'break-all' }}>{email}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'register' && (
              <input
                className="input-custom"
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                autoComplete="name"
              />
            )}
            <input
              className="input-custom"
              type="password"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              autoFocus
            />
            <button className="btn-primary-custom" onClick={handleSubmit} disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span>
                : mode === 'register' ? 'Create Account' : 'Sign In'}
            </button>
            <button
              className="btn-outline-custom"
              onClick={() => { setEmailStep(false); setPassword(''); }}
            >
              ← Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}
