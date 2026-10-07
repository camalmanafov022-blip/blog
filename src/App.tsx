import React, { useState } from 'react';
import { BlogProvider, useBlog } from './context/BlogContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ArticleCard } from './components/ArticleCard';
import { ArticleReader } from './components/ArticleReader';
import { VideoSection } from './components/VideoSection';
import { PersonalBlogSection } from './components/PersonalBlogSection';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AdminModal } from './components/Admin/AdminModal';
import { GoogleAdUnit } from './components/GoogleAdUnit';
import { CategoryType } from './types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  Bookmark,
  Layers,
  Cpu,
  Compass,
  Zap,
  BookOpen,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    articles,
    activeArticle,
    closeArticle,
    selectedCategory,
    setSelectedCategory,
    bookmarks,
  } = useBlog();

  const [filterView, setFilterView] = useState<'all' | 'bookmarks'>('all');

  // Filter articles based on selected category or bookmark view
  const filteredArticles = articles.filter((article) => {
    if (filterView === 'bookmarks') {
      return bookmarks.includes(article.id);
    }
    if (selectedCategory === 'all') return true;
    return article.category === selectedCategory;
  });

  const categories: { id: CategoryType | 'all'; label: string; icon?: any }[] = [
    { id: 'all', label: 'Bütün Mövzular' },
    { id: 'texnologiya', label: 'Texnologiya & AI' },
    { id: 'sexsi-inkisaf', label: 'Şəxsi İnkişaf' },
    { id: 'mehsuldarliq', label: 'Məhsuldarlıq' },
    { id: 'felsefe', label: 'Fəlsəfə & Stoitsizm' },
    { id: 'innovasiya', label: 'Gələcək Trendlər' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#0c0d0e] text-[#1a1c1e] dark:text-[#e4e6eb] transition-colors duration-200">
      
      <Header />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeArticle ? (
            <ArticleReader
              key={activeArticle.id}
              article={activeArticle}
              onClose={closeArticle}
            />
          ) : (
            <motion.div
              key="main-feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
              {/* Top Leaderboard Google Ad */}
              <GoogleAdUnit slotType="header" />

              {/* Editorial Hero (Lead story & trending highlights) */}
              {selectedCategory === 'all' && filterView === 'all' && (
                <HeroSection />
              )}

              {/* Articles Feed Section */}
              <section id="articles-feed" className="py-10">
                
                {/* Clean Segmented Filter Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800 mb-8">
                  
                  {/* Category Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-medium no-scrollbar">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setFilterView('all');
                          setSelectedCategory(cat.id);
                        }}
                        className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                          selectedCategory === cat.id && filterView === 'all'
                            ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Bookmark Filter Toggle */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => setFilterView(filterView === 'bookmarks' ? 'all' : 'bookmarks')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        filterView === 'bookmarks'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 font-bold'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${filterView === 'bookmarks' ? 'fill-current' : ''}`} />
                      <span>Saxlananlar ({bookmarks.length})</span>
                    </button>
                  </div>

                </div>

                {/* Article Grid */}
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
                    <p className="font-editorial text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">
                      Məqalə tapılmadı
                    </p>
                    <p className="text-xs text-stone-500 mb-4">
                      {filterView === 'bookmarks'
                        ? 'Hələ heç bir məqaləni yadda saxlamamısınız.'
                        : 'Bu kateqoriyada hələlik məqalə yoxdur.'}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setFilterView('all');
                      }}
                      className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-lg"
                    >
                      Bütün Məqalələrə Qayıt
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {filteredArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                )}

              </section>

              {/* Maraqlı Videolar Bölməsi */}
              <VideoSection />

              {/* Müəllif Sütunu & Şəxsi Bloq Bölməsi */}
              <PersonalBlogSection />

              {/* E-Bülleten Abunəlik Sistemi */}
              <NewsletterSection />

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Modals */}
      <SearchModal />
      <AdminModal />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BlogProvider>
      <MainContent />
    </BlogProvider>
  );
}
