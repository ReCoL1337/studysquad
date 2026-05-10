import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

const GROUP_COLORS = ['#E53935', '#3949AB', '#2E7D32', '#F57C00', '#00838F', '#6A1B9A'];

export function getGroupColor(name) {
  const idx = name.charCodeAt(0) % GROUP_COLORS.length;
  return GROUP_COLORS[idx];
}

export async function createGroup(name, description, userId, userName) {
  const groupRef = await addDoc(collection(db, 'groups'), {
    name,
    description: description || '',
    color: getGroupColor(name),
    createdBy: userId,
    createdByName: userName,
    createdAt: serverTimestamp(),
    memberIds: [userId],
    memberNames: [userName],
    memberCount: 1,
    isActive: true
  });
  return groupRef.id;
}

/**
 * Get groups where current user is a member
 */
export async function getUserGroups(userId) {
  const q = query(
    collection(db, 'groups'),
    where('memberIds', 'array-contains', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getGroup(groupId) {
  const snap = await getDoc(doc(db, 'groups', groupId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function joinGroup(groupId, userId, userName) {
  const groupRef = doc(db, 'groups', groupId);
  await updateDoc(groupRef, {
    memberIds: arrayUnion(userId),
    memberNames: arrayUnion(userName),
    memberCount: (await getDoc(groupRef)).data().memberCount + 1
  });
}

export async function leaveGroup(groupId, userId, userName) {
  const groupRef = doc(db, 'groups', groupId);
  const snap = await getDoc(groupRef);
  const data = snap.data();
  await updateDoc(groupRef, {
    memberIds: arrayRemove(userId),
    memberNames: arrayRemove(userName),
    memberCount: Math.max(0, data.memberCount - 1)
  });
}

export function subscribeToGroups(userId, callback, onError) {
  const q = query(
    collection(db, 'groups'),
    where('memberIds', 'array-contains', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, snapshot => {
    const groups = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(groups);
  }, err => {
    console.error('subscribeToGroups error:', err);
    onError?.(err);
  });
}

export async function createSession(name, date, groupId, groupName, userId) {
  const [y, m, d] = date.split('-').map(Number);
  return addDoc(collection(db, 'sessions'), {
    name,
    date: Timestamp.fromDate(new Date(y, m - 1, d)),
    groupId,
    groupName: groupName || '',
    createdBy: userId,
    createdAt: serverTimestamp(),
    description: '',
    isCompleted: false
  });
}

/**
 * Get upcoming sessions for a user's groups
 */
export async function getUserSessions(groupIds) {
  if (!groupIds || groupIds.length === 0) return [];
  const q = query(
    collection(db, 'sessions'),
    where('groupId', 'in', groupIds.slice(0, 10)),
    orderBy('date', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeToSessions(groupIds, callback, onError) {
  if (!groupIds || groupIds.length === 0) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, 'sessions'),
    where('groupId', 'in', groupIds.slice(0, 10)),
    orderBy('date', 'asc')
  );
  return onSnapshot(q, snapshot => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  }, err => {
    console.error('subscribeToSessions error:', err);
    onError?.(err);
  });
}

export async function sendMessage(groupId, text, userId, userName) {
  return addDoc(collection(db, 'messages'), {
    text,
    senderId: userId,
    senderName: userName,
    groupId,
    timestamp: serverTimestamp(),
    type: 'text',
    isEdited: false
  });
}

export function subscribeToMessages(groupId, callback, onError) {
  const q = query(
    collection(db, 'messages'),
    where('groupId', '==', groupId),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, snapshot => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  }, err => {
    console.error('subscribeToMessages error:', err);
    onError?.(err);
  });
}

export async function saveNote(groupId, name, fileUrl, uploadedBy, uploadedByName, fileType, fileSize) {
  return addDoc(collection(db, 'notes'), {
    name,
    groupId,
    uploadedBy,
    uploadedByName,
    fileUrl,
    fileType: fileType || 'image/jpeg',
    fileSize: fileSize || 0,
    uploadedAt: serverTimestamp(),
    hasAttachment: true,
    tags: [],
    downloadCount: 0
  });
}

export function subscribeToNotes(groupId, callback, onError) {
  const q = query(
    collection(db, 'notes'),
    where('groupId', '==', groupId),
    orderBy('uploadedAt', 'desc')
  );
  return onSnapshot(q, snapshot => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  }, err => {
    console.error('subscribeToNotes error:', err);
    onError?.(err);
  });
}

export async function deleteNote(noteId) {
  return deleteDoc(doc(db, 'notes', noteId));
}

export async function deleteGroup(groupId) {
  return deleteDoc(doc(db, 'groups', groupId));
}

export async function deleteSession(sessionId) {
  return deleteDoc(doc(db, 'sessions', sessionId));
}
