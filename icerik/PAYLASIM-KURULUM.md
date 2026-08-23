# Paylaşım kurulumu

`paylas.py` günün içeriğini Instagram ve TikTok'a **resmî API'lerle** gönderir.
Tarayıcıdan hesabına girip tıklayan bir bot değil — o yol iki platformun da
kullanım şartlarında yasaklı ve hesap kapatmayla sonuçlanıyor.

Karşılığında bir bedel var: her iki platform da uygulama onayı istiyor.
**Instagram 2-4 hafta, TikTok 2-6 hafta.** Onaylar gelene kadar araç kuru
çalışmada her şeyi doğrular ama hiçbir şey göndermez.

## Bugün başlamak istiyorsan

Onayı beklemeden başlamanın yolu var: `cikti/zamanlayici/` altındaki CSV'leri
Buffer, Later ya da Publer gibi bir zamanlayıcıya yükle. Video dosyaları artık
her gün klasöründe hazır. Bu araç o yolun yerine geçmez, kalıcı alternatifidir.

---

## 1. Instagram

### Hesap
- Instagram hesabı **Professional** (Business ya da Creator) olmalı
- Bir Facebook **sayfasına** bağlı olmalı

### Meta uygulaması
1. `developers.facebook.com` → yeni uygulama
2. Instagram ürününü ekle
3. İstenecek izin: `instagram_business_content_publish`
4. Uygulama incelemesine gönder — **2-4 hafta**

### Erişim anahtarı
İnceleme onaylandıktan sonra uzun ömürlü bir anahtar üret. Anahtarlar süreli;
süresi dolunca paylaşım sessizce durmaz, hata verir — `paylas.py` bunu yazdırır.

### Medya barındırma — atlanamaz
Instagram medyayı **kendi sunucusundan çeker**; ikili dosya yüklemesi kabul
etmez. Dokümantasyonun sözü: *"we cURL media used in publishing attempts, so
the media must be hosted on a publicly accessible server"*.

Yani `cikti/gunluk/` klasörünün herkese açık bir adreste yayında olması gerekir.
Seçenekler:

| Yol | Not |
|---|---|
| Vercel Blob | Site zaten Vercel'de; en az sürtünme |
| Cloudflare R2 | Cömert ücretsiz katman |
| Herhangi bir statik barındırma | Klasör yapısı korunmalı |

Adres `MEDYA_TABAN_URL` olarak verilir ve araç şu düzeni bekler:

```
MEDYA_TABAN_URL/<gün>/<biçim>/<dosya>
örn. https://cdn.example.com/icerik/2026-08-24/instagram-karusel/1.png
```

Kuru çalışma her adresi tek tek yoklar; biri açık değilse paylaşımı hiç
denemez. Yanlış yapılandırmayı postu attıktan sonra değil, önce görürsün.

**TikTok'ta bu şart yok** — dosya doğrudan yükleniyor.

---

## 2. TikTok

1. `developers.tiktok.com` → uygulama oluştur
2. **Content Posting API** ürününü ekle
3. `video.publish` iznini iste
4. Denetime gönder — **2-6 hafta**

**Denetim bitene kadar attığın her post `SELF_ONLY` olur** — yalnız sen
görürsün. Bu bizim kısıtımız değil, TikTok'un kuralı. Yani onay gelmeden
gerçek paylaşım yapmanın anlamı yok.

Sınır: hesap başına günde 25 video. Bizim kadansımız günde 1-2.

---

## 3. Çalıştırma

```bash
# Doğrula, hiçbir şey gönderme (varsayılan)
python3 icerik/paylas.py
python3 icerik/paylas.py --gun 2026-08-24

# Gerçekten paylaş
python3 icerik/paylas.py --gercek
```

**Varsayılanın kuru çalışma olması bilinçli.** Bu araç herkese açık, geri
alınamaz post atıyor. Yanlış güne ya da yarım yapılandırmayla atılan bir post
geri alınmaz, o yüzden paylaşmak için açıkça `--gercek` yazmak gerekir.

### Ortam değişkenleri

```bash
export IG_KULLANICI_ID=...      # Instagram Professional hesap ID'si
export IG_TOKEN=...             # instagram_business_content_publish izinli
export MEDYA_TABAN_URL=...      # gün klasörlerinin açık adresi
export TIKTOK_TOKEN=...         # video.publish izinli
```

### Her sabah kendiliğinden çalışsın

```
0 10 * * *  cd /yol/mizac-app && /usr/bin/python3 icerik/paylas.py --gercek >> /tmp/paylasim.log 2>&1
```

`cikti/paylasildi.json` neyin gönderildiğini tutar; aynı post iki kez atılmaz.
Cron iki kez tetiklense de sorun olmaz.

---

## Bilinmesi gerekenler

- **YouTube kapsam dışı.** Data API ayrı bir onay süreci; bu araç Instagram ve
  TikTok için yazıldı. YouTube içeriği klasörlerde duruyor, elle yüklenebilir.
- **Videolar slayt videosudur.** Senaryodan üretilmiş; yüz, gerçek ses ve çekim
  yok. Kendin çekmek istersen senaryolar `postlar/` klasöründe.
- **Bu araç gerçek API'lere karşı denenmedi.** Onaylar gelmeden denenemez.
  Kuru çalışma yolu baştan sona sınandı; asıl gönderim adımları ilk gerçek
  çalıştırmada doğrulanacak. İlk seferi `--gun` ile tek bir güne kısıtlayıp
  sonucu gözle kontrol et.
