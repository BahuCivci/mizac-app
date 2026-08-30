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

export type SesDurumu = 'bos' | 'dinliyor' | 'dusunuyor' | 'konusuyor';

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
  if (uygun.length) return uygun.find((s) => s.localService) ?? uygun[0];

  // İstenen dilde ses yoksa SUSMA. `lang` tanımadığı bir değere ayarlanınca
  // bazı tarayıcılar hiç konuşmuyor; eldeki herhangi bir sesle okumak,
  // aksanlı da olsa, sessizlikten iyi.
  return hepsi.find((s) => s.localService) ?? hepsi[0] ?? null;
}

/** Cihazda istenen dilde ses var mı — arayüzde durumu göstermek için. */
export function dildeSesVar(dil: 'tr' | 'en'): boolean {
  if (!sesVar()) return false;
  const on = dil === 'tr' ? 'tr' : 'en';
  return window.speechSynthesis.getVoices().some((s) => s.lang.toLowerCase().startsWith(on));
}

let uyandi = false;

/**
 * Ses motorunu kullanıcı hareketi içinde uyandırır.
 *
 * BU FONKSİYON OLMADAN SES HİÇ ÇIKMIYORDU.
 * Safari (Mac ve iOS) ve Chrome'un otomatik oynatma politikası, ilk
 * `speak()` çağrısının gerçek bir kullanıcı hareketinin içinde olmasını şart
 * koşuyor. Bizim ilk çağrımız ağ cevabı geldiğinde, tıklamadan saniyeler
 * sonra oluyordu; tarayıcı da hata vermeden yutuyordu — ne ses ne uyarı.
 *
 * Tıklamanın içinde sessiz bir söylem çalıştırmak motoru açıyor, sonraki
 * asenkron çağrılar serbest kalıyor. Bir kez yeterli.
 */
export function sesiUyandir(): void {
  if (!sesVar() || uyandi) return;
  uyandi = true;
  try {
    // Boş metni bazı tarayıcılar yok sayıyor; tek boşluk ve sıfır ses düzeyi.
    const s = new SpeechSynthesisUtterance(' ');
    s.volume = 0;
    window.speechSynthesis.speak(s);
  } catch {
    uyandi = false;
  }
}

export function sesUyandiMi(): boolean {
  return uyandi;
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

/**
 * Kuyrukta okunacak cümle kaldı mı.
 *
 * Seans kipinde mikrofonun ne zaman yeniden açılacağını bu belirliyor: danışman
 * daha konuşurken mikrofonu açmak, kendi sesini duyup cevap yazmasına yol açıyor.
 */
export function konusuyorMu(): boolean {
  return sesVar() && (window.speechSynthesis.speaking || window.speechSynthesis.pending);
}

/** Sekme arkaya alınıp dönüldüğünde Chrome sentezi askıda bırakıyor. */
export function sesiCanlandir(): void {
  if (!sesVar() || !sonSoylem) return;
  if (window.speechSynthesis.paused) window.speechSynthesis.resume();
}

/* ------------------------------------------------------------ söz kesme */

export interface Kulak {
  /** Sözün kesilmesini bekle (danışman konuşurken açılır). */
  gozet(): void;
  /** Gözetimi durdur ama mikrofonu kapatma. */
  birak(): void;
  kapat(): void;
}

/**
 * Kullanıcının araya girdiği anı yakalar.
 *
 * NEDEN AYRI BİR MİKROFON AKIŞI
 * Gerçek sohbette karşındakinin sözünü kesebilirsin. Bunu yapabilmek için
 * danışman konuşurken de mikrofonun açık olması gerekiyor — ama o zaman
 * mikrofon danışmanın kendi sesini duyuyor ve konuşma tanıma kendi cümlesini
 * metne çevirip cevap yazıyor.
 *
 * Çözüm: tanıma yerine burada ham ses seviyesine bakılıyor ve akış
 * `echoCancellation` ile açılıyor. Tarayıcı hoparlörden çıkan sesi mikrofon
 * girdisinden düşüyor, geriye büyük ölçüde odadaki gerçek ses kalıyor. Seviye
 * eşiği aşınca "kullanıcı konuşmaya başladı" deniyor, danışman susturuluyor ve
 * asıl tanıma başlatılıyor.
 *
 * SINIRI
 * Yankı engelleme hoparlörde mükemmel değil. Kulaklıkla kusursuz çalışıyor;
 * hoparlörde yüksek sesle dinlerken ara sıra kendi sesiyle tetiklenebilir.
 * Eşik ortamın gürültüsüne göre ayarlanıyor ki sessiz odada aşırı hassas,
 * gürültülü ortamda sağır olmasın.
 */
export async function kulakAc(algila: () => void): Promise<Kulak | null> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return null;

  let akis: MediaStream;
  try {
    akis = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
  } catch {
    return null;
  }

  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const baglam = new AC();
  const kaynak = baglam.createMediaStreamSource(akis);
  const cozumleyici = baglam.createAnalyser();
  cozumleyici.fftSize = 1024;
  kaynak.connect(cozumleyici);

  const veri = new Float32Array(cozumleyici.fftSize);
  let gozetiyor = false;
  let ustUsteYuksek = 0;
  // Ortam gürültüsü sürekli ölçülüyor: sessiz odada hassas, kafede sağır
  // olmasın diye eşik buna göre kayıyor.
  let taban = 0.004;
  let kare = 0;

  const olc = () => {
    kare = requestAnimationFrame(olc);
    cozumleyici.getFloatTimeDomainData(veri);
    let toplam = 0;
    for (let i = 0; i < veri.length; i++) toplam += veri[i] * veri[i];
    const rms = Math.sqrt(toplam / veri.length);

    if (!gozetiyor) {
      // Gözetim kapalıyken taban güncelleniyor — konuşulmadığı an burası.
      taban = taban * 0.95 + rms * 0.05;
      ustUsteYuksek = 0;
      return;
    }

    const esik = Math.max(taban * 4, 0.02);
    if (rms > esik) {
      ustUsteYuksek++;
      // ~6 kare (100 ms) sürekli yüksek: kapı çarpması, öksürük ya da
      // yankı artığı tek karede geçip gitmiyor, konuşma geçiyor.
      if (ustUsteYuksek >= 6) {
        gozetiyor = false;
        ustUsteYuksek = 0;
        algila();
      }
    } else {
      ustUsteYuksek = 0;
    }
  };
  olc();

  return {
    gozet: () => {
      ustUsteYuksek = 0;
      gozetiyor = true;
    },
    birak: () => {
      gozetiyor = false;
    },
    kapat: () => {
      cancelAnimationFrame(kare);
      akis.getTracks().forEach((t) => t.stop());
      void baglam.close();
    },
  };
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
