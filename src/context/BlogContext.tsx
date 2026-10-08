import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Article,
  VideoItem,
  Subscriber,
  AdSettings,
  SiteSettings,
  CategoryType,
  Comment,
  BackupSnapshot,
  BackupPackage,
} from '../types';
import {
  INITIAL_ARTICLES,
  INITIAL_VIDEOS,
  INITIAL_SUBSCRIBERS,
  INITIAL_AD_SETTINGS,
  INITIAL_SITE_SETTINGS,
} from '../data/initialData';
import confetti from 'canvas-confetti';

interface BlogContextType {
  articles: Article[];
  videos: VideoItem[];
  subscribers: Subscriber[];
  adSettings: AdSettings;
  siteSettings: SiteSettings;
  comments: Comment[];
  bookmarks: string[];
  likedArticles: string[];
  activeArticle: Article | null;
  activeVideo: VideoItem | null;
  isSearchOpen: boolean;
  isAdminOpen: boolean;
  isAdminAuthenticated: boolean;
  theme: 'light' | 'dark';
  searchQuery: string;
  selectedCategory: CategoryType | 'all';
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: CategoryType | 'all') => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  openArticle: (article: Article | string) => void;
  closeArticle: () => void;
  openVideo: (video: VideoItem | string) => void;
  closeVideo: () => void;
  
  // Interactions
  likeArticle: (id: string) => void;
  toggleBookmark: (id: string) => void;
  addComment: (articleId: string, authorName: string, content: string) => void;
  subscribeNewsletter: (email: string, frequency?: 'weekly' | 'breaking' | 'all') => { success: boolean; message: string };
  deleteSubscriber: (id: string) => void;
  
  // Admin CMS & Data Backup
  authenticateAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  addArticle: (article: Omit<Article, 'id' | 'views' | 'likes' | 'publishedAt'>) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  addVideo: (video: Omit<VideoItem, 'id' | 'publishedAt'>) => void;
  updateVideo: (id: string, updates: Partial<VideoItem>) => void;
  deleteVideo: (id: string) => void;
  updateAdSettings: (updates: Partial<AdSettings>) => void;
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;
  resetToDefaults: () => void;
  
  // Enhanced Backup & Restore
  exportDataJSON: () => void;
  exportArticlesOnlyJSON: () => void;
  exportInitialDataTsCode: () => string;
  exportArticlesCSV: () => void;
  importDataJSON: (jsonStr: string, mode?: 'replace' | 'merge') => { success: boolean; message: string; count?: number };
  snapshots: BackupSnapshot[];
  createSnapshot: (note?: string) => void;
  restoreSnapshot: (id: string) => boolean;
  deleteSnapshot: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ARTICLES: 'intellektual_articles_v1',
  VIDEOS: 'intellektual_videos_v1',
  SUBSCRIBERS: 'intellektual_subscribers_v1',
  ADS: 'intellektual_ads_v1',
  SITE: 'intellektual_site_v1',
  COMMENTS: 'intellektual_comments_v1',
  BOOKMARKS: 'intellektual_bookmarks_v1',
  LIKES: 'intellektual_likes_v1',
  THEME: 'intellektual_theme_v1',
  ADMIN_AUTH: 'intellektual_admin_auth_v1',
  SNAPSHOTS: 'intellektual_snapshots_v1',
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: defaults strictly to 'light'
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark') return 'dark';
    return 'light';
  });

  // Articles state
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  // Videos state
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  // Subscribers state
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIBERS;
    } catch {
      return INITIAL_SUBSCRIBERS;
    }
  });

  // Ad Settings state
  const [adSettings, setAdSettings] = useState<AdSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADS);
      return saved ? JSON.parse(saved) : INITIAL_AD_SETTINGS;
    } catch {
      return INITIAL_AD_SETTINGS;
    }
  });

  // Site Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SITE);
      return saved ? JSON.parse(saved) : INITIAL_SITE_SETTINGS;
    } catch {
      return INITIAL_SITE_SETTINGS;
    }
  });

  // Comments state
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'c-1',
          articleId: 'art-1',
          authorName: 'Rəşad Əliyev',
          content: 'Möhtəşəm təhlildir! Xüsusilə diqqətin qorunması və dərin düşüncə hissəsi çox yerində qeyd olunub.',
          createdAt: '2026-10-06T10:15:00.000Z',
          likes: 4,
        },
        {
          id: 'c-2',
          articleId: 'art-2',
          authorName: 'Günel Məmmədova',
          content: '1% qaydası həqiqətən həyatımı dəyişdi. Saytın dizaynı da çox oxunaqlı və gözəldir.',
          createdAt: '2026-10-06T14:30:00.000Z',
          likes: 2,
        },
      ];
    } catch {
      return [];
    }
  });

  // User interactions
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [likedArticles, setLikedArticles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Navigation
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');

  // Sync theme with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Sync localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(adSettings));
  }, [adSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SITE, JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likedArticles));
  }, [likedArticles]);

  // Snapshots state
  const [snapshots, setSnapshots] = useState<BackupSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(snapshots));
  }, [snapshots]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const activeArticle = articles.find((a) => a.id === activeArticleId) || null;
  const activeVideo = videos.find((v) => v.id === activeVideoId) || null;

  const openArticle = (item: Article | string, updateUrl = true) => {
    const id = typeof item === 'string' ? item : item.id;
    const found = articles.find((a) => a.id === id || (a.slug && a.slug.toLowerCase() === ('' + id).toLowerCase()));
    const targetId = found ? found.id : id;
    setActiveArticleId(targetId);
    setArticles((prev) =>
      prev.map((a) => (a.id === targetId ? { ...a, views: a.views + 1 } : a))
    );
    if (updateUrl && found) {
      const slugOrId = found.slug || found.id;
      const targetHash = `#/xeber/${encodeURIComponent(slugOrId)}`;
      if (window.location.hash !== targetHash) {
        history.pushState({ articleId: found.id }, '', targetHash);
      }
      document.title = `${found.title} — Fikir & Zəka`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeArticle = (updateUrl = true) => {
    setActiveArticleId(null);
    if (updateUrl) {
      const targetHash = selectedCategory !== 'all' ? `#/bolme/${encodeURIComponent(selectedCategory)}` : '#/';
      if (window.location.hash !== targetHash) {
        history.pushState(null, '', targetHash);
      }
    }
  };

  const selectCategory = (cat: CategoryType | 'all', updateUrl = true) => {
    setSelectedCategory(cat);
    setActiveArticleId(null);
    if (updateUrl) {
      const targetHash = cat === 'all' ? '#/' : `#/bolme/${encodeURIComponent(cat)}`;
      if (window.location.hash !== targetHash) {
        history.pushState({ category: cat }, '', targetHash);
      }
    }
  };

  // URL Deep Link Listener
  useEffect(() => {
    const handleRoute = () => {
      let hash = window.location.hash || '';
      if (!hash || hash === '#' || hash === '#/') {
        const params = new URLSearchParams(window.location.search);
        const qXeber = params.get('xeber') || params.get('article');
        const qBolme = params.get('bolme') || params.get('category');
        if (qXeber) hash = `#/xeber/${encodeURIComponent(qXeber)}`;
        else if (qBolme) hash = `#/bolme/${encodeURIComponent(qBolme)}`;
      }

      if (!hash || hash === '#' || hash === '#/' || hash === '#top') {
        setActiveArticleId(null);
        setActiveVideoId(null);
        setIsAdminOpen(false);
        return;
      }

      const artMatch = hash.match(/^#\/?(?:xeber|article|post)\/([^/?#]+)/i);
      if (artMatch) {
        const slugOrId = decodeURIComponent(artMatch[1]);
        const found = articles.find((a) => (a.slug && a.slug.toLowerCase() === slugOrId.toLowerCase()) || a.id === slugOrId);
        if (found) {
          openArticle(found.id, false);
          return;
        }
      }

      const catMatch = hash.match(/^#\/?(?:bolme|kateqoriya|category)\/([^/?#]+)/i);
      if (catMatch) {
        const cat = decodeURIComponent(catMatch[1]) as CategoryType;
        selectCategory(cat, false);
        return;
      }

      if (/^#\/?admin/i.test(hash)) {
        setIsAdminOpen(true);
        return;
      }
    };

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
    return () => {
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('popstate', handleRoute);
    };
  }, [articles]);

  const openVideo = (item: VideoItem | string) => {
    const id = typeof item === 'string' ? item : item.id;
    setActiveVideoId(id);
  };

  const closeVideo = () => {
    setActiveVideoId(null);
  };

  const likeArticle = (id: string) => {
    const isLiked = likedArticles.includes(id);
    if (isLiked) {
      setLikedArticles((prev) => prev.filter((i) => i !== id));
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, likes: Math.max(0, a.likes - 1) } : a))
      );
    } else {
      setLikedArticles((prev) => [...prev, id]);
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, likes: a.likes + 1 } : a))
      );
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#0d9488', '#0284c7', '#6366f1'],
        });
      } catch {
        // ignore confetti errors
      }
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addComment = (articleId: string, authorName: string, content: string) => {
    if (!content.trim() || !authorName.trim()) return;
    const newComment: Comment = {
      id: 'c-' + Date.now(),
      articleId,
      authorName: authorName.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const subscribeNewsletter = (
    email: string,
    frequency: 'weekly' | 'breaking' | 'all' = 'weekly'
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Zəhmət olmasa düzgün e-poçt ünvanı daxil edin.' };
    }

    const exists = subscribers.some((s) => s.email.toLowerCase() === cleanEmail && s.status === 'active');
    if (exists) {
      return { success: true, message: 'Siz artıq bülletenimizə abunəsiniz!' };
    }

    const newSub: Subscriber = {
      id: 'sub-' + Date.now(),
      email: cleanEmail,
      frequency,
      subscribedAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setSubscribers((prev) => [newSub, ...prev]);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
    return { success: true, message: 'Təbriklər! Siz Fikir & Zəka bülleteninə uğurla abunə oldunuz.' };
  };

  const deleteSubscriber = (id: string) => {
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  };

  const authenticateAdmin = (pin: string) => {
    if (pin === siteSettings.adminPin || pin === 'admin123') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  const createSnapshot = (note: string = 'Avtomatik Nüsxə') => {
    const backupPkg: BackupPackage = {
      format: 'fikir-zeka-cms-backup',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      siteName: siteSettings.siteName,
      totalArticles: articles.length,
      totalVideos: videos.length,
      totalSubscribers: subscribers.length,
      articles,
      videos,
      subscribers,
      adSettings,
      siteSettings,
      comments,
    };
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = now.toLocaleDateString('az-AZ', { day: 'numeric', month: 'short' });
    const newSnapshot: BackupSnapshot = {
      id: 'snap-' + Date.now(),
      createdAt: `${dateFormatted}, ${timeFormatted}`,
      note,
      articlesCount: articles.length,
      videosCount: videos.length,
      subscribersCount: subscribers.length,
      data: JSON.stringify(backupPkg),
    };
    setSnapshots((prev) => [newSnapshot, ...prev.slice(0, 9)]);
  };

  const restoreSnapshot = (id: string): boolean => {
    const snap = snapshots.find((s) => s.id === id);
    if (!snap) return false;
    const res = importDataJSON(snap.data, 'replace');
    return res.success;
  };

  const deleteSnapshot = (id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  };

  const addArticle = (articleData: Omit<Article, 'id' | 'views' | 'likes' | 'publishedAt'>) => {
    const newArt: Article = {
      ...articleData,
      id: 'art-' + Date.now(),
      slug: articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      views: 1,
      likes: 0,
      publishedAt: new Date().toISOString().split('T')[0],
    };
    setArticles((prev) => [newArt, ...prev]);
    // Create snapshot
    setTimeout(() => createSnapshot(`Yeni Məqalə: "${newArt.title.slice(0, 25)}..."`), 100);
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    setTimeout(() => createSnapshot(`Redaktə: ${id}`), 100);
  };

  const deleteArticle = (id: string) => {
    const target = articles.find((a) => a.id === id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
    if (activeArticleId === id) {
      setActiveArticleId(null);
    }
    setTimeout(() => createSnapshot(`Silinən Məqalə: "${target?.title?.slice(0, 20) || id}"`), 100);
  };

  const addVideo = (videoData: Omit<VideoItem, 'id' | 'publishedAt'>) => {
    const newVid: VideoItem = {
      ...videoData,
      id: 'vid-' + Date.now(),
      publishedAt: new Date().toISOString().split('T')[0],
    };
    setVideos((prev) => [newVid, ...prev]);
    setTimeout(() => createSnapshot(`Yeni Video: "${newVid.title.slice(0, 25)}..."`), 100);
  };

  const updateVideo = (id: string, updates: Partial<VideoItem>) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    if (activeVideoId === id) {
      setActiveVideoId(null);
    }
  };

  const updateAdSettings = (updates: Partial<AdSettings>) => {
    setAdSettings((prev) => ({ ...prev, ...updates }));
  };

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetToDefaults = () => {
    createSnapshot('İlkin Vəziyyətə Qaytarılmazdan Əvvəlki Nüsxə');
    setArticles(INITIAL_ARTICLES);
    setVideos(INITIAL_VIDEOS);
    setSubscribers(INITIAL_SUBSCRIBERS);
    setAdSettings(INITIAL_AD_SETTINGS);
    setSiteSettings(INITIAL_SITE_SETTINGS);
    localStorage.clear();
  };

  const exportDataJSON = () => {
    const data: BackupPackage = {
      format: 'fikir-zeka-cms-backup',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      siteName: siteSettings.siteName,
      totalArticles: articles.length,
      totalVideos: videos.length,
      totalSubscribers: subscribers.length,
      articles,
      videos,
      subscribers,
      adSettings,
      siteSettings,
      comments,
    };
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
    const filename = `fikir-zeka-backup-${dateStr}-${timeStr}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    } catch {
      // ignore
    }
  };

  const exportArticlesOnlyJSON = () => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const blob = new Blob([JSON.stringify(articles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meqaleler-backup-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportInitialDataTsCode = (): string => {
    return `// Bu fayl Fikir & Zəka CMS Admin tərəfindən avtomatik generasiya olunub
// Tarix: ${new Date().toISOString()}
// Bu faylın məzmununu src/data/initialData.ts içinə kopyalayıb GitHub-a göndərsəniz, sayt yeni ziyarətçilərə də sizin son xəbərlərinizlə açılacaq!

import { Article, VideoItem, Subscriber, AdSettings, SiteSettings } from '../types';

export const INITIAL_ARTICLES: Article[] = ${JSON.stringify(articles, null, 2)};

export const INITIAL_VIDEOS: VideoItem[] = ${JSON.stringify(videos, null, 2)};

export const INITIAL_SUBSCRIBERS: Subscriber[] = ${JSON.stringify(subscribers, null, 2)};

export const INITIAL_AD_SETTINGS: AdSettings = ${JSON.stringify(adSettings, null, 2)};

export const INITIAL_SITE_SETTINGS: SiteSettings = ${JSON.stringify(siteSettings, null, 2)};
`;
  };

  const exportArticlesCSV = () => {
    if (articles.length === 0) return;
    const header = 'ID,Başlıq,Kateqoriya,Müəllif,Tarix,Oxu Müddəti (dəq),Baxış,Bəyənmə\n';
    const rows = articles
      .map((a) => `"${a.id}","${a.title.replace(/"/g, '""')}","${a.category}","${a.author.name}","${a.publishedAt}",${a.readTimeMinutes},${a.views},${a.likes}`)
      .join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meqaleler-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (
    jsonStr: string,
    mode: 'replace' | 'merge' = 'replace'
  ): { success: boolean; message: string; count?: number } => {
    try {
      const parsed = JSON.parse(jsonStr);
      // Auto-save a snapshot before restoring
      createSnapshot('Bərpadan Əvvəlki Avtomatik Nüsxə');

      let count = 0;

      // Handle raw array of articles
      if (Array.isArray(parsed)) {
        if (mode === 'replace') {
          setArticles(parsed);
          count = parsed.length;
        } else {
          const existingIds = new Set(articles.map((a) => a.id));
          const toAdd = parsed.filter((a: Article) => !existingIds.has(a.id));
          setArticles([...toAdd, ...articles]);
          count = toAdd.length;
        }
        try {
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
        } catch {}
        return { success: true, message: `${count} məqalə uğurla tətbiq edildi!`, count };
      }

      // Handle full BackupPackage or standard backup object
      if (parsed.articles && Array.isArray(parsed.articles)) {
        if (mode === 'replace') {
          setArticles(parsed.articles);
          count = parsed.articles.length;
          if (parsed.videos && Array.isArray(parsed.videos)) setVideos(parsed.videos);
          if (parsed.subscribers && Array.isArray(parsed.subscribers)) setSubscribers(parsed.subscribers);
          if (parsed.adSettings) setAdSettings(parsed.adSettings);
          if (parsed.siteSettings) setSiteSettings(parsed.siteSettings);
          if (parsed.comments && Array.isArray(parsed.comments)) setComments(parsed.comments);
        } else {
          const existingIds = new Set(articles.map((a) => a.id));
          const toAdd = parsed.articles.filter((a: Article) => !existingIds.has(a.id));
          setArticles([...toAdd, ...articles]);
          count = toAdd.length;
          if (parsed.videos && Array.isArray(parsed.videos)) {
            const existingVidIds = new Set(videos.map((v) => v.id));
            const newVids = parsed.videos.filter((v: VideoItem) => !existingVidIds.has(v.id));
            setVideos([...newVids, ...videos]);
          }
        }
        try {
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
        } catch {}
        return { success: true, message: `Backup uğurla bərpa edildi! (${count} məqalə)`, count };
      }

      return { success: false, message: 'Fayl strukturunda uyğun xəbər və ya məqalə məlumatı tapılmadı.' };
    } catch {
      return { success: false, message: 'Xəta: JSON faylı oxuna bilmədi və ya strukturu yanlışdır.' };
    }
  };

  return (
    <BlogContext.Provider
      value={{
        articles,
        videos,
        subscribers,
        adSettings,
        siteSettings,
        comments,
        bookmarks,
        likedArticles,
        activeArticle,
        activeVideo,
        isSearchOpen,
        isAdminOpen,
        isAdminAuthenticated,
        theme,
        searchQuery,
        selectedCategory,
        setTheme,
        toggleTheme,
        setSearchQuery,
        setSelectedCategory: selectCategory,
        setIsSearchOpen,
        setIsAdminOpen,
        openArticle,
        closeArticle,
        openVideo,
        closeVideo,
        likeArticle,
        toggleBookmark,
        addComment,
        subscribeNewsletter,
        deleteSubscriber,
        authenticateAdmin,
        logoutAdmin,
        addArticle,
        updateArticle,
        deleteArticle,
        addVideo,
        updateVideo,
        deleteVideo,
        updateAdSettings,
        updateSiteSettings,
        resetToDefaults,
        exportDataJSON,
        exportArticlesOnlyJSON,
        exportInitialDataTsCode,
        exportArticlesCSV,
        importDataJSON,
        snapshots,
        createSnapshot,
        restoreSnapshot,
        deleteSnapshot,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
