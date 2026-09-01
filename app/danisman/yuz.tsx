'use client';

import { useEffect, useRef } from 'react';
import type { SesDurumu } from './ses';

/**
 * Danışmanın yüzü — SVG ile çizilmiş, konuşmayla senkron.
 *
 * NEDEN SVG, NEDEN 3B DEĞİL
 * İlk sürüm Three.js ile ilkel şekillerden (küre kafa, koni burun) bir baş
 * kuruyordu ve "seramik büst" gibi duruyordu — kullanıcının tepkisi "insana
 * bile benzemiyor, çok dandik" oldu, haklıydı. İlkel geometriyle insan yüzü
 * yapmak, elde çizmekten kat kat zor. SVG'de her hattı doğrudan kontrol
 * edebiliyorum; üstelik 600 KB'lık three.js bağımlılığı da ortadan kalkıyor
 * ve WebGL'siz cihazlarda da çalışıyor.
 *
 * NEDEN FOTOGERÇEKÇİ DEĞİL
 * Kasıtlı olarak çizim üslubunda. Sağlığa değen bir konuda konuşan yapay
 * zekâya fotogerçekçi bir surat takmak, karşısındakine hekimle konuştuğunu
 * düşündürebilir. Çizim, "burada biri var" der ama "bu gerçek bir insan"
 * demez.
 *
 * ANİMASYON REF İLE, STATE İLE DEĞİL
 * Ağız her karede güncelleniyor; React state kullanmak saniyede 60 render
 * demek olurdu. DOM'a doğrudan yazılıyor.
 */

const TEN = '#e8c9a0';
const TEN_GOLGE = '#d2a87c';
// Saç arka plandan AYRILMAK zorunda: ilk denemede #2e2011'di ve koyu zeminle
// birleşip kafa siluetini yok ediyordu — yüz karanlık bir kütlenin içinde
// yüzüyor gibi duruyordu. Sıcak kahve, zeminden belirgin biçimde açık.
const SAC = '#5c4020';
const SAC_ISIK = '#7a5730';
const AK = '#fdfaf5';
const IRIS = '#6b4423';
const AGIZ_IC = '#7d3f38';
const DUDAK = '#c98070';
const ALTIN = '#c4973a';

