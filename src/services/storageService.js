import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadNoteFile(file, groupId, userId) {
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const storageRef = ref(storage, `notes/${groupId}/${userId}/${fileName}`);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      uploadedBy: userId,
      groupId,
      originalName: file.name
    }
  });

  const downloadURL = await getDownloadURL(snapshot.ref);
  return { downloadURL, storagePath: snapshot.ref.fullPath };
}

export async function deleteNoteFile(storagePath) {
  if (!storagePath) return;
  const fileRef = ref(storage, storagePath);
  return deleteObject(fileRef);
}

export async function uploadProfilePicture(file, userId) {
  const storageRef = ref(storage, `avatars/${userId}/profile.jpg`);
  const snapshot = await uploadBytes(storageRef, file, { contentType: 'image/jpeg' });
  return getDownloadURL(snapshot.ref);
}
