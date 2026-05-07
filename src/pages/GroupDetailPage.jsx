import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../App';
import {
  getGroup, subscribeToMessages, subscribeToNotes,
  sendMessage, saveNote, getGroupColor
} from '../services/firestoreService';
import { uploadNoteFile } from '../services/storageService';
import { useVibration } from '../hooks/useVibration';

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { vibrateNotification, vibrateSuccess } = useVibration();

  const [group, setGroup] = useState(null);
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const messagesEndRef = useRef(null);
  const prevMsgCount = useRef(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getGroup(groupId).then(setGroup);
  }, [groupId]);

  useEffect(() => {
    const unsub = subscribeToMessages(groupId, msgs => {
      // Vibrate on new incoming messages
      if (msgs.length > prevMsgCount.current && prevMsgCount.current > 0) {
        const last = msgs[msgs.length - 1];
        if (last.senderId !== user?.uid) {
          vibrateNotification(); // Device Feature #3: Vibration
        }
      }
      prevMsgCount.current = msgs.length;
      setMessages(msgs);
    });
    return unsub;
  }, [groupId, user]);

  useEffect(() => {
    const unsub = subscribeToNotes(groupId, setNotes);
    return unsub;
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const displayName = user.displayName || user.email?.split('@')[0] || 'Student';
    await sendMessage(groupId, text.trim(), user.uid, displayName);
    setText('');
  };

  // Device Feature #2: Camera / Gallery for note upload
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File too large (max 10MB)', 'error');
      return;
    }

    setUploading(true);
    try {
      const displayName = user.displayName || user.email?.split('@')[0] || 'Student';
      const { downloadURL } = await uploadNoteFile(file, groupId, user.uid);
      const noteName = file.name.replace(/\.[^.]+$/, '') || `Note ${notes.length + 1}`;
      await saveNote(groupId, noteName, downloadURL, user.uid, displayName, file.type, file.size);
      vibrateSuccess();
      showToast('Note uploaded! 📎', 'success');
    } catch (err) {
      console.error(err);
      showToast('Upload failed. Check Firebase Storage rules.', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatNoteDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (!group) return (
    <div className="loading-screen" style={{ height: '50vh' }}>
      <div className="spinner"></div>
    </div>
  );

  const groupColor = group.color || getGroupColor(group.name);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - var(--nav-height))' }}>
      {}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'white', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/groups')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--primary)', fontSize: 20 }}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <div className="group-avatar" style={{ background: groupColor, width: 36, height: 36, fontSize: 15, borderRadius: 10 }}>
            {group.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{group.name}</h2>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
              {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(groupId);
                showToast('Group ID copied to clipboard!', 'success');
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18 }}
              title="Copy Group ID to invite others"
            >
              <i className="bi bi-share"></i>
            </button>
          </div>
        </div>
      </div>

      {}
      <div className="tab-bar" style={{ flexShrink: 0 }}>
        <div
          className={`tab-item ${tab === 'chat' ? 'active' : ''}`}
          onClick={() => setTab('chat')}
        >
          Chat
        </div>
        <div
          className={`tab-item ${tab === 'shared' ? 'active' : ''}`}
          onClick={() => setTab('shared')}
          style={{ marginLeft: 'auto' }}
        >
          Shared
        </div>
      </div>

      {tab === 'chat' ? (

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="messages-area">
            {messages.length === 0 && (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <i className="bi bi-chat-dots"></i>
                <p>No messages yet. Say hi! 👋</p>
              </div>
            )}
            {messages.map(msg => {
              const isOwn = msg.senderId === user?.uid;
              return (
                <div key={msg.id} className={`message-row ${isOwn ? 'own' : ''}`}>
                  {!isOwn && (
                    <div className="message-avatar">
                      <i className="bi bi-person-fill"></i>
                    </div>
                  )}
                  <div>
                    {!isOwn && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, paddingLeft: 4 }}>
                        {msg.senderName}
                      </div>
                    )}
                    <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
                      {msg.text}
                    </div>
                    <div className={`message-time`} style={{ textAlign: isOwn ? 'right' : 'left', paddingLeft: isOwn ? 0 : 4, paddingRight: isOwn ? 4 : 0 }}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                  {isOwn && (
                    <div className="message-avatar" style={{ background: 'var(--primary)', color: 'white' }}>
                      <i className="bi bi-person-fill"></i>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-bar">
            <input
              className="chat-input"
              placeholder="Message..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend} disabled={!text.trim()}>
              <i className="bi bi-send-fill" style={{ fontSize: 14 }}></i>
            </button>
          </div>
        </div>
      ) : (

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {}
          <div style={{ padding: 16 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf,.doc,.docx"
              capture="environment"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="upload-btn"
                onClick={() => {
                  fileInputRef.current.removeAttribute('capture');
                  fileInputRef.current.click();
                }}
                disabled={uploading}
                style={{ flex: 1 }}
              >
                <i className="bi bi-upload"></i>
                {uploading ? 'Uploading...' : 'Upload Note 📤'}
              </button>
              <button
                className="btn-outline-custom"
                onClick={() => {
                  fileInputRef.current.setAttribute('capture', 'environment');
                  fileInputRef.current.click();
                }}
                disabled={uploading}
                style={{ width: 'auto', padding: '14px 16px' }}
                title="Take photo with camera"
              >
                <i className="bi bi-camera"></i>
              </button>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-file-earmark-image"></i>
              <p>No shared notes yet.<br />Upload photos from your camera or gallery!</p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map(note => (
                <div
                  key={note.id}
                  className="note-card"
                  onClick={() => setSelectedNote(note)}
                  style={{
                    background: note.fileType?.startsWith('image/') ? '#2a2060' : 'var(--primary)'
                  }}
                >
                  {note.fileType?.startsWith('image/') && note.fileUrl && (
                    <img src={note.fileUrl} alt={note.name} className="note-card-img" />
                  )}
                  <div className="note-card-content">
                    {note.hasAttachment && (
                      <div className="note-card-icon">
                        {note.fileType?.startsWith('image/') ? '🖼️' : '📄'}
                      </div>
                    )}
                    <div className="note-card-name">{note.name}</div>
                    <div className="note-card-date">{formatNoteDate(note.uploadedAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {}
      {selectedNote && (
        <div className="modal-overlay" onClick={() => setSelectedNote(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle"></div>
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, marginBottom: 4 }}>{selectedNote.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
              Uploaded by {selectedNote.uploadedByName} · {formatNoteDate(selectedNote.uploadedAt)}
            </p>
            {selectedNote.fileType?.startsWith('image/') && (
              <img
                src={selectedNote.fileUrl}
                alt={selectedNote.name}
                style={{ width: '100%', borderRadius: 'var(--radius-md)', marginBottom: 16 }}
              />
            )}
            <a
              href={selectedNote.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary-custom"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <i className="bi bi-download"></i> Open / Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
