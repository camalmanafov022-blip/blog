import React from 'react';
import { useBlog } from '../context/BlogContext';

interface GoogleAdUnitProps {
  slotType: 'header' | 'in-article' | 'sidebar' | 'footer';
  className?: string;
}

export const GoogleAdUnit: React.FC<GoogleAdUnitProps> = ({ slotType, className = '' }) => {
  const { adSettings } = useBlog();

  if (!adSettings.enabled) {
    return null;
  }

  const slotConfig = {
    header: {
      slotId: adSettings.headerSlotId,
      format: '728x90 / Responsive Leaderboard',
      height: 'min-h-[90px] md:min-h-[100px]',
      label: 'Sponsorlu Məzmun · Google Ads',
    },
    'in-article': {
      slotId: adSettings.articleSlotId,
      format: 'Məqalə Daxili Banner (In-Article Responsive)',
      height: 'min-h-[140px]',
      label: 'Tövsiyə Edilən Reklam · Google AdSense',
    },
    sidebar: {
      slotId: adSettings.sidebarSlotId,
      format: '300x250 / 300x600 Display Ad',
      height: 'min-h-[250px]',
      label: 'Partnyor Təklifləri · Reklam',
    },
    footer: {
      slotId: adSettings.footerSlotId,
      format: 'Responsive Multiplex Banner',
      height: 'min-h-[100px]',
      label: 'Google Reklam Şəbəkəsi',
    },
  }[slotType];

  return (
    <div className={`my-6 w-full ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1.5 px-1">
        <span>{slotConfig.label}</span>
        <span>ID: {slotConfig.slotId}</span>
      </div>

      {adSettings.showSimulationBanner ? (
        <div className={`w-full ${slotConfig.height} border border-dashed border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/40 rounded-lg flex flex-col items-center justify-center p-4 text-center transition-all hover:border-stone-400 dark:hover:border-stone-700`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500/80"></span>
            <p className="text-xs font-medium text-stone-700 dark:text-stone-300">
              {adSettings.customBannerText || 'Google AdSense Reklam Yeri'}
            </p>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 max-w-md">
            Format: {slotConfig.format} (Monetizasiya aktivdir. Admin panelindən real AdSense Publisher ID: <code className="font-mono text-[10px] text-stone-600 dark:text-stone-300">{adSettings.adSensePublisherId}</code> konfiqurasiya edilə bilər).
          </p>
        </div>
      ) : (
        /* Real AdSense Container */
        <div className={`w-full ${slotConfig.height} overflow-hidden flex items-center justify-center`}>
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-client={adSettings.adSensePublisherId}
            data-ad-slot={slotConfig.slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      )}
    </div>
  );
};
