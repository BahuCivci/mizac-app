import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, istemciIp } from '@/lib/rate-limit';
import { saglayiciSec, type Mesaj } from '@/danisman/model';
import { danismanPromptu, uslupHatirlatmasi } from '@/danisman/persona';
import { kanitCikar, puanla, yonerge, type Kanit } from '@/danisman/kanit';

/**
 * Danışman uç noktası.
 *
 * Durum sunucuda tutulmaz: sohbet geçmişi ve o ana kadar toplanan kanıtlar
 * istemciden gelir, güncellenmiş hâli geri döner. Oturum deposu gerektirmez ve
 * Vercel'in her isteği başka bir instance'a düşürmesinden etkilenmez.
 *
 * Model adresi ve anahtarı yalnızca burada, sunucu tarafında. Tarayıcı hangi
 * modele konuşulduğunu görmez.
 */

const EN_FAZLA_MESAJ = 40;
const EN_FAZLA_UZUNLUK = 2000;
const EN_FAZLA_KANIT = 120;

const ROLLER = new Set(['kullanici', 'danisman']);

function gecerliMesaj(x: unknown): x is Mesaj {
  if (typeof x !== 'object' || x === null) return false;
  const m = x as Record<string, unknown>;
  return (
    typeof m.metin === 'string' &&
    m.metin.length > 0 &&
    m.metin.length <= EN_FAZLA_UZUNLUK &&
    typeof m.rol === 'string' &&
    ROLLER.has(m.rol)
  );
}

export async function POST(req: NextRequest) {
  // Her istek bir model çağrısı — sınırsız bırakmak GPU'yu bedavaya açmak olur.
  if (!rateLimit(istemciIp(req), { limit: 20, windowMs: 60_000 })) {
    return NextResponse.json(
      { hata: 'Çok hızlı gidiyoruz. Bir dakika sonra tekrar dene.' },
      { status: 429 }
    );
  }

  let govde: unknown;
  try {
    govde = await req.json();
  } catch {
    return NextResponse.json({ hata: 'Geçersiz istek' }, { status: 400 });
  }

  const { mesajlar, kanitlar } = (govde ?? {}) as {
    mesajlar?: unknown;
    kanitlar?: unknown;
  };

  if (!Array.isArray(mesajlar) || mesajlar.length === 0) {
    return NextResponse.json({ hata: 'mesajlar boş olamaz' }, { status: 400 });
  }
  if (mesajlar.length > EN_FAZLA_MESAJ) {
    return NextResponse.json(
      { hata: 'Sohbet çok uzadı. Yeni bir sohbet başlat.' },
      { status: 400 }
    );
  }
  if (!mesajlar.every(gecerliMesaj)) {
    return NextResponse.json({ hata: 'Geçersiz mesaj' }, { status: 400 });
  }

  const son = mesajlar[mesajlar.length - 1];
  if (son.rol !== 'kullanici') {
    return NextResponse.json({ hata: 'Son mesaj kullanıcıdan olmalı' }, { status: 400 });
  }

  // İstemciden gelen kanıtlara güvenilmez; biçimi `kanitCikar` ile aynı
  // doğrulamadan geçer, sayısı sınırlanır.
  const oncekiKanitlar: Kanit[] = Array.isArray(kanitlar)
    ? (kanitlar as Kanit[]).slice(-EN_FAZLA_KANIT).filter(
        (k) =>
          k &&
          typeof k.gosterge === 'string' &&
          typeof k.alinti === 'string' &&
          (k.guc === 1 || k.guc === 2 || k.guc === 3) &&
          ['safravi', 'demevi', 'balgami', 'sevdavi'].includes(k.mizac)
      )
    : [];

  const saglayici = saglayiciSec();

  try {
    // Kanıt çıkarma ile cevap üretme birbirini beklemez.
    const yeniKanitSozu = kanitCikar(
      saglayici,
      son.metin,
      mesajlar.slice(-6).map((m) => `${m.rol}: ${m.metin}`)
    );

    const not = yonerge(oncekiKanitlar);
    const istem: Mesaj[] = [
      { rol: 'sistem', metin: danismanPromptu() },
      ...mesajlar,
      { rol: 'sistem' as const, metin: uslupHatirlatmasi() },
      ...(not ? [{ rol: 'sistem' as const, metin: not }] : []),
    ];

    const cevap = await saglayici.sor(istem, { sicaklik: 0.7, enFazlaJeton: 300 });
    const yeni = await yeniKanitSozu;
    const tumKanitlar = [...oncekiKanitlar, ...yeni];
    const durum = puanla(tumKanitlar);

    return NextResponse.json({
      cevap: cevap.trim(),
      kanitlar: tumKanitlar,
      // Kanaat oluşmadan mizaç dışarı verilmez; arayüz erken sonuç göstermesin.
      durum:
        durum.guven > 0.35 && tumKanitlar.length >= 6
          ? { kazanan: durum.kazanan, guven: durum.guven, puanlar: durum.puanlar }
          : null,
    });
  } catch (e) {
    // Model adresi/anahtarı hata metniyle sızmasın.
    console.error('danisman:', e);
    return NextResponse.json(
      { hata: 'Danışmana şu an ulaşılamıyor. Biraz sonra tekrar dene.' },
      { status: 503 }
    );
  }
}
