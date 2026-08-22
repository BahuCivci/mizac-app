/**
 * Taban sınavını `lib/mizac-data.ts`'ten üretir.
 *
 * Bir seçenek tek bir mizaca 3 puan veriyorsa, o seçeneğin metni o mizacın
 * temiz göstergesidir. Model bunu bilemiyorsa dağınık konuşmayı hiç okuyamaz —
 * bu yüzden taban sınavı elemedir, asıl ölçüm `sinav-gercekci.jsonl`.
 *
 *   node --import ./icerik/kayit.mjs danisman/sinav-uret.ts > danisman/sinav-taban.jsonl
 */
import { sorular, type MizacTip } from '@/lib/mizac-data';

const TIPLER: MizacTip[] = ['safravi', 'demevi', 'balgami', 'sevdavi'];

const satirlar: string[] = [];
const dagilim: Record<string, number> = { safravi: 0, demevi: 0, balgami: 0, sevdavi: 0 };

for (const soru of sorular) {
  for (const secenek of soru.secenekler) {
    const uc = TIPLER.filter((t) => secenek.puan[t] >= 3);
    // İki mizaca birden 3 veren ya da hiçbirine 3 vermeyen seçenekler
    // tek doğru cevaba oturmaz; sınava alınmaz.
    if (uc.length !== 1) continue;
    const dogru = uc[0];
    dagilim[dogru]++;
    satirlar.push(
      JSON.stringify({
        soru_id: soru.id,
        kategori: soru.kategori,
        baglam: soru.soru,
        ifade: secenek.metin,
        dogru,
        puan: secenek.puan,
      })
    );
  }
}

process.stdout.write(satirlar.join('\n') + '\n');
process.stderr.write(`${satirlar.length} madde — ${JSON.stringify(dagilim)}\n`);
