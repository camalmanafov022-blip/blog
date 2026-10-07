import React, { useState } from 'react';
import { useBlog } from '../context/BlogContext';
import { Mail, CheckCircle2, Sparkles, Send, BellRing } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { subscribeNewsletter } = useBlog();
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'breaking' | 'all'>('weekly');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = subscribeNewsletter(email, frequency);
    if (result.success) {
      setStatus({ type: 'success', message: result.message });
      setEmail('');
    } else {
      setStatus({ type: 'error', message: result.message });
    }
  };

  return (
    <section className="py-16 my-8 bg-stone-900 text-stone-100 rounded-3xl relative overflow-hidden shadow-xl border border-stone-800">
      
      {/* Subtle Glow Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        
        {/* Unboxed Header */}
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-3">
          <BellRing className="w-3.5 h-3.5" />
          <span>FİKİR & ZƏKA E-BÜLLETEN</span>
        </div>

        <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-balance">
          Hər həftə ən dəyərli texnoloji təhlillər və şəxsi inkişaf fəlsəfəsi poçtunuzda.
        </h2>

        <p className="text-stone-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          Spam yoxdur. Sadəcə diqqətlə seçilmiş məqalələr, qısa kitab xülasələri və gələcəyə yön verən ideyalar. İstənilən vaxt tək kliklə abunəlikdən çıxa bilərsiniz.
        </p>

        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
          
          {/* Frequency Choice */}
          <div className="flex items-center justify-center gap-2 p-1 bg-stone-800/80 rounded-xl max-w-sm mx-auto text-xs font-medium">
            <button
              type="button"
              onClick={() => setFrequency('weekly')}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                frequency === 'weekly'
                  ? 'bg-stone-700 text-white font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Həftəlik Xülasə
            </button>
            <button
              type="button"
              onClick={() => setFrequency('all')}
              className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                frequency === 'all'
                  ? 'bg-stone-700 text-white font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Bütün Yazılar
            </button>
          </div>

          {/* Email input & Submit button */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="E-poçt ünvanınızı daxil edin..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status.type !== 'idle') setStatus({ type: 'idle', message: '' });
                }}
                required
                className="w-full pl-11 pr-4 py-3 bg-stone-800/90 border border-stone-700 rounded-xl text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-amber-400 text-stone-950 font-bold text-sm rounded-xl hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md active:scale-98"
            >
              <span>Abunə Ol</span>
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Status Message */}
          {status.type === 'success' && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{status.message}</span>
            </div>
          )}

          {status.type === 'error' && (
            <div className="p-3 bg-rose-950/70 border border-rose-800 text-rose-300 text-xs rounded-xl">
              <span>{status.message}</span>
            </div>
          )}
        </form>

        <div className="mt-6 text-xs text-stone-500 font-mono flex items-center justify-center gap-2">
          <span>🔒 Məxfiliyiniz qorunur</span>
          <span aria-hidden="true">·</span>
          <span>Pulsuz və limitsiz</span>
        </div>

      </div>
    </section>
  );
};
