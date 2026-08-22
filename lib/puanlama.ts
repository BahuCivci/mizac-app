// Yalnız tip olarak kullanılıyor; `import type` olmazsa Node tipleri soyarken
// bunu değer sanıp çalışma anında hata veriyor (danisman/ script'leri).
import type { MizacTip } from './mizac-data';

const TIPLER: MizacTip[] = ['safravi', 'demevi', 'balgami', 'sevdavi'];

/**
 * Kazanan mizacı belirler.
 *
 * Önceden `Object.keys(puanlar).reduce((a, b) => puanlar[a] > puanlar[b] ? a : b)`
 * kullanılıyordu. Bu, beraberlikte her zaman anahtar sırasındaki *sonraki* tipi
 * döndürüyordu; sıra safravi→demevi→balgami→sevdavi olduğu için berabere kalan
 * kullanıcılar sistematik olarak sevdavîye kayıyor, safravî bir beraberliği
 * asla kazanamıyordu. Rastgele cevaplarla yapılan simülasyonda testlerin
 * ~%4.5'i berabere bitiyor, yani bu az görülen bir köşe durumu değil.
 *
 * Yeni kural:
 *  1. En yüksek puanı alan tip(ler) bulunur.
 *  2. Beraberlik varsa, kullanıcının o mizaç için kaç kez *güçlü* (3 puanlık)
 *     cevap verdiğine bakılır — hangi mizaca daha kararlı yöneldiği.
 *  3. Hâlâ eşitse, toplam puandan türeyen sabit bir kaymayla seçilir: aynı
 *     cevaplar hep aynı sonucu verir ama hiçbir tip kalıcı avantaj kazanmaz.
 */
export function kazananBelirle(
  puanlar: Record<MizacTip, number>,
  secilenPuanlar: Partial<Record<MizacTip, number>>[] = []
): MizacTip {
  const enYuksek = Math.max(...TIPLER.map((t) => puanlar[t]));
  const berabere = TIPLER.filter((t) => puanlar[t] === enYuksek);

  if (berabere.length === 1) return berabere[0];

  // 2. ölçüt: güçlü (3 puanlık) cevap sayısı
  const gucluSayisi = (tip: MizacTip) =>
    secilenPuanlar.reduce((n, p) => n + ((p?.[tip] ?? 0) >= 3 ? 1 : 0), 0);

  const enGuclu = Math.max(...berabere.map(gucluSayisi));
  const kalan = berabere.filter((t) => gucluSayisi(t) === enGuclu);
  if (kalan.length === 1) return kalan[0];

  // 3. ölçüt: deterministik ama tipe göre yanlı olmayan kayma.
  // Puanların toplamı kullanılamaz: dört tip de berabereyken toplam her zaman
  // 4'ün katı olur ve `toplam % 4` daima 0 verip hep ilk tipi seçerdi.
  // Bunun yerine puanlar sırayla karıştırılır.
  let tohum = secilenPuanlar.length;
  for (const t of TIPLER) tohum = (tohum * 31 + puanlar[t]) % 100003;
  return kalan[tohum % kalan.length];
}
