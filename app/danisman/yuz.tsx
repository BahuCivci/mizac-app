'use client';

import { useEffect, useRef, useState } from 'react';
import type { SesDurumu } from './ses';
import { yuzKur, type YuzParcalari } from './yuz-geometri';
import Varlik from './varlik';

/**
 * Danışmanın yüzü — tarayıcıda çizilen bir baş.
 *
 * NEDEN BÖYLE
 * İstenen "karşımda bir insan olsun"du. Fotogerçekçi konuşan baş üreten
 * servisler dakika başına ücretli; her sohbet para yakardı. Bu yol ekran
 * kartıyla çiziyor, dışarıya hiçbir istek gitmiyor, maliyeti sıfır.
 * Yüzün kendisi kodla üretiliyor (`yuz-geometri.ts`) — indirilen model yok,
 * telif sorunu yok, kimsenin gerçek yüzü değil.
 *
 * AĞIZ HAREKETİ UYDURMA DEĞİL
 * `speechSynthesis` ürettiği sesi Web Audio'ya vermiyor, yani genlik okunamıyor.
 * Ama kelime sınırlarında olay veriyor. Ağız o olaylara bağlı: kelime gelince
 * açılıyor, sönümlenerek kapanıyor. Rastgele titreşimden farkı, dudakların
 * gerçekten konuşmayla tutması. Safari bu olayı vermiyor; orada `konusuyor`
 * durumu boyunca daha kaba bir ritim çalışıyor — sessiz durmasından iyi.
 */
export default function Yuz({
  durum,
  agizTetik,
}: {
  durum: SesDurumu;
  /** Her artışında ağız bir kez açılır. Kelime sınırı sayacı. */
  agizTetik: number;
}) {
  const kutuRef = useRef<HTMLDivElement>(null);
  const agizRef = useRef(0);
  const durumRef = useRef(durum);
  durumRef.current = durum;
  // WebGL yoksa boş bir daire göstermektense soyut varlığa düş.
  const [webglYok, setWebglYok] = useState(false);

  useEffect(() => {
    if (agizTetik > 0) agizRef.current = 1;
  }, [agizTetik]);

  useEffect(() => {
    const kutu = kutuRef.current;
    if (!kutu) return;

    let iptal = false;
    let kare = 0;
    let temizle: (() => void) | null = null;

    (async () => {
      const t = await import('three');
      if (iptal || !kutu.isConnected) return;

      const en = kutu.clientWidth || 168;
      const boy = kutu.clientHeight || 168;

      const sahne = new t.Scene();
      // Baş dairenin içine sığmalı: 30° / 4.4 birimde tepesi kırpılıyordu.
      const kamera = new t.PerspectiveCamera(26, en / boy, 0.1, 100);
      kamera.position.set(0, -0.05, 5.6);

      let cizer: import('three').WebGLRenderer;
      try {
        cizer = new t.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        // WebGL yoksa (eski cihaz, kapatılmış donanım hızlandırma) sayfa
        // çökmesin; halkalara düş.
        setWebglYok(true);
        return;
      }
      cizer.setSize(en, boy);
      // Retina'da 2'nin üstüne çıkmak görüntüyü iyileştirmiyor, pili yiyor.
      cizer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      cizer.outputColorSpace = t.SRGBColorSpace;
      kutu.appendChild(cizer.domElement);

      sahne.add(new t.HemisphereLight(0xfff2dd, 0x2a1c08, 1.8));
      const on = new t.DirectionalLight(0xffe9c7, 2.1);
      on.position.set(0.8, 1.4, 2.2);
      sahne.add(on);
      // Arkadan hafif altın kenar ışığı: baş zeminden ayrılsın.
      const arka = new t.DirectionalLight(0xc4973a, 1.1);
      arka.position.set(-1.4, 0.6, -1.6);
      sahne.add(arka);

      const parcalar: YuzParcalari = yuzKur(t);
      parcalar.kok.position.y = 0.22;
      sahne.add(parcalar.kok);

      const saat = new t.Clock();
      let sonrakiKirpma = 1.5 + Math.random() * 3;
      let kirpma = 0;
      // Baş dönüşü hedefe doğru yumuşatılıyor; durum değişince zıplamasın.
      let egim = 0;

      const ciz = () => {
        if (iptal) return;
        kare = requestAnimationFrame(ciz);
        const dt = Math.min(saat.getDelta(), 0.1);
        const z = saat.getElapsedTime();
        const konusuyor = durumRef.current === 'konusuyor';
        const dinliyor = durumRef.current === 'dinliyor';

        // Ağız: tetikle açılır, sönümlenerek kapanır. Safari kelime olayı
        // vermediği için konuşurken tabanda bir ritim tutuluyor.
        agizRef.current = Math.max(0, agizRef.current - dt * 4.5);
        const taban = konusuyor ? 0.25 + 0.25 * Math.abs(Math.sin(z * 8.5)) : 0;
        const acik = Math.max(agizRef.current, taban);
        parcalar.agiz.scale.y = 0.12 + acik * 0.5;
        parcalar.agiz.scale.z = 0.45 + acik * 0.12;

        // Göz kırpma düzensiz aralıklarla: düzenli olan tekinsiz duruyor.
        sonrakiKirpma -= dt;
        if (sonrakiKirpma <= 0) {
          kirpma = 1;
          sonrakiKirpma = 2 + Math.random() * 3.5;
        }
        kirpma = Math.max(0, kirpma - dt * 8);
        for (const k of parcalar.kapaklar) k.position.y = 0.115 - kirpma * 0.2;

        // Baş: boştayken yavaş salınım, dinlerken kişiye doğru hafif eğilme.
        egim += ((dinliyor ? 0.13 : 0) - egim) * Math.min(1, dt * 4);
        parcalar.kafa.rotation.y = Math.sin(z * 0.45) * 0.09;
        parcalar.kafa.rotation.x = egim + Math.sin(z * 0.63) * 0.03;
        // Konuşurken çok hafif bir vurgu hareketi.
        parcalar.kok.position.y = 0.22 + (konusuyor ? Math.sin(z * 7) * 0.012 : 0);

        cizer.render(sahne, kamera);
      };
      ciz();

      const olcuAyarla = () => {
        const e = kutu.clientWidth || 168;
        const b = kutu.clientHeight || 168;
        kamera.aspect = e / b;
        kamera.updateProjectionMatrix();
        cizer.setSize(e, b);
      };
      window.addEventListener('resize', olcuAyarla);

      temizle = () => {
        window.removeEventListener('resize', olcuAyarla);
        // Geometri ve malzemeler elle bırakılmazsa sayfa gezildikçe GPU
        // belleği birikiyor; React bunları toplamıyor.
        sahne.traverse((n) => {
          const m = n as import('three').Mesh;
          m.geometry?.dispose();
          const mal = m.material;
          if (Array.isArray(mal)) mal.forEach((x) => x.dispose());
          else mal?.dispose();
        });
        cizer.dispose();
        kutu.replaceChildren();
      };
    })();

    return () => {
      iptal = true;
      cancelAnimationFrame(kare);
      temizle?.();
    };
  }, []);

  if (webglYok) return <Varlik durum={durum} />;

  return (
    <div
      ref={kutuRef}
      className="mx-auto mb-4 rounded-full overflow-hidden"
      style={{
        width: 168,
        height: 168,
        background: 'radial-gradient(circle at 50% 32%, #2f2109 0%, #1a1207 72%)',
        border: '1px solid #3d2c0e',
      }}
      aria-hidden="true"
    />
  );
}
