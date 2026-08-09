/**
 * İçerik atomlarını uygulamanın kendi verisinden çıkarır.
 *
 * Buradaki hiçbir metin elle yazılmamıştır: hepsi lib/mizac-data.ts,
 * lib/uyum-data.ts ve lib/blog-data.ts içindeki gerçek içerikten türetilir.
 * Sitede bir şey değişirse üretilen postlar da değişir — tek kaynak.
 */
import { mizacProfiller, sorular } from '../lib/mizac-data';
import type { MizacTip } from '../lib/mizac-data';
import { uyumVerisi, kombinasyonlar } from '../lib/uyum-data';
import { blogYazilari } from '../lib/blog-data';
import type { SutunId } from './temalar';

export type Atom = {
  id: string;
  sutun: SutunId;
  mizac?: MizacTip;
  /** Görselin/videonun üstündeki kanca */
  baslik: string;
  /** Ana gövde — madde madde ya da tek paragraf */
  maddeler: string[];
  /** İzlenebilirlik: bu içerik uygulamanın neresinden geldi */
  kaynak: string;
};

const TIPLER: MizacTip[] = ['safravi', 'demevi', 'balgami', 'sevdavi'];

export function atomlariUret(): Atom[] {
  const atomlar: Atom[] = [];
  const ekle = (a: Atom) => atomlar.push(a);

  for (const tip of TIPLER) {
    const p = mizacProfiller[tip];
    const ad = p.isim;

    ekle({
      id: `profil-${tip}`, sutun: 'profil', mizac: tip,
      baslik: `${ad} kimdir?`,
      maddeler: [p.kisaAciklama, ...p.gucluYonler.slice(0, 4)],
      kaynak: `mizacProfiller.${tip}.gucluYonler`,
    });
    ekle({
      id: `golge-${tip}`, sutun: 'profil', mizac: tip,
      baslik: `${ad} mizacın gölge tarafı`,
      maddeler: p.zayifYonler,
      kaynak: `mizacProfiller.${tip}.zayifYonler`,
    });
    ekle({
      id: `beslenme-${tip}`, sutun: 'beslenme', mizac: tip,
      baslik: `${ad} mizaç ne yemeli?`,
      maddeler: p.beslenme,
      kaynak: `mizacProfiller.${tip}.beslenme`,
    });
    ekle({
      id: `yasak-${tip}`, sutun: 'beslenme', mizac: tip,
      baslik: `${ad} mizacın uzak durması gerekenler`,
      maddeler: p.yasak,
      kaynak: `mizacProfiller.${tip}.yasak`,
    });
    ekle({
      id: `detoks-${tip}`, sutun: 'beslenme', mizac: tip,
      baslik: `${ad} mizaca özel detoks`,
      maddeler: p.detoks,
      kaynak: `mizacProfiller.${tip}.detoks`,
    });
    ekle({
      id: `saglik-${tip}`, sutun: 'saglik', mizac: tip,
      baslik: `${ad} mizacın sağlık eğilimleri`,
      maddeler: p.saglikEgilimleri,
      kaynak: `mizacProfiller.${tip}.saglikEgilimleri`,
    });
    ekle({
      id: `agri-${tip}`, sutun: 'saglik', mizac: tip,
      baslik: `${ad} ağrıyı nasıl tarif eder?`,
      maddeler: [p.agriTipi, ...p.hastaliklar.slice(0, 3)],
      kaynak: `mizacProfiller.${tip}.agriTipi`,
    });
    ekle({
      id: `fiziksel-${tip}`, sutun: 'profil', mizac: tip,
      baslik: `${ad} mizacı bedeninden tanı`,
      maddeler: p.fiziksel,
      kaynak: `mizacProfiller.${tip}.fiziksel`,
    });
    ekle({
      id: `manevi-${tip}`, sutun: 'manevi', mizac: tip,
      baslik: `${ad} mizaca önerilen esmalar`,
      maddeler: [...p.esmalar.slice(0, 5), p.halife],
      kaynak: `mizacProfiller.${tip}.esmalar`,
    });
    ekle({
      id: `gunluk-${tip}`, sutun: 'gunluk', mizac: tip,
      baslik: `${ad} mizacın ritmi`,
      maddeler: [
        `Vakti: ${p.vakit}`,
        `Mevsimi: ${p.mevsim}`,
        `Yaş dönemi: ${p.yasDonem}`,
        `Ona iyi gelen renkler: ${p.renkOnerilir.join(', ')}`,
        `Kaçınması gerekenler: ${p.renkOnerilmez.join(', ')}`,
      ],
      kaynak: `mizacProfiller.${tip}.vakit/mevsim/renk`,
    });
    ekle({
      id: `cocuk-${tip}`, sutun: 'cocuk', mizac: tip,
      baslik: `${ad} mizaçlı çocuk`,
      maddeler: p.cocukOzellikleri,
      kaynak: `mizacProfiller.${tip}.cocukOzellikleri`,
    });
    ekle({
      id: `kariyer-${tip}`, sutun: 'kariyer', mizac: tip,
      baslik: `${ad} mizaca uygun meslekler`,
      maddeler: p.kariyer,
      kaynak: `mizacProfiller.${tip}.kariyer`,
    });
    ekle({
      id: `sevgi-${tip}`, sutun: 'uyum', mizac: tip,
      baslik: `${ad} mizacın sevgi dili`,
      maddeler: [p.sevgiDili, p.iliski],
      kaynak: `mizacProfiller.${tip}.sevgiDili`,
    });
    ekle({
      id: `duygu-${tip}`, sutun: 'saglik', mizac: tip,
      baslik: `${ad} mizacın duygu haritası`,
      maddeler: p.duygular,
      kaynak: `mizacProfiller.${tip}.duygular`,
    });
  }

  // Uyum çiftleri
  for (const k of kombinasyonlar) {
    const u = uyumVerisi[k.a][k.b];
    const a = mizacProfiller[k.a].isim;
    const b = mizacProfiller[k.b].isim;
    ekle({
      id: `uyum-${k.slug}`, sutun: 'uyum',
      baslik: `${a} × ${b} — %${u.puan}`,
      maddeler: [u.baslik, u.aciklama, ...u.gucler.map((g) => `Güçlü: ${g}`), ...u.zorluklar.map((z) => `Zorluk: ${z}`)],
      kaynak: `uyumVerisi.${k.a}.${k.b}`,
    });
  }

  // Test soruları — etkileşim için
  for (const s of sorular) {
    ekle({
      id: `soru-${s.id}`, sutun: 'test',
      baslik: s.soru,
      maddeler: s.secenekler.map((x, i) => `${['A', 'B', 'C', 'D'][i]}) ${x.metin}`),
      kaynak: `sorular[${s.id}]`,
    });
  }

  // Blog yazıları — uzun form
  for (const y of blogYazilari) {
    ekle({
      id: `blog-${y.slug}`, sutun: 'blog',
      baslik: typeof y.baslik === 'string' ? y.baslik : String(y.baslik),
      maddeler: [typeof y.ozet === 'string' ? y.ozet : String(y.ozet)],
      kaynak: `blogYazilari.${y.slug}`,
    });
  }

  return atomlar;
}
