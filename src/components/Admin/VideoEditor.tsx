import React, { useState } from 'react';
import { VideoItem, CategoryType } from '../../types';
import { X, Save, Video, Sparkles } from 'lucide-react';

interface VideoEditorProps {
  initialVideo?: VideoItem | null;
  onSave: (videoData: any) => void;
  onClose: () => void;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({
  initialVideo,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialVideo?.title || '');
  const [description, setDescription] = useState(initialVideo?.description || '');
  const [youtubeId, setYoutubeId] = useState(initialVideo?.youtubeId || '');
  const [duration, setDuration] = useState(initialVideo?.duration || '12:30');
  const [category, setCategory] = useState<CategoryType>(initialVideo?.category || 'texnologiya');
  const [speaker, setSpeaker] = useState(initialVideo?.speaker || 'Məruzəçi təhlili');
  const [thumbnail, setThumbnail] = useState(
    initialVideo?.thumbnail || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
  );
  const [takeawaysInput, setTakeawaysInput] = useState(
    initialVideo?.keyTakeaways.join('\n') ||
      'Əsas nəticə 1\nƏsas nəticə 2\nƏsas nəticə 3'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !youtubeId.trim()) return;

    // Clean YouTube ID if full URL was pasted
    let cleanYoutubeId = youtubeId.trim();
    if (cleanYoutubeId.includes('youtube.com/watch?v=')) {
      cleanYoutubeId = cleanYoutubeId.split('watch?v=')[1].split('&')[0];
    } else if (cleanYoutubeId.includes('youtu.be/')) {
      cleanYoutubeId = cleanYoutubeId.split('youtu.be/')[1].split('?')[0];
    }

    const keyTakeaways = takeawaysInput
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave({
      title: title.trim(),
      description: description.trim(),
      youtubeId: cleanYoutubeId,
      duration: duration.trim(),
      category,
      speaker: speaker.trim(),
      thumbnail: thumbnail.trim(),
      keyTakeaways,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-rose-500" />
            <span className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100">
              {initialVideo ? 'Videonı Redaktə Et' : 'Yeni Video Əlavə Et'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Video Başlığı *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Məs: Kvant Hesablamaları Necə İşləyir?"
              className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                YouTube ID və ya Link *
              </label>
              <input
                type="text"
                required
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                placeholder="Məs: p3JLaF_4Tz8 və ya link"
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                Kateqoriya
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
              >
                <option value="texnologiya">Texnologiya & AI</option>
                <option value="sexsi-inkisaf">Şəxsi İnkişaf</option>
                <option value="mehsuldarliq">Məhsuldarlıq</option>
                <option value="felsefe">Fəlsəfə</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                Məruzəçi / Mənbə
              </label>
              <input
                type="text"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="Məs: Sam Altman təhlili"
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                Müddət (Məs: 15:40)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="15:40"
                className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Önizləmə Şəkli (Thumbnail URL)
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Video Təsviri
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Video haqqında qısa təhlil..."
              className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
              Əsas Nəticələr & Qeydlər (Hər sətrə bir bənd)
            </label>
            <textarea
              rows={3}
              value={takeawaysInput}
              onChange={(e) => setTakeawaysInput(e.target.value)}
              placeholder="Birinci qeyd&#10;İkinci qeyd&#10;Üçüncü qeyd"
              className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            >
              Ləğv Et
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg hover:opacity-90 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Yadda Saxla</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
