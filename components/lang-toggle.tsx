'use client';

import { useLang } from '@/lib/lang-context';

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      className="fixed top-4 right-4 z-50 flex rounded-full overflow-hidden text-sm font-semibold"
      style={{ border: '1.5px solid var(--gold)' }}
    >
      <button
        onClick={() => setLang('tr')}
        className="px-3 py-1.5 transition-all"
        style={{
          background: lang === 'tr' ? 'var(--gold)' : 'white',
          color: lang === 'tr' ? 'white' : 'var(--earth)',
        }}
      >
        TR
      </button>
      <button
        onClick={() => setLang('en')}
        className="px-3 py-1.5 transition-all"
        style={{
          background: lang === 'en' ? 'var(--gold)' : 'white',
          color: lang === 'en' ? 'white' : 'var(--earth)',
        }}
      >
        EN
      </button>
    </div>
  );
}
