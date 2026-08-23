/**
 * Kriz tespiti ve sabit karşılık.
 *
 * Neden kodda, promptta değil: sistem promptunda "ciddi belirtide hekime
 * yönlendir" yazıyordu ve model çoğu zaman uydu — ama prompt bir ricadır.
 * Bir insanın intihardan söz ettiği turda modelin ne diyeceği tahmine
 * bırakılamaz. Kriz yakalandığında model hiç çağrılmaz; metin sabittir.
 *
 * Numaralar doğrulandı (Ağustos 2026):
 *   112 — acil sağlık, ücretsiz
 *   183 — Sosyal Destek Hattı (Aile ve Sosyal Hizmetler Bakanlığı), 7/24, ücretsiz
 * 182 KULLANILMIYOR: o MHRS hastane randevu hattı, kriz hattı değil.
 * Yanlış numara vermek hiç vermemekten kötüdür; değiştirmeden önce doğrula.
 */

export type KrizTuru = 'ruhsal' | 'tibbi' | 'ilac';

/**
 * İntihar düşüncesi ve kendine zarar. Kalıplar dar tutuldu: "bittim",
 * "ölüyorum" gibi günlük abartmalar sohbeti kesmemeli, ama açık ifadeler
 * kaçmamalı.
 */
const RUHSAL =
  /intihar|canıma kıy|kendimi öldür|kendime zarar|kendimi kes|yaşamak istemiyorum|ölmek istiyorum|hayatıma son|yaşamanın (bir )?anlamı yok|artık dayanamıyorum ve|yok olmak istiyorum/i;

/**
 * Tıbbi acil. Tek başına "başım ağrıyor" değil; acil servise gitmeyi
 * gerektiren tabloları arıyoruz.
 */
// Simüle sohbette kaçan gerçek bir vaka: "göğüsümde bir ağırlık var gibi,
// nefes almak bile zor geliyor". Üç ayrı sebeple kaçtı — "göğüsüm" yazımı,
// "ağırlık" sözcüğü ve "nefes almak zor" kalıbı. Danışman konuyu terlemeye
// çevirdi. Kalıplar bu üçünü de kapsayacak şekilde genişletildi.
// Araya kelime girebiliyor ("göğüsümde BİR ağırlık"), o yüzden sabit boşluk
// değil sınırlı serbest aralık aranıyor. Cümle sonu geçilmiyor ki alakasız
// iki cümle yanlışlıkla eşleşmesin.
const TIBBI =
  /(göğsüm|göğüsüm|göğüs)[^.!?]{0,25}(ağrı|sıkış|baskı|ağırlık|daralma)/i;
const TIBBI_2 =
  /nefes alam|nefes almak.{0,15}(zor|güç)|nefesim (daralı|kesil|yetmi)|bayıl|kendimden geçt|felç|konuşamıyorum|görme kaybı|durmayan kanama|kan kusma|kolum uyuş/i;

/**
 * Reçeteli ilacı bırakma/azaltma sorusu.
 *
 * Promptta "fikir belirtme, hekime yönlendir" yazılıydı ve tutmadı: güvenlik
 * sınavında model "demek ki bu ilaç sana iyi gelmiyor gibi" dedi — kişinin
 * ilacı hakkında klinik çıkarım. Kriz gibi dar ve yüksek riskli bir kategori,
 * o yüzden modele hiç sorulmuyor.
 */
// `\w` Türkçe harfleri kapsamıyor: "Antidepresanı kessem" ifadesinde ek olan
// "ı" yakalanamayıp kalıp kaçıyordu. Ek harfleri açıkça saymak gerekiyor.
const EK = '[\\wçğıöşüÇĞİÖŞÜ]*';
const ILAC = new RegExp(
  `(ilac|ilaç|hap|tablet|antidepresan|tansiyon ilac)${EK}\\s+(bırak|kes|azalt|içme|kullanma)` +
    '|bıraksam mı|kessem|dozunu (azalt|düşür)',
  'i'
);

export function krizTespit(metin: string): KrizTuru | null {
  if (RUHSAL.test(metin)) return 'ruhsal';
  if (TIBBI.test(metin) || TIBBI_2.test(metin)) return 'tibbi';
  if (ILAC.test(metin)) return 'ilac';
  return null;
}

/**
 * Sabit karşılık. Mizaç okuması burada durur — kriz anında birine huy
 * analizi yapmak hem faydasız hem de zararlı olabilir.
 */
export function krizCevabi(tur: KrizTuru): string {
  if (tur === 'ruhsal') {
    return (
      'Söylediğin şey ciddi ve bunu yazabilmen önemli. Burada mizaç konuşmayı ' +
      'bırakıyorum, çünkü şu an sana gereken şey bu değil.\n\n' +
      'Lütfen bir insana ulaş: hemen tehlikede hissediyorsan 112, konuşacak ' +
      'birine ihtiyacın varsa 183 Sosyal Destek Hattı (7/24, ücretsiz). ' +
      'Yakınında güvendiğin biri varsa ona da haber ver.\n\n' +
      'Ben bir yapay zekâyım; bu konuda sana gerçekten yardım edecek kişiler ' +
      'o hatların ucunda.'
    );
  }
  if (tur === 'ilac') {
    return (
      'Reçeteli bir ilacı bırakmak ya da azaltmak konusunda sana fikir '
      + 'veremem — bu kararı ilacı yazan hekimle konuşman gerekiyor, çünkü '
      + 'sonuçlarını ancak o değerlendirebilir.\n\n'
      + 'İlacın sana uymadığını düşünüyorsan bunu ona anlat; doz ya da ilaç '
      + 'değişikliği onun işi. Mizaç konuşmasına başka bir yerden devam edelim.'
    );
  }
  return (
    'Anlattığın belirtiler bekleyecek türden değil. Mizaç konuşmasını burada ' +
    'bırakıyorum.\n\n' +
    'Lütfen vakit kaybetmeden 112’yi ara ya da en yakın acil servise git. ' +
    'Bunu mizaçla açıklamaya çalışmak doğru olmaz.'
  );
}
