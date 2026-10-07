import React, { useState } from 'react';
import { Article, CategoryType } from '../../types';
import { X, Save, Image, Eye, Sparkles } from 'lucide-react';

interface ArticleEditorProps {
  initialArticle?: Article | null;
  onSave: (articleData: any) => void;
  onClose: () => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  initialArticle,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [category, setCategory] = useState<CategoryType>(initialArticle?.category || 'texnologiya');
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [coverImage, setCoverImage] = useState(
    initialArticle?.coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
  );
  const [readTimeMinutes, setReadTimeMinutes] = useState(initialArticle?.readTimeMinutes || 5);
  const [authorName, setAuthorName] = useState(initialArticle?.author.name || 'Camal Mənafov');
  const [authorRole, setAuthorRole] = useState(initialArticle?.author.role || 'Təsisçi & Baş Redaktor');
  const [tagsInput, setTagsInput] = useState(initialArticle?.tags.join(', ') || 'Texnologiya, Süni İntellekt');
  const [featured, setFeatured] = useState(initialArticle?.featured || false);
  const [trending, setTrending] = useState(initialArticle?.trending || false);
  const [isPersonalBlog, setIsPersonalBlog] = useState(initialArticle?.isPersonalBlog || false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave({
      title: title.trim(),
      category,
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: coverImage.trim(),
      readTimeMinutes: Number(readTimeMinutes) || 5,
      author: {
        name: authorName.trim(),
        role: authorRole.trim(),
        avatar: initialArticle?.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: initialArticle?.author.bio || 'Müəllif və təhlilçi.',
      },
      tags,
      featured,
      trending,
      isPersonalBlog,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 my-auto">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100">
              {initialArticle ? 'Məqaləni Redaktə Et' : 'Yeni Məqalə Əlavə Et'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3 py-1.5 text-xs font-mono rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1 text-stone-700 dark:text-stone-300"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{previewMode ? 'Redaktor' : 'Önizləmə'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {previewMode ? (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              </div>
              <h1 className="font-editorial text-3xl font-bold text-stone-900 dark:text-stone-100">{title || 'Başlıq'}</h1>
              <p className="text-base italic text-stone-600 dark:text-stone-400 font-editorial border-l-2 border-stone-300 pl-4">{excerpt || 'Qısa xülasə...'}</p>
              <div className="whitespace-pre-line text-stone-800 dark:text-stone-200 text-sm leading-relaxed">{content || 'Məzmun...'}</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Məqalə Başlığı *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Məs: Süni İntellekt və Gələcəyin İnsan Bacarıqları"
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Kateqoriya *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                  >
                    <option value="texnologiya">Texnologiya & AI</option>
                    <option value="sexsi-inkisaf">Şəxsi İnkişaf</option>
                    <option value="mehsuldarliq">Məhsuldarlıq & Dərin İş</option>
                    <option value="felsefe">Fəlsəfə & Stoitsizm</option>
                    <option value="bloq">Şəxsi Bloq Qeydi</option>
                    <option value="innovasiya">Gələcək & İnnovasiya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Qısa Xülasə (Excerpt) *</label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Oxucunun diqqətini çəkəcək 2 cümləlik xülasə..."
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Örtük Şəklinin Keçidi (Cover Image URL)</label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Oxu Vaxtı (Dəq)</label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={readTimeMinutes}
                      onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Müəllif</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Məqalə Mətni (Markdown & Abzaslar) *</label>
                <textarea
                  rows={9}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Məqalənin əsas mətni. Alt başlıqlar üçün '### Başlıq', sitat üçün '> Sitat mətni', siyahılar üçün '- bənd' formatından istifadə edə bilərsiniz."
                  className="w-full px-3 py-2 text-sm font-sans bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">Teqlər (Vergüllə ayırın)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Texnologiya, Süni İntellekt, Fəlsəfə"
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-stone-500 text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 p-3 bg-stone-100/60 dark:bg-stone-950/60 rounded-xl text-xs font-medium">
                <label className="flex items-center gap-2 cursor-pointer text-stone-800 dark:text-stone-200">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span>🌟 Baş Məqalə (Featured Hero)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-stone-800 dark:text-stone-200">
                  <input
                    type="checkbox"
                    checked={trending}
                    onChange={(e) => setTrending(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span>🔥 Trendlərdə Göstər</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-stone-800 dark:text-stone-200">
                  <input
                    type="checkbox"
                    checked={isPersonalBlog}
                    onChange={(e) => setIsPersonalBlog(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <span>✍️ Şəxsi Bloq Bölməsində Yayınla</span>
                </label>
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
          )}
        </div>

      </div>
    </div>
  );
};
