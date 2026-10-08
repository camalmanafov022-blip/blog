import React, { useState, useEffect } from 'react';
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
import { CategoryType, Article } from './types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  Bookmark,
  Clock,
  ArrowRight,
  Flame,
  BookOpen,
  Mail,
  Check,
  CheckCircle2,
  Share2,
  Compass,
  Cpu,
  Layers,
  Zap,
  Eye,
  Heart,
  Quote,
  Radio,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    articles,
    activeArticle,
    closeArticle,
    openArticle,
    selectedCategory,
    setSelectedCategory,
    bookmarks,
    likeArticle,
    likedArticles,
    toggleBookmark,
    subscribeNewsletter,
  } = useBlog();

  const [filterView, setFilterView] = useState<'all' | 'bookmarks'>('all');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [sidebarEmail, setSidebarEmail] = useState('');
  const [sidebarSubSuccess, setSidebarSubSuccess] = useState(false);

  // Cycling breaking news ticker
  useEffect(() => {
    if (articles.length === 0) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % articles.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [articles.length]);

  // Filter articles based on selected category or bookmark view
  const filteredArticles = articles.filter((article) => {
    if (filterView === 'bookmarks') {
      return bookmarks.includes(article.id);
    }
    if (selectedCategory === 'all') return true;
    return article.category === selectedCategory;
  });

  // Top 5 Trending articles sorted by views
  const trendingTop5 = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  // Editor's picks / Personal blog articles
  const editorsPicks = articles.filter((a) => a.isPersonalBlog || a.featured).slice(0, 3);

  const categories: { id: CategoryType | 'all'; label: string }[] = [
    { id: 'all', label: 'Bütün Mövzular' },
    { id: 'texnologiya', label: 'Texnologiya & AI' },
    { id: 'sexsi-inkisaf', label: 'Şəxsi İnkişaf' },
    { id: 'mehsuldarliq', label: 'Məhsuldarlıq' },
    { id: 'felsefe', label: 'Fəlsəfə & Stoitsizm' },
    { id: 'innovasiya', label: 'Gələcək Trendlər' },
  ];

  const popularTags = [
    '#Süniİntellekt',
    '#Məhsuldarlıq',
    '#Stoitsizm',
    '#KvantTexnologiyası',
    '#FikirVəZəka',
    '#Gələcək',
    '#KitabTəhlilləri',
    '#Karyera',
  ];

  const handleSidebarSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sidebarEmail.trim()) return;
    const res = subscribeNewsletter(sidebarEmail, 'all');
    if (res.success) {
      setSidebarSubSuccess(true);
      setSidebarEmail('');
      setTimeout(() => setSidebarSubSuccess(false), 4000);
    }
  };

  const tickerArticle = articles[tickerIndex] || articles[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#0c0d0e] text-[#1a1c1e] dark:text-[#e4e6eb] transition-colors duration-200">
      
      <Header />

      {/* Main Container with id="main-content" matching CSS selectors */}
      <main id="main-content" className="flex-1">
        <AnimatePresence mode="wait">
          {activeArticle ? (
            <ArticleReader
              key={activeArticle.id}
              article={activeArticle}
              onClose={closeArticle}
            />
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Top Leaderboard Google Ad Banner */}
              <div className="pt-3">
                <GoogleAdUnit slotType="header" />
              </div>

              {/* DIV 1: Breaking News Ticker & Rivax Digimag Hero Spotlight */}
              <div className="mt-3 space-y-6">
                
                {/* Rivax Digimag Breaking News Ticker Strip */}
                {tickerArticle && (
                  <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 rounded-xl p-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="px-2.5 py-1 bg-rose-600 text-white text-[11px] font-mono font-bold uppercase rounded-md tracking-wider flex items-center gap-1.5 shrink-0 shadow-xs">
                        <Radio className="w-3 h-3 animate-pulse" />
                        <span>FLAŞ XƏBƏR</span>
                      </div>

                      <div
                        onClick={() => openArticle(tickerArticle)}
                        className="truncate cursor-pointer group flex items-center gap-2"
                      >
                        <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
                          {tickerArticle.title}
                        </span>
                        <span className="hidden md:inline text-[11px] font-mono text-stone-400 shrink-0">
                          ({tickerArticle.readTimeMinutes} dəq oxu)
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-stone-400 shrink-0 border-l border-stone-200 dark:border-stone-800 pl-3">
                      <span>{new Date().toLocaleDateString('az-AZ', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>·</span>
                      <span className="text-stone-600 dark:text-stone-300 font-semibold">Bakı 21°C</span>
                    </div>
                  </div>
                )}

                {/* Editorial Hero Frontpage */}
                {selectedCategory === 'all' && filterView === 'all' && (
                  <HeroSection />
                )}
              </div>

              {/* DIV 2: 3-Column Magazine Layout matching user's exact CSS selectors */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-8 relative">
                
                {/* ASIDE 1 (Left Sticky Sidebar): Redaktorun Seçimi & Mövzular */}
                <aside className="lg:col-span-3 hidden xl:block sticky top-20 self-start space-y-6 max-h-[calc(100vh-5.5rem)] overflow-y-auto no-scrollbar">
                  
                  {/* Left Widget 1: Müəllifin Qeydləri / Redaksiya Sütunu */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                      <Quote className="w-4 h-4 text-amber-500" />
                      <h4 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100">
                        Redaktorun Qeydi
                      </h4>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 font-editorial italic leading-relaxed">
                      "Texnologiya sürətlə inkişaf etsə də, dərin düşüncə və daxili sakitlik insan zəkasının ən böyük gücüdür."
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                        FZ
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-900 dark:text-stone-100">Fikir & Zəka</p>
                        <p className="text-[10px] text-stone-500 font-mono">Baş Redaktor</p>
                      </div>
                    </div>
                  </div>

                  {/* Left Widget 2: Seçilmiş Şəxsi Bloq Yazıları */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                      <span className="text-xs font-mono uppercase tracking-wider font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                        Seçilmiş Yazılar
                      </span>
                    </div>

                    <div className="space-y-3.5 divide-y divide-stone-100 dark:divide-stone-800/80">
                      {editorsPicks.map((art) => (
                        <div
                          key={art.id}
                          onClick={() => openArticle(art)}
                          className="pt-3 first:pt-0 group cursor-pointer space-y-1"
                        >
                          <span className="text-[10px] font-mono uppercase text-purple-600 dark:text-purple-400 font-semibold">
                            {art.category}
                          </span>
                          <h5 className="font-editorial text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
                            {art.title}
                          </h5>
                          <span className="text-[11px] font-mono text-stone-400 block">
                            {art.publishedAt} · {art.readTimeMinutes} dəq
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Left Widget 3: Populyar Teqlər Buludu */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
                    <span className="text-xs font-mono uppercase tracking-wider font-bold text-stone-700 dark:text-stone-300 block">
                      Trend Teqlər
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {popularTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedCategory('all');
                            setFilterView('all');
                          }}
                          className="px-2.5 py-1 text-[11px] font-mono bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 rounded-md transition-colors cursor-pointer"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                </aside>

                {/* CENTER CONTENT: Main Feed & Category Filters */}
                <div className="col-span-12 xl:col-span-6 lg:col-span-8 space-y-6 min-w-0">
                  
                  {/* Clean Filter Bar */}
                  <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
                          {filterView === 'bookmarks' ? 'Yadda Saxlanan Məqalələr' : 'Son Təhlillər & Məqalələr'}
                        </h3>
                      </div>

                      {/* Bookmark Toggle */}
                      <button
                        onClick={() => setFilterView(filterView === 'bookmarks' ? 'all' : 'bookmarks')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          filterView === 'bookmarks'
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400 font-bold'
                            : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${filterView === 'bookmarks' ? 'fill-current' : ''}`} />
                        <span>Saxlananlar ({bookmarks.length})</span>
                      </button>
                    </div>

                    {/* Category Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setFilterView('all');
                            setSelectedCategory(cat.id);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                            selectedCategory === cat.id && filterView === 'all'
                              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-750'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Articles Feed */}
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
                        className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-lg cursor-pointer"
                      >
                        Bütün Məqalələrə Qayıt
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {filteredArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  )}

                </div>

                {/* ASIDE 2 (Right Sticky Sidebar): Matching CSS selector 2 & 3 */}
                <aside className="col-span-12 xl:col-span-3 lg:col-span-4 sticky top-20 self-start space-y-6 max-h-[calc(100vh-5.5rem)] overflow-y-auto no-scrollbar">
                  
                  {/* DIV 1 of ASIDE 2: Matching selector 'aside:nth-of-type(2) > div:nth-of-type(1)' */}
                  {/* Top 5 Trending Stories with ranked metallic counters */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                      <span className="text-xs font-mono uppercase tracking-wider font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-amber-500" />
                        Ən Çox Oxunanlar
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">TOP 5</span>
                    </div>

                    <div className="space-y-4 divide-y divide-stone-100 dark:divide-stone-800/80">
                      {trendingTop5.map((article, idx) => (
                        <div
                          key={article.id}
                          onClick={() => openArticle(article)}
                          className="pt-3 first:pt-0 group cursor-pointer flex items-start gap-3.5"
                        >
                          {/* Numbered Ranked Counter */}
                          <div className="shrink-0 w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:bg-amber-500 group-hover:text-stone-950 text-stone-800 dark:text-stone-200 font-mono font-bold text-sm flex items-center justify-center transition-colors shadow-xs">
                            0{idx + 1}
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <h5 className="font-editorial text-sm font-bold leading-snug text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                              {article.title}
                            </h5>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400">
                              <span className="uppercase text-amber-600 dark:text-amber-400 font-semibold">{article.category}</span>
                              <span>·</span>
                              <span>{article.views} baxış</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DIV 2 of ASIDE 2: Matching selector 'aside:nth-of-type(2) > div:nth-of-type(2)' */}
                  {/* Google AdSense Widget & Compact Newsletter */}
                  <div className="space-y-6">
                    {/* Google AdSense 300x250 Banner */}
                    <div className="p-1 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
                      <GoogleAdUnit slotType="sidebar" />
                    </div>

                    {/* Compact E-Bülleten Box */}
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 text-white border border-stone-800 shadow-md space-y-3">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Mail className="w-4 h-4" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider">Həftəlik Bülleten</span>
                      </div>

                      <h4 className="font-editorial text-base font-bold leading-tight">
                        Ən yaxşı məqalələri birbaşa e-poçtunuza alın.
                      </h4>

                      <p className="text-[11px] text-stone-400 leading-relaxed">
                        Hər həftə yeni texnologiya xülasələri və şəxsi inkişaf analizləri.
                      </p>

                      {sidebarSubSuccess ? (
                        <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Uğurla abunə oldunuz!</span>
                        </div>
                      ) : (
                        <form onSubmit={handleSidebarSubscribe} className="space-y-2 pt-1">
                          <input
                            type="email"
                            required
                            placeholder="E-poçt ünvanınız..."
                            value={sidebarEmail}
                            onChange={(e) => setSidebarEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-800/90 border border-stone-700 rounded-lg text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono"
                          />
                          <button
                            type="submit"
                            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Abunə Ol
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                </aside>

              </div>

              {/* Maraqlı Videolar Bölməsi */}
              <VideoSection />

              {/* Müəllif Sütunu & Şəxsi Bloq Bölməsi */}
              <PersonalBlogSection />

              {/* Geniş E-Bülleten Abunəlik Bölməsi */}
              <NewsletterSection />

            </div>
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
