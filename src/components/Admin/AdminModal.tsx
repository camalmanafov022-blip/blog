import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import { Article, VideoItem } from '../../types';
import { ArticleEditor } from './ArticleEditor';
import { VideoEditor } from './VideoEditor';
import { GitHubDeployGuide } from './GitHubDeployGuide';
import {
  Shield,
  X,
  Plus,
  Edit2,
  Trash2,
  Lock,
  LogOut,
  FileText,
  Video,
  Users,
  DollarSign,
  Settings,
  Github,
  Download,
  Upload,
  RefreshCw,
  Search,
  CheckCircle,
  Eye,
} from 'lucide-react';

export const AdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    authenticateAdmin,
    logoutAdmin,
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    videos,
    addVideo,
    updateVideo,
    deleteVideo,
    subscribers,
    deleteSubscriber,
    adSettings,
    updateAdSettings,
    siteSettings,
    updateSiteSettings,
    resetToDefaults,
    exportDataJSON,
    importDataJSON,
    openArticle,
  } = useBlog();

  const [activeTab, setActiveTab] = useState<'articles' | 'videos' | 'subscribers' | 'ads' | 'settings' | 'github'>('articles');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Editors state
  const [editingArticle, setEditingArticle] = useState<Article | null | 'new'>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null | 'new'>(null);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Local state for settings form
  const [adPubId, setAdPubId] = useState(adSettings.adSensePublisherId);
  const [adEnabled, setAdEnabled] = useState(adSettings.enabled);
  const [adSimMode, setAdSimMode] = useState(adSettings.showSimulationBanner);
  const [adCustomText, setAdCustomText] = useState(adSettings.customBannerText || '');
  const [newAdminPin, setNewAdminPin] = useState(siteSettings.adminPin);
  const [siteName, setSiteName] = useState(siteSettings.siteName);
  const [siteTagline, setSiteTagline] = useState(siteSettings.siteTagline);
  const [siteDesc, setSiteDesc] = useState(siteSettings.siteDescription);

  if (!isAdminOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = authenticateAdmin(pinInput);
    if (success) {
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleSaveAds = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdSettings({
      adSensePublisherId: adPubId,
      enabled: adEnabled,
      showSimulationBanner: adSimMode,
      customBannerText: adCustomText,
    });
    alert('Google Ads parametrləri uğurla yeniləndi!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      siteName,
      siteTagline,
      siteDescription: siteDesc,
      adminPin: newAdminPin || 'admin123',
    });
    alert('Sayt parametrləri uğurla yeniləndi!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importDataJSON(content);
      if (ok) {
        setImportNotice('Məlumatlar uğurla bərpa edildi!');
      } else {
        setImportNotice('Xəta: JSON fayl strukturu düzgün deyil.');
      }
    };
    reader.readAsText(file);
  };

  const exportSubscribersCSV = () => {
    if (subscribers.length === 0) return;
    const header = 'ID,Email,Tezlik,Tarix,Status\n';
    const rows = subscribers
      .map((s) => `"${s.id}","${s.email}","${s.frequency}","${s.subscribedAt}","${s.status}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 my-auto overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-editorial text-lg sm:text-xl font-bold">
                Məzmun və Sistem İdarəetmə Paneli (CMS)
              </h2>
              <p className="text-xs text-stone-400 font-mono">
                {siteSettings.siteName} · Redaksiya Mərkəzi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 text-xs font-mono bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors flex items-center gap-1.5"
                title="Çıxış"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Çıxış</span>
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentication Wall */}
        {!isAdminAuthenticated ? (
          <div className="p-8 max-w-md mx-auto my-auto text-center space-y-6">
            <div className="w-14 h-14 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto text-stone-700 dark:text-stone-300">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-editorial text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                Müəllif Girişi Tələb Olunur
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                Məqalə əlavə etmək, silmək və Google Ads parametrlərini tənzimləmək üçün PIN kodu daxil edin.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="PIN Kod (Standart: admin123)"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (pinError) setPinError(false);
                  }}
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl text-center text-lg tracking-widest font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                />
                {pinError && (
                  <p className="text-xs text-rose-500 mt-2">
                    Daxil edilən PIN yanlışdır. Standart kod: <code className="font-mono">admin123</code>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-sm rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
              >
                İdarəetmə Sisteminə Daxil Ol
              </button>
            </form>

            <p className="text-[11px] font-mono text-stone-400">
              Qeyd: PIN kodu daxil olduqdan sonra Ayarlar tabından dəyişə bilərsiniz.
            </p>
          </div>
        ) : (
          /* Authenticated CMS Dashboard */
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Tabs Bar */}
            <div className="px-4 bg-stone-100 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2 overflow-x-auto text-xs font-medium">
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'articles'
                    ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-bold'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Məqalələr ({articles.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'videos'
                    ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-bold'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Videolar ({videos.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('subscribers')}
                className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'subscribers'
                    ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-bold'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Abunəçilər ({subscribers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('ads')}
                className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'ads'
                    ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-bold'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span>Google Ads Monetizasiya</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-bold'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Ayarlar & Bərpa</span>
              </button>

              <button
                onClick={() => setActiveTab('github')}
                className={`py-3 px-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'github'
                    ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white font-bold'
                    : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Github className="w-4 h-4 text-amber-500" />
                <span>GitHub Pages Deploy</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              
              {/* TAB 1: ARTICLES */}
              {activeTab === 'articles' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100">
                        Bütün Məqalələrin İdarə Edilməsi
                      </h3>
                      <p className="text-xs text-stone-500">Məqalə əlavə edin, redaktə edin və ya silin.</p>
                    </div>
                    <button
                      onClick={() => setEditingArticle('new')}
                      className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yeni Məqalə Əlavə Et</span>
                    </button>
                  </div>

                  <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 dark:bg-stone-950 text-stone-600 dark:text-stone-400 font-mono uppercase">
                        <tr>
                          <th className="p-3">Başlıq & Kateqoriya</th>
                          <th className="p-3 hidden sm:table-cell">Müəllif</th>
                          <th className="p-3 hidden md:table-cell">Tarix</th>
                          <th className="p-3">Statistika</th>
                          <th className="p-3 text-right">Əməliyyatlar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                        {articles.map((art) => (
                          <tr key={art.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                            <td className="p-3">
                              <p className="font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                                {art.title}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500 mt-0.5">
                                <span className="uppercase text-amber-600 dark:text-amber-400 font-semibold">{art.category}</span>
                                {art.featured && <span className="text-emerald-600">★ Baş Məqalə</span>}
                                {art.isPersonalBlog && <span className="text-purple-500">✍ Bloq</span>}
                              </div>
                            </td>
                            <td className="p-3 hidden sm:table-cell">{art.author.name}</td>
                            <td className="p-3 hidden md:table-cell font-mono">{art.publishedAt}</td>
                            <td className="p-3 font-mono text-[11px]">
                              <span>{art.views} baxış</span> · <span>{art.likes} like</span>
                            </td>
                            <td className="p-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setIsAdminOpen(false);
                                    openArticle(art);
                                  }}
                                  className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded"
                                  title="Saytda bax"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingArticle(art)}
                                  className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 rounded"
                                  title="Redaktə et"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`"${art.title}" məqaləsini silmək istədiyinizdən əminsiniz?`)) {
                                      deleteArticle(art.id);
                                    }
                                  }}
                                  className="p-1.5 text-rose-600 hover:text-rose-700 dark:text-rose-400 rounded"
                                  title="Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: VIDEOS */}
              {activeTab === 'videos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100">
                        Video Təhlillərin İdarə Edilməsi
                      </h3>
                      <p className="text-xs text-stone-500">Video dərslər, çıxışlar və analizləri idarə edin.</p>
                    </div>
                    <button
                      onClick={() => setEditingVideo('new')}
                      className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Yeni Video Əlavə Et</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos.map((vid) => (
                      <div
                        key={vid.id}
                        className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-2">
                            <span className="uppercase text-rose-500 font-semibold">{vid.category}</span>
                            <span>{vid.duration}</span>
                          </div>
                          <h4 className="font-editorial text-base font-bold text-stone-900 dark:text-stone-100 mb-1 line-clamp-1">
                            {vid.title}
                          </h4>
                          <p className="text-xs text-stone-500 line-clamp-2 mb-3">{vid.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
                          <span className="text-stone-400 truncate max-w-[160px]">{vid.speaker}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingVideo(vid)}
                              className="p-1 text-blue-600 hover:text-blue-700"
                              title="Redaktə et"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`"${vid.title}" videosunu silmək istəyirsiniz?`)) {
                                  deleteVideo(vid.id);
                                }
                              }}
                              className="p-1 text-rose-600 hover:text-rose-700"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SUBSCRIBERS */}
              {activeTab === 'subscribers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100">
                        E-Bülleten Abunəçiləri
                      </h3>
                      <p className="text-xs text-stone-500">Saytınızdan qeydiyyatdan keçən oxucuların siyahısı.</p>
                    </div>
                    <button
                      onClick={exportSubscribersCSV}
                      className="px-3.5 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>CSV İxrac Et</span>
                    </button>
                  </div>

                  <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 dark:bg-stone-950 text-stone-600 dark:text-stone-400 font-mono uppercase">
                        <tr>
                          <th className="p-3">E-poçt Ünvanı</th>
                          <th className="p-3">Tezlik</th>
                          <th className="p-3">Qeydiyyat Tarixi</th>
                          <th className="p-3 text-right">Əməliyyat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:divide-stone-800 text-stone-800 dark:text-stone-200">
                        {subscribers.map((sub) => (
                          <tr key={sub.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50">
                            <td className="p-3 font-medium text-stone-900 dark:text-stone-100">{sub.email}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-stone-200 dark:bg-stone-800 rounded text-[10px] font-mono uppercase">
                                {sub.frequency}
                              </span>
                            </td>
                            <td className="p-3 font-mono">{sub.subscribedAt}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => deleteSubscriber(sub.id)}
                                className="p-1 text-rose-500 hover:text-rose-700"
                                title="Abunəçini sil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: GOOGLE ADS MONETIZATION */}
              {activeTab === 'ads' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100">
                      Google AdSense Reklam & Gəlir Tənzimləmələri
                    </h3>
                    <p className="text-xs text-stone-500">
                      Google AdSense hesabınızı bağlayaraq saytınızdan gəlir əldə edin.
                    </p>
                  </div>

                  <form onSubmit={handleSaveAds} className="space-y-4">
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={adEnabled}
                          onChange={(e) => setAdEnabled(e.target.checked)}
                          className="w-4 h-4 text-amber-500 rounded focus:ring-0"
                        />
                        <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          Reklam Şəbəkəsini Aktiv Et (Monetizasiya)
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={adSimMode}
                          onChange={(e) => setAdSimMode(e.target.checked)}
                          className="w-4 h-4 text-amber-500 rounded focus:ring-0"
                        />
                        <span className="text-xs text-stone-700 dark:text-stone-300">
                          Önizləmə / Test Reklam Rejimi (AdSense təsdiqinə qədər vizual placeholder göstərir)
                        </span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                        Google AdSense Publisher ID
                      </label>
                      <input
                        type="text"
                        value={adPubId}
                        onChange={(e) => setAdPubId(e.target.value)}
                        placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                        className="w-full px-3 py-2 text-sm font-mono bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                        Test Banner Başlıq Mətni
                      </label>
                      <input
                        type="text"
                        value={adCustomText}
                        onChange={(e) => setAdCustomText(e.target.value)}
                        placeholder="Google Reklam Alanı (Google AdSense)"
                        className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Reklam Parametrlərini Yadda Saxla
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: SETTINGS & BACKUP */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100">
                      Sayt Başlığı, Təhlükəsizlik və Məlumatların İxracı/İdxalı
                    </h3>
                    <p className="text-xs text-stone-500">Məlumat bazasını qoruyun və tənzimləyin.</p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                          Saytın Adı
                        </label>
                        <input
                          type="text"
                          value={siteName}
                          onChange={(e) => setSiteName(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                          Admin PIN Kodu
                        </label>
                        <input
                          type="text"
                          value={newAdminPin}
                          onChange={(e) => setNewAdminPin(e.target.value)}
                          placeholder="admin123"
                          className="w-full px-3 py-2 text-sm font-mono bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                        Saytın Şüarı (Tagline)
                      </label>
                      <input
                        type="text"
                        value={siteTagline}
                        onChange={(e) => setSiteTagline(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-stone-500 mb-1">
                        Təsvir (Description)
                      </label>
                      <textarea
                        rows={2}
                        value={siteDesc}
                        onChange={(e) => setSiteDesc(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold rounded-lg hover:opacity-90"
                    >
                      Ayarları Yadda Saxla
                    </button>
                  </form>

                  {/* Backup & Restore */}
                  <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
                    <h4 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
                      Məlumatların Backup & Bərpa Edilməsi
                    </h4>
                    
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={exportDataJSON}
                        className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-mono hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        <span>Bütün Məlumatları JSON Kimi Yüklə</span>
                      </button>

                      <label className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-mono hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>JSON Faylından Bərpa Et</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      <button
                        onClick={() => {
                          if (confirm('Bütün məlumatları ilkin vəziyyətinə qaytarmaq istəyirsiniz?')) {
                            resetToDefaults();
                          }
                        }}
                        className="px-4 py-2 border border-rose-300 dark:border-rose-900 text-rose-600 rounded-lg text-xs font-mono hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>İlkin Vəziyyətə Qaytar (Reset)</span>
                      </button>
                    </div>

                    {importNotice && (
                      <p className="text-xs text-amber-600 font-mono mt-2">{importNotice}</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: GITHUB PAGES */}
              {activeTab === 'github' && <GitHubDeployGuide />}

            </div>

          </div>
        )}

      </div>

      {/* Child Editors */}
      {editingArticle && (
        <ArticleEditor
          initialArticle={editingArticle === 'new' ? null : editingArticle}
          onSave={(data) => {
            if (editingArticle === 'new') {
              addArticle(data);
            } else {
              updateArticle(editingArticle.id, data);
            }
            setEditingArticle(null);
          }}
          onClose={() => setEditingArticle(null)}
        />
      )}

      {editingVideo && (
        <VideoEditor
          initialVideo={editingVideo === 'new' ? null : editingVideo}
          onSave={(data) => {
            if (editingVideo === 'new') {
              addVideo(data);
            } else {
              updateVideo(editingVideo.id, data);
            }
            setEditingVideo(null);
          }}
          onClose={() => setEditingVideo(null)}
        />
      )}
    </div>
  );
};
