/**
 * Danışmanın o turda hangi konuşma hamlesini yapacağını seçer.
 *
 * Neden var: danışmanın repertuvarı tek hamleden ibaretti — gözlemle ve sor.
 * "Mülakatçı gibi" hissinin sebebi üslup değil, eksik tasarımdı. Koçluk/terapi
 * yapay zekâlarının dayandığı motivasyonel görüşme çerçevesinde danışmanın
 * elinde yansıtma, onaylama, yeniden çerçeveleme, özetleme gibi hamleler var ve
 * soru bunlardan yalnızca biri (bkz. arastirma.md).
 *
 * Seçim neden kodda: GPTCoach stratejiyi ayrı bir model çağrısıyla seçiyor. Biz
 * deterministik seçiyoruz — elimizde zaten zengin durum var (kanıt sayısı,
 * güven, eksik alanlar, tur sırası), tur başına ikinci bir çağrı 5-10 saniye
 * daha eklerdi, ve deterministik seçim modelsiz test edilebiliyor.
 */
import type { Durum, Kanit } from './kanit';
import { eksikAlanlar, nemYoklamasiGerek } from './kanit';

export type StratejiAdi =
  | 'yansitma'
  | 'duygulanim'
  | 'onaylama'
  | 'cerceveleme'
  | 'acik_soru'
  | 'hedefli_soru'
  | 'ozet';

export interface Strateji {
  ad: StratejiAdi;
  /** Modele o tur ne yapacağını söyleyen yönerge. */
  yonerge: string;
  /** Bu hamlede soru sorulur mu — sorulmuyorsa çıktıdan da ayıklanır. */
  soruVar: boolean;
  /**
   * Bu hamlede en fazla kaç cümle.
   *
   * Soru sormayan hamlelerde model, cevabı bağlayacak bir çıpa kalmayınca
   * boşluğu genel geçer lafla dolduruyor ("tamamen normal", "herkes
   * farklıdır"). Yansıtma zaten kısa olmalı; sınır dar tutuluyor.
   */
  enFazlaCumle: number;
}

const STRATEJILER: Record<StratejiAdi, Omit<Strateji, 'ad'>> = {
  yansitma: {
    yonerge:
      'BU TUR: basit yansıtma yap. Kişinin söylediğini kendi cümlenle geri ver ' +
      'ki duyulduğunu bilsin. Soru SORMA, yorum ekleme, öğüt verme.',
    soruVar: false,
    enFazlaCumle: 2,
  },
  duygulanim: {
    yonerge:
      'BU TUR: duyguyu yansıt. Anlattığının altındaki duyguyu adlandır ' +
      '("yorucu olmalı", "canını sıkmış") ama teşhis koyar gibi değil, ' +
      'tahmin eder gibi söyle. Soru SORMA.',
    soruVar: false,
    enFazlaCumle: 2,
  },
  onaylama: {
    yonerge:
      'BU TUR: onayla. Kişinin anlattığı içinde gerçekten değerli ya da zor ' +
      'olan bir şeyi göster. Boş iltifat değil, somut olana değin. Soru SORMA.',
    soruVar: false,
    enFazlaCumle: 2,
  },
  cerceveleme: {
    yonerge:
      'BU TUR: yeniden çerçevele. Anlattığı şeye başka bir açıdan bak — ' +
      'kusur gibi gördüğü şeyin işlevini, ya da alışkanlığının ona ne ' +
      'kazandırdığını göster. Tek bir soruyla bitirebilirsin.',
    soruVar: true,
    enFazlaCumle: 3,
  },
  acik_soru: {
    yonerge:
      'BU TUR: kısaca karşılık ver, sonra açık uçlu TEK bir soru sor. ' +
      'Evet/hayırla cevaplanan soru sorma.',
    soruVar: true,
    enFazlaCumle: 3,
  },
  hedefli_soru: {
    yonerge:
      'BU TUR: kısaca karşılık ver, sonra öğrenmen gereken şeyi TEK bir soruyla ' +
      'sor. Sorgu gibi olmasın; sohbetin akışına yedir.',
    soruVar: true,
    enFazlaCumle: 3,
  },
  ozet: {
    yonerge:
      'BU TUR: konuşulanları toparla. Kişinin kendi sözlerinden yola çıkarak ' +
      'ne gördüğünü söyle ve kanaatini paylaş. Sonunda ona söz hakkı bırak.',
    soruVar: true,
    enFazlaCumle: 4,
  },
};

/** Kişinin sözünde belirgin duygu yükü var mı — kabaca, sözcük düzeyinde. */
const DUYGU_IZI =
  /ağl|üzü|üzgün|yoruyor|yorgun|bunal|zorlan|korku|kaygı|endişe|yalnız|çaresiz|bıkt|dayanam|sıkıl|utan|kızgın|öfke|pişman|suçlu/i;

export interface SecimDurumu {
  kanitlar: Kanit[];
  durum: Durum | null;
  /** Kaçıncı kullanıcı mesajı (1'den başlar). */
  tur: number;
  sonSoz: string;
  /** Kanaat bildirilebilir mi — puanlama eşiği geçildi mi. */
  kanaatVar: boolean;
}

/**
 * Sıra tabanlı kural: soru soran hamleler arka arkaya gelmesin.
 *
 * Her turu soruya bağlamak sorgu hissi veriyordu. Üç turda bir soru sormayan
 * bir hamle zorunlu kılınıyor; böylece "her turda soru sorman gerekmez" bir
 * temenni olmaktan çıkıp yapıya giriyor.
 */
export function stratejiSec(s: SecimDurumu): Strateji {
  const ad = adSec(s);
  return { ad, ...STRATEJILER[ad] };
}

function adSec(s: SecimDurumu): StratejiAdi {
  // Kanaat oluştuysa toparla — ama her turda değil.
  //
  // İlk sürümde koşul yalnız `kanaatVar && kanıt >= 8` idi; bir kez sağlanınca
  // kalıcı olarak sağlandığı için danışman 5., 6. ve 7. turda üst üste özet
  // geçti. Özet ara verilerek gelmeli, yoksa sohbet kapanış konuşmasına döner.
  if (s.kanaatVar && s.kanitlar.length >= 8 && s.tur % 4 === 0) return 'ozet';

  // Duygu yüklü bir şey anlatıldıysa önce ona değin, soruyla üstünden geçme.
  if (DUYGU_IZI.test(s.sonSoz)) {
    return s.tur % 2 === 0 ? 'duygulanim' : 'onaylama';
  }

  // İlk tur: tanışma. Soru sorulur ama açık uçlu.
  if (s.tur === 1) return 'acik_soru';

  // Her üçüncü turda soru sorulmaz — sorgu ritmini kırar.
  if (s.tur % 3 === 0) return s.tur % 6 === 0 ? 'cerceveleme' : 'yansitma';

  // Nem ekseninde karar verilemiyor: hedefli soru.
  if (s.durum && nemYoklamasiGerek(s.durum)) return 'hedefli_soru';

  // Hâlâ hiç değinilmemiş çok alan varsa oraya doğru aç.
  if (eksikAlanlar(s.kanitlar).length > 4) return 'acik_soru';

  return 'acik_soru';
}

/**
 * Stratejiye göre modele verilecek yönerge; `yonerge()` notuyla birleşir.
 * Kullanıcıya gösterilmez.
 */
export function stratejiNotu(strateji: Strateji): string {
  return `[yönerge — kullanıcıya gösterme]\n${strateji.yonerge}`;
}
