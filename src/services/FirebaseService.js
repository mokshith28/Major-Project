import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';

class FirebaseService {
  static async initialize() {
    try {
      if (!db) throw new Error("Firestore not available");
      console.log("✅ Firebase service initialized");
      return true;
    } catch (error) {
      console.error("❌ Firebase init failed:", error);
      return false;
    }
  }

  // ========== SCANS OPERATIONS ==========

  static async addScan(scan, userId) {
    const docRef = await addDoc(collection(db, 'users', userId, 'scans'), scan);
    return docRef.id;
  }

  static async getScans(userId) {
    const q = query(collection(db, 'users', userId, 'scans'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), firebaseId: doc.id }));
  }

  static async updateScan(scanId, updates, userId) {
    const docRef = doc(db, 'users', userId, 'scans', scanId);
    await updateDoc(docRef, updates);
    return true;
  }

  static async deleteScan(scanId, userId) {
    const docRef = doc(db, 'users', userId, 'scans', scanId);
    await deleteDoc(docRef);
    return true;
  }

  // ========== SUBJECTS OPERATIONS ==========

  static async addSubject(subjectName, userId) {
    const docRef = await addDoc(collection(db, 'users', userId, 'subjects'), { name: subjectName });
    return docRef.id;
  }

  static async getSubjects(userId) {
    const q = query(collection(db, 'users', userId, 'subjects'), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().name);
  }

  static async deleteSubject(subjectName, userId) {
    const q = query(collection(db, 'users', userId, 'subjects'), where('name', '==', subjectName));
    const querySnapshot = await getDocs(q);
    for (const docSnap of querySnapshot.docs) {
      await deleteDoc(doc(db, 'users', userId, 'subjects', docSnap.id));
    }
    return true;
  }

  // ========== REAL-TIME LISTENERS ==========

  static subscribeToScans(callback, userId) {
    const q = query(collection(db, 'users', userId, 'scans'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const scans = querySnapshot.docs.map(doc => ({ ...doc.data(), firebaseId: doc.id }));
      callback(scans);
    });
  }

  static subscribeToSubjects(callback, userId) {
    const q = query(collection(db, 'users', userId, 'subjects'), orderBy('name'));
    return onSnapshot(q, (querySnapshot) => {
      const subjects = querySnapshot.docs.map(doc => doc.data().name);
      callback(subjects);
    });
  }

  // ========== SYNC ==========

  static async syncLocalToFirebase(localScans, localSubjects, userId) {
    console.log('Sync started...');
    for (const scan of localScans) {
      await this.addScan(scan, userId);
    }
    for (const subj of localSubjects) {
      await this.addSubject(subj, userId);
    }
    return { success: true, message: 'Sync completed ✅' };
  }
}

export default FirebaseService;
