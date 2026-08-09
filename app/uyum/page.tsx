'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/lang-context';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';
import { uyumVerisi } from '@/lib/uyum-data';
import { EmailCapture } from '@/components/email-capture';


const sirala: MizacTip[] = ['safravi', 'demevi', 'balgami', 'sevdavi'];

function UyumRengi(puan: number): string {
  if (puan >= 85) return '#16a34a';
  if (puan >= 65) return '#2980b9';
  if (puan >= 50) return '#d97706';
  return '#dc2626';
}

export default function UyumPage() {
  const { lang } = useLang();
  const tr = lang === 'tr';
  const [secilen, setSecilen] = useState<MizacTip | null>(null);

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>

      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#c4973a' }}>
            {tr ? 'Mizaç · İlişki Bilimi' : 'Temperament · Relationship Science'}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {tr ? (
              <>Bu ilişki neden hep<br /><span style={{ color: '#c4973a' }}>aynı noktada takılıyor?</span></>
            ) : (
              <>Why does this relationship<br /><span style={{ color: '#c4973a' }}>always get stuck at the same point?</span></>
            )}
          </h1>
          <p className="text-lg leading-relaxed mb-4" style={{ color: '#9a8060' }}>
            {tr
              ? 'Çünkü iki farklı mizaç, iki farklı dünya. Birinin hızı diğerini yoruyor, birinin sessizliği diğerini endişelendiriyor.'
              : 'Because two different temperaments mean two different worlds. One\'s speed exhausts the other, one\'s silence worries the other.'}
          </p>
          <p className="text-sm" style={{ color: '#6b5230' }}>
            {tr
              ? 'İbn-i Sina geleneği, uyumun şans değil bilim olduğunu söylüyor.'
              : 'Ibn Sina\'s tradition says compatibility is science, not chance.'}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Mizaç seç */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: 'var(--cream)' }}>
          <p className="text-sm font-semibold opacity-60 mb-3 text-center uppercase tracking-wider">
            {tr ? 'Mizacınızı seçin' : 'Select your temperament'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {sirala.map((tip) => {
              const p = mizacProfiller[tip];
              return (
                <button
                  key={tip}
                  onClick={() => setSecilen(secilen === tip ? null : tip)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 border-2"
                  style={{
                    background: secilen === tip ? p.renk : 'white',
                    borderColor: p.renk,
                    color: secilen === tip ? 'white' : p.renk,
                  }}
                >
                  {p.elementSembol} {tr ? p.isim : p.isimEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Uyum kartları */}
        {secilen ? (
          <div>
            <h2 className="text-xl font-bold mb-5" style={{ color: mizacProfiller[secilen].renk }}>
              {mizacProfiller[secilen].elementSembol} {tr ? mizacProfiller[secilen].isim : mizacProfiller[secilen].isimEn}
              {tr ? ' ile Uyum' : ' Compatibility'}
            </h2>
            <div className="space-y-5">
              {sirala.map((diger) => {
                const veri = uyumVerisi[secilen][diger];
                const digerProfil = mizacProfiller[diger];
                const renkHex = UyumRengi(veri.puan);
                return (
                  <div key={diger} className="rounded-2xl p-6"
                    style={{ background: `linear-gradient(135deg, ${digerProfil.renkAcik}, white)` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{digerProfil.elementSembol}</span>
                      <div className="flex-1">
                        <h3 className="font-bold" style={{ color: digerProfil.renk }}>
                          {tr ? digerProfil.isim : digerProfil.isimEn}
                        </h3>
                        <p className="text-xs opacity-50">{tr ? veri.baslik : veri.baslikEn}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold" style={{ color: renkHex }}>%{veri.puan}</div>
                        <div className="h-2 w-20 rounded-full overflow-hidden mt-1" style={{ background: '#e5e7eb' }}>
                          <div className="h-full rounded-full" style={{ width: `${veri.puan}%`, background: renkHex }} />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed opacity-75 mb-3">
                      {tr ? veri.aciklama : veri.aciklamaEn}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-bold text-green-700 mb-1">✓ {tr ? 'Güçlü Yönler' : 'Strengths'}</p>
                        {(tr ? veri.gucler : veri.guclerEn).map((g) => (
                          <p key={g} className="text-xs opacity-70">· {g}</p>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-orange-700 mb-1">△ {tr ? 'Zorluklar' : 'Challenges'}</p>
                        {(tr ? veri.zorluklar : veri.zorluklarEn).map((z) => (
                          <p key={z} className="text-xs opacity-70">· {z}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Genel matris */
          <div>
            <h2 className="text-lg font-bold mb-4 text-center opacity-60">
              {tr ? 'Uyum Haritası' : 'Compatibility Map'}
            </h2>
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--cream)' }}>
              {/* Header */}
              <div className="grid grid-cols-5 border-b" style={{ borderColor: 'var(--gold-light)' }}>
                <div className="p-3" />
                {sirala.map((tip) => {
                  const p = mizacProfiller[tip];
                  return (
                    <div key={tip} className="p-3 text-center">
                      <div className="text-xl">{p.elementSembol}</div>
                      <div className="text-xs font-bold opacity-60">{tr ? p.isim : p.isimEn}</div>
                    </div>
                  );
                })}
              </div>
              {/* Rows */}
              {sirala.map((satir) => {
                const satirProfil = mizacProfiller[satir];
                return (
                  <div key={satir} className="grid grid-cols-5 border-b last:border-0"
                    style={{ borderColor: 'var(--gold-light)' }}>
                    <div className="p-3 flex items-center gap-2">
                      <span className="text-xl">{satirProfil.elementSembol}</span>
                      <span className="text-xs font-bold opacity-60 hidden sm:block">{tr ? satirProfil.isim : satirProfil.isimEn}</span>
                    </div>
                    {sirala.map((sutun) => {
                      const veri = uyumVerisi[satir][sutun];
                      const renkHex = UyumRengi(veri.puan);
                      return (
                        <button
                          key={sutun}
                          onClick={() => setSecilen(satir)}
                          className="p-3 text-center transition-all hover:opacity-80"
                        >
                          <div className="text-sm font-bold" style={{ color: renkHex }}>%{veri.puan}</div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <p className="text-xs opacity-40 text-center mt-3">
              {tr ? 'Detay için mizacınıza tıklayın' : 'Click on your temperament for details'}
            </p>
          </div>
        )}

        {/* Detaylı Karşılaştırmalar */}
        <div className="mt-10 rounded-2xl p-5" style={{ background: 'var(--cream)' }}>
          <h2 className="font-bold text-sm uppercase tracking-widest opacity-50 mb-4 text-center">
            {tr ? 'Detaylı Karşılaştırmalar' : 'Detailed Comparisons'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { slug: 'safravi-vs-balgami', label: '🔥 × 🌊', isim: tr ? 'Safravî × Balgamî' : 'Choleric × Phlegmatic', puan: uyumVerisi.safravi.balgami.puan },
              { slug: 'demevi-vs-sevdavi', label: '💧 × 🌍', isim: tr ? 'Demevî × Sevdavî' : 'Sanguine × Melancholic', puan: uyumVerisi.demevi.sevdavi.puan },
              { slug: 'balgami-vs-sevdavi', label: '🌊 × 🌍', isim: tr ? 'Balgamî × Sevdavî' : 'Phlegmatic × Melancholic', puan: uyumVerisi.balgami.sevdavi.puan },
              { slug: 'safravi-vs-demevi', label: '🔥 × 💧', isim: tr ? 'Safravî × Demevî' : 'Choleric × Sanguine', puan: uyumVerisi.safravi.demevi.puan },
              { slug: 'demevi-vs-balgami', label: '💧 × 🌊', isim: tr ? 'Demevî × Balgamî' : 'Sanguine × Phlegmatic', puan: uyumVerisi.demevi.balgami.puan },
              { slug: 'safravi-vs-sevdavi', label: '🔥 × 🌍', isim: tr ? 'Safravî × Sevdavî' : 'Choleric × Melancholic', puan: uyumVerisi.safravi.sevdavi.puan },
            ].map((item) => (
              <Link
                key={item.slug}
                href={`/karsilastir/${item.slug}`}
                className="flex flex-col items-center text-center rounded-xl p-3 bg-white hover:shadow-sm transition-all border border-stone-100"
              >
                <span className="text-lg mb-1">{item.label}</span>
                <span className="text-xs font-semibold text-stone-600 leading-tight">{item.isim}</span>
                <span className="text-xs font-bold mt-1" style={{ color: UyumRengi(item.puan) }}>%{item.puan}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Email capture */}
        <div className="mt-10">
          <EmailCapture
            title={tr ? 'İlişkinde mizacını kullan' : 'Use temperament in your relationships'}
            subtitle={tr ? 'Her Pazartesi — uyum, iletişim ve denge üzerine. Ücretsiz.' : 'Every Monday — on compatibility, communication and balance. Free.'}
            cta={tr ? 'Gönder' : 'Send'}
          />
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <p className="text-sm opacity-50 mb-4">
            {tr ? 'Kendi mizacını henüz öğrenmedin mi?' : 'Haven\'t discovered your temperament yet?'}
          </p>
          <Link href="/test"
            className="inline-block px-8 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--earth), var(--gold))' }}>
            ✦ {tr ? 'Mizaç Testini Başlat' : 'Start the Temperament Test'}
          </Link>
        </div>
      </div>
    </main>
  );
}
