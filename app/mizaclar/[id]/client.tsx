'use client';

import Link from 'next/link';
import { MizacProfil } from '@/lib/mizac-data';
import { useLang } from '@/lib/lang-context';

export default function MizacDetayClient({ profil }: { profil: MizacProfil }) {
  const { lang } = useLang();
  const tr = lang === 'tr';

  return (
    <main className="min-h-screen px-4 py-16" style={{ background: 'var(--background)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Hero */}
        <div
          className="rounded-3xl p-10 text-center mb-8"
          style={{ background: `linear-gradient(135deg, ${profil.renkAcik}, white)` }}
        >
          <div className="text-7xl mb-4">{profil.elementSembol}</div>
          <h1 className="text-5xl font-bold mb-1" style={{ color: profil.renk }}>
            {tr ? profil.isim : profil.isimEn}
          </h1>
          <p className="text-xl opacity-50 mb-2">{tr ? profil.isimEn : profil.isim}</p>
          <div className="flex justify-center gap-4 text-sm opacity-60 mb-6">
            <span>{tr ? 'Element' : 'Element'}: <strong>{tr ? profil.element : profil.elementEn}</strong></span>
            <span>·</span>
            <span>{profil.sicaklik} & {profil.nem}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {(tr ? profil.anahtarKelimeler : profil.anahtarKelimelerEn).map((k) => (
              <span key={k} className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ background: profil.renk }}>
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* Açıklama */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h2 className="font-bold text-lg mb-3" style={{ color: 'var(--earth)' }}>
            {tr ? 'Mizaç Özellikleri' : 'Temperament Traits'}
          </h2>
          <p className="leading-relaxed opacity-80">
            {tr ? profil.uzunAciklama : profil.uzunAciklamaEn}
          </p>
        </div>

        {/* Güçlü / Zayıf */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-6" style={{ background: '#f0fdf4' }}>
            <h3 className="font-bold mb-3 text-green-700">{tr ? '✓ Güçlü Yönler' : '✓ Strengths'}</h3>
            <ul className="space-y-2">
              {(tr ? profil.gucluYonler : profil.gucluYonlerEn).map((y) => (
                <li key={y} className="text-sm flex gap-2">
                  <span className="text-green-500">·</span> {y}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-6" style={{ background: '#fff7ed' }}>
            <h3 className="font-bold mb-3 text-orange-700">{tr ? '△ Gelişim Alanları' : '△ Areas for Growth'}</h3>
            <ul className="space-y-2">
              {(tr ? profil.zayifYonler : profil.zayifYonlerEn).map((y) => (
                <li key={y} className="text-sm flex gap-2">
                  <span className="text-orange-400">·</span> {y}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sağlık */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h3 className="font-bold mb-3" style={{ color: 'var(--earth)' }}>
            {tr ? '⚕ Sağlık Eğilimleri' : '⚕ Health Tendencies'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(tr ? profil.saglikEgilimleri : profil.saglikEgilimleriEn).map((s) => (
              <span key={s} className="text-sm px-3 py-1 rounded-full bg-white border"
                style={{ borderColor: 'var(--gold-light)' }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Beslenme */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h3 className="font-bold mb-3" style={{ color: 'var(--earth)' }}>
            {tr ? '🍃 Beslenme Tavsiyeleri' : '🍃 Nutrition Tips'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(tr ? profil.beslenme : profil.beslenmeEn).map((b) => (
              <span key={b} className="text-sm px-3 py-1 rounded-full bg-white border"
                style={{ borderColor: 'var(--gold-light)' }}>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* İlişki */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--cream)' }}>
          <h3 className="font-bold mb-2" style={{ color: 'var(--earth)' }}>
            {tr ? '💛 İlişki Uyumu' : '💛 Relationship Compatibility'}
          </h3>
          <p className="text-sm leading-relaxed opacity-80">
            {tr ? profil.iliski : profil.iliskiEn}
          </p>
        </div>

        {/* Nav */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/test"
            className="text-center px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
            style={{ background: profil.renk }}>
            {tr ? 'Testi Başlat' : 'Start the Test'}
          </Link>
          <Link href="/mizaclar"
            className="text-center px-6 py-3 rounded-full font-semibold border-2 transition-all hover:scale-105"
            style={{ borderColor: 'var(--gold)', color: 'var(--earth)' }}>
            {tr ? '← Tüm Mizaçlar' : '← All Temperaments'}
          </Link>
        </div>
      </div>
    </main>
  );
}
