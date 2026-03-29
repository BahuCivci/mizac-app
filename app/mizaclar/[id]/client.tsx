'use client';

import Link from 'next/link';
import { MizacProfil, MizacTip } from '@/lib/mizac-data';
import { useLang } from '@/lib/lang-context';

const kariyerVerisi: Record<MizacTip, { meslekler: string[]; mesleklerEn: string[]; kariyer: string; kariyerEn: string }> = {
  safravi: {
    meslekler: ['Girişimci', 'Yönetici / CEO', 'Avukat', 'Sporcu', 'Politikacı', 'Cerrah'],
    mesleklerEn: ['Entrepreneur', 'Executive / CEO', 'Lawyer', 'Athlete', 'Politician', 'Surgeon'],
    kariyer: 'Safravî mizaçlılar liderlik gerektiren pozisyonlarda parlıyor. Hızlı karar verme yetenekleri ve yüksek enerjileriyle zorlu ortamlarda öne çıkarlar. Rekabeti severler ve meydan okumalar onları daha da motive eder.',
    kariyerEn: 'Cholerics shine in positions requiring leadership. Their quick decision-making and high energy help them stand out in challenging environments. They love competition and challenges motivate them even more.',
  },
  demevi: {
    meslekler: ['Satış / Pazarlama', 'Öğretmen', 'Aktör / Sunucu', 'Tasarımcı', 'Gazeteci', 'Halkla İlişkiler'],
    mesleklerEn: ['Sales / Marketing', 'Teacher', 'Actor / Presenter', 'Designer', 'Journalist', 'Public Relations'],
    kariyer: 'Demevî mizaçlılar insanlarla iletişim gerektiren alanlarda başarıya ulaşır. Yaratıcılıkları ve sosyal yetenekleri onları ekip çalışmalarında değerli kılar. Rutinden sıkıldıkları için çeşitlilik sunan işler idealdir.',
    kariyerEn: 'Sanguines succeed in fields requiring communication. Their creativity and social skills make them valuable in teamwork. Since they get bored with routine, jobs offering variety are ideal.',
  },
  balgami: {
    meslekler: ['Doktor / Hemşire', 'Terapist / Danışman', 'Muhasebeci', 'Mühendis', 'Diplomat', 'Öğretmen'],
    mesleklerEn: ['Doctor / Nurse', 'Therapist / Counselor', 'Accountant', 'Engineer', 'Diplomat', 'Teacher'],
    kariyer: 'Balgamî mizaçlılar sabır ve süreklilik gerektiren işlerde mükemmelleşir. İnsanlara yardım etmekten zevk alırlar ve uzun vadeli projelerde güvenilir bir ortak olurlar. Stresli ortamlarda dahi sakin kalmayı başarırlar.',
    kariyerEn: 'Phlegmatics excel in jobs requiring patience and consistency. They enjoy helping people and become reliable partners in long-term projects. They manage to stay calm even in stressful environments.',
  },
  sevdavi: {
    meslekler: ['Yazar / Şair', 'Araştırmacı / Bilim İnsanı', 'Mimar', 'Müzisyen', 'Felsefeci', 'Analist'],
    mesleklerEn: ['Writer / Poet', 'Researcher / Scientist', 'Architect', 'Musician', 'Philosopher', 'Analyst'],
    kariyer: 'Sevdavî mizaçlılar derinlik ve anlam arayışıyla öne çıkan işlerde başarılıdır. Analitik düşünce yapıları ve mükemmeliyetçilikleri araştırma ve yaratıcı alanlarda onları vazgeçilmez kılar.',
    kariyerEn: 'Melancholics excel in work that demands depth and meaning. Their analytical thinking and perfectionism make them indispensable in research and creative fields.',
  },
};

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
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h3 className="font-bold mb-2" style={{ color: 'var(--earth)' }}>
            {tr ? '💛 İlişki Uyumu' : '💛 Relationship Compatibility'}
          </h3>
          <p className="text-sm leading-relaxed opacity-80">
            {tr ? profil.iliski : profil.iliskiEn}
          </p>
        </div>

        {/* Kariyer */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h3 className="font-bold mb-3" style={{ color: 'var(--earth)' }}>
            {tr ? '💼 Kariyer ve Meslek' : '💼 Career & Profession'}
          </h3>
          <p className="text-sm leading-relaxed opacity-80 mb-4">
            {tr ? kariyerVerisi[profil.id].kariyer : kariyerVerisi[profil.id].kariyerEn}
          </p>
          <div className="flex flex-wrap gap-2">
            {(tr ? kariyerVerisi[profil.id].meslekler : kariyerVerisi[profil.id].mesleklerEn).map((m) => (
              <span
                key={m}
                className="text-sm px-3 py-1 rounded-full font-medium text-white"
                style={{ background: profil.renk + 'cc' }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Fiziksel Özellikler */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h3 className="font-bold mb-3" style={{ color: 'var(--earth)' }}>
            {tr ? '🪞 Fiziksel Özellikler' : '🪞 Physical Characteristics'}
          </h3>
          <ul className="space-y-2">
            {(tr ? profil.fiziksel : profil.fizikselEn).map((f) => (
              <li key={f} className="text-sm flex gap-2 opacity-80">
                <span style={{ color: profil.renk }}>·</span> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Yasak ve Detoks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-6" style={{ background: '#fef9f0' }}>
            <h3 className="font-bold mb-3" style={{ color: '#b45309' }}>
              {tr ? '🚫 Kaçınılacak Gıdalar' : '🚫 Foods to Avoid'}
            </h3>
            <ul className="space-y-1">
              {(tr ? profil.yasak : profil.yasakEn).map((y) => (
                <li key={y} className="text-sm opacity-80">· {y}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-6" style={{ background: '#f0fdf4' }}>
            <h3 className="font-bold mb-3 text-green-700">
              {tr ? '🌿 Detoks Kürleri' : '🌿 Detox Cures'}
            </h3>
            <ul className="space-y-1">
              {(tr ? profil.detoks : profil.detoksEn).map((d) => (
                <li key={d} className="text-sm opacity-80">· {d}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sevgi Dili + Halife */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-6" style={{ background: 'var(--cream)' }}>
            <h3 className="font-bold mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? '💝 Sevgi Dili' : '💝 Love Language'}
            </h3>
            <p className="text-sm leading-relaxed opacity-80">
              {tr ? profil.sevgiDili : profil.sevgiDiliEn}
            </p>
          </div>
          <div className="rounded-2xl p-6" style={{ background: 'var(--cream)' }}>
            <h3 className="font-bold mb-2" style={{ color: 'var(--earth)' }}>
              {tr ? '🌙 Halife Örneği' : '🌙 Companion Example'}
            </h3>
            <p className="text-sm leading-relaxed opacity-80">
              {tr ? profil.halife : profil.halifeEn}
            </p>
          </div>
        </div>

        {/* Renk Önerileri */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--cream)' }}>
          <h3 className="font-bold mb-4" style={{ color: 'var(--earth)' }}>
            {tr ? '🎨 Renk Önerileri' : '🎨 Color Recommendations'}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wider">
                {tr ? '✓ Önerilen' : '✓ Recommended'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(tr ? profil.renkOnerilir : profil.renkOnerilirEn).map((r) => (
                  <span key={r} className="text-xs px-2 py-1 rounded-full bg-white border border-green-200 text-green-800">{r}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wider">
                {tr ? '✗ Önerilmeyen' : '✗ Not Recommended'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(tr ? profil.renkOnerilmez : profil.renkOnerilmezEn).map((r) => (
                  <span key={r} className="text-xs px-2 py-1 rounded-full bg-white border border-red-200 text-red-800">{r}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mevsim/Vakit + Esmalar */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'var(--cream)' }}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold opacity-50 mb-1 uppercase tracking-wider">{tr ? 'Dikkat Edilecek Mevsim' : 'Season to Watch'}</p>
              <p className="text-sm font-medium" style={{ color: profil.renk }}>{tr ? profil.mevsim : profil.mevsimEn}</p>
            </div>
            <div>
              <p className="text-xs font-semibold opacity-50 mb-1 uppercase tracking-wider">{tr ? 'Güçlü Vakit' : 'Peak Time'}</p>
              <p className="text-sm font-medium" style={{ color: profil.renk }}>{tr ? profil.vakit : profil.vakitEn}</p>
            </div>
          </div>
          <h3 className="font-bold mb-3" style={{ color: 'var(--earth)' }}>
            {tr ? '📿 Esmâü\'l-Hüsnâ Önerileri' : '📿 Recommended Divine Names'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {profil.esmalar.map((e) => (
              <span
                key={e}
                className="text-sm px-3 py-1 rounded-full font-medium"
                style={{ background: profil.renkAcik, color: profil.renk }}
              >
                {e}
              </span>
            ))}
          </div>
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
