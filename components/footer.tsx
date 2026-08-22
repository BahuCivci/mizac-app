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
      { href: '/hiltlar', tr: 'Dört Hılt', en: 'Four Humors' },
      { href: '/bitkiler', tr: 'Şifalı Bitkiler', en: 'Medicinal Herbs' },
      { href: '/hastaliklar', tr: 'Hastalıklar', en: 'Health & Illness' },
      { href: '/organ-duygu', tr: 'Organ & Duygu', en: 'Organ & Emotion' },
      { href: '/nefes', tr: 'Nefes Egzersizleri', en: 'Breathing' },
      { href: '/varligin-mizaci', tr: "Varlığın Mizacı", en: "Nature's Temperament" },
      { href: '/esma-sifa', tr: 'Esma ile Şifa', en: 'Healing with Names' },
      { href: '/gida-kavrami', tr: 'Gıda Kavramı', en: 'Food Concept' },
    ],
  },
  islami: {
    baslik: { tr: 'İslam & Mizaç', en: 'Islam & Temperament' },
    liste: [
      { href: '/peygamber-mizaci', tr: 'Hz. Peygamber\'in Mizacı', en: 'The Prophet\'s Temperament' },
      { href: '/namaz-mizac', tr: 'Namaz & Mizaç', en: 'Prayer & Temperament' },
      { href: '/ruya-mizac', tr: 'Rüya & Mizaç', en: 'Dreams & Temperament' },
      { href: '/mevsim-mizac', tr: 'Mevsim & Mizaç', en: 'Seasons & Temperament' },
      { href: '/muzik-mizac', tr: 'Müzik & Mizaç', en: 'Music & Temperament' },
      { href: '/koku-mizac', tr: 'Koku & Mizaç', en: 'Scent & Temperament' },
    ],
  },
  kesfet: {
    baslik: { tr: 'Keşfet', en: 'Explore' },
    liste: [
      { href: '/test', tr: 'Mizaç Testi', en: 'Temperament Test' },
      { href: '/hizli-test', tr: 'Hızlı Test (10 Soru)', en: 'Quick Test (10 Q)' },
      { href: '/danisman', tr: 'Mizaç Danışmanı (Sohbet)', en: 'Temperament Consultant (Chat)' },
      { href: '/sss', tr: 'SSS', en: 'FAQ' },
      { href: '/karsilastir', tr: 'Mizaç Uyumu', en: 'Compatibility' },
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
              href="https://chat.whatsapp.com/JgAiXSGm0wW7z0pQERCaaI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-5 py-2 rounded-full text-sm font-semibold"
              style={{ background: '#25D366', color: 'white' }}
            >
              💬 {tr ? 'Topluluğa Katıl' : 'Join Community'}
            </a>
          </div>

          {/* Link Grupları */}
          <div className="md:w-3/4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
          <div className="flex gap-4 text-xs" style={{ color: '#6b5230' }}>
            <Link href="/gizlilik" className="hover:text-amber-600 transition-colors">
              {tr ? 'Gizlilik Politikası' : 'Privacy Policy'}
            </Link>
            <span>·</span>
            <span>{tr ? 'İbn-i Sina geleneğine dayalı · Tıbbi tavsiye değildir' : 'Not medical advice'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
