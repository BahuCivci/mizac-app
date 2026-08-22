/**
 * Danışman boru hattının duman testi — sohbete oturmadan çalıştığını görmek için.
 *
 *   MIZAC_OLLAMA=http://localhost:11500 node --import ./icerik/kayit.mjs danisman/deneme.ts
 *
 * Sınavda kullanılan gerçekçi ifadelerden birkaçını sırayla verir, her turda
 * çıkarılan kanıtı ve o ana kadarki puanı basar. Beklenen: ifadeler safravî
 * göstergeleri taşıdığı için puan safravîde toplanmalı.
 */
import { ollama } from './model';
import { kanitCikar, puanla, eksikAlanlar, nemYoklamasiGerek } from './kanit';
import { danismanPromptu } from './persona';

const SOZLER = [
  'Trafikte biri önüme kırdı diye bağırdım, adam gözden kaybolmadan ben zaten unutmuştum.',
  'Alarm kurmuyorum yıllardır, altıya çeyrek kala gözüm açılıyor. Beş buçukta uyansam da yorgun hissetmiyorum.',
  'Temmuz benim için kâbus, klima olmayan yerde duramıyorum. Spor salonunda yanımdaki sırılsıklam olurken benim sadece saç diplerim nemleniyor.',
];

async function main() {
  const saglayici = ollama();
  console.log(`sağlayıcı: ${saglayici.ad}`);
  console.log(`persona promptu: ${danismanPromptu().length} karakter\n`);

  const kanitlar = [];

  for (const soz of SOZLER) {
    console.log(`— "${soz.slice(0, 70)}..."`);
    const yeni = await kanitCikar(saglayici, soz);
    kanitlar.push(...yeni);

    if (!yeni.length) {
      console.log('   kanıt çıkmadı\n');
      continue;
    }
    for (const k of yeni) {
      console.log(`   ${k.mizac.padEnd(8)} ${k.guc}  ${k.gosterge}`);
    }
    const d = puanla(kanitlar);
    console.log(
      `   puan: saf ${d.puanlar.safravi} · dem ${d.puanlar.demevi} · ` +
        `bal ${d.puanlar.balgami} · sev ${d.puanlar.sevdavi}  → ${d.kazanan} ` +
        `(güven %${Math.round(d.guven * 100)})\n`
    );
  }

  const son = puanla(kanitlar);
  console.log('=== sonuç ===');
  console.log(`kazanan: ${son.kazanan} (beklenen: safravi)`);
  console.log(`toplam kanıt: ${kanitlar.length}`);
  console.log(`nem yoklaması gerekli mi: ${nemYoklamasiGerek(son) ? 'evet' : 'hayır'}`);
  console.log(`değinilmeyen alanlar: ${eksikAlanlar(kanitlar).length}`);

  // Danışman gerçekten konuşabiliyor mu — ve kurallara uyuyor mu?
  const cevap = (
    await saglayici.sor(
      [
        { rol: 'sistem', metin: danismanPromptu() },
        { rol: 'kullanici', metin: SOZLER[0] },
      ],
      { sicaklik: 0.7, enFazlaJeton: 300 }
    )
  ).trim();
  console.log(`\ndanışmanın cevabı:\n${cevap}`);

  // Üslup kuralları öğüt değil şart; burada ölçülür.
  //
  // "Soruyla bitmeli" ölçütü kaldırıldı: her turu soruya bağlamak danışmanı
  // sohbet arkadaşı değil mülakatçı yapıyordu. Artık soru sormamak serbest,
  // sorgulamak değil.
  const cumleSayisi = (cevap.match(/[.!?…]/g) ?? []).length;
  const soruSayisi = (cevap.match(/\?/g) ?? []).length;

  // Kendi gözlem sürecini anlatmak insana denek olduğunu hissettiriyor.
  const inceleyenDil =
    /fark ettim|dikkatimi çekti|görüyor gibiyim|anlaşılıyor|gözlemliyorum|senin şu özelliğin|bu bana .{0,20}gösteriyor|olduğunu görüyorum/i;

  const ihlaller: string[] = [];
  if (cumleSayisi > 4) ihlaller.push(`${cumleSayisi} cümle (en fazla 4)`);
  if (/safrav|demev|balgam|sevdav/i.test(cevap)) ihlaller.push('mizaç adını erken söyledi');
  if (soruSayisi > 1) ihlaller.push(`${soruSayisi} soru (en fazla 1)`);
  if (inceleyenDil.test(cevap)) ihlaller.push('inceleyen dil ("fark ettim" vb.)');

  console.log(`\nüslup: ${ihlaller.length ? '✗ ' + ihlaller.join(', ') : '✓ kurallara uygun'}`);

  const gecti = son.kazanan === 'safravi' && ihlaller.length === 0;
  process.exit(gecti ? 0 : 1);
}

main().catch((e) => {
  console.error('HATA:', e.message);
  process.exit(2);
});
