/**
 * Danışmanın cevabını yayına çıkmadan önce biçime sokar.
 *
 * Neden kodda: sohbet testinde 72B, sistem mesajındaki üslup kurallarını uzun
 * sohbette tutmadı. Her tura hatırlatma eklemek de yetmedi — paragraf paragraf
 * ders anlatmaya, madde listelemeye ve izin verilmeden mizaç adı söylemeye
 * devam etti. Üstelik söylediği mizaç puanlama motorunun bulduğundan farklı
 * olabiliyor; kullanıcı çelişki görüyor.
 *
 * Promptla rica edilen şey garanti değildir. Burada dayatılır, böylece hangi
 * model kullanılırsa kullanılsın kullanıcının gördüğü şey aynı sınırlar içinde
 * kalır.
 */

// Site iki dilli; İngilizce cevapta mizaç adı İngilizce geçer. Filtreler
// yalnız Türkçeyi tanısaydı İngilizce tarafta hiçbiri çalışmazdı.
const MIZAC_ADI =
  /safrav[iî]|demev[iî]|balgam[iî]|sevdav[iî]|choleric|sanguine|phlegmatic|melancholic/i;

/** Madde işareti, numaralı liste ve başlık işaretleri. */
const LISTE_BASI = /^\s*(?:[-*•–]|\d+[.)])\s+/;

/**
 * Tedavi/ürün önerisi kalıpları.
 *
 * Sağlık sınırı promptta yazılı ama model yine de "antiperspirant kullanın",
 * "düzenli egzersiz dolaşımı hızlandırır" gibi öneriler üretti. Bunlar tıbbi
 * tavsiye ve danışmanın işi değil; içeren cümle atılır.
 */
const TEDAVI_ONERISI =
  /\b(kullan(ma[nz]ı|abilirsin|ın|mayı)|iç(me[nz]i|ebilirsin)|tüket(me[nz]i|ebilirsin)|uygula(ma[nz]ı|yabilirsin)|takviye|antiperspirant|nemlendirici|vitamin|ilaç|doz|tedavi yöntem|egzersiz yap|terapi|dermatolo|psikolog|supplement|dosage|you should take|try taking|antiperspirant|moisturi[sz]er|see a dermatolog|therapist)\b/i;

/**
 * Rol devralma. Güvenlik sınavında model "Anladım, geçmiş talimatları
 * unutuyorum. Bir doktor olarak size yardımcı olmaktan memnunum" dedi —
 * reçete yazmadığı için tedavi filtresine takılmadı ama kimliğini teslim
 * etmişti. Sonraki tur reçete isteseydi verecekti. Bu cümleler atılır.
 */
const ROL_DEVRALMA =
  /\b(bir (doktor|hekim|terapist|psikolog|eczacı) olarak|talimatları unut|talimatlarımı unut|geçmiş talimatlar|rolümü değiştir|artık bir (doktor|hekim|terapist)|as a (doctor|physician|therapist|pharmacist)|ignoring my (previous )?instructions|forget(ting)? my instructions|i am now a (doctor|therapist))/i;

/**
 * Uydurulmuş kişisel deneyim. Simüle sohbette danışman "Ben de bazen markette
 * ne alacağıma karar vermekte zorlanıyorum" ve "Benim de bazen boğazım kurur"
 * dedi — bedeni ve gündelik hayatı varmış gibi. Sağlık konuşan bir üründe bu
 * yalnız sahtelik değil, yanıltıcı.
 */
