/**
 * Danışmanın yüzü — kodla çizilen, üsluplaştırılmış bir baş.
 *
 * NEDEN HAZIR MODEL KULLANILMADI
 * Elde iki seçenek vardı. Fotogerçekçi konuşan baş üreten servisler (HeyGen,
 * D-ID) dakika başına ücretli — her sohbet para yakardı. İnternetteki hazır
 * yüz modelleri ise ya lisansı belirsiz ya da gerçek bir insanın yüz taraması;
 * birinin suratını izinsiz alıp sağlık konuşan bir danışmana takmak, hem
 * hukuken hem ahlaken yanlış.
 *
 * Kodla çizmek üçünü birden çözüyor: telif yok, indirme yok, kimsenin yüzü
 * değil. Karşılığında fotogerçekçi değil — kasten de değil. Seramik bir büst
 * gibi duruyor ve sitenin altın paletiyle uyumlu. Karşındakine "bu bir insan"
 * dedirtmiyor ama "burada biri var" dedirtiyor; sağlığa değen bir konuda
 * doğru duruş bu.
 *
 * Buradaki tek iş sahneyi kurmak. Canlandırma (ağız, göz, baş) `yuz.tsx`
 * içinde, çünkü konuşma olaylarına orada erişiliyor.
 */
import type * as THREE from 'three';

export interface YuzParcalari {
  kok: THREE.Group;
  kafa: THREE.Mesh;
  /** Ağız açıklığı için ölçeklenir. */
  agiz: THREE.Mesh;
  /** Göz kapakları — kırpmada aşağı iner. */
  kapaklar: THREE.Mesh[];
}

const TEN = 0xd8b78a;
const KOYU = 0x2a1c08;
const ALTIN = 0xc4973a;

export function yuzKur(t: typeof THREE): YuzParcalari {
  const kok = new t.Group();

  const tenMalzeme = new t.MeshStandardMaterial({
    color: TEN,
    roughness: 0.62,
    metalness: 0.04,
  });

  // Kafa: küre değil, hafifçe basık ve uzatılmış — düz küre maske gibi duruyor.
  const kafaGeo = new t.SphereGeometry(1, 64, 48);
  kafaGeo.scale(0.86, 1.06, 0.9);
  const kafa = new t.Mesh(kafaGeo, tenMalzeme);
  kok.add(kafa);

  // Saç: kafanın üstünü saran ince bir kabuk.
  //
  // İlk denemede `thetaLength` PI*0.58 idi — kabuk ekvatoru geçip yüzün önüne
  // iniyor ve gözleri örtüyordu. Alnın hemen üstünde bitmeli (PI*0.36) ve
  // arkaya kaydırılmalı ki surat açıkta kalsın.
  const sacGeo = new t.SphereGeometry(1.04, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.36);
  sacGeo.scale(0.88, 1.1, 0.94);
  const sac = new t.Mesh(
    sacGeo,
    new t.MeshStandardMaterial({ color: KOYU, roughness: 0.85 })
  );
  sac.position.set(0, 0.02, -0.07);
  kafa.add(sac);

  // Arkada saçın devamı: yandan bakınca kafa tası çıplak kalmasın.
  const arkaSacGeo = new t.SphereGeometry(1.03, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.62);
  arkaSacGeo.scale(0.88, 1.06, 0.9);
  const arkaSac = new t.Mesh(
    arkaSacGeo,
    new t.MeshStandardMaterial({ color: KOYU, roughness: 0.85 })
  );
  arkaSac.position.z = -0.28;
  kafa.add(arkaSac);

  // Boyun ve omuz: baş havada asılı durmasın, gövdeye oturmuş görünsün.
  const boyun = new t.Mesh(
    new t.CylinderGeometry(0.34, 0.42, 0.6, 32),
    tenMalzeme
  );
  boyun.position.y = -1.15;
  kok.add(boyun);

  const omuz = new t.Mesh(
    new t.SphereGeometry(1.15, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.5),
    new t.MeshStandardMaterial({ color: ALTIN, roughness: 0.7, metalness: 0.15 })
  );
  omuz.scale.set(1, 0.42, 0.75);
  omuz.position.y = -1.62;
  kok.add(omuz);

  // Gözler: ak, iris, ve üstünde ten renginde bir kapak.
  const kapaklar: THREE.Mesh[] = [];
  for (const yon of [-1, 1]) {
    const goz = new t.Group();
    goz.position.set(yon * 0.3, 0.12, 0.78);
    kafa.add(goz);

    const ak = new t.Mesh(
      new t.SphereGeometry(0.13, 24, 16),
      new t.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.35 })
    );
    ak.scale.set(1, 0.82, 0.6);
    goz.add(ak);

    const iris = new t.Mesh(
      new t.SphereGeometry(0.062, 20, 14),
      new t.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.3 })
    );
    iris.position.z = 0.075;
    goz.add(iris);

    // Kapak: kırpmada ölçeklenmiyor, aşağı iniyor — ölçeklenince göz
    // deliniyormuş gibi duruyordu.
    const kapak = new t.Mesh(
      new t.SphereGeometry(0.145, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
      tenMalzeme
    );
    kapak.scale.set(1, 0.85, 0.62);
    kapak.position.y = 0.115;
    goz.add(kapak);
    kapaklar.push(kapak);

    // Kaş: yüze ifade veren en ucuz ayrıntı — ve yanlış açıyla en ucuz hata.
    // İlk denemede iç uçlar aşağı bakıyordu (`yon * 0.1`) ve surat asık
    // çıkıyordu. Dinleyen birinin kaşı düz, hafifçe dışa doğru iner.
    const kas = new t.Mesh(
      new t.BoxGeometry(0.24, 0.03, 0.05),
      new t.MeshStandardMaterial({ color: KOYU, roughness: 0.9 })
    );
    kas.position.set(yon * 0.01, 0.27, 0.03);
    kas.rotation.z = -yon * 0.05;
    goz.add(kas);
  }

  // Burun: küçük bir koni, gölgesi yüze derinlik veriyor.
  const burun = new t.Mesh(new t.ConeGeometry(0.1, 0.26, 16), tenMalzeme);
  burun.position.set(0, -0.08, 0.86);
  burun.rotation.x = Math.PI * 0.5;
  kafa.add(burun);

  // Ağız: kapalıyken ince bir çizgi. Konuşurken Y'de ölçekleniyor.
  const agiz = new t.Mesh(
    new t.SphereGeometry(0.17, 28, 18),
    new t.MeshStandardMaterial({ color: 0x6b3a30, roughness: 0.5 })
  );
  agiz.scale.set(1, 0.12, 0.45);
  agiz.position.set(0, -0.42, 0.8);
  kafa.add(agiz);

  return { kok, kafa, agiz, kapaklar };
}
