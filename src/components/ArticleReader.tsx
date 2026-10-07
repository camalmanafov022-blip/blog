import React, { useState, useEffect, useRef } from 'react';
import { useBlog } from '../context/BlogContext';
import { Article } from '../types';
import { GoogleAdUnit } from './GoogleAdUnit';
import {
  ArrowLeft,
  Clock,
  Heart,
  Bookmark,
  Share2,
  Check,
  MessageSquare,
  Send,
  Sparkles,
  Type,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArticleReaderProps {
  article: Article;
  onClose: () => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({ article, onClose }) => {
  const {
    articles,
    openArticle,
    likeArticle,
    likedArticles,
    toggleBookmark,
    bookmarks,
    comments,
    addComment,
  } = useBlog();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(article.readTimeMinutes * 60);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copiedLink, setCopiedLink] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [focusMode, setFocusMode] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const isLiked = likedArticles.includes(article.id);
  const isBookmarked = bookmarks.includes(article.id);

  // Article comments
  const articleComments = comments.filter((c) => c.articleId === article.id);

  // Find next and prev articles
  const currentIndex = articles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  // Track dynamic scroll progress and calculate exact remaining reading time
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - windowHeight;
      if (docHeight <= 0) return;

      const scrollTop = window.scrollY;
      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      setScrollProgress(progress);

      const totalSecs = article.readTimeMinutes * 60;
      const remaining = Math.max(0, Math.round(totalSecs * (1 - progress / 100)));
      setRemainingSeconds(remaining);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article.readTimeMinutes, article.id]);

  const formatRemainingTime = (seconds: number) => {
    if (seconds <= 0) return 'Tamamlandı 🎉';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s} san qaldı`;
    if (s === 0) return `${m} dəq qaldı`;
    return `${m} dəq ${s} san qaldı`;
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleShareTelegram = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Oxumağı tövsiyə edirəm: ${article.title}`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${article.title} - ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commenterName.trim()) return;
    addComment(article.id, commenterName, commentText);
    setCommentText('');
  };

  const fontSizeClass = {
    normal: 'text-base sm:text-lg leading-relaxed sm:leading-loose',
    large: 'text-lg sm:text-xl leading-relaxed sm:leading-loose',
    xlarge: 'text-xl sm:text-2xl leading-relaxed sm:leading-loose',
  }[fontSize];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pb-24"
    >
      {/* Dynamic Sticky Reading Progress & Time Left Bar */}
      <div className="fixed top-16 left-0 w-full z-30 bg-[#faf8f5]/95 dark:bg-[#0c0d0e]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 shadow-xs">
        {/* Progress Fill Indicator Line */}
        <div className="w-full bg-stone-200 dark:bg-stone-800 h-1">
          <div
            className="bg-stone-900 dark:bg-amber-400 h-1 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 h-11 flex items-center justify-between text-xs font-mono">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Geri Qayıt</span>
          </button>

          {/* Real-time Dynamic Remaining Time */}
          <div className="flex items-center gap-2 px-3 py-1 bg-stone-200/70 dark:bg-stone-800/80 rounded-full text-stone-800 dark:text-stone-200 font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span className="tabular-nums">
              Oxu müddəti: {formatRemainingTime(remainingSeconds)} ({Math.round(scrollProgress)}%)
            </span>
          </div>

          {/* Reading Controls */}
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
            {/* Font Size Selector */}
            <button
              onClick={() => {
                setFontSize((prev) =>
                  prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal'
                );
              }}
              className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition-colors flex items-center gap-1 text-[11px]"
              title="Şrift ölçüsünü dəyiş"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="uppercase">{fontSize}</span>
            </button>

            {/* Focus Mode */}
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition-colors"
              title={focusMode ? 'Fokus rejimindən çıx' : 'Fokus rejimi'}
            >
              {focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Reading Container */}
      <div className="pt-20 max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Editorial Accession / Header */}
        <div className="mb-8 pt-4">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-3">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {article.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{article.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>{article.views} baxış</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-stone-900 dark:text-stone-50 mb-6 text-balance">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 leading-relaxed font-editorial italic border-l-2 border-stone-400 dark:border-stone-600 pl-4 py-1 mb-8">
            {article.excerpt}
          </p>

          {/* Author Byline */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-stone-300 dark:border-stone-700"
              />
              <div>
                <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {article.author.name}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {article.author.role}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => likeArticle(article.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isLiked
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border-rose-200 dark:border-rose-900 font-semibold'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                <span>{article.likes}</span>
              </button>

              <button
                onClick={() => toggleBookmark(article.id)}
                className={`p-2 rounded-lg border transition-all ${
                  isBookmarked
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800'
                }`}
                title="Yadda saxla"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Linki kopyala"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-stone-100 dark:bg-stone-900 mb-10 shadow-sm">
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Prose Body with Dropcap */}
        <div
          ref={contentRef}
          className={`max-w-prose mx-auto text-stone-800 dark:text-stone-200 ${fontSizeClass} space-y-6 font-sans`}
        >
          {article.content.split('\n\n').map((paragraph, idx) => {
            // Heading 3
            if (paragraph.startsWith('### ')) {
              return (
                <h3
                  key={idx}
                  className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 pt-6 pb-2"
                >
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            // Pull Quote
            if (paragraph.startsWith('> ')) {
              return (
                <blockquote
                  key={idx}
                  className="my-8 p-6 border-l-4 border-stone-900 dark:border-amber-400 bg-stone-100/70 dark:bg-stone-900/50 rounded-r-xl font-editorial italic text-xl sm:text-2xl text-stone-900 dark:text-stone-100"
                >
                  {paragraph.replace('> ', '')}
                </blockquote>
              );
            }
            // Ordered / Unordered Lists
            if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').filter((l) => l.trim().startsWith('- '));
              return (
                <ul key={idx} className="my-4 space-y-2 list-disc list-inside text-stone-700 dark:text-stone-300">
                  {items.map((item, itemIdx) => (
                    <li key={itemIdx} className="leading-relaxed">
                      {item.replace(/^- /, '')}
                    </li>
                  ))}
                </ul>
              );
            }
            if (paragraph.includes('\n1. ') || paragraph.startsWith('1. ')) {
              const items = paragraph.split('\n').filter((l) => /^\d+\.\s/.test(l.trim()));
              return (
                <ol key={idx} className="my-4 space-y-2 list-decimal list-inside text-stone-700 dark:text-stone-300">
                  {items.map((item, itemIdx) => (
                    <li key={itemIdx} className="leading-relaxed">
                      {item.replace(/^\d+\.\s/, '')}
                    </li>
                  ))}
                </ol>
              );
            }

            // Standard Paragraph (apply dropcap to first paragraph)
            return (
              <p
                key={idx}
                className={idx === 0 ? 'article-dropcap text-stone-800 dark:text-stone-200' : ''}
              >
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* In-Article Google Ad Slot */}
        <div className="max-w-prose mx-auto my-12">
          <GoogleAdUnit slotType="in-article" />
        </div>

        {/* Tags */}
        <div className="max-w-prose mx-auto pt-6 pb-8 border-t border-stone-200 dark:border-stone-800">
          <p className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-3">Teqlər</p>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Social Share Bar */}
        <div className="max-w-prose mx-auto p-6 bg-stone-100/70 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Bu məqaləni faydalı hesab edirsinizsə, dostlarınızla paylaşın:
            </p>
            <p className="text-xs text-stone-500">Məlumat paylaşıldıqca dəyər qazanır.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareTelegram}
              className="px-3 py-1.5 bg-[#229ED9] text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Telegram
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 bg-[#25D366] text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-stone-800 text-white text-xs font-medium rounded-lg hover:bg-stone-700 transition-colors"
            >
              {copiedLink ? 'Kopyalandı!' : 'Linki Kopyala'}
            </button>
          </div>
        </div>

        {/* Next / Previous Article Navigation */}
        <div className="max-w-prose mx-auto my-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevArticle ? (
            <button
              onClick={() => openArticle(prevArticle)}
              className="p-4 text-left rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors group cursor-pointer"
            >
              <span className="flex items-center gap-1 text-xs font-mono text-stone-500 mb-1">
                <ChevronLeft className="w-3.5 h-3.5" /> Əvvəlki Məqalə
              </span>
              <p className="font-editorial text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-600 transition-colors">
                {prevArticle.title}
              </p>
            </button>
          ) : <div />}

          {nextArticle && (
            <button
              onClick={() => openArticle(nextArticle)}
              className="p-4 text-right rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors group cursor-pointer"
            >
              <span className="flex items-center justify-end gap-1 text-xs font-mono text-stone-500 mb-1">
                Növbəti Məqalə <ChevronRight className="w-3.5 h-3.5" />
              </span>
              <p className="font-editorial text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-600 transition-colors">
                {nextArticle.title}
              </p>
            </button>
          )}
        </div>

        {/* Comments Section */}
        <div className="max-w-prose mx-auto mt-14 pt-8 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <h3 className="font-editorial text-2xl font-bold text-stone-900 dark:text-stone-100">
              Oxucu Fikirləri ({articleComments.length})
            </h3>
          </div>

          {/* Comment Submission Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8 space-y-3">
            <input
              type="text"
              placeholder="Adınız və Soyadınız..."
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
              required
            />
            <textarea
              placeholder="Məqalə haqqında fikrinizi bölüşün..."
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Rəyi Paylaş</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {articleComments.length === 0 ? (
              <p className="text-sm text-stone-500 italic py-4">
                İlk rəy yazan siz olun!
              </p>
            ) : (
              articleComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 rounded-lg bg-stone-100/60 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {comment.authorName}
                    </span>
                    <span className="font-mono text-stone-400">
                      {new Date(comment.createdAt).toLocaleDateString('az-AZ')}
                    </span>
                  </div>
                  <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
