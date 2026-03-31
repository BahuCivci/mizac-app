'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang-context';

const linkler = {
  mizac: {
    baslik: { tr: 'Mizaç Profilleri', en: 'Temperament Profiles' },
    liste: [
      { href: '/mizaclar', tr: '4 Mizaç Nedir?', en: '4 Temperaments' },
      { href: '/mizaclar/safravi', tr: 'Safravî Mizacı', en: 'Choleric' },
      { href: '/mizaclar/demevi', tr: 'Demevî Mizacı', en: 'Sanguine' },
      { href: '/mizaclar/balgami', tr: 'Balgamî Mizacı', en: 'Phlegmatic' },
      { href: '/mizaclar/sevdavi', tr: 'Sevdavî Mizacı', en: 'Melancholic' },
      { href: '/nur-mizaci', tr: 'Nur Mizacı', en: 'Nur Temperament' },
    ],
  },
  yasam: {
    baslik: { tr: 'Yaşam & Kariyer', en: 'Life & Career' },
    liste: [
      { href: '/uyum', tr: 'Mizaç Uyumu', en: 'Compatibility' },
      { href: '/meslekler', tr: 'Kariyer Rehberi', en: 'Career Guide' },
      { href: '/cocuk-mizaci', tr: 'Çocuk Mizacı', en: "Child's Temperament" },
      { href: '/yas-mizaclari', tr: 'Yaş Mizaçları', en: 'Life Stages' },
      { href: '/dort-halife', tr: 'Dört Halifenin Mizacı', en: 'Four Caliphs' },
      { href: '/tarifler', tr: 'Şifalı Tarifler', en: 'Healing Recipes' },
    ],
  },
  sifa: {
    baslik: { tr: 'Şifa & Sağlık', en: 'Healing & Health' },
    liste: [
      { href: '/hastaliklar', tr: 'Hastalıklar', en: 'Health & Illness' },
      { href: '/esma-sifa', tr: "Esmaü'l-Hüsna", en: 'Divine Names' },
      { href: '/nefes', tr: 'Nefes Egzersizleri', en: 'Breathing' },
      { href: '/gida-kavrami', tr: 'Gıda Kavramı', en: 'Nourishment' },
      { href: '/varligin-mizaci', tr: "Varlığın Mizacı", en: "Nature's Temperament" },
    ],
  },
  kesfet: {
    baslik: { tr: 'Keşfet', en: 'Explore' },
    liste: [
      { href: '/test', tr: 'Mizaç Testi', en: 'Temperament Test' },
      { href: '/hizli-test', tr: 'Hızlı Test (10 Soru)', en: 'Quick Test (10 Q)' },
      { href: '/sss', tr: 'SSS', en: 'FAQ' },
      { href: '/karsilastir/safravi-vs-balgami', tr: 'Karşılaştır', en: 'Compare' },
      { href: '/blog', tr: 'Blog', en: 'Blog' },
      { href: '/hakkinda', tr: 'Hakkında', en: 'About' },
    ],
  },
};

export function Footer() {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <footer
      className="mt-auto border-t pt-12 pb-6 px-6"
      style={{ background: '#1a1207', borderColor: '#3d2c0e' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Logo & Açıklama */}
        <div className="flex flex-col md:flex-row gap-10 mb-10">
          <div className="md:w-1/4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3" style={{ color: '#c4973a' }}>
              <span>✦</span>
              <span style={{ color: '#f5f0e8' }}>Mizaç</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: '#9a8060' }}>
              {tr
                ? 'İbn-i Sina geleneğine dayalı mizaç testi ve yaşam rehberi. Safravî, Demevî, Balgamî ve Sovdavî.'
                : 'Temperament test and life guide based on Ibn Sina tradition. Choleric, Sanguine, Phlegmatic and Melancholic.'}
            </p>
            <Link
              href="/test"
              className="inline-block mt-4 px-5 py-2 rounded-full text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #7c4a1e, #c4973a)', color: 'white' }}
            >
              {tr ? '✦ Testi Başlat' : '✦ Start Test'}
            </Link>
            <a
              href="https://chat.whatsapp.com/mizac"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 px-5 py-2 rounded-full text-sm font-semibold"
              style={{ background: '#25D36622', color: '#25D366', border: '1px solid #25D36640' }}
            >
              💬 {tr ? 'Topluluğa Katıl' : 'Join Community'}
            </a>
          </div>

          {/* Link Grupları */}
          <div className="md:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.values(linkler).map((grup) => (
              <div key={grup.baslik.tr}>
                <h3 className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#c4973a' }}>
                  {tr ? grup.baslik.tr : grup.baslik.en}
                </h3>
                <ul className="space-y-2">
                  {grup.liste.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm transition-colors hover:text-amber-400"
                        style={{ color: '#9a8060' }}
                      >
                        {tr ? link.tr : link.en}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Alt Çizgi */}
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderColor: '#3d2c0e' }}>
          <p className="text-xs" style={{ color: '#6b5230' }}>
            © {new Date().getFullYear()} mizac.xyz — {tr ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
          </p>
          <p className="text-xs" style={{ color: '#6b5230' }}>
            {tr
              ? 'İbn-i Sina geleneğine dayalı · Tıbbi tavsiye değildir'
              : 'Based on Ibn Sina tradition · Not medical advice'}
          </p>
        </div>
      </div>
    </footer>
  );
}
