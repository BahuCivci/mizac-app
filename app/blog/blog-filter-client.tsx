'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';

type Yazi = {
  slug: string;
  baslik: string;
  ozet: string;
  etiketler: string[];
  okumaSuresi: number;
  tarih: string;
  ilgiliMizac?: string;
};

const MIZACLAR: { id: MizacTip | 'hepsi'; etiket: string; sembol: string }[] = [
  { id: 'hepsi', etiket: 'Tümü', sembol: '✦' },
  { id: 'safravi', etiket: 'Safravî', sembol: '🔥' },
  { id: 'demevi', etiket: 'Demevî', sembol: '💨' },
  { id: 'balgami', etiket: 'Balgamî', sembol: '💧' },
  { id: 'sevdavi', etiket: 'Sevdavî', sembol: '🌍' },
];

export function BlogFilter({ yazilar }: { yazilar: Yazi[] }) {
  const [aktif, setAktif] = useState<MizacTip | 'hepsi'>('hepsi');

  const filtrelenmis = aktif === 'hepsi'
    ? yazilar
    : yazilar.filter((y) => y.ilgiliMizac === aktif);

  return (
    <>
      {/* Filtre butonları */}
      <div className="flex flex-wrap gap-2 mb-8">
        {MIZACLAR.map(({ id, etiket, sembol }) => {
          const profil = id !== 'hepsi' ? mizacProfiller[id] : null;
          const isActive = aktif === id;
          return (
            <button
              key={id}
              onClick={() => setAktif(id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
              style={{
                background: isActive ? (profil?.renk ?? '#c4973a') : 'var(--cream)',
                color: isActive ? 'white' : 'var(--earth)',
                border: `1.5px solid ${isActive ? (profil?.renk ?? '#c4973a') : 'var(--gold-light)'}`,
              }}
            >
              <span>{sembol}</span>
              <span>{etiket}</span>
            </button>
          );
        })}
      </div>

      {/* Yazı listesi */}
      <div className="space-y-5">
        {filtrelenmis.length === 0 && (
          <p className="text-center opacity-50 py-8">Bu mizaç için henüz yazı yok.</p>
        )}
        {filtrelenmis.map((yazi) => {
          const profil = yazi.ilgiliMizac ? mizacProfiller[yazi.ilgiliMizac as MizacTip] : null;
          return (
            <Link
              key={yazi.slug}
              href={`/blog/${yazi.slug}`}
              className="group flex gap-4 rounded-2xl p-6 border transition-all hover:scale-[1.01] hover:shadow-lg"
              style={{
                background: profil ? profil.renkAcik : 'var(--cream)',
                borderColor: profil ? profil.renk + '30' : 'var(--gold-light)',
              }}
            >
              <div className="text-5xl flex-shrink-0">{profil ? profil.elementSembol : '📖'}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1 mb-2">
                  {yazi.etiketler.slice(0, 2).map((e) => (
                    <span
                      key={e}
                      className="text-xs px-2 py-0.5 rounded-full text-white"
                      style={{ background: profil ? profil.renk : 'var(--earth)' }}
                    >
                      {e}
                    </span>
                  ))}
                </div>
                <h2 className="font-bold text-lg mb-1 group-hover:underline" style={{ color: 'var(--foreground)' }}>
                  {yazi.baslik}
                </h2>
                <p className="text-sm opacity-70 leading-relaxed line-clamp-2">{yazi.ozet}</p>
                <p className="text-xs opacity-40 mt-2">{yazi.okumaSuresi} dk okuma · {yazi.tarih}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
