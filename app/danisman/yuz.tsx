'use client';

import { useEffect, useRef } from 'react';
import type { SesDurumu } from './ses';

/**
 * Danışmanın yüzü — tarayıcıda çizilen 3B karakter.
 *
 * NEDEN BÖYLE
 * İstenen şey "karşımda bir insan olsun"du. Fotogerçekçi konuşan baş üreten
 * servisler (HeyGen, D-ID) dakika başına ücretli; her sohbet para yakardı.
 * Bu yol tarayıcının ekran kartıyla çiziyor, dışarıya hiçbir istek gitmiyor,
 * maliyeti sıfır.
 *
 * AĞIZ HAREKETİ UYDURMA DEĞİL
 * `speechSynthesis` ürettiği sesi Web Audio'ya vermiyor, yani genlik okunamıyor.
 * Ama kelime sınırlarında olay veriyor (`onboundary`). Ağız o olaylara bağlı:
 * kelime geldiğinde açılıyor, uzunluğuna göre açık kalıyor, sonra kapanıyor.
 * Rastgele titreşimden farkı, dudakların gerçekten konuşmayla tutması.
 * Safari `onboundary` vermiyor; orada `konusuyor` durumu boyunca daha kaba bir
 * ritim çalışıyor — sessiz durmasından iyi.
 *
 * MODEL DIŞARIDAN GELİYOR
 * GLB dosyası `src` ile veriliyor ve kendi Blob depomuzdan sunuluyor. Üçüncü
 * parti bir CDN'e bağlamak, o servis kapandığında danışmanın yüzsüz kalması
 * demek olurdu.
 */
