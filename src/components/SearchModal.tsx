import React, { useState, useEffect, useRef } from 'react';
import { useBlog } from '../context/BlogContext';
import { Search, X, Clock, ArrowRight, BookOpen, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CategoryType } from '../types';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    articles,
    videos,
    openArticle,
    openVideo,
  } = useBlog();

  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on modal open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Global shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search in articles
  const matchedArticles = articles.filter((art) => {
    const matchesCat = filterCategory === 'all' || art.category === filterCategory;
    if (!matchesCat) return false;
    if (!cleanQuery) return true;
    return (
      art.title.toLowerCase().includes(cleanQuery) ||
      art.excerpt.toLowerCase().includes(cleanQuery) ||
      art.author.name.toLowerCase().includes(cleanQuery) ||
      art.tags.some((t) => t.toLowerCase().includes(cleanQuery))
    );
  });

  // Search in videos
  const matchedVideos = videos.filter((vid) => {
    const matchesCat = filterCategory === 'all' || vid.category === filterCategory;
    if (!matchesCat) return false;
    if (!cleanQuery) return true;
    return (
      vid.title.toLowerCase().includes(cleanQuery) ||
      vid.description.toLowerCase().includes(cleanQuery) ||
      vid.speaker.toLowerCase().includes(cleanQuery)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Məqalə, mövzu, video və ya teq axtarın..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-base sm:text-lg text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-xs font-mono bg-stone-100 dark:bg-stone-800 text-stone-500 rounded hover:bg-stone-200 dark:hover:bg-stone-700"
          >
            ESC
          </button>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="px-4 py-2 bg-stone-50 dark:bg-stone-950/50 border-b border-stone-200 dark:border-stone-800/80 flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Hamısı
          </button>
          <button
            onClick={() => setFilterCategory('texnologiya')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              filterCategory === 'texnologiya'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Texnologiya
          </button>
          <button
            onClick={() => setFilterCategory('sexsi-inkisaf')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              filterCategory === 'sexsi-inkisaf'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Şəxsi İnkişaf
          </button>
          <button
            onClick={() => setFilterCategory('mehsuldarliq')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              filterCategory === 'mehsuldarliq'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            Məhsuldarlıq
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          
          {/* Article Results */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Məqalələr ({matchedArticles.length})</span>
            </div>

            {matchedArticles.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-2">Uyğun məqalə tapılmadı.</p>
            ) : (
              <div className="space-y-1.5">
                {matchedArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      openArticle(article);
                    }}
                    className="w-full p-3 rounded-lg text-left hover:bg-stone-100 dark:hover:bg-stone-800/70 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="pr-4">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 mb-1">
                        <span className="uppercase text-amber-600 dark:text-amber-400 font-semibold">
                          {article.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{article.readTimeMinutes} dəq oxu</span>
                      </div>
                      <p className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                        {article.title}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Video Results */}
          {matchedVideos.length > 0 && (
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400 uppercase tracking-wider mb-2">
                <Video className="w-3.5 h-3.5" />
                <span>Videolar ({matchedVideos.length})</span>
              </div>

              <div className="space-y-1.5">
                {matchedVideos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      openVideo(video);
                    }}
                    className="w-full p-3 rounded-lg text-left hover:bg-stone-100 dark:hover:bg-stone-800/70 transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="pr-4">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 mb-1">
                        <span className="uppercase text-rose-500 font-semibold">
                          {video.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{video.duration}</span>
                      </div>
                      <p className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-rose-500 transition-colors line-clamp-1">
                        {video.title}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
