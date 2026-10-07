import React from 'react';
import { useBlog } from '../context/BlogContext';
import { Article } from '../types';
import { ArrowUpRight, Clock, Flame, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { articles, openArticle } = useBlog();

  // Find lead article (featured or highest views)
  const leadArticle = articles.find((a) => a.featured) || articles[0];
  const secondaryArticles = articles.filter((a) => a.id !== leadArticle?.id).slice(0, 2);

  if (!leadArticle) return null;

  return (
    <section className="pt-6 pb-12 border-b border-stone-200 dark:border-stone-800">
      {/* Editorial Category Header Ribbon */}
      <div className="flex items-center justify-between text-xs font-mono tracking-widest text-stone-500 dark:text-stone-400 mb-6 uppercase">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-stone-900 dark:bg-stone-100"></span>
          <span>HƏFTƏNİN SEÇİLMİŞ TƏHLİLLƏRİ</span>
          <span aria-hidden="true">·</span>
          <span>BURAXILIŞ № 42</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-stone-400">
          <span>BAKI / RƏQƏMSAL NƏŞR</span>
        </div>
      </div>

      {/* 3-Tier Front-Page Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Tier 1: Lead Story (7 cols) */}
        <div
          onClick={() => openArticle(leadArticle)}
          className="lg:col-span-7 group cursor-pointer"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-900 mb-5">
            <img
              src={leadArticle.coverImage}
              alt={leadArticle.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            
            {/* Top Overlay Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-stone-950/80 backdrop-blur-md text-white rounded-sm border border-white/10">
                {leadArticle.category.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2 font-mono">
            <span>{leadArticle.author.name}</span>
            <span aria-hidden="true">·</span>
            <span>{leadArticle.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-stone-600 dark:text-stone-300 font-medium">
              <Clock className="w-3 h-3" />
              {leadArticle.readTimeMinutes} dəqiqə oxu
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors mb-3">
            {leadArticle.title}
          </h1>

          {/* Excerpt */}
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed mb-4">
            {leadArticle.excerpt}
          </p>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 dark:text-stone-100 group-hover:translate-x-1 transition-transform">
            <span>Məqaləni tam oxu</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>

        {/* Tier 2: Secondary Features (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:border-l lg:border-stone-200 lg:dark:border-stone-800 lg:pl-8">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Trend Məqalələr
            </span>
          </div>

          {secondaryArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => openArticle(article)}
              className="group cursor-pointer flex flex-col sm:flex-row lg:flex-col gap-4 pb-6 border-b border-stone-100 dark:border-stone-850 last:border-0"
            >
              <div className="relative aspect-[16/10] sm:w-44 lg:w-full shrink-0 overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-900">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5 font-mono">
                  <span className="uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                    {article.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTimeMinutes} dəq</span>
                </div>

                <h2 className="font-editorial text-lg sm:text-xl font-bold leading-snug text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors mb-2">
                  {article.title}
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
