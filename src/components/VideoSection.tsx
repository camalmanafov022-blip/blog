import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { VideoItem } from '../types';
import { Play, Clock, Sparkles, X, User, ExternalLink, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const VideoSection: React.FC = () => {
  const { videos, activeVideo, openVideo, closeVideo } = useBlog();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredVideos = selectedFilter === 'all'
    ? videos
    : videos.filter((v) => v.category === selectedFilter);

  return (
    <section id="video-gallery" className="py-12 border-t border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-widest mb-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>MARAQLI VİDEO TƏHLİLLƏR & ESSELƏR</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              Texnologiya və Şəxsi İnkişaf Video Klubu
            </h2>
          </div>

          {/* Clean Segmented Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 dark:bg-stone-800/80 rounded-lg text-xs font-medium">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Hamısı ({videos.length})
            </button>
            <button
              onClick={() => setSelectedFilter('texnologiya')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedFilter === 'texnologiya'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Texnologiya
            </button>
            <button
              onClick={() => setSelectedFilter('sexsi-inkisaf')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                selectedFilter === 'sexsi-inkisaf'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Şəxsi İnkişaf
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => openVideo(video)}
              className="group cursor-pointer bg-white dark:bg-stone-900/60 rounded-xl border border-stone-200/80 dark:border-stone-800/80 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Thumbnail with Play Overlay */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-950">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md flex items-center justify-center text-stone-900 dark:text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-white text-[10px] font-mono rounded">
                  {video.duration}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-mono">
                    <span className="uppercase font-semibold text-stone-800 dark:text-stone-200">
                      {video.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{video.publishedAt}</span>
                  </div>

                  <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2 leading-snug">
                    {video.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed mb-4">
                    {video.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1 truncate max-w-[180px]">
                    <User className="w-3 h-3 opacity-70" />
                    {video.speaker}
                  </span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 group-hover:translate-x-0.5 transition-transform">
                    İzlə &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-900 text-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-800"
            >
              {/* Modal Top Bar */}
              <div className="p-4 bg-stone-950 flex items-center justify-between border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <p className="text-sm font-bold truncate max-w-md">
                    {activeVideo.title}
                  </p>
                </div>
                <button
                  onClick={closeVideo}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Responsive Video Embed */}
              <div className="relative aspect-[16/9] w-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Video Takeaways & Notes */}
              <div className="p-6 bg-stone-900 max-h-60 overflow-y-auto">
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-stone-400">
                  <span>Məruzəçi: {activeVideo.speaker}</span>
                  <span>Müddət: {activeVideo.duration}</span>
                </div>

                <p className="text-sm text-stone-300 leading-relaxed mb-4">
                  {activeVideo.description}
                </p>

                {activeVideo.keyTakeaways && activeVideo.keyTakeaways.length > 0 && (
                  <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700">
                    <p className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Əsas Nəticələr & Qeydlər
                    </p>
                    <ul className="space-y-1.5 text-xs text-stone-200">
                      {activeVideo.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
