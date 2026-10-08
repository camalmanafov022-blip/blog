import React, { useState } from 'react';
import { useBlog } from '../../context/BlogContext';
import {
  Download,
  Upload,
  RefreshCw,
  Copy,
  Check,
  FileText,
  Clock,
  Shield,
  Layers,
  Database,
  AlertCircle,
  FileJson,
  Calendar,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';

export const BackupManager: React.FC = () => {
  const {
    articles,
    videos,
    subscribers,
    comments,
    exportDataJSON,
    exportArticlesOnlyJSON,
    exportInitialDataTsCode,
    exportArticlesCSV,
    importDataJSON,
    snapshots,
    createSnapshot,
    restoreSnapshot,
    deleteSnapshot,
    resetToDefaults,
  } = useBlog();

  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [fileAnalysis, setFileAnalysis] = useState<{
    fileName: string;
    fileSize: string;
    articlesCount: number;
    videosCount: number;
    subscribersCount: number;
    exportedAt?: string;
    isValid: boolean;
    error?: string;
  } | null>(null);
  const [restoreMode, setRestoreMode] = useState<'replace' | 'merge'>('replace');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [manualNote, setManualNote] = useState('');
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);

  // Handle file selection and parsing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMessage(null);
    const sizeKB = (file.size / 1024).toFixed(1) + ' KB';

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setSelectedFileContent(text);

      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          setFileAnalysis({
            fileName: file.name,
            fileSize: sizeKB,
            articlesCount: parsed.length,
            videosCount: 0,
            subscribersCount: 0,
            isValid: true,
          });
        } else if (parsed.articles && Array.isArray(parsed.articles)) {
          setFileAnalysis({
            fileName: file.name,
            fileSize: sizeKB,
            articlesCount: parsed.articles.length,
            videosCount: parsed.videos?.length || 0,
            subscribersCount: parsed.subscribers?.length || 0,
            exportedAt: parsed.exportedAt,
            isValid: true,
          });
        } else {
          setFileAnalysis({
            fileName: file.name,
            fileSize: sizeKB,
            articlesCount: 0,
            videosCount: 0,
            subscribersCount: 0,
            isValid: false,
            error: 'Faylda məqalə məlumatları tapılmadı.',
          });
        }
      } catch {
        setFileAnalysis({
          fileName: file.name,
          fileSize: sizeKB,
          articlesCount: 0,
          videosCount: 0,
          subscribersCount: 0,
          isValid: false,
          error: 'JSON sintaksis xətası: Fayl zədələnib.',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleApplyRestore = () => {
    if (!selectedFileContent || !fileAnalysis?.isValid) return;

    const res = importDataJSON(selectedFileContent, restoreMode);
    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: `✓ ${res.message}`,
      });
      setSelectedFileContent(null);
      setFileAnalysis(null);
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message,
      });
    }
  };

  const handleCopyCode = () => {
    const code = exportInitialDataTsCode();
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleDownloadInitialDataTs = () => {
    const code = exportInitialDataTsCode();
    const blob = new Blob([code], { type: 'text/typescript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'initialData.ts';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateManualSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    const note = manualNote.trim() || 'Əl ilə Saxlanan Nüsxə';
    createSnapshot(note);
    setManualNote('');
    setIsCreatingSnapshot(false);
    setStatusMessage({
      type: 'success',
      text: 'Yeni ehtiyat nüsxə uğurla yaradıldı və yadda saxlanıldı!',
    });
  };

  const handleDownloadSnapshotJSON = (snapshotData: string, id: string) => {
    const blob = new Blob([snapshotData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snapshot-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner & Stats Overview */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white border border-stone-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold tracking-tight">
                Məlumat Bazası, Backup & Bərpa Mərkəzi
              </h3>
              <p className="text-xs text-stone-300">
                Əlavə etdiyiniz xəbərləri qoruyun, istənilən vaxt backup yükləyin və ya bərpa edin.
              </p>
            </div>
          </div>

          <button
            onClick={exportDataJSON}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Ən Güncəl Backup-u Yüklə</span>
          </button>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-stone-700/60 text-xs">
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
            <span className="text-stone-400 block text-[11px] font-mono">Cari Məqalələr</span>
            <span className="text-lg font-bold text-white font-mono">{articles.length} xəbər</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
            <span className="text-stone-400 block text-[11px] font-mono">Videolar</span>
            <span className="text-lg font-bold text-white font-mono">{videos.length} video</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
            <span className="text-stone-400 block text-[11px] font-mono">Abunəçilər</span>
            <span className="text-lg font-bold text-white font-mono">{subscribers.length} oxucu</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
            <span className="text-stone-400 block text-[11px] font-mono">Lokal Nüsxələr</span>
            <span className="text-lg font-bold text-amber-400 font-mono">{snapshots.length} nüsxə</span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Grid of Main Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: Export Options */}
        <div className="p-5 bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base mb-1">
              <Download className="w-4 h-4 text-amber-500" />
              <h4>Backup Fayllarını Kompüterə Yüklə</h4>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              İstədiyiniz an ən son xəbərlərinizin və sayt məzmununuzun ehtiyat nüsxəsini yükləyərək saxlayın.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={exportDataJSON}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-amber-400 dark:text-amber-600" />
                <span>Bütün Saytın Tam Backup-u (JSON)</span>
              </span>
              <span className="text-[10px] font-mono opacity-80">Tövsiyə olunur</span>
            </button>

            <button
              onClick={exportArticlesOnlyJSON}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 text-xs font-medium rounded-xl transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-stone-500" />
                <span>Yalnız Məqalələri Yüklə (articles.json)</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400">{articles.length} məqalə</span>
            </button>

            <button
              onClick={exportArticlesCSV}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 text-xs font-medium rounded-xl transition-colors flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Məqalələri CSV (Excel) Kimi İxrac Et</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400">Excel / Cədvəl</span>
            </button>
          </div>
        </div>

        {/* CARD 2: Import & Restore File */}
        <div className="p-5 bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base mb-1">
              <Upload className="w-4 h-4 text-blue-500" />
              <h4>Backup Faylından Saytı Bərpa Et</h4>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Daha əvvəl saxladığınız JSON backup faylını seçərək məqalələri və saytı bərpa edin.
            </p>
          </div>

          <div className="space-y-3">
            {/* File drop zone */}
            <label className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-stone-50 dark:bg-stone-900/50">
              <Upload className="w-6 h-6 text-stone-400 mb-1.5" />
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">
                JSON Backup Faylını Seçin
              </span>
              <span className="text-[10px] font-mono text-stone-400 mt-0.5">
                .json formatında fayl seçin və ya bura atın
              </span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* File Analysis Preview */}
            {fileAnalysis && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2.5 ${
                  fileAnalysis.isValid
                    ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-stone-100 truncate max-w-[200px]">
                    {fileAnalysis.fileName}
                  </span>
                  <span className="font-mono text-[10px] text-stone-500">{fileAnalysis.fileSize}</span>
                </div>

                {fileAnalysis.isValid ? (
                  <>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-stone-600 dark:text-stone-300">
                      <span>📰 {fileAnalysis.articlesCount} məqalə</span>
                      {fileAnalysis.videosCount > 0 && <span>🎥 {fileAnalysis.videosCount} video</span>}
                      {fileAnalysis.subscribersCount > 0 && <span>👥 {fileAnalysis.subscribersCount} abunəçi</span>}
                    </div>

                    {/* Mode selection */}
                    <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 space-y-1.5 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="restoreMode"
                          checked={restoreMode === 'replace'}
                          onChange={() => setRestoreMode('replace')}
                          className="text-amber-500"
                        />
                        <span className="font-medium text-stone-800 dark:text-stone-200">
                          Tam Bərpa (Əvəzləmə)
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="restoreMode"
                          checked={restoreMode === 'merge'}
                          onChange={() => setRestoreMode('merge')}
                          className="text-amber-500"
                        />
                        <span className="font-medium text-stone-800 dark:text-stone-200">
                          Birləşdirmə (Mövcud xəbərləri qoru, yenilərini əlavə et)
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={handleApplyRestore}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Bərpanı Təsdiqlə və Tətbiq Et
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-rose-500">{fileAnalysis.error}</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* CARD 3: Deployment / Static Hosting Solution */}
      <div className="p-5 sm:p-6 bg-stone-100 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg">
              <Shield className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
                GitHub Pages və Statik Hosting üçün Daimi Xəbər Yaddaşı
              </h4>
              <p className="text-xs text-stone-500">
                Bu skripti hostingə yükləyəndə əlavə etdiyiniz məqalələrin bütün yeni ziyarətçilərə daimi görünməsi üçün:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-2 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
            </button>
            <button
              onClick={handleDownloadInitialDataTs}
              className="px-3.5 py-2 bg-stone-900 dark:bg-stone-100 hover:opacity-90 text-white dark:text-stone-900 rounded-xl text-xs font-mono font-bold transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>initialData.ts Endir</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 space-y-2">
          <div className="flex items-start gap-2">
            <span className="font-bold text-amber-500 font-mono">1.</span>
            <span>
              <strong>initialData.ts</strong> faylını endirin və ya yuxarıdakı düymə ilə kodu kopyalayın.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-amber-500 font-mono">2.</span>
            <span>
              Kompüterinizdə layihə qovluğuna keçin və <code className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded font-mono text-[11px]">src/data/initialData.ts</code> faylını bu kodla əvəz edin.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-amber-500 font-mono">3.</span>
            <span>
              GitHub-a göndərin (<code className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded font-mono text-[11px]">git push</code>). Sayt artıq GitHub Pages və istənilən hostingdə sizin əlavə etdiyiniz xəbərlərlə ilkin olaraq açılacaq!
            </span>
          </div>
        </div>
      </div>

      {/* CARD 4: Auto-Snapshots in Browser Storage */}
      <div className="p-5 sm:p-6 bg-white dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h4 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
                Avtomatik Lokal Nüsxələr (Auto-Snapshots)
              </h4>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Hər məqalə əlavə etdikdə və ya dəyişdikdə sistem brauzerdə son 10 ehtiyat nüsxəni saxlayır.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isCreatingSnapshot ? (
              <button
                onClick={() => setIsCreatingSnapshot(true)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>+ İndi Yeni Nüsxə Yarat</span>
              </button>
            ) : (
              <form onSubmit={handleCreateManualSnapshot} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nüsxə üçün başlıq..."
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Saxla
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingSnapshot(false)}
                  className="p-1 text-stone-400 hover:text-stone-600 text-xs"
                >
                  Ləğv
                </button>
              </form>
            )}
          </div>
        </div>

        {snapshots.length === 0 ? (
          <div className="text-center py-6 text-xs text-stone-400 font-mono">
            Hələlik qeydə alınmış nüsxə yoxdur. Xəbər əlavə etdikdə və ya "+ İndi Yeni Nüsxə Yarat" düyməsi ilə avtomatik yaranacaq.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {snapshots.map((snap) => (
              <div
                key={snap.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-stone-50 dark:hover:bg-stone-900/40 px-2 rounded-lg transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-stone-500 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{snap.createdAt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{snap.articlesCount} məqalə</span>
                  </div>
                  <p className="font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                    {snap.note}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (confirm(`"${snap.note}" nüsxəsini bərpa etmək istəyirsiniz?`)) {
                        const ok = restoreSnapshot(snap.id);
                        if (ok) {
                          setStatusMessage({
                            type: 'success',
                            text: 'Nüsxə uğurla bərpa edildi!',
                          });
                        }
                      }
                    }}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-blue-500" />
                    <span>Bərpa Et</span>
                  </button>

                  <button
                    onClick={() => handleDownloadSnapshotJSON(snap.data, snap.id)}
                    className="p-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                    title="Bu nüsxəni JSON kimi endir"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteSnapshot(snap.id)}
                    className="p-1 text-rose-500 hover:text-rose-700"
                    title="Nüsxəni sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CARD 5: Danger Zone */}
      <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-rose-700 dark:text-rose-400 block">
            İlkin Vəziyyətə Qaytar (Zavod Ayarları)
          </span>
          <p className="text-stone-500 dark:text-stone-400 text-[11px]">
            Bütün redaktə etdiyiniz xəbərləri silərək ilk nümayiş məlumatlarına qaytarır (əvvəlcə avtomatik nüsxə saxlanır).
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Bütün xəbərləri ilkin nümayiş vəziyyətinə qaytarmaq istədiyinizdən əminsiniz?')) {
              resetToDefaults();
              setStatusMessage({
                type: 'info',
                text: 'Sayt ilkin vəziyyətinə qaytarıldı. Əvvəlki vəziyyət nüsxələr siyahısında saxlanıldı.',
              });
            }
          }}
          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-mono text-xs font-semibold cursor-pointer shrink-0 transition-colors"
        >
          İlkin Vəziyyətə Sıfırla
        </button>
      </div>
    </div>
  );
};
