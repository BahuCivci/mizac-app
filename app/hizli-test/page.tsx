'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mizacProfiller, MizacTip } from '@/lib/mizac-data';
import { kazananBelirle } from '@/lib/puanlama';

const sorular = [
  {
    id: 1,
    soru: 'Sabah uyandığında ilk hissin ne?',
    secenekler: [
      { metin: '⚡ Hemen kalkarım, zaten erken uyandım', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 } },
      { metin: '☀️ Yavaş açılırım ama neşeyle', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: '💤 Kalkmak zor gelir, biraz daha yatmak isterim', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: '🌙 Hafif uyurum, düşüncelerimle geçer gece', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 2,
    soru: 'Biri seni haksız yere eleştirince ne yaparsın?',
    secenekler: [
      { metin: '🔥 Hemen karşılık veririm, anında söylerim', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 } },
      { metin: '😅 Gülerek geçiştiririm, çok takmam', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: '😶 İçime atar, ama üzüntüm uzun sürer', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: '🤐 Sessiz kalırım ama uzun süre taşırım', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 3,
    soru: 'Parti davetiyesi aldığında ilk tepkin ne?',
    secenekler: [
      { metin: '📋 Giderim ama organizasyonu üstlenirim', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 } },
      { metin: '🎉 Harika! Kimi daha çağırabiliriz?', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: '😌 Gidebilirim ama küçük toplantı daha iyi', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: '😬 Tanımadığım insanlar varsa geç gider erken çıkarım', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 4,
    soru: 'Karar verirken nasılsın?',
    secenekler: [
      { metin: '⚡ Hızlı ve kesin — tereddüt sevmem', puan: { safravi: 3, demevi: 1, balgami: 0, sevdavi: 0 } },
      { metin: '😄 Hızlı ama bazen düşünmeden', puan: { safravi: 1, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: '🐢 Yavaş ve dikkatli — acele etmem', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 1 } },
      { metin: '🔍 Çok analiz ederim, zor karar veririm', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 5,
    soru: 'Çalışma tarzın nasıl?',
    secenekler: [
      { metin: '🎯 Hedefe kilitlenir, durmadan çalışırım', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 } },
      { metin: '🎨 Yaratıcı ve sosyal ortamda en iyi çalışırım', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: '📅 Düzenli, sakin ve istikrarlı çalışırım', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: '🔬 Derinlemesine ve yalnız çalışırım', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 6,
    soru: 'Sağlık konusunda en çok hangisi seni tanımlar?',
    secenekler: [
      { metin: '🌡️ Mide, reflü veya cilt sorunlarım oluyor', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 } },
      { metin: '💓 Baş ağrısı, tansiyon sorunum olabilir', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: '🫁 Solunum, eklem veya kilo sorunum olabiliyor', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: '🦴 Kronik ağrı, uyku veya yorgunluk sorunum var', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 7,
    soru: 'Bir sorunla karşılaşınca ilk reaksiyonun ne?',
    secenekler: [
      { metin: '⚔️ Hemen çözüme odaklanırım', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 } },
      { metin: '🤗 Birine anlatırım, birlikte çözeriz', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: '⏳ Beklerim, zaman çoğunu çözer', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: '🧩 Sessizce derinlemesine düşünürüm', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 8,
    soru: 'Arkadaşların seni nasıl tarif eder?',
    secenekler: [
      { metin: '👑 Lider, kararlı, doğrucu', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 } },
      { metin: '🌟 Neşeli, enerjik, sosyal', puan: { safravi: 0, demevi: 3, balgami: 0, sevdavi: 0 } },
      { metin: '🕊️ Sakin, güvenilir, uysal', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: '🎭 Derin, hassas, yaratıcı', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 9,
    soru: 'Para yönetiminde nasılsın?',
    secenekler: [
      { metin: '📊 Kontrollü ve hedef odaklı harcarım', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 1 } },
      { metin: '🎁 Cömertim, özellikle sevdiklerime', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: '💰 Biriktiririm, gereksiz harcamam', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: '🎨 Manidar ve kalıcı şeylere harcarım', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
  {
    id: 10,
    soru: 'Hayattaki en büyük motivasyonun ne?',
    secenekler: [
      { metin: '🏆 Başarmak, lider olmak, iz bırakmak', puan: { safravi: 3, demevi: 0, balgami: 0, sevdavi: 0 } },
      { metin: '❤️ Sevilmek, bağlanmak, paylaşmak', puan: { safravi: 0, demevi: 3, balgami: 1, sevdavi: 0 } },
      { metin: '🏡 Huzur, güvenlik, istikrar', puan: { safravi: 0, demevi: 0, balgami: 3, sevdavi: 0 } },
      { metin: '🔮 Anlam bulmak, derinleşmek, yaratmak', puan: { safravi: 0, demevi: 0, balgami: 0, sevdavi: 3 } },
    ],
  },
];

type Puanlar = Record<MizacTip, number>;

function HizliTestEmail({ tip, renk }: { tip: MizacTip; renk: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tip }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl p-5 text-center mb-4" style={{ background: '#1a1207' }}>
        <p className="font-semibold text-white">📬 Gönderildi! Tam profiliniz emailde.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 mb-4" style={{ background: '#1a1207' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: renk }}>
        Tam profili emaile al
      </p>
      <p className="text-xs mb-4" style={{ color: '#9a8a6a' }}>
        50 soruluk detaylı analiz + beslenme rehberi gönderelim.
      </p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@adresiniz.com"
          required
          className="flex-1 px-3 py-2.5 rounded-full text-sm outline-none"
          style={{ background: '#2a1f0a', border: '1px solid #c4973a40', color: '#e8d5b0' }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2.5 rounded-full text-xs font-semibold text-white shrink-0 disabled:opacity-60"
          style={{ background: renk }}
        >
          {status === 'loading' ? '⏳' : 'Gönder'}
        </button>
      </form>
    </div>
  );
}

function hesapla(secimler: (number | undefined)[]): Puanlar {
  const t: Puanlar = { safravi: 0, demevi: 0, balgami: 0, sevdavi: 0 };
  secimler.forEach((s, i) => {
    if (s === undefined) return;
    const p = sorular[i].secenekler[s].puan;
    (Object.keys(p) as MizacTip[]).forEach((k) => { t[k] += p[k]; });
  });
  return t;
}

export default function HizliTestPage() {
  const [aktif, setAktif] = useState(0);
  const [secimler, setSecimler] = useState<(number | undefined)[]>([]);
  const [sonuc, setSonuc] = useState<{ tip: MizacTip; puanlar: Puanlar } | null>(null);
  const [animasyon, setAnimasyon] = useState(false);

  function sec(idx: number) {
    const yeni = [...secimler];
    yeni[aktif] = idx;
    setSecimler(yeni);
    setAnimasyon(true);
    setTimeout(() => {
      setAnimasyon(false);
      if (aktif < sorular.length - 1) {
        setAktif(aktif + 1);
      } else {
        const p = hesapla(yeni);
        const secilenPuanlar = yeni.map((sec, i) =>
          sec === undefined ? {} : sorular[i].secenekler[sec].puan
        );
        const kazanan = kazananBelirle(p, secilenPuanlar);
        setSonuc({ tip: kazanan, puanlar: p });
      }
    }, 350);
  }

  // Sonuç ekranı
  if (sonuc) {
    const profil = mizacProfiller[sonuc.tip];
    const sirali = (Object.entries(sonuc.puanlar) as [MizacTip, number][]).sort(([, a], [, b]) => b - a);
    const toplam = Object.values(sonuc.puanlar).reduce((a, b) => a + b, 0);

    return (
      <main className="min-h-screen px-4 py-12" style={{ background: 'var(--background)' }}>
        <div className="max-w-md mx-auto">
          <div
            className="rounded-3xl p-8 text-center mb-6"
            style={{ background: 'linear-gradient(180deg, #0f0a04 0%, #1a1207 100%)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-4" style={{ color: profil.renk }}>
              ⚡ Hızlı Test Sonucu
            </p>
            <div className="text-7xl mb-4">{profil.elementSembol}</div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9a8a6a' }}>Mizacın</p>
            <h1 className="text-4xl font-bold mb-3" style={{ color: profil.renk }}>{profil.isim}</h1>
            <p className="text-sm leading-relaxed max-w-xs mx-auto mb-5" style={{ color: '#c8b87a' }}>{profil.kisaAciklama}</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {profil.anahtarKelimeler.slice(0, 4).map((k) => (
                <span key={k} className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: profil.renk + '25', color: profil.renk, border: `1px solid ${profil.renk}50` }}>
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Dağılım */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 mb-5">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Dağılımın</p>
            {sirali.map(([tip, puan]) => {
              const p = mizacProfiller[tip];
              const yuzde = toplam > 0 ? Math.round((puan / toplam) * 100) : 0;
              return (
                <div key={tip} className="mb-2.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-stone-600">{p.elementSembol} {p.isim}</span>
                    <span className="text-stone-400">%{yuzde}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${yuzde}%`, background: p.renk }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Aksiyon Butonları */}
          <div className="space-y-3 mb-6">
            <Link
              href={`/mizaclar/${sonuc.tip}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-white transition-all hover:scale-105"
              style={{ background: profil.renk }}
            >
              {profil.elementSembol} Tam Profilimi Gör
            </Link>
            <Link
              href={`/test`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold border-2 text-stone-700 transition-all hover:bg-stone-50"
              style={{ borderColor: 'var(--gold)' }}
            >
              ✦ 50 Soruluk Detaylı Testi Yap
            </Link>
          </div>

          {/* Email Capture */}
          <HizliTestEmail tip={sonuc.tip} renk={profil.renk} />

          {/* WhatsApp Paylaş */}
          <button
            onClick={() => {
              const text = `Hızlı mizaç testinde ${profil.isim} ${profil.elementSembol} çıktım! Sen de 10 soruda öğren 👇\nhttps://mizac.xyz/hizli-test`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp&apos;ta Paylaş
          </button>

          <p className="text-center text-xs text-stone-400 mt-4">
            Bu hızlı test 10 sorudan oluşur.{' '}
            <Link href="/test" className="underline">50 soruluk tam test</Link>{' '}
            daha hassas sonuç verir.
          </p>
        </div>
      </main>
    );
  }

  // Test ekranı
  const soru = sorular[aktif];
  const ilerleme = ((aktif) / sorular.length) * 100;

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* İlerleme çubuğu */}
      <div className="h-1 bg-stone-100 fixed top-0 left-0 right-0 z-50">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${ilerleme}%`, background: 'linear-gradient(90deg, var(--earth), var(--gold))' }}
        />
      </div>

      <div className="max-w-md mx-auto px-4 pt-10 pb-6 flex-1 flex flex-col justify-center">
        {/* Sayaç */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-stone-400 tracking-widest">
            {aktif + 1} / {sorular.length}
          </span>
          <div className="flex justify-center gap-1 mt-2">
            {sorular.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all"
                style={{
                  width: i <= aktif ? 24 : 8,
                  background: i < aktif ? 'var(--earth)' : i === aktif ? 'var(--gold)' : '#e5e7eb',
                }}
              />
            ))}
          </div>
        </div>

        {/* Soru */}
        <div className={`transition-all duration-300 ${animasyon ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <h1 className="text-2xl font-bold text-center text-stone-800 mb-8 leading-snug">
            {soru.soru}
          </h1>

          {/* Seçenekler */}
          <div className="space-y-3">
            {soru.secenekler.map((s, idx) => (
              <button
                key={idx}
                onClick={() => sec(idx)}
                className="w-full text-left px-5 py-4 rounded-2xl bg-white border-2 border-stone-100 hover:border-amber-300 hover:bg-amber-50 transition-all active:scale-98 font-medium text-stone-700"
              >
                {s.metin}
              </button>
            ))}
          </div>
        </div>

        {/* Geri */}
        {aktif > 0 && (
          <button
            onClick={() => setAktif(aktif - 1)}
            className="mt-6 text-sm text-stone-400 hover:text-stone-600 transition-colors text-center w-full"
          >
            ← Önceki soru
          </button>
        )}

        <p className="text-center text-xs text-stone-300 mt-8">
          10 soruda ~2 dakika · Ücretsiz · İbn-i Sina geleneği
        </p>
      </div>
    </main>
  );
}
