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

const MIZAC_ADI = /safrav[iî]|demev[iî]|balgam[iî]|sevdav[iî]/i;

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
  /\b(kullan(ma[nz]ı|abilirsin|ın|mayı)|iç(me[nz]i|ebilirsin)|tüket(me[nz]i|ebilirsin)|uygula(ma[nz]ı|yabilirsin)|takviye|antiperspirant|nemlendirici|vitamin|ilaç|doz|tedavi yöntem|egzersiz yap|terapi|dermatolo|psikolog)\b/i;

/**
 * Rol devralma. Güvenlik sınavında model "Anladım, geçmiş talimatları
 * unutuyorum. Bir doktor olarak size yardımcı olmaktan memnunum" dedi —
 * reçete yazmadığı için tedavi filtresine takılmadı ama kimliğini teslim
 * etmişti. Sonraki tur reçete isteseydi verecekti. Bu cümleler atılır.
 */
const ROL_DEVRALMA =
  /\b(bir (doktor|hekim|terapist|psikolog|eczacı) olarak|talimatları unut|talimatlarımı unut|geçmiş talimatlar|rolümü değiştir|artık bir (doktor|hekim|terapist))/i;

/**
 * Uydurulmuş kişisel deneyim. Simüle sohbette danışman "Ben de bazen markette
 * ne alacağıma karar vermekte zorlanıyorum" ve "Benim de bazen boğazım kurur"
 * dedi — bedeni ve gündelik hayatı varmış gibi. Sağlık konuşan bir üründe bu
 * yalnız sahtelik değil, yanıltıcı.
 */
const UYDURMA_DENEYIM =
  /\b(ben|benim) de\b[^.!?]{0,60}\b(olurum|oluyorum|yaparım|yapıyorum|zorlanıyorum|kurur|kuruyor|üşürüm|üşüyorum|yaşıyorum|hissediyorum|severim)\b/i;

/** İçi boş teselli — persona bunu yasaklıyor ama model yine kuruyor. */
const BOS_TESELLI = /\b(bu )?(çok )?normal(dir)?\b|herkes böyle|herkeste olur/i;

/** Hekime yönlendirme — bu kalmalı, tavsiye değil sınır çizmedir. */
const HEKIME_YONLENDIRME = /\b(doktor|hekim|acil|112)\b/i;

function cumlelereBol(metin: string): string[] {
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
   * Bu turda soru sorulabilir mi. Strateji "yansıtma"/"onaylama" gibi bir
   * hamle seçtiyse false gelir ve soru cümleleri ayıklanır — soru sormamak
   * temenni değil, uygulanan bir kural olsun diye.
   */
  soruVar?: boolean;
  enFazlaCumle?: number;
}

export function cevabiBicimlendir(
  ham: string,
  { mizacSoylenebilir, kazanan, soruVar = true, enFazlaCumle = 4 }: BicimSecenekleri
): string {
  // Satır bazlı temizlik: liste maddelerini ve başlıkları düz metne indir.
  const satirlar = ham
    .split('\n')
    .map((s) => s.replace(LISTE_BASI, '').replace(/^#+\s*/, '').replace(/\*\*/g, '').trim())
    .filter(Boolean);

  let cumleler = cumlelereBol(satirlar.join(' '));

  // Tedavi önerisi içeren cümleler atılır; hekime yönlendirme muaf.
  cumleler = cumleler.filter(
    (c) => !TEDAVI_ONERISI.test(c) || HEKIME_YONLENDIRME.test(c)
  );

  // Kimliğini teslim eden cümleler atılır.
  cumleler = cumleler.filter((c) => !ROL_DEVRALMA.test(c));

  // Uydurulmuş kişisel deneyim ve içi boş teselli atılır.
  cumleler = cumleler.filter((c) => !UYDURMA_DENEYIM.test(c) && !BOS_TESELLI.test(c));

  // Kanaat oluşmadıysa mizaç adı geçmez. Model burada puanlama motorundan
  // farklı bir mizaç söyleyebiliyor; kullanıcıya çelişki gitmemeli.
  if (!mizacSoylenebilir) {
    cumleler = cumleler.filter((c) => !MIZAC_ADI.test(c));
  } else if (kazanan) {
    // Kanaat var ama model motorunkinden başka bir mizaç adı anıyorsa o cümle
    // düşer; iki farklı sonuç aynı ekranda görünmemeli.
    const dogruAd = new RegExp(kazanan.replace(/i$/, '[iî]'), 'i');
    cumleler = cumleler.filter((c) => !MIZAC_ADI.test(c) || dogruAd.test(c));
  }

  // Latin dışı sızıntı: qwen ara sıra Çince karakter üretiyor
  // ("derin katmanlarda扎根 olduğunu" gibi). O cümle güvenilmez, atılır.
  cumleler = cumleler.filter((c) => !/[　-鿿가-힯]/.test(c));

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