const UYDURMA_DENEYIM =
  /\b(ben|benim) de\b[^.!?]{0,60}\b(olurum|oluyorum|yaparım|yapıyorum|zorlanıyorum|kurur|kuruyor|üşürüm|üşüyorum|yaşıyorum|hissediyorum|severim)\b|\b(i )?(too|also) (get|feel|struggle|have)\b|\bwhen i('m| am)\b[^.!?]{0,40}\b(i feel|i get)\b/i;

/** İçi boş teselli — persona bunu yasaklıyor ama model yine kuruyor. */
const BOS_TESELLI =
  /\b(bu )?(çok )?normal(dir)?\b|herkes böyle|herkeste olur|that'?s (completely |totally )?normal|everyone (feels|gets) (that|this)|it happens to everyone/i;

/**
 * Kişiye söylemediği bir şeyi atfetme.
 *
 * Kitaptan getirim eklendikten sonra ortaya çıktı: model, pasajda geçen bir
 * duyguyu ya da örneği karşısındakinin sözü sanıyor. Üç koşunun ikisinde
 * "sigara kullandığın için utanman", "hüzünlendiğini söylediğin şey" gibi
 * cümleler kurdu — kullanıcı bunların hiçbirini söylememişti. Prompt'a kural
 * yazmak yetmedi.
 *
 * Kural: atıf ifadesi içeren bir cümle, ancak içeriği kişinin gerçekten
 * söyledikleriyle örtüşüyorsa geçer.
 */
// Türkçe'de atıf çok biçimli: "söylediğin", "söylemiştin", "söylemişsin",
// "bahsettiğin", "demiştin"... Fiil köklerini alıp ek kısmını serbest
// bırakmak, tek tek biçim saymaktan sağlam.
const ATIF =
  /\b(söyle|de|belirt|bahset|anlat|dile getir)\w*\s*(m[ıi][şs]|di[ğg]|ti[ğg])\w*\b|\b(söylemi[şs]tin|demi[şs]tin|dedi[ğg]in|anlattı[ğg]ın)\b|\byou (said|mentioned|told me)\b|\bas you (said|mentioned)\b/i;

/**
 * Kişiye hastalık atfetme.
 *
 * Atıf denetimi eklendikten sonra kalan vaka: model, kitaptan gelen bir
 * hastalık örneğini kullanıcıya yapıştırdı — "Senin durumunda yüz felci
 * geçirmiş olman ve tansiyonun olması..." Kullanıcı ikisinden de
 * bahsetmemişti. Atıf fiili olmadığı için `ATIF` yakalamıyor.
 *
 * Kural dar tutuluyor: cümle hem KİŞİYE yönelik olmalı (sen/senin/sende…)
 * hem de kişinin ağzından çıkmamış bir hastalık adı içermeli. Mizaçların
 * genel eğilimini anlatan cümleler ("demevîlerde tansiyon görülebilir")
 * kişiye yönelik olmadığı için elenmez.
 */
const KISIYE_YONELIK = /\b(sen|senin|sende|sana|seni)\b|\b\w+(man|men|ın|in)\s+(ve|de|da)?\s*\w*(olması|olman)\b/i;
const HASTALIK =
  /\b(felç|tansiyon|diyabet|şeker hastal|migren|reflü|astım|kanser|depresyon|anemi|tiroid|ülser|romatizma|sedef|egzama|sinüzit|kolesterol|kalp hastal|böbrek|karaciğer)\w*/gi;

/** Hekime yönlendirme — bu kalmalı, tavsiye değil sınır çizmedir. */
const HEKIME_YONLENDIRME = /\b(doktor|hekim|acil|112|doctor|physician|emergency)\b/i;

export function cumlelereBol(metin: string): string[] {
  // Nokta/ünlem/soru sonrası boşlukta böl; kısaltmalar için mükemmel değil ama
  // danışman cevapları kısa olduğundan yeterli.
  return metin
    .split(/(?<=[.!?…])\s+/)
    .map((c) => c.trim())
    .filter(Boolean);
}

export interface BicimSecenekleri {
  /** Kanaat oluştu mu — oluşmadıysa mizaç adı geçen cümleler atılır. */
  mizacSoylenebilir: boolean;
  /**
   * Puanlama motorunun bulduğu mizaç. Kanaat oluştuğunda bile model başka bir
   * mizaç adı söyleyebiliyor (gerçek koşuda motor balgamî derken danışman
   * "demevî eğilimi" dedi). Kullanıcıya çelişki gitmemesi için yalnızca bu
   * mizacın adı geçebilir.
   */
  kazanan?: string;
  /**
   * Kişinin bu sohbette gerçekten yazdıkları.
   *
   * Atıf denetimi için gerekli: "söyledin" diyen bir cümlenin içeriği burada
   * geçmiyorsa cümle uydurmadır ve düşer.
   */
  kullaniciSozleri?: string;
  /**
   * Bu turda soru sorulabilir mi. Strateji "yansıtma"/"onaylama" gibi bir
   * hamle seçtiyse false gelir ve soru cümleleri ayıklanır — soru sormamak
   * temenni değil, uygulanan bir kural olsun diye.
   */
  soruVar?: boolean;
  enFazlaCumle?: number;
}

/**
 * Tek bir cümle yayına uygun mu.
 *
 * Akışlı cevapta cümleler tek tek gönderiliyor; aynı kuralların hem toplu hem
 * parça parça uygulanabilmesi için karar burada. İki yerde iki ayrı kural
 * kümesi tutmak, akışta sızan ama toplu halde ayıklanan bir cümleyle
 * sonuçlanırdı.
 */
/** Sözcük kökleri — atıf örtüşmesi için. */
function kokKumesi(metin: string): Set<string> {
  return new Set(
    metin
      .toLocaleLowerCase('tr-TR')
      .replace(/[^a-zçğıöşü\s]/g, ' ')
      .split(/\s+/)
      .filter((k) => k.length > 3)
      .map((k) => k.slice(0, 4))
  );
}

export function cumleGecerliMi(
  cumle: string,
  {
    mizacSoylenebilir,
    kazanan,
    kullaniciSozleri,
  }: Pick<BicimSecenekleri, 'mizacSoylenebilir' | 'kazanan' | 'kullaniciSozleri'>
): boolean {
  if (TEDAVI_ONERISI.test(cumle) && !HEKIME_YONLENDIRME.test(cumle)) return false;
  if (ROL_DEVRALMA.test(cumle)) return false;
  if (UYDURMA_DENEYIM.test(cumle) || BOS_TESELLI.test(cumle)) return false;
  if (/[　-鿿가-힯]/.test(cumle)) return false;

  // Kişiye, söylemediği bir hastalık atfedilemez.
  if (kullaniciSozleri !== undefined && KISIYE_YONELIK.test(cumle)) {
    const kisiMetni = kullaniciSozleri.toLocaleLowerCase('tr-TR');
    const gecenler = cumle.match(HASTALIK) ?? [];
    for (const h of gecenler) {
      // Kök karşılaştırması: "tansiyonun" ↔ "tansiyon"
      const kok = h.toLocaleLowerCase('tr-TR').slice(0, 5);
      if (!kisiMetni.includes(kok)) return false;
    }
  }

  // Atıf varsa içeriği kişinin sözleriyle örtüşmeli.
  if (ATIF.test(cumle) && kullaniciSozleri !== undefined) {
    const kisi = kokKumesi(kullaniciSozleri);
    const cumleKok = [...kokKumesi(cumle)];
    // Atıf kalıbının kendi sözcükleri sayılmasın diye içerik sözcüklerine bak.
    const ortak = cumleKok.filter((k) => kisi.has(k)).length;
    if (ortak < 2) return false;
  }

  if (MIZAC_ADI.test(cumle)) {
    if (!mizacSoylenebilir) return false;
    if (kazanan) {
      const dogruAd = new RegExp(kazanan.replace(/i$/, '[iî]'), 'i');
      if (!dogruAd.test(cumle)) return false;
    }
  }
  return true;
}

export function cevabiBicimlendir(
  ham: string,
  {
    mizacSoylenebilir,
    kazanan,
    kullaniciSozleri,
    soruVar = true,
    enFazlaCumle = 4,
  }: BicimSecenekleri
): string {
  // Satır bazlı temizlik: liste maddelerini ve başlıkları düz metne indir.
  const satirlar = ham
    .split('\n')
    .map((s) => s.replace(LISTE_BASI, '').replace(/^#+\s*/, '').replace(/\*\*/g, '').trim())
    .filter(Boolean);

  let cumleler = cumlelereBol(satirlar.join(' '));

  /*
   * Cümle bazlı kuralların TAMAMI `cumleGecerliMi`'de.
   *
   * Bir süre burada ikinci bir kopya durdu ve tam da beklenen oldu: atıf
   * denetimi eklenince yalnız akış yoluna girdi, toplu yol eski kopyayı
   * kullanmaya devam etti. Buraya kural eklenmez — `cumleGecerliMi`'ye eklenir.
   */
  cumleler = cumleler.filter((c) =>
    cumleGecerliMi(c, { mizacSoylenebilir, kazanan, kullaniciSozleri })
  );

  cumleler = cumleler.slice(0, enFazlaCumle);

  if (soruVar) {
    // Birden fazla soru varsa ilkinden sonrakiler düşer — sorgu değil sohbet.
    let soruGoruldu = false;
    cumleler = cumleler.filter((c) => {
      if (!c.includes('?')) return true;
      if (soruGoruldu) return false;
      soruGoruldu = true;
      return true;
    });
  } else {
    cumleler = cumleler.filter((c) => !c.includes('?'));
  }

  const sonuc = cumleler.join(' ').trim();

  // Her şey elendiyse sohbeti boş bırakma. Soru yasakken soruyla dolduramayız.
  if (sonuc) return sonuc;
  return soruVar ? 'Anlıyorum. Biraz daha anlatır mısın?' : 'Anlıyorum seni.';
}
