export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="toast-container">
      <div className={`toast-msg ${toast.type}`}>
        {toast.type === 'success' && <span>✓ </span>}
        {toast.type === 'error' && <span>✕ </span>}
        {toast.message}
      </div>
    </div>
  );
}
