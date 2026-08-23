'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { mizacProfiller, type MizacTip } from '@/lib/mizac-data';
import { DANISMAN_ACIK } from '@/lib/ozellikler';
import { useLang } from '@/lib/lang-context';

type Rol = 'kullanici' | 'danisman';
interface Mesaj {
  rol: Rol;
  metin: string;
}
interface Kanit {
  gosterge: string;
  mizac: MizacTip;
  guc: 1 | 2 | 3;
  alinti: string;
  alan?: string;
}
interface Durum {
  kazanan: MizacTip;
  guven: number;
  puanlar: Record<MizacTip, number>;
}

const ACILIS = {
  tr:
    'Merhaba. Ben mizacını anlamana yardım eden bir danışmanım — sana soru listesi ' +
    'okumayacağım, konuşurken anlamaya çalışacağım. Nasıl gidiyor, seni bugünlerde ' +
    'en çok ne yoruyor?',
  en:
    'Hello. I help people work out their temperament — I won’t read you a list of ' +
    'questions, I’ll try to understand you as we talk. How are things? What’s been ' +
    'wearing you out lately?',
};

export default function DanismanSayfasi() {
  const { lang } = useLang();
  const tr = lang === 'tr';
  const [mesajlar, setMesajlar] = useState<Mesaj[]>([
    { rol: 'danisman', metin: ACILIS[lang] },
  ]);
  const [kanitlar, setKanitlar] = useState<Kanit[]>([]);
  const [durum, setDurum] = useState<Durum | null>(null);
  const [girdi, setGirdi] = useState('');
  const [bekliyor, setBekliyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [izGoster, setIzGoster] = useState(false);
  const [oncekiTest, setOncekiTest] = useState<MizacTip | null>(null);

  const sonRef = useRef<HTMLDivElement>(null);

  // Testi daha önce çözdüyse danışman onu tanıyarak başlasın.
  useEffect(() => {
    try {
      const kayit = localStorage.getItem('mizac_sonuc');
      if (kayit) {
        const { tip } = JSON.parse(kayit);
        if (tip && tip in mizacProfiller) setOncekiTest(tip as MizacTip);
      }
    } catch {
      // Bozuk kayıt sohbeti engellemesin.
    }
  }, []);

  useEffect(() => {
    sonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [mesajlar, bekliyor]);

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    const metin = girdi.trim();
    if (!metin || bekliyor) return;

    const yeniMesajlar: Mesaj[] = [...mesajlar, { rol: 'kullanici', metin }];
    setMesajlar(yeniMesajlar);
    setGirdi('');
    setBekliyor(true);
    setHata(null);

    try {
      const cevap = await fetch('/api/danisman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mesajlar: yeniMesajlar, kanitlar, dil: lang }),
      });
      const d = await cevap.json();

      if (!cevap.ok) {
        setHata(d.hata ?? (tr ? 'Bir şeyler ters gitti.' : 'Something went wrong.'));
        return;
      }

      setMesajlar((m) => [...m, { rol: 'danisman', metin: d.cevap }]);
      if (Array.isArray(d.kanitlar)) setKanitlar(d.kanitlar);
      if (d.durum) setDurum(d.durum);
    } catch {
      setHata(tr ? 'Bağlantı kurulamadı. Tekrar dene.' : 'Could not connect. Try again.');
    } finally {
      setBekliyor(false);
    }
  }

  const profil = durum ? mizacProfiller[durum.kazanan] : null;

  // Model bu ortamdan erişilemiyorken sohbet arayüzü göstermek, kullanıcıyı
  // yazdırıp sonra hata vermek demek. Doğrudan gelen ziyaretçiye durumu söyle.
  if (!DANISMAN_ACIK) {
    return (
      <main className="min-h-screen px-4 py-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-md mx-auto text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-3"
            style={{ color: '#c4973a' }}
          >
            {tr ? 'Mizaç Danışmanı' : 'Temperament Consultant'}
          </p>
          <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
            {tr ? 'Henüz yayında değil' : 'Not live yet'}
          </h1>
          <p className="text-sm leading-relaxed opacity-70 mb-6" style={{ color: 'var(--foreground)' }}>
            {tr
              ? 'Konuşarak mizacını okuyan danışman üzerinde çalışıyoruz. O gelene kadar 60 soruluk test aynı motoru kullanıyor ve hazır.'
              : 'We’re still building the consultant that reads your temperament from conversation. Until then the 60-question test uses the same engine and is ready.'}
          </p>
          <Link
            href="/test"
            className="inline-block px-6 py-3 rounded-full text-sm font-semibold"
            style={{ background: '#c4973a', color: '#1a1207' }}
          >
            {tr ? 'Mizaç Testine Git' : 'Take the Test'}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10" style={{ background: 'var(--background)' }}>
      <div className="max-w-lg mx-auto">
        <header className="text-center mb-6">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-2"
            style={{ color: '#c4973a' }}
          >
            {tr ? 'Mizaç Danışmanı' : 'Temperament Consultant'}
          </p>
          {/* Sayfa arka planı açık (--background: #faf7f2); krem başlık görünmez
              oluyordu. Koyu paleti yalnızca kartların içinde kullan. */}
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            {tr ? 'Konuşarak mizacını bul' : 'Find your temperament by talking'}
          </h1>
          <p className="text-sm leading-relaxed opacity-70" style={{ color: 'var(--foreground)' }}>
            {tr ? 'Soru listesi yok. Anlat, dinleyeyim.' : 'No question list. Talk, and I’ll listen.'}{' '}
            <Link href="/test" className="underline" style={{ color: '#c4973a' }}>
              {tr ? 'Klasik testi' : 'The classic test'}
            </Link>{' '}
            {tr ? 'tercih edersen o da duruyor.' : 'is still there if you prefer it.'}
          </p>
          {oncekiTest && (
            <p className="text-xs mt-2 opacity-60" style={{ color: 'var(--foreground)' }}>
              {tr
                ? `Testte ${mizacProfiller[oncekiTest].isim} çıkmıştın — bakalım sohbet ne diyecek.`
                : `The test said ${mizacProfiller[oncekiTest].isimEn} — let’s see what the conversation says.`}
            </p>
          )}
        </header>

        <div
          className="rounded-3xl p-4 mb-4 space-y-3"
          style={{ background: '#1a1207', border: '1px solid #3d2c0e' }}
        >
          {mesajlar.map((m, i) => (
            <div
              key={i}
              className={m.rol === 'kullanici' ? 'flex justify-end' : 'flex justify-start'}
            >
              <p
                className="text-sm leading-relaxed rounded-2xl px-4 py-2.5 max-w-[85%] wrap-break-word"
                style={
                  m.rol === 'kullanici'
                    ? { background: '#3d2c0e', color: '#f5f0e8' }
                    : { background: '#241a0b', color: '#e8dcc4' }
                }
              >
                {m.metin}
              </p>
            </div>
          ))}

          {bekliyor && (
            <p className="text-xs px-2" style={{ color: '#9a8060' }}>
              {tr ? 'düşünüyor…' : 'thinking…'}
            </p>
          )}
          {hata && (
            <p className="text-xs px-2" style={{ color: '#d98c6a' }}>
              {hata}
            </p>
          )}
          <div ref={sonRef} />
        </div>

        <form onSubmit={gonder} className="flex gap-2 mb-4">
          <input
            value={girdi}
            onChange={(e) => setGirdi(e.target.value)}
            placeholder={tr ? 'Anlatmak istediğini yaz…' : 'Write what’s on your mind…'}
            maxLength={2000}
            disabled={bekliyor}
            className="flex-1 min-w-0 px-4 py-3 rounded-full text-sm outline-none"
            style={{ background: '#1a1207', color: '#f5f0e8', border: '1px solid #3d2c0e' }}
          />
          <button
            type="submit"
            disabled={bekliyor || !girdi.trim()}
            className="px-5 py-3 rounded-full text-xs font-semibold shrink-0 disabled:opacity-50"
            style={{ background: '#c4973a', color: '#1a1207' }}
          >
            {tr ? 'Gönder' : 'Send'}
          </button>
        </form>

        {profil && durum && (
          <div
            className="rounded-2xl p-5 mb-4 text-center"
            style={{ background: '#1a1207', border: `1px solid ${profil.renk}` }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9a8060' }}>
              {tr ? 'Şu ana kadar okuduğum' : 'What I’m reading so far'}
            </p>
            <p className="text-2xl font-bold mb-1" style={{ color: profil.renk }}>
              {profil.elementSembol} {tr ? profil.isim : profil.isimEn}
            </p>
            <p className="text-xs mb-3" style={{ color: '#9a8060' }}>
              {tr
                ? `güven %${Math.round(durum.guven * 100)} — sohbet sürdükçe netleşir`
                : `${Math.round(durum.guven * 100)}% confidence — it sharpens as we talk`}
            </p>
            <Link
              href="/mizaclar"
              className="text-xs underline"
              style={{ color: '#c4973a' }}
            >
              {tr ? 'Bu mizaç ne demek?' : 'What does this temperament mean?'}
            </Link>
          </div>
        )}

        {kanitlar.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: '#1a1207', border: '1px solid #3d2c0e' }}>
            <button
              onClick={() => setIzGoster((g) => !g)}
              className="text-xs font-bold uppercase tracking-widest w-full text-left"
              style={{ color: '#c4973a' }}
            >
              {izGoster ? '▾' : '▸'}{' '}
              {tr
                ? `Neye dayanarak — ${kanitlar.length} gösterge`
                : `What this is based on — ${kanitlar.length} signals`}
            </button>
            {izGoster && (
              <ul className="mt-3 space-y-2">
                {kanitlar.map((k, i) => (
                  <li key={i} className="text-xs leading-relaxed wrap-break-word" style={{ color: '#9a8060' }}>
                    <span style={{ color: mizacProfiller[k.mizac].renk }}>
                      {tr ? mizacProfiller[k.mizac].isim : mizacProfiller[k.mizac].isimEn}
                    </span>{' '}
                    · {k.gosterge}
                    <span className="block italic opacity-70">“{k.alinti}”</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <p className="text-xs text-center mt-6 leading-relaxed opacity-60" style={{ color: 'var(--foreground)' }}>
          {tr
            ? 'Mizaç okuması bir kişilik ve beden eğilimi yorumudur, tıbbi teşhis değildir. Sağlık şikâyetlerin için hekimine başvur.'
            : 'A temperament reading is an interpretation of personality and bodily tendencies, not a medical diagnosis. See a doctor about health complaints.'}
        </p>
      </div>
    </main>
  );
}
