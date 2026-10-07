import React from 'react';
import { useBlog } from '../context/BlogContext';
import { Shield, Github, Twitter, Linkedin, Youtube, Send, Heart } from 'lucide-react';
import { GoogleAdUnit } from './GoogleAdUnit';

export const Footer: React.FC = () => {
  const { siteSettings, setIsAdminOpen, setSelectedCategory } = useBlog();

  const handleCategoryClick = (cat: any) => {
    setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-stone-200 dark:border-stone-800 bg-[#f5f2eb] dark:bg-[#08090a] transition-colors">
      
      {/* Optional Footer Google Ad Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <GoogleAdUnit slotType="footer" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2">
            <span className="font-editorial text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 block mb-3">
              FİKİR & ZƏKA
            </span>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm mb-6">
              {siteSettings.siteDescription}
            </p>
            <div className="flex items-center gap-3 text-stone-600 dark:text-stone-400">
              <a
                href={siteSettings.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-stone-200/60 dark:bg-stone-800/80 rounded-lg hover:text-stone-900 dark:hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-stone-200/60 dark:bg-stone-800/80 rounded-lg hover:text-stone-900 dark:hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-stone-200/60 dark:bg-stone-800/80 rounded-lg hover:text-stone-900 dark:hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks.telegram}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-stone-200/60 dark:bg-stone-800/80 rounded-lg hover:text-stone-900 dark:hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Kateqoriyalar */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-4">
              Bölmələr
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-600 dark:text-stone-400">
              <li>
                <button
                  onClick={() => handleCategoryClick('texnologiya')}
                  className="hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  Texnologiya & AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('sexsi-inkisaf')}
                  className="hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  Şəxsi İnkişaf & Vərdişlər
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('mehsuldarliq')}
                  className="hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  Dərin İş & Məhsuldarlıq
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('innovasiya')}
                  className="hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  Gələcək İdeologiyası
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Resurslar */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-4">
              Resurslar
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-600 dark:text-stone-400">
              <li>
                <a href="#video-gallery" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Video Kitabxana
                </a>
              </li>
              <li>
                <a href="#personal-column" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                  Şəxsi Qeydlər
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-stone-400" />
                  <span>Müəllif & Redaksiya Girişi</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platforma & GitHub */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-4">
              GitHub Pages
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
              Bu portal GitHub Pages vasitəsilə 100% avtomatlaşdırılmış şəkildə yayımlanmağa tam hazırdır.
            </p>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-600 dark:text-amber-400 hover:underline"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Deploy Təlimatına Bax</span>
            </button>
          </div>

        </div>

        {/* Bottom Legal Strip */}
        <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-mono">
          <div className="flex items-center gap-2">
            <span>© 2026 {siteSettings.siteName}. Bütün hüquqlar qorunur.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Google AdSense Uyğun</span>
            <span aria-hidden="true">·</span>
            <span>SEO Optimallaşdırılıb</span>
            <span aria-hidden="true">·</span>
            <span>Müəllif: Camal Mənafov</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
