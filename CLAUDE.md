@AGENTS.md

# Mizaç Projesi — Claude Rehberi

## Proje Özeti
Next.js 16 + React 19 + Tailwind CSS v4 ile geliştirilmiş İslami tıbb-ı nebevî / mizaç sistemi sitesi.
URL: **mizac.xyz** — Vercel üzerinde deploy edilmiş.

## Temel Kavramlar
- **4 Mizaç**: `safravi` (safravî / choleric), `demevi` (demevî / sanguine), `balgami` (balgamî / phlegmatic), `sevdavi` (sevdavî / melancholic)
- **4 Hılt**: Kan (demevî), Safra (safravî), Balgam (balgamî), Sevda (sevdavî)
- **4 Unsur**: Ateş, Hava, Su, Toprak
- **4 Nitelik**: Sıcak, Islak, Soğuk, Kuru
- Kaynak kitap: *Varlığın Tahlili* — Zeynep Işık Büyükbay

## Kritik Dosyalar
| Dosya | İçerik |
|-------|--------|
| `lib/mizac-data.ts` | Tüm mizaç profil verileri — `MizacTip`, `mizacProfiller` |
| `lib/blog-data.ts` | Tüm blog yazıları (31 adet) |
| `lib/uyum-data.ts` | Mizaç uyum matrisi + karşılaştırma kombinasyonları (tek kaynak) |
| `app/sitemap.ts` | Sitemap — yeni sayfa eklerken buraya da ekle |
| `components/footer.tsx` | Footer linkleri — yeni sayfa eklerken buraya da ekle |
| `app/page.tsx` | Ana sayfa — Keşfet kartları grid'i |
| `icerik/sirada.py` | Publer'a sırada hangi CSV yüklenecek — her oturumda çalıştır |
| `icerik/cikti/yuklendi.json` | Hangi parçalar yüklendi (git'te değil, yerel) |

## Mizaç Danışmanı — canlı, kırılgan

`mizac.xyz/danisman` çalışıyor. Model üniversite sunucusundaki `gemma3:27b`;
oraya Cloudflare tüneli ve kimlik doğrulayan bir vekil üzerinden gidiliyor.

**Kırılgan nokta:** tünel adresi `trycloudflare.com` üzerinde geçici. Tünel
süreci ölür ya da sunucu yeniden başlarsa adres değişir ve danışman **sessizce**
cevap vermez olur — hata sayfası çıkmaz. Süreçler `nohup` ile başlatıldı,
`sudo` olmadığı için systemd yok.

**Nöbetçi kuruldu** (`danisman/sunucu/nobetci.sh`, sunucuda crontab'da her
5 dakikada bir çalışıyor): Ollama, vekil ve tünel süreçlerinden hangisi
ölmüşse yeniden başlatıyor. 31 Ağu 2026'da tam bu yüzden bir hafta boyunca
fark edilmeden kesintide kaldı — `cloudflared` kendini güncelleyip süreç
kapanmış, kimse yeniden başlatmamıştı. Nöbetçi bunu en fazla 5 dakikaya indiriyor.

**Nöbetçinin yapamadığı tek şey:** tünel yeniden başlarken adresi değişirse
(`trycloudflare.com` her seferinde rastgele bir alt alan adı veriyor),
Vercel'deki `MIZAC_OLLAMA`'yı otomatik güncellemiyor — bilerek, Vercel kimlik
bilgisini sunucuya koymak ayrı bir güvenlik riski olurdu. Adres değiştiğinde
`~/mizac-lab/nobetci.log`'a satır düşüyor; şüphe duyulduğunda o log'a bakılıp
gerekirse `vercel env` elle güncellenir.

Şüphe duyulduğunda:

```bash
curl -s -m 60 -X POST https://mizac.xyz/api/danisman \
  -H 'Content-Type: application/json' \
  -d '{"mesajlar":[{"rol":"kullanici","metin":"Yazlari zor gecirivorum."}],"dil":"tr"}'
```

Boş dönüyorsa onarım adımları: `danisman/sunucu/KURULUM.md`.

Sunucu erişimi: `mta_kullanici@192.168.1.40`, FortiClient SSL-VPN gerekiyor.
Ollama yalnız `127.0.0.1:11434`'ü dinliyor — dışarıdan doğrudan erişilmez,
bu kasıtlı.

## Sosyal Medya Paylaşımı — düzenli iş

Site içeriği Instagram, TikTok ve YouTube'a **Publer** üzerinden paylaşılıyor.
429 gönderi (24 Ağu 2026 → 23 Ağu 2027) hazır, her günde en az bir gönderi var.

**Her oturumda kontrol et, kullanıcı sormasa bile:**

```bash
python3 icerik/sirada.py
```

`ŞİMDİ YÜKLE` çıkıyorsa kullanıcıya söyle ve yüklemeyi yap. `yayında` ise
yapacak bir şey yok; çıktı sıradaki yüklemenin gününü de yazar.

**Neden elle besleniyor:** Publer'ın ücretsiz planı hesap başına yalnız
**5 bekleyen gönderi** tutuyor (belge 10 diyor, ölçülen 5). Bu yüzden takvim
8-10 günde bir besleniyor. Kullanıcı ücretli plana geçmek istemiyor — sorma.

**Yükleme nasıl yapılır** (Publer oturumu Playwright profilinde kalıcı):
1. `app.publer.com` → **Create**
2. Hesap satırından **yalnız hedef hesabı** seç — sağdaki *Post Preview*
   başlığı hangi platformda olduğunu yazar, oradan doğrula
3. **Bulk Options** → **Import CSV** → `cikti/zamanlayici/publer/parcali/`
   içinden sıradaki dosya
4. *"You will receive a notification once the CSV import is finished"*
   yeterli — işlem arka planda, composer boş kalır, bu normal
5. `python3 icerik/sirada.py --yuklendi instagram-02` ile deftere işle
6. Takvimden doğrula: **Posts** → sonraki hafta

**Instagram'a tarayıcıdan girmeyi deneme.** Doğru şifreyle bile "login
information is incorrect" diyor; otomasyonu kasıtlı engelliyor. Publer'da
böyle bir engel yok.

**İçerik tazeleme** (yeni gönderi üretildiyse):
```bash
python3 icerik/video.py     # eksik videolar
vercel env pull             # BLOB_READ_WRITE_TOKEN
node icerik/yukle.mjs       # medyayı Vercel Blob'a
python3 icerik/csv-url.py   # CSV'ler + parçalar
```

**Video sesi:** macOS'un yerleşik Yelda'sı (temel sürüm) test edildi, hız
120-150 arası fark etmiyordu — formant tabanlı, robotik hissin sebebi buydu.
Enhanced Yelda (Sistem Ayarları → Erişilebilirlik → Konuşulan İçerik → Sesler,
176 MB, ücretsiz) denendi, "çok yapay" bulundu. Şimdi **FreyaTTS** kullanılıyor
— Türkçe'ye özel, Apache-2.0 (ticari kullanıma açık), üniversite sunucusunda
GPU'da çalışıyor. XTTS v2 elendi çünkü ağırlıkları CPML lisanslı ve "ad-supported
video" için ticari kullanımı açıkça yasaklıyor.

Sesler önceden toplu üretilip `icerik/cikti/ses-onbellek/` altına iniyor
(`danisman/sunucu/toplu-seslendir.py`, sunucuda `PYTHONPATH=~/mizac-lab/FreyaTTS`
gerekiyor — paket o klasörün içinde). `video.py`'nin `seslendir()`'i önce
oraya bakıyor, karşılığı yoksa (yeni içerik, henüz sunucuya gönderilmemiş)
Enhanced Yelda'ya düşüyor — sessiz kalmıyor.

Yeni içerik üretilince önbelleği tazelemek:
```bash
python3 icerik/toplu-ses-cikart.py   # SENARYO.md'lerden metinleri çıkar
# → toplu-ses-girdi.json'u sunucuya gönder, toplu-seslendir.py çalıştır,
#   cikti-ses/ çıktısını icerik/cikti/ses-onbellek/ üzerine indir
python3 icerik/video.py --yeniden    # videoları yeniden üret
```

Ayrıntı: `icerik/ZAMANLAYICI.md`. API ile tam otomasyon (Meta/TikTok onayı
bekliyor): `icerik/PAYLASIM-KURULUM.md`.

## Tailwind v4 Uyarıları
- `bg-gradient-to-b` → **`bg-linear-to-b`** kullan (Tailwind v4'te değişti)
- `bg-gradient-to-r` → `bg-linear-to-r` vb.

## Sayfa Şablonu
Yeni bir içerik sayfası eklerken:
1. `app/[slug]/layout.tsx` — server component, `export const metadata` ile SEO
2. `app/[slug]/page.tsx` — içerik (`'use client'` veya server)
3. `app/[slug]/opengraph-image.tsx` — OG image (`next/og` ImageResponse)
4. `app/sitemap.ts` — yeni URL'yi ekle
5. `components/footer.tsx` — ilgili bölüme link ekle
6. `app/page.tsx` — Keşfet grid'ine kart ekle

## OG Image Şablonu
```tsx
import { ImageResponse } from 'next/og';
export const alt = 'Sayfa Başlığı | mizac.xyz';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OGImage() {
  return new ImageResponse(<div style={{ ... }}>...</div>, { width: 1200, height: 630 });
}
```
Renk paleti: bg `#1a1207`, gold `#c4973a`, cream `#f5f0e8`, muted `#9a8060`, border `#3d2c0e`

## Blog Yazısı Şablonu
`lib/blog-data.ts` içinde `blogYazilari` dizisine ekle:
```ts
{
  slug: 'yeni-konu',
  baslik: { tr: 'Türkçe Başlık', en: 'English Title' },
  ozet: { tr: 'Kısa açıklama...', en: 'Short description...' },
  icerik: { tr: '...uzun içerik...', en: '...long content...' },
  tarih: '2026-04-10',
  kategori: { tr: 'Kategori', en: 'Category' },
  okumaSuresi: 7,
  resim: '/blog/gorsel.jpg',
}
```

## Proje Slash Komutları
- `/new-page` — Yeni içerik sayfası iskelet kodu oluştur
- `/new-blog` — Yeni blog yazısı ekle
- `/audit` — Tüm eksiklikleri tara (OG images, sitemap, footer, typo)
- `/og` — Belirtilen sayfa için OG image oluştur

## Deploy
```bash
vercel --prod --yes
```
Her `git push` Vercel'de otomatik deploy tetikler.
