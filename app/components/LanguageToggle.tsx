'use client';

import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
        className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 font-semibold px-4 py-2 rounded-full shadow-lg transition-all border border-purple-200 hover:border-purple-400"
      >
        {language === 'ko' ? '🇺🇸 EN' : '🇰🇷 KO'}
      </button>
    </div>
  );
}
