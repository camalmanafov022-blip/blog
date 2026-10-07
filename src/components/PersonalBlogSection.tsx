import React from 'react';
import { useBlog } from '../context/BlogContext';
import { Article } from '../types';
import { BookOpen, Feather, Quote, ArrowRight, Clock, Heart } from 'lucide-react';

export const PersonalBlogSection: React.FC = () => {
  const { articles, openArticle } = useBlog();

  // Filter personal blog essays or reflections
  const personalPosts = articles.filter((a) => a.isPersonalBlog || a.category === 'bloq' || a.category === 'felsefe');

  return (
    <section id="personal-column" className="py-12 bg-stone-100/50 dark:bg-stone-900/30 border-t border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Author Lead Column Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          
          {/* Left Column: Author's Philosophy & Vision */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/30">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Camal Mənafov"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
                  Camal Mənafov
                </h3>
                <p className="text-xs text-stone-500 font-mono">Müəllifin Şəxsi Qeydləri</p>
              </div>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6 italic font-editorial">
              "Bu guşədə texnologiyanın insan həyatına təsiri, şəxsi intizam, stoitsizm prinsipləri və oxuduğum kitablardan çıxardığım ən dəyərli dərsləri heç bir senzura olmadan, səmimi dildə qələmə alıram."
            </p>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-mono text-stone-500">
              <span>Yazılar: {personalPosts.length} ədəd</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">Gündəlik Bloq</span>
            </div>
          </div>

          {/* Right Column: Recent Personal Blog Essays */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-500 flex items-center gap-2">
                <Feather className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                MÜƏLLİF SÜTUNU VƏ DƏRİN DÜŞÜNCƏLƏR
              </span>
            </div>

            {personalPosts.length === 0 ? (
              <p className="text-sm text-stone-500 py-6 italic">
                Hələlik şəxsi bloq qeydi yoxdur. Admin panelindən yeni bloq yazısı əlavə edə bilərsiniz.
              </p>
            ) : (
              personalPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => openArticle(post)}
                  className="group cursor-pointer p-5 bg-white dark:bg-stone-900/80 rounded-xl border border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-all"
                >
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 font-mono">
                    <span className="text-amber-600 dark:text-amber-400 font-semibold uppercase">
                      ŞƏXSİ QEYD
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{post.publishedAt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTimeMinutes} dəq
                    </span>
                  </div>

                  <h4 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2">
                    {post.title}
                  </h4>

                  <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed mb-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800/60">
                    <span className="flex items-center gap-1 text-rose-500">
                      <Heart className="w-3 h-3 fill-current" />
                      {post.likes} bəyənmə
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Qeydi oxu <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
