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

export type KrizTuru = 'ruhsal' | 'tibbi';

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
const TIBBI =
  /göğsüm(de)? (ağrı|sıkış|baskı)|nefes alam|nefesim daralı|bayıl|kendimden geçt|felç|konuşamıyorum|görme kaybı|durmayan kanama|kan kusma|kolum uyuş/i;

export function krizTespit(metin: string): KrizTuru | null {
  if (RUHSAL.test(metin)) return 'ruhsal';
  if (TIBBI.test(metin)) return 'tibbi';
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
  return (
    'Anlattığın belirtiler bekleyecek türden değil. Mizaç konuşmasını burada ' +
    'bırakıyorum.\n\n' +
    'Lütfen vakit kaybetmeden 112’yi ara ya da en yakın acil servise git. ' +
    'Bunu mizaçla açıklamaya çalışmak doğru olmaz.'
  );
}
