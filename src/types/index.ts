export type CategoryType = 
  | 'texnologiya'
  | 'sexsi-inkisaf'
  | 'mehsuldarliq'
  | 'felsefe'
  | 'bloq'
  | 'innovasiya';

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: CategoryType;
  excerpt: string;
  content: string;
  coverImage: string;
  readTimeMinutes: number;
  author: Author;
  publishedAt: string;
  views: number;
  likes: number;
  tags: string[];
  featured: boolean;
  trending: boolean;
  isPersonalBlog: boolean;
  videoUrl?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  category: CategoryType;
  speaker: string;
  thumbnail: string;
  publishedAt: string;
  keyTakeaways: string[];
}

export interface Subscriber {
  id: string;
  email: string;
  frequency: 'weekly' | 'breaking' | 'all';
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

export interface AdSettings {
  enabled: boolean;
  showSimulationBanner: boolean;
  adSensePublisherId: string;
  headerSlotId: string;
  articleSlotId: string;
  sidebarSlotId: string;
  footerSlotId: string;
  customBannerText?: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  adminPin: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    youtube: string;
    telegram: string;
    github: string;
  };
}

export interface BackupSnapshot {
  id: string;
  createdAt: string;
  note: string;
  articlesCount: number;
  videosCount: number;
  subscribersCount: number;
  data: string;
}

export interface BackupPackage {
  format: 'fikir-zeka-cms-backup';
  version: string;
  exportedAt: string;
  siteName: string;
  totalArticles: number;
  totalVideos: number;
  totalSubscribers: number;
  articles: Article[];
  videos: VideoItem[];
  subscribers: Subscriber[];
  adSettings: AdSettings;
  siteSettings: SiteSettings;
  comments: Comment[];
}
