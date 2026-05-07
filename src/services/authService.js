import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const googleProvider = new GoogleAuthProvider();

async function createUserProfile(user, additionalData = {}) {
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || additionalData.displayName || 'Student',
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      isOnline: true,
      groupIds: [],
      ...additionalData
    });
  }
  return userRef;
}

export async function registerWithEmail(email, password, displayName) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  await createUserProfile(result.user, { displayName });
  return result.user;
}

export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await createUserProfile(result.user);
  return result.user;
}

export async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export async function logout() {
  return signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth.currentUser;
}
