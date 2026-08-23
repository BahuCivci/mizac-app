import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, istemciIp } from '@/lib/rate-limit';
import { DANISMAN_ACIK } from '@/lib/ozellikler';
import { krizTespit, krizCevabi } from '@/danisman/kriz';
import { saglayiciSec, type Mesaj } from '@/danisman/model';
import { danismanPromptu, uslupHatirlatmasi } from '@/danisman/persona';
import { kanitCikar, puanla, yonerge, benzersizKanitlar, type Kanit } from '@/danisman/kanit';
import { cevabiBicimlendir, cumleGecerliMi, cumlelereBol } from '@/danisman/bicim';
import { stratejiSec, stratejiNotu } from '@/danisman/strateji';
import { kitaptaAra, pasajlariBicimle } from '@/danisman/kitap';

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
  // Model bu ortamdan erişilemiyorsa isteği hiç başlatma: zaman aşımı bekletip
  // 503 dönmektense durumu açıkça söyle.
  if (!DANISMAN_ACIK) {
    return NextResponse.json(
      { hata: 'Mizaç danışmanı henüz yayında değil.' },
      { status: 503 }
    );
  }

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

  const { mesajlar, kanitlar, dil: istenenDil } = (govde ?? {}) as {
    mesajlar?: unknown;
    kanitlar?: unknown;
    dil?: unknown;
  };
  const dil: 'tr' | 'en' = istenenDil === 'en' ? 'en' : 'tr';

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

  // Kriz, modele sorulmadan karşılanır. Bir insanın intihardan söz ettiği
  // turda ne söyleneceği tahmine bırakılamaz; kanıt da çıkarılmaz, puan da
  // işlenmez — o an mizaç okuması yapılacak an değildir.
  const kriz = krizTespit(son.metin);
  if (kriz) {
    return NextResponse.json({
      cevap: krizCevabi(kriz, dil),
      kanitlar: oncekiKanitlar,
      durum: null,
      kriz,
    });
  }

  const saglayici = saglayiciSec();

  try {
    // Kanıt çıkarma ile cevap üretme birbirini beklemez.
    const yeniKanitSozu = kanitCikar(
      saglayici,
      son.metin,
      mesajlar.slice(-6).map((m) => `${m.rol}: ${m.metin}`),
      dil
    );

    const oncekiDurum = oncekiKanitlar.length ? puanla(oncekiKanitlar) : null;
    const oncekiKanaatVar =
      !!oncekiDurum && oncekiDurum.guven > 0.35 && oncekiKanitlar.length >= 6;

    // Danışmanın o turdaki hamlesi: yansıtma, onaylama, soru, özet...
    const strateji = stratejiSec({
      kanitlar: oncekiKanitlar,
      durum: oncekiDurum,
      tur: mesajlar.filter((m) => m.rol === 'kullanici').length,
      sonSoz: son.metin,
      kanaatVar: oncekiKanaatVar,
    });

    /*
     * Kitaptan getirim — her tur değil, gerektiğinde.
     *
     * Kişi bir kavramı sorduğunda ya da kanaat oluşup açıklama sırası
     * geldiğinde ilgili pasajlar aranır. Her tura eklemek prompt'a boşuna
     * ~1400 karakter bindirirdi; sohbetin başındaki "nasılsın" turunda
     * kitaba bakmanın faydası yok.
     */
    // Atıf denetimi için: kişinin bu sohbette gerçekten yazdıkları.
    const kullaniciSozleri = mesajlar
      .filter((m) => m.rol === 'kullanici')
      .map((m) => m.metin)
      .join(' ');

    const soruSoruyor = /\?|neden|niye|nasıl|nedir|ne demek|why|what is|how come/i.test(son.metin);
    const pasajlar =
      soruSoruyor || oncekiKanaatVar
        ? kitaptaAra(`${son.metin} ${oncekiDurum?.kazanan ?? ''}`, 2)
        : [];

    const kitapNotu = pasajlar.length
      ? '[kaynak — kullanıcıya gösterme]\nKitaptan ilgili bölümler aşağıda. ' +
        'İşine yarıyorsa kendi cümlenle aktar; yaramıyorsa GÖRMEZDEN GEL, ' +
        'zorlama. Kitapta geçmeyen bir şeyi kitaba dayandırma. ' +
        'SAYFA NUMARASI YA DA "kitabın şu kadarıncı sayfası" GİBİ BİR ŞEY ' +
        'SÖYLEME. Buradaki numaralar tarama sırası, basılı sayfa değil; ' +
        'söylersen yanlış bilgi vermiş olursun. "Kitapta şöyle anlatılıyor" ' +
        'demen yeterli.\n' +
        'KİTAPTAN GELENİ KİŞİNİN SÖYLEDİĞİ ŞEY SANMA. Aşağıdaki metin kitabın ' +
        'metnidir, karşındakinin sözü değil; orada geçen bir duygu ya da ' +
        'belirtiyi ona atfetme ("utanmandan bahsetmen ilginç" gibi). Kişi ne ' +
        'söylediyse odur.\n\n' +
        // Pasaj başına 400 karakter: uzun blok verince model içindeki
        // örnekleri (kuaför, alışveriş, hastalıklar) kullanıcıya ait sanıp
        // cümlesine katıyor. Kısa tutmak sızıntı malzemesini azaltıyor.
        pasajlariBicimle(pasajlar, 400)
      : null;

    const not = yonerge(oncekiKanitlar);
    const istem: Mesaj[] = [
      { rol: 'sistem', metin: danismanPromptu(dil) },
      ...mesajlar,
      { rol: 'sistem' as const, metin: uslupHatirlatmasi(dil) },
      ...(not ? [{ rol: 'sistem' as const, metin: not }] : []),
      ...(kitapNotu ? [{ rol: 'sistem' as const, metin: kitapNotu }] : []),
      { rol: 'sistem' as const, metin: stratejiNotu(strateji, dil) },
    ];

    if (!saglayici.akisli) {
      // Akışı desteklemeyen sağlayıcıda (ör. Claude yolu) toplu cevap.
      const ham = await saglayici.sor(istem, { sicaklik: 0.7, enFazlaJeton: 300 });
      const yeni = await yeniKanitSozu;
      const tumKanitlar = [...oncekiKanitlar, ...benzersizKanitlar(oncekiKanitlar, yeni)];
      const durum = puanla(tumKanitlar);
      const kanaatVar = durum.guven > 0.35 && tumKanitlar.length >= 6;
      return NextResponse.json({
        cevap: cevabiBicimlendir(ham, {
          mizacSoylenebilir: kanaatVar,
          kazanan: durum.kazanan,
          kullaniciSozleri,
          soruVar: strateji.soruVar,
          enFazlaCumle: strateji.enFazlaCumle,
        }),
        kanitlar: tumKanitlar,
        durum: kanaatVar
          ? { kazanan: durum.kazanan, guven: durum.guven, puanlar: durum.puanlar }
          : null,
      });
    }

    /*
     * Akış cümle cümle, token token değil.
     *
     * `bicim.ts` kuralları cümle üzerinde çalışıyor: tıbbi tavsiye ayıklama,
     * mizaç adı kapısı, uydurma deneyim filtresi. Ham token akıtmak,
     * kullanıcıya tavsiyeyi gösterip sonra geri almak olurdu — beklemekten
     * kötü. Bu yüzden cümle tamamlanana kadar tutuluyor, filtreden geçerse
     * gönderiliyor.
     *
     * Mizaç adı kapısı bu turun kanıtlarına göre değil, ÖNCEKİ kanaate göre
     * karar veriyor: cümleler yayına girerken bu turun kanıtı henüz hazır
     * değil. Bu, kapıyı bir tur geciktirir — yanlış tarafa değil.
     */
    const kodlayici = new TextEncoder();
    const akis = new ReadableStream({
      async start(kontrol) {
        const gonder = (o: unknown) =>
          kontrol.enqueue(kodlayici.encode(JSON.stringify(o) + '\n'));

        let tampon = '';
        let yayinlanan = 0;
        let soruGoruldu = false;

        const bosalt = (sondaMi: boolean) => {
          const parcalar = cumlelereBol(tampon);
          const tamamlanan = sondaMi ? parcalar : parcalar.slice(0, -1);
          tampon = sondaMi ? '' : parcalar[parcalar.length - 1] ?? '';

          for (const c of tamamlanan) {
            if (!c.trim()) continue;
            if (yayinlanan >= strateji.enFazlaCumle) return;
            if (!cumleGecerliMi(c, {
              mizacSoylenebilir: oncekiKanaatVar,
              kazanan: oncekiDurum?.kazanan,
              kullaniciSozleri,
            })) continue;
            if (c.includes('?')) {
              if (!strateji.soruVar || soruGoruldu) continue;
              soruGoruldu = true;
            }
            yayinlanan++;
            gonder({ tip: 'cumle', metin: c });
          }
        };

        try {
          await saglayici.akisli!(
            istem,
            (p) => {
              tampon += p;
              if (/[.!?…]/.test(p)) bosalt(false);
            },
            { sicaklik: 0.7, enFazlaJeton: 300 }
          );
          bosalt(true);

          if (yayinlanan === 0) {
            gonder({
              tip: 'cumle',
              metin: strateji.soruVar
                ? dil === 'en'
                  ? 'I see. Tell me a bit more?'
                  : 'Anlıyorum. Biraz daha anlatır mısın?'
                : dil === 'en'
                  ? 'I hear you.'
                  : 'Anlıyorum seni.',
            });
          }

          const yeni = await yeniKanitSozu;
          const tumKanitlar = [...oncekiKanitlar, ...benzersizKanitlar(oncekiKanitlar, yeni)];
          const durum = puanla(tumKanitlar);
          const kanaatVar = durum.guven > 0.35 && tumKanitlar.length >= 6;

          gonder({
            tip: 'son',
            kanitlar: tumKanitlar,
            /*
             * Hangi bölümlere bakıldığı arayüzde gösterilebilsin diye.
             *
             * Tarama sırası bilerek dışarı verilmiyor: OCR'da basılı sayfa
             * numaraları korunmadığı için o sayı kitabın sayfası değil, ve
             * arayüzde gösterilirse sayfa numarası sanılır. Bölüm başlığı
             * hem doğru hem okura daha faydalı.
             */
            kaynaklar: pasajlar.map((p) => ({
              baslik: p.baslik ?? null,
              ozet: p.metin.replace(/\s+/g, ' ').slice(0, 180),
            })),
            durum: kanaatVar
              ? { kazanan: durum.kazanan, guven: durum.guven, puanlar: durum.puanlar }
              : null,
          });
        } catch (e) {
          console.error('danisman akis:', e);
          gonder({
            tip: 'hata',
            hata:
              dil === 'en'
                ? 'The consultant is unavailable right now.'
                : 'Danışmana şu an ulaşılamıyor.',
          });
        } finally {
          kontrol.close();
        }
      },
    });

    return new Response(akis, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-store',
      },
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