export default function Yuz({
  src,
  durum,
  agizTetik,
}: {
  src: string;
  durum: SesDurumu;
  /** Her artışında ağız bir kez açılır. Kelime sınırı sayacı. */
  agizTetik: number;
}) {
  const kutuRef = useRef<HTMLDivElement>(null);
  const agizRef = useRef(0);          // 0..1 hedef açıklık
  const durumRef = useRef(durum);
  durumRef.current = durum;

  // Tetik değişince ağzı aç; sönümlemeyi çizim döngüsü yapıyor.
  useEffect(() => {
    if (agizTetik > 0) agizRef.current = 0.75;
  }, [agizTetik]);

  useEffect(() => {
    const kutu = kutuRef.current;
    if (!kutu) return;

    let iptal = false;
    let kare = 0;
    let temizle: (() => void) | null = null;

    (async () => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      if (iptal) return;

      const en = kutu.clientWidth || 240;
      const boy = kutu.clientHeight || 240;

      const sahne = new THREE.Scene();
      const kamera = new THREE.PerspectiveCamera(22, en / boy, 0.1, 100);
      kamera.position.set(0, 1.62, 0.72);

      const cizer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      cizer.setSize(en, boy);
      // Retina'da 3'ün üstüne çıkmak görüntüyü iyileştirmiyor, pili yiyor.
      cizer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      cizer.outputColorSpace = THREE.SRGBColorSpace;
      kutu.appendChild(cizer.domElement);

      // Sıcak, tek yönlü ışık: sitenin altın paletiyle uyumlu dursun.
      sahne.add(new THREE.HemisphereLight(0xfff2dd, 0x2a1c08, 2.2));
      const on = new THREE.DirectionalLight(0xffe9c7, 1.6);
      on.position.set(0.6, 1.8, 1.4);
      sahne.add(on);

      let kafa: import('three').Object3D | null = null;
      const agizHedefleri: { mesh: import('three').Mesh; indeks: number }[] = [];
      const gozHedefleri: { mesh: import('three').Mesh; indeks: number }[] = [];

      try {
        const glb = await new GLTFLoader().loadAsync(src);
        if (iptal) return;
        sahne.add(glb.scene);

        glb.scene.traverse((n) => {
          if (/head/i.test(n.name) && !kafa) kafa = n;
          const mesh = n as import('three').Mesh;
          const sozluk = mesh.morphTargetDictionary;
          if (!sozluk) return;
          // Ready Player Me / ARKit adları. Hangisi varsa o kullanılıyor;
          // model setine göre biri ya da öteki bulunuyor.
          for (const ad of ['jawOpen', 'mouthOpen', 'viseme_aa']) {
            if (ad in sozluk) {
              agizHedefleri.push({ mesh, indeks: sozluk[ad] });
              break;
            }
          }
          for (const ad of ['eyeBlinkLeft', 'eyesClosed', 'eyeBlink_L']) {
            if (ad in sozluk) gozHedefleri.push({ mesh, indeks: sozluk[ad] });
          }
          for (const ad of ['eyeBlinkRight', 'eyeBlink_R']) {
            if (ad in sozluk) gozHedefleri.push({ mesh, indeks: sozluk[ad] });
          }
        });
      } catch {
        // Model gelmezse sayfa çökmesin: kutu boş kalır, çağıran taraf
        // soyut varlığa düşer.
        kutu.replaceChildren();
        return;
      }

      const saat = new THREE.Clock();
      let sonrakiKirpma = 2 + Math.random() * 3;
      let kirpma = 0;

      const ciz = () => {
        if (iptal) return;
        kare = requestAnimationFrame(ciz);
        const dt = saat.getDelta();
        const t = saat.getElapsedTime();

        // Ağız: tetikle açılır, üstel sönümle kapanır.
        agizRef.current = Math.max(0, agizRef.current - dt * 3.2);
        // Safari kelime olayı vermiyor; konuşurken tabanda bir ritim tut.
        const taban =
          durumRef.current === 'konusuyor' ? 0.12 + 0.12 * Math.abs(Math.sin(t * 9)) : 0;
        const acik = Math.max(agizRef.current, taban);
        for (const h of agizHedefleri) {
          if (h.mesh.morphTargetInfluences) h.mesh.morphTargetInfluences[h.indeks] = acik;
        }

        // Göz kırpma: düzenli değil, aralıklı — düzenli olan tekinsiz duruyor.
        sonrakiKirpma -= dt;
        if (sonrakiKirpma <= 0) {
          kirpma = 1;
          sonrakiKirpma = 2.5 + Math.random() * 3.5;
        }
        kirpma = Math.max(0, kirpma - dt * 7);
        for (const h of gozHedefleri) {
          if (h.mesh.morphTargetInfluences) h.mesh.morphTargetInfluences[h.indeks] = kirpma;
        }

        // Hafif baş hareketi: dinlerken kişiye doğru eğilir, boştayken salınır.
        if (kafa) {
          const k = kafa as import('three').Object3D;
          const dinliyor = durumRef.current === 'dinliyor';
          k.rotation.y = Math.sin(t * 0.5) * 0.05;
          k.rotation.x = (dinliyor ? 0.06 : 0) + Math.sin(t * 0.7) * 0.02;
        }

        cizer.render(sahne, kamera);
      };
      ciz();

      const olcuAyarla = () => {
        const e = kutu.clientWidth || 240;
        const b = kutu.clientHeight || 240;
        kamera.aspect = e / b;
        kamera.updateProjectionMatrix();
        cizer.setSize(e, b);
      };
      window.addEventListener('resize', olcuAyarla);

      temizle = () => {
        window.removeEventListener('resize', olcuAyarla);
        cizer.dispose();
        kutu.replaceChildren();
      };
    })();

    return () => {
      iptal = true;
      cancelAnimationFrame(kare);
      temizle?.();
    };
  }, [src]);

  return (
    <div
      ref={kutuRef}
      className="mx-auto mb-4 rounded-full overflow-hidden"
      style={{
        width: 168,
        height: 168,
        background: 'radial-gradient(circle at 50% 35%, #2a1c08 0%, #1a1207 70%)',
        border: '1px solid #3d2c0e',
      }}
      aria-hidden="true"
    />
  );
}
