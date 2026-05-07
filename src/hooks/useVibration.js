export function useVibration() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const vibrate = (pattern = [100, 50, 100]) => {
    if (isSupported) {
      navigator.vibrate(pattern);
    }
  };

  const vibrateOnce = (duration = 100) => {
    if (isSupported) {
      navigator.vibrate(duration);
    }
  };

  const vibrateNotification = () => {

    if (isSupported) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
  };

  const vibrateSuccess = () => {
    if (isSupported) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  const vibrateError = () => {
    if (isSupported) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  return { isSupported, vibrate, vibrateOnce, vibrateNotification, vibrateSuccess, vibrateError };
}
