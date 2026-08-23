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
export type Dil = 'tr' | 'en';

/**
 * İngilizce kalıplar ayrı tutuluyor.
 *
 * Site iki dilli. Güvenlik ağını yalnız Türkçe kurmak, İngilizce yazan birinin
 * krizini hiç görmemek demek — sessiz ve en kötü türden bir açık.
 */
const RUHSAL_EN =
  /suicid|kill myself|end my life|don'?t want to live|want to die|hurt myself|self[- ]harm|cutting myself|no reason to live/i;
const TIBBI_EN =
  /chest (pain|pressure|tightness|heav)|can'?t breathe|cannot breathe|hard to breathe|short(ness)? of breath|passed out|fainted|numb(ness)? in my arm|slurred speech|vision loss|bleeding (that )?won'?t stop|coughing (up )?blood/i;
const ILAC_EN =
  /(stop|quit|skip|cut|reduce|halve)\w*\s+(taking\s+)?(my\s+)?(medication|meds|pills|antidepressant|prescription)|off my (meds|medication)|lower the dose|reduce the dose/i;

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
  // Dil bilgisine güvenilmiyor: kullanıcı arayüzü İngilizce olsa da Türkçe
  // yazabilir, tersi de olur. Her iki kalıp kümesi de her metne uygulanır.
  if (RUHSAL.test(metin) || RUHSAL_EN.test(metin)) return 'ruhsal';
  if (TIBBI.test(metin) || TIBBI_2.test(metin) || TIBBI_EN.test(metin)) return 'tibbi';
  if (ILAC.test(metin) || ILAC_EN.test(metin)) return 'ilac';
  return null;
}

/**
 * Sabit karşılık. Mizaç okuması burada durur — kriz anında birine huy
 * analizi yapmak hem faydasız hem de zararlı olabilir.
 */
export function krizCevabi(tur: KrizTuru, dil: Dil = 'tr'): string {
  if (dil === 'en') return krizCevabiEn(tur);
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

/**
 * İngilizce karşılıklar.
 *
 * Hat numaraları Türkiye'ye ait: site Türkiye merkezli ve kullanıcı burada
 * olabilir. Uluslararası bir ziyaretçi için de yerel acil servise yönlendirme
 * ekleniyor — yanlış ülkenin numarasını vermektense ikisini birden söylemek
 * doğru olan.
 */
function krizCevabiEn(tur: KrizTuru): string {
  if (tur === 'ruhsal') {
    return (
      'What you just said matters, and it took something to write it. I am ' +
      'stopping the temperament conversation here, because that is not what ' +
      'you need right now.\n\n' +
      'Please reach a person. In Turkey: 112 if you are in immediate danger, ' +
      'or 183 (free, 24/7) if you need someone to talk to. Elsewhere, call ' +
      'your local emergency number. If someone you trust is nearby, tell them ' +
      'too.\n\n' +
      'I am an AI; the people who can actually help you are at the end of ' +
      'those lines.'
    );
  }
  if (tur === 'ilac') {
    return (
      'I cannot give you an opinion on stopping or reducing a prescribed ' +
      'medication — that decision belongs with the doctor who prescribed it, ' +
      'because only they can weigh the consequences.\n\n' +
      'If you think it is not suiting you, tell them that; changing the dose ' +
      'or the drug is their call. Let us pick the conversation up somewhere ' +
      'else.'
    );
  }
  return (
    'What you are describing is not something to wait on. I am stopping the ' +
    'temperament conversation here.\n\n' +
    'Please call 112 (or your local emergency number) or go to the nearest ' +
    'emergency department. Trying to explain this through temperament would ' +
    'be wrong.'
  );
}
