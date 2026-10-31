import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App & Firestore with configured databaseId
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

function cleanForFirestore(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => (value === undefined ? null : value))
  );
}

function sortArticlesList(list: any[]): any[] {
  return [...list].sort((a, b) => {
    const timeA =
      typeof a.createdAt === 'number'
        ? a.createdAt
        : parseInt(String(a.id || '').replace(/\D/g, '')) || 0;
    const timeB =
      typeof b.createdAt === 'number'
        ? b.createdAt
        : parseInt(String(b.id || '').replace(/\D/g, '')) || 0;
    return timeB - timeA;
  });
}

export const CloudStore = {
  db,
  isReady: true,
  config: firebaseConfig,

  async loadArticles(): Promise<any[]> {
    try {
      const snap = await getDocs(collection(db, 'articles'));
      const list: any[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.id) {
          list.push(data);
        }
      });
      return sortArticlesList(list);
    } catch (err) {
      console.error('[CloudStore] loadArticles error:', err);
      throw err;
    }
  },

  async saveArticle(article: any): Promise<boolean> {
    try {
      if (!article || !article.id) throw new Error('Missing article ID');
      if (!article.createdAt) {
        article.createdAt = Date.now();
      }
      const cleaned = cleanForFirestore(article);
      await setDoc(doc(db, 'articles', article.id), cleaned, { merge: true });
      return true;
    } catch (err) {
      console.error('[CloudStore] saveArticle error:', err);
      throw err;
    }
  },

  async deleteArticle(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'articles', id));
      return true;
    } catch (err) {
      console.error('[CloudStore] deleteArticle error:', err);
      throw err;
    }
  },

  onArticlesChange(callback: (articles: any[]) => void): () => void {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'articles'),
        (snapshot) => {
          const list: any[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data && data.id) {
              list.push(data);
            }
          });
          callback(sortArticlesList(list));
        },
        (error) => {
          console.warn('[CloudStore] Snapshot listener notice:', error);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.error('[CloudStore] onArticlesChange error:', err);
      return () => {};
    }
  },

  async testConnection(): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      const snap = await getDocs(collection(db, 'articles'));
      return { success: true, count: snap.size };
    } catch (e: any) {
      return { success: false, count: 0, error: e?.message || String(e) };
    }
  },

  async loadVideos(): Promise<any[]> {
    try {
      const snap = await getDocs(collection(db, 'videos'));
      const list: any[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.id) {
          list.push(data);
        }
      });
      return list;
    } catch (err) {
      console.warn('[CloudStore] loadVideos notice:', err);
      return [];
    }
  },

  async saveVideo(video: any): Promise<boolean> {
    try {
      if (!video || !video.id) throw new Error('Missing video ID');
      if (!video.createdAt) video.createdAt = Date.now();
      const cleaned = cleanForFirestore(video);
      await setDoc(doc(db, 'videos', video.id), cleaned, { merge: true });
      return true;
    } catch (err) {
      console.error('[CloudStore] saveVideo error:', err);
      throw err;
    }
  },

  async deleteVideo(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'videos', id));
      return true;
    } catch (err) {
      console.error('[CloudStore] deleteVideo error:', err);
      throw err;
    }
  },

  async likeVideo(id: string, delta: number = 1): Promise<number | null> {
    try {
      const vDoc = doc(db, 'videos', id);
      const snap = await getDocs(collection(db, 'videos'));
      let target = null;
      snap.forEach(d => {
        if (d.id === id) target = d.data();
      });
      const newLikes = Math.max(0, ((target as any)?.likes || 0) + delta);
      await setDoc(vDoc, { likes: newLikes }, { merge: true });
      return newLikes;
    } catch (err) {
      console.warn('[CloudStore] likeVideo fallback:', err);
      return null;
    }
  },

  onVideosChange(callback: (videos: any[]) => void): () => void {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'videos'),
        (snapshot) => {
          const list: any[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data && data.id) {
              list.push(data);
            }
          });
          callback(list);
        },
        (error) => {
          console.warn('[CloudStore] Videos snapshot listener notice:', error);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.error('[CloudStore] onVideosChange error:', err);
      return () => {};
    }
  }
};

// Expose globally on window so index.html script can use it instantly on any device / hosting
(window as any).CloudStore = CloudStore;

// Trigger ready event
window.dispatchEvent(new CustomEvent('cloudstore:ready', { detail: CloudStore }));
