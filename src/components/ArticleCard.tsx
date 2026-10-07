import React from 'react';
import { useBlog } from '../context/BlogContext';
import { Article } from '../types';
import { Clock, Heart, Bookmark, ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  layout?: 'grid' | 'horizontal' | 'compact';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, layout = 'grid' }) => {
  const { openArticle, toggleBookmark, bookmarks, likeArticle, likedArticles } = useBlog();

  const isBookmarked = bookmarks.includes(article.id);
  const isLiked = likedArticles.includes(article.id);

  if (layout === 'horizontal') {
    return (
      <article
        onClick={() => openArticle(article)}
        className="group cursor-pointer flex flex-col sm:flex-row gap-5 p-4 rounded-xl hover:bg-stone-100/60 dark:hover:bg-stone-900/60 transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-800"
      >
        <div className="relative aspect-[16/10] sm:w-56 shrink-0 overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-900">
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2 font-mono">
              <span className="uppercase font-semibold text-stone-800 dark:text-stone-200">
                {article.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>{article.publishedAt}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-stone-600 dark:text-stone-300">
                <Clock className="w-3 h-3" />
                {article.readTimeMinutes} dəq
              </span>
            </div>

            <h3 className="font-editorial text-xl font-bold leading-tight text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors mb-2">
              {article.title}
            </h3>

            <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs text-stone-500">
            <span className="font-medium text-stone-700 dark:text-stone-300">
              {article.author.name}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  likeArticle(article.id);
                }}
                className={`flex items-center gap-1 hover:text-rose-600 transition-colors ${
                  isLiked ? 'text-rose-600 font-semibold' : ''
                }`}
                title="Bəyən"
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600' : ''}`} />
                <span>{article.likes}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(article.id);
                }}
                className={`p-1 hover:text-stone-900 dark:hover:text-white transition-colors ${
                  isBookmarked ? 'text-stone-900 dark:text-white' : ''
                }`}
                title="Yadda saxla"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => openArticle(article)}
      className="group cursor-pointer flex flex-col h-full bg-white dark:bg-stone-900/60 rounded-xl border border-stone-200/80 dark:border-stone-800/80 overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
        <img
          src={article.coverImage}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-stone-950/80 backdrop-blur-md text-white rounded-sm">
            {article.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2 font-mono">
            <span>{article.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTimeMinutes} dəq
            </span>
          </div>

          <h3 className="font-editorial text-lg sm:text-xl font-bold leading-snug text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors mb-2">
            {article.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-700 dark:text-stone-300 truncate max-w-[120px]">
              {article.author.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                likeArticle(article.id);
              }}
              className={`flex items-center gap-1 hover:text-rose-600 transition-colors ${
                isLiked ? 'text-rose-600 font-semibold' : ''
              }`}
              title="Bəyən"
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600' : ''}`} />
              <span>{article.likes}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(article.id);
              }}
              className={`hover:text-stone-900 dark:hover:text-white transition-colors ${
                isBookmarked ? 'text-stone-900 dark:text-white' : ''
              }`}
              title="Yadda saxla"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
