import React from 'react';
import { useBlog } from '../context/BlogContext';
import { Search, Moon, Sun, Shield, Bookmark, Video, BookOpen, Sparkles } from 'lucide-react';
import { CategoryType } from '../types';

interface HeaderProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateSection }) => {
  const {
    theme,
    toggleTheme,
    setIsSearchOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    bookmarks,
    selectedCategory,
    setSelectedCategory,
    closeArticle,
    closeVideo,
  } = useBlog();

  const handleNavClick = (category: CategoryType | 'all', sectionId?: string) => {
    closeArticle();
    closeVideo();
    setSelectedCategory(category);
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    if (onNavigateSection && sectionId) {
      onNavigateSection(sectionId);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#faf8f5]/90 dark:bg-[#0c0d0e]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element Brand Zone */}
        <button
          onClick={() => handleNavClick('all')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-editorial text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
            FİKİR & ZƏKA
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-300">
          <button
            onClick={() => handleNavClick('all', 'articles-feed')}
            className={`cursor-pointer transition-colors hover:text-stone-900 dark:hover:text-white ${
              selectedCategory === 'all' ? 'text-stone-900 dark:text-white font-semibold' : ''
            }`}
          >
            Bütün Məqalələr
          </button>
          <button
            onClick={() => handleNavClick('texnologiya', 'articles-feed')}
            className={`cursor-pointer transition-colors hover:text-stone-900 dark:hover:text-white ${
              selectedCategory === 'texnologiya' ? 'text-stone-900 dark:text-white font-semibold' : ''
            }`}
          >
            Texnologiya
          </button>
          <button
            onClick={() => handleNavClick('sexsi-inkisaf', 'articles-feed')}
            className={`cursor-pointer transition-colors hover:text-stone-900 dark:hover:text-white ${
              selectedCategory === 'sexsi-inkisaf' ? 'text-stone-900 dark:text-white font-semibold' : ''
            }`}
          >
            Şəxsi İnkişaf
          </button>
          <button
            onClick={() => handleNavClick('all', 'video-gallery')}
            className="cursor-pointer transition-colors hover:text-stone-900 dark:hover:text-white flex items-center gap-1.5"
          >
            <Video className="w-3.5 h-3.5 opacity-70" />
            <span>Videolar</span>
          </button>
          <button
            onClick={() => handleNavClick('bloq', 'personal-column')}
            className="cursor-pointer transition-colors hover:text-stone-900 dark:hover:text-white flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 opacity-70" />
            <span>Şəxsi Bloq</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Instant Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/60 rounded-md transition-colors flex items-center gap-2 text-xs font-mono"
            title="Axtarış (Cmd+K)"
            aria-label="Axtarış"
          >
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline text-stone-400 dark:text-stone-500 border border-stone-300 dark:border-stone-700 px-1.5 py-0.5 rounded text-[10px]">
              ⌘K
            </span>
          </button>

          {/* Bookmarks counter */}
          {bookmarks.length > 0 && (
            <button
              onClick={() => handleNavClick('all', 'articles-feed')}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/60 rounded-md transition-colors relative"
              title="Yadda saxlanılanlar"
              aria-label="Yadda saxlanılanlar"
            >
              <Bookmark className="w-4 h-4 fill-stone-400/40" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                {bookmarks.length}
              </span>
            </button>
          )}

          {/* Dark/Light mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/60 rounded-md transition-colors"
            title={theme === 'dark' ? 'İşıqlı rejimə keç' : 'Qaranlıq rejimə keç'}
            aria-label="Rejimi dəyiş"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700" />
            )}
          </button>

          {/* Admin CMS Button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              isAdminAuthenticated
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200'
            }`}
            title="Məzmun İdarəetmə Paneli (Admin)"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isAdminAuthenticated ? 'Admin Panel' : 'İdarəetmə'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
