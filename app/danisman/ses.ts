/**
 * Danışmanın sesi ve kulağı — tamamen tarayıcıda.
 *
 * Ne sunucuya uğruyor ne bir servise para ödeniyor: konuşma sentezi ve tanıma
 * tarayıcının kendi motorlarıyla yapılıyor. Bu, ses eklemenin maliyetini sıfır
 * tutan tek yol; D-ID/ElevenLabs gibi servisler konuşma başına ücretli ve
 * zaten 4 saniye olan gecikmeye bir tur daha ekliyorlar.
 *
 * SINIRI AÇIKÇA SÖYLEMEK GEREKİR
 * Tarayıcı sesleri robotik. iOS ve macOS'ta Türkçe (Yelda) makul, Android'de
 * Google TTS iyi, Windows'ta değişken, Firefox'ta konuşma tanıma hiç yok.
 * `sesVar()` ve `dinlemeVar()` bunu çağırana bildiriyor ki arayüz olmayan
 * düğmeyi göstermesin.
 */

export type SesDurumu = 'bos' | 'dinliyor' | 'konusuyor';

/* --------------------------------------------------------------- tanımlar */

// SpeechRecognition standart TS tiplerinde yok; ihtiyacımız olan kadarı.
interface TanimaSonucu {
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
}
interface Tanima {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: TanimaSonucu) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type TanimaYapici = new () => Tanima;

function tanimaYapici(): TanimaYapici | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: TanimaYapici;
    webkitSpeechRecognition?: TanimaYapici;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function sesVar(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function dinlemeVar(): boolean {
  return tanimaYapici() !== null;
}

/* ------------------------------------------------------------- konuşturma */

/**
 * Türkçe ses seçer.
 *
 * `getVoices()` ilk çağrıda çoğu tarayıcıda boş dönüyor; listeyi `voiceschanged`
 * olayından sonra dolduruyorlar. Bu yüzden seçim her konuşmada yeniden yapılıyor,
 * bir kez hesaplanıp saklanmıyor — ilk cümlenin sessiz kalmasının sebebi buydu.
 */
function sesSec(dil: 'tr' | 'en'): SpeechSynthesisVoice | null {
  const hepsi = window.speechSynthesis.getVoices();
  if (!hepsi.length) return null;
  const on = dil === 'tr' ? 'tr' : 'en';
  // Yerel (cihaz üstü) sesler ağdakilere tercih ediliyor: gecikmesiz başlıyorlar.
  const uygun = hepsi.filter((s) => s.lang.toLowerCase().startsWith(on));
  return uygun.find((s) => s.localService) ?? uygun[0] ?? null;
}

let sonSoylem: SpeechSynthesisUtterance | null = null;

export function konus(
  metin: string,
  dil: 'tr' | 'en',
  olaylar: {
    basladi?: () => void;
    bitti?: () => void;
    /**
     * Her kelime sınırında çağrılır — ağız hareketi buna bağlanıyor.
     *
     * Sentezlenen ses Web Audio'ya verilmediği için genlik okunamıyor; kelime
     * sınırı, elde olan tek GERÇEK zamanlama sinyali. Rastgele bir titreşimle
     * ağız oynatmak yerine bunu kullanmak, konuşmayla dudakların tutmasını
     * sağlıyor. Safari bu olayı vermiyor — orada `basladi`/`bitti` arasında
     * daha kaba bir ritim kullanılıyor (bkz. yuz.tsx).
     */
    kelime?: (uzunluk: number) => void;
  } = {}
): void {
  if (!sesVar() || !metin.trim()) return;

  const soylem = new SpeechSynthesisUtterance(metin);
  soylem.lang = dil === 'tr' ? 'tr-TR' : 'en-US';
  const ses = sesSec(dil);
  if (ses) soylem.voice = ses;
  // Varsayılan hız danışman için biraz hızlı; 0.95 daha sakin duruyor.
  soylem.rate = 0.95;
  soylem.pitch = 1;

  soylem.onstart = () => olaylar.basladi?.();
  soylem.onend = () => olaylar.bitti?.();
  if (olaylar.kelime) {
    soylem.onboundary = (e) => {
      if (e.name === 'word' || e.name === undefined) {
        // charLength bazı tarayıcılarda 0; kelimeyi metinden ölçüyoruz ki
        // uzun kelimelerde ağız daha uzun açık kalsın.
        const uzunluk =
          e.charLength || (metin.slice(e.charIndex).match(/^\S+/)?.[0].length ?? 3);
        olaylar.kelime?.(uzunluk);
      }
    };
  }
  // Hata da bitiş sayılmalı, yoksa arayüz "konuşuyor" hâlinde donup kalıyor.
  soylem.onerror = () => olaylar.bitti?.();

  sonSoylem = soylem;
  window.speechSynthesis.speak(soylem);
}

export function sus(): void {
  if (!sesVar()) return;
  window.speechSynthesis.cancel();
  sonSoylem = null;
}

/** Sekme arkaya alınıp dönüldüğünde Chrome sentezi askıda bırakıyor. */
export function sesiCanlandir(): void {
  if (!sesVar() || !sonSoylem) return;
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();
}

/* ---------------------------------------------------------------- dinleme */

export interface Dinleyici {
  durdur(): void;
}

/**
 * Mikrofonu açar, konuşulanı metne çevirir.
 *
 * `araSonuc` konuşma sürerken güncelleniyor — kullanıcı sözünün algılandığını
 * görmezse mikrofonun çalışıp çalışmadığını anlayamıyor. `sonuc` yalnız cümle
 * bittiğinde bir kez çağrılıyor.
 */
export function dinle(
  dil: 'tr' | 'en',
  olaylar: {
    araSonuc?: (metin: string) => void;
    sonuc?: (metin: string) => void;
    hata?: (kod: string) => void;
    bitti?: () => void;
  }
): Dinleyici | null {
  const Yapici = tanimaYapici();
  if (!Yapici) return null;

  const t = new Yapici();
  t.lang = dil === 'tr' ? 'tr-TR' : 'en-US';
  t.continuous = false;
  t.interimResults = true;

  let sonMetin = '';

  t.onresult = (e) => {
    let ara = '';
    let kesin = '';
    for (let i = 0; i < e.results.length; i++) {
      const r = e.results[i];
      const metin = r[0]?.transcript ?? '';
      if (r.isFinal) kesin += metin;
      else ara += metin;
    }
    if (kesin) {
      sonMetin = kesin;
      olaylar.sonuc?.(kesin.trim());
    } else if (ara) {
      olaylar.araSonuc?.(ara.trim());
    }
  };

  t.onerror = (e) => {
    // 'aborted' bizim durdurmamız; kullanıcıya hata gibi gösterilmemeli.
    if (e.error !== 'aborted') olaylar.hata?.(e.error);
  };

  t.onend = () => {
    // Kullanıcı konuştu ama tarayıcı hiç 'final' vermeden bitirdiyse eldeki
    // ara sonucu kaybetmemek için son bir şans.
    if (!sonMetin) olaylar.bitti?.();
    else olaylar.bitti?.();
  };

  try {
    t.start();
  } catch {
    return null;
  }

  return { durdur: () => t.abort() };
}
