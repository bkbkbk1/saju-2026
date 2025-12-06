'use client';

import { useLanguage } from '@/lib/LanguageContext';
import LanguageToggle from './components/LanguageToggle';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <LanguageToggle />
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t.home.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t.home.subtitle}
          </p>

          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 mb-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {t.home.description}
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="font-semibold text-gray-800">{t.home.wealth.title}</h3>
                <p className="text-gray-600 text-sm">{t.home.wealth.desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <h3 className="font-semibold text-gray-800">{t.home.career.title}</h3>
                <p className="text-gray-600 text-sm">{t.home.career.desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💚</span>
              <div>
                <h3 className="font-semibold text-gray-800">{t.home.health.title}</h3>
                <p className="text-gray-600 text-sm">{t.home.health.desc}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-3">
              {t.home.cta}
            </p>
            <a
              href="/fortune"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-8 py-3 rounded-full hover:shadow-lg transition-all"
            >
              {t.home.button}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