export default function Yuz({
  durum,
  agizTetik,
}: {
  durum: SesDurumu;
  /** Her artışında ağız bir kez açılır. Kelime sınırı sayacı. */
  agizTetik: number;
}) {
  const agizRef = useRef<SVGEllipseElement>(null);
  const dudakRef = useRef<SVGPathElement>(null);
  const solKapakRef = useRef<SVGGElement>(null);
  const sagKapakRef = useRef<SVGGElement>(null);
  const kafaRef = useRef<SVGGElement>(null);
  const solKasRef = useRef<SVGPathElement>(null);
  const sagKasRef = useRef<SVGPathElement>(null);

  /*
   * Çizim döngüsü saniyede 60 kez çalışıyor ve güncel `durum`/`agizTetik`
   * değerlerini görmesi gerekiyor — ama döngüyü her prop değişiminde yeniden
   * kurmak animasyonu sıfırlardı. Değerler ref'lere kopyalanıp döngü oradan
   * okuyor. Kopyalama effect içinde: React'in kural denetimi render sırasında
   * ref'e yazmayı yasaklıyor.
   */
  const acikRef = useRef(0);
  const durumRef = useRef<SesDurumu>(durum);
  const tetikRef = useRef(agizTetik);
  const gorulenTetikRef = useRef(agizTetik);

  useEffect(() => {
    durumRef.current = durum;
  }, [durum]);

  useEffect(() => {
    tetikRef.current = agizTetik;
  }, [agizTetik]);

  useEffect(() => {
    let kare = 0;
    let sonrakiKirpma = 1.5 + Math.random() * 3;
    let kirpma = 0;
    let egim = 0;
    let sonZaman = performance.now();

    const ciz = (simdi: number) => {
      kare = requestAnimationFrame(ciz);
      const dt = Math.min((simdi - sonZaman) / 1000, 0.1);
      sonZaman = simdi;
      const z = simdi / 1000;

      const konusuyor = durumRef.current === 'konusuyor';
      const dinliyor = durumRef.current === 'dinliyor';
      const dusunuyor = durumRef.current === 'dusunuyor';

      // Ağız: kelime tetiğiyle açılır, sönümlenerek kapanır. Safari kelime
      // sınırı olayı vermediği için konuşurken tabanda bir ritim tutuluyor.
      if (tetikRef.current !== gorulenTetikRef.current) {
        gorulenTetikRef.current = tetikRef.current;
        acikRef.current = 1;
      }
      acikRef.current = Math.max(0, acikRef.current - dt * 4.5);
      const taban = konusuyor ? 0.3 + 0.25 * Math.abs(Math.sin(z * 8)) : 0;
      const acik = Math.max(acikRef.current, taban);

      if (agizRef.current) {
        // Kapalıyken neredeyse çizgi, açıkken oval.
        agizRef.current.setAttribute('ry', String(1.2 + acik * 7.5));
        agizRef.current.setAttribute('rx', String(9 - acik * 1.5));
      }
      if (dudakRef.current) {
        dudakRef.current.setAttribute('opacity', String(1 - acik * 0.75));
      }

      // Göz kırpma: düzensiz aralık. Düzenli olan tekinsiz duruyor.
      // Düşünürken daha sık — insanlar da öyle yapıyor.
      sonrakiKirpma -= dt * (dusunuyor ? 2 : 1);
      if (sonrakiKirpma <= 0) {
        kirpma = 1;
        sonrakiKirpma = 2.4 + Math.random() * 3.4;
      }
      kirpma = Math.max(0, kirpma - dt * 9);
      const kapakY = kirpma * 12;
      solKapakRef.current?.setAttribute('transform', `translate(0 ${kapakY})`);
      sagKapakRef.current?.setAttribute('transform', `translate(0 ${kapakY})`);

      /*
       * Baş hareketi. Donmaması meselenin kendisi: kullanıcı sustuktan sonra
       * ekranda hiçbir şey olmaması, karşıda kimsenin olmadığı hissini veren
       * asıl şeydi.
       *   dinliyor  → kişiye doğru hafifçe eğilir
       *   düşünüyor → bakışını yana kaydırır, yavaşça gezinir
       *   konuşuyor → küçük vurgu hareketleri
       */
      const hedefEgim = dinliyor ? 2.2 : dusunuyor ? -1.6 : 0;
      egim += (hedefEgim - egim) * Math.min(1, dt * 4);
      const yatay = Math.sin(z * 0.45) * 2.2 + (dusunuyor ? Math.sin(z * 0.8) * 3.5 - 4 : 0);
      const dikey = egim + (konusuyor ? Math.sin(z * 7) * 0.5 : 0) + Math.sin(z * 0.6) * 0.8;
      kafaRef.current?.setAttribute('transform', `translate(${yatay} ${dikey})`);

      // Kaşlar: düşünürken hafif yukarı, konuşurken canlanır.
      const kasY = dusunuyor ? -2.5 : konusuyor ? Math.sin(z * 5) * 0.8 : 0;
      solKasRef.current?.setAttribute('transform', `translate(0 ${kasY})`);
      sagKasRef.current?.setAttribute('transform', `translate(0 ${kasY})`);
    };
    kare = requestAnimationFrame(ciz);
    return () => cancelAnimationFrame(kare);
  }, []);

  return (
    <div
      className="mx-auto mb-4 rounded-full overflow-hidden"
      style={{
        width: 168,
        height: 168,
        background: 'radial-gradient(circle at 50% 30%, #34240c 0%, #1a1207 72%)',
        border: '1px solid #3d2c0e',
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" width="168" height="168">
        <defs>
          <clipPath id="mz-sol-goz">
            <ellipse cx="80" cy="92" rx="12" ry="8.5" />
          </clipPath>
          <clipPath id="mz-sag-goz">
            <ellipse cx="120" cy="92" rx="12" ry="8.5" />
          </clipPath>
          <linearGradient id="mz-omuz" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ALTIN} />
            <stop offset="100%" stopColor="#8b6a24" />
          </linearGradient>
        </defs>

        {/* Omuzlar — baş havada asılı durmasın */}
        <path d="M40 200 Q40 168 68 160 L132 160 Q160 168 160 200 Z" fill="url(#mz-omuz)" />
        {/* Boyun */}
        <path d="M86 138 L114 138 L116 164 Q100 172 84 164 Z" fill={TEN_GOLGE} />

        <g ref={kafaRef}>
          {/* Saç — arka kütle, yüzün etrafını sarıyor */}
          <path
            d="M100 24 Q152 24 152 84 Q152 104 148 118 L142 96 Q146 62 100 62 Q54 62 58 96 L52 118 Q48 104 48 84 Q48 24 100 24 Z"
            fill={SAC}
          />
          {/* Üstten ışık — saç düz bir leke değil, hacimli görünsün */}
          <path d="M100 24 Q146 24 151 74 Q140 36 100 34 Q60 36 49 74 Q54 24 100 24 Z" fill={SAC_ISIK} opacity="0.55" />
          {/* Kulaklar */}
          <ellipse cx="49" cy="96" rx="7" ry="11" fill={TEN_GOLGE} />
          <ellipse cx="151" cy="96" rx="7" ry="11" fill={TEN_GOLGE} />

          {/* Yüz */}
          <path
            d="M100 42 Q145 42 145 92 Q145 122 128 138 Q114 150 100 150 Q86 150 72 138 Q55 122 55 92 Q55 42 100 42 Z"
            fill={TEN}
          />

          {/* Kâkül — alnın üstünü örtüyor, yüzü açık bırakıyor */}
          <path
            d="M56 82 Q54 44 100 44 Q146 44 144 82 Q138 60 112 58 Q92 72 74 62 Q60 66 56 82 Z"
            fill={SAC}
          />

          {/* Kaşlar */}
          <path ref={solKasRef} d="M67 76 Q80 70 92 75" stroke={SAC} strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <path ref={sagKasRef} d="M108 75 Q120 70 133 76" stroke={SAC} strokeWidth="3.4" fill="none" strokeLinecap="round" />

          {/* Sol göz */}
          <ellipse cx="80" cy="92" rx="12" ry="8.5" fill={AK} />
          <g clipPath="url(#mz-sol-goz)">
            <circle cx="81" cy="92" r="5.4" fill={IRIS} />
            <circle cx="81" cy="92" r="2.4" fill="#1a1008" />
            <circle cx="83" cy="89.5" r="1.7" fill="#fff" opacity="0.9" />
            {/* Göz kapağı — kırpmada aşağı iner */}
            <g ref={solKapakRef}>
              <rect x="66" y="72" width="28" height="12" fill={TEN} />
            </g>
          </g>
          <path d="M68 92 Q80 82 92 92" stroke="#a9825a" strokeWidth="1.4" fill="none" opacity="0.7" />

          {/* Sağ göz */}
          <ellipse cx="120" cy="92" rx="12" ry="8.5" fill={AK} />
          <g clipPath="url(#mz-sag-goz)">
            <circle cx="119" cy="92" r="5.4" fill={IRIS} />
            <circle cx="119" cy="92" r="2.4" fill="#1a1008" />
            <circle cx="121" cy="89.5" r="1.7" fill="#fff" opacity="0.9" />
            <g ref={sagKapakRef}>
              <rect x="106" y="72" width="28" height="12" fill={TEN} />
            </g>
          </g>
          <path d="M108 92 Q120 82 132 92" stroke="#a9825a" strokeWidth="1.4" fill="none" opacity="0.7" />

          {/* Burun — tek bir eğri, gölgeyle */}
          <path d="M100 98 Q97 110 93 114 Q97 117 101 115" stroke={TEN_GOLGE} strokeWidth="2.6" fill="none" strokeLinecap="round" />

          {/* Yanaklar */}
          <ellipse cx="70" cy="112" rx="8" ry="5" fill="#dfa88a" opacity="0.35" />
          <ellipse cx="130" cy="112" rx="8" ry="5" fill="#dfa88a" opacity="0.35" />

          {/* Ağız — konuşurken ry büyüyor, kapalıyken dudak çizgisi görünüyor */}
          <ellipse ref={agizRef} cx="100" cy="128" rx="9" ry="1.2" fill={AGIZ_IC} />
          <path ref={dudakRef} d="M89 128 Q100 133 111 128" stroke={DUDAK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}
