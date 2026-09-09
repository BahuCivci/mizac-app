# icerik/ — içerik üretimi ve teslimi

Burada üç ayrı boru hattı var. Karıştırmamak için hangisinin nerede
çalıştığı ve neyi ürettiği aşağıda.

## 1. Kitaptan video (asıl üretim, 2026 Eylül)

Kitabın metninden günlük dikey videolar üretir.

| Betik | Nerede çalışır | Ne yapar |
|---|---|---|
| `kitap-bol.py` | Mac | Kitabı anlatım boyunda pasajlara böler, OCR çöpünü eler |
| `gonderi-uret.py` | **Sunucu** | Pasajdan 5 adımlık tarif üretir (anlatım, altyazı, görüntü istemi) |
| `gonderi-yap.py` | **Sunucu** | Tariften ses + 5 plan üretir (Chatterbox + Wan 2.2) |
| `kurgu-toplu.py` | Mac | Sunucudan çeker, altyazıyı basar, videoyu kurgular |
| `takvime-yerlestir.py` | Mac | Bitmiş videoyu takvimdeki yuvaya koyar, metnini yazar |

Çıktı: `cikti/gonderiler/` (asıllar) ve `cikti/gunluk/<gün>/<biçim>/`
(takvimdeki yerleri — videolar asla kopyalanmaz, **sabit bağlantı** kurulur).

## 2. Blob teslimi (medyanın Instagram'a ulaşması)

Instagram medyayı herkese açık bir adresten çekiyor, ama Vercel Blob'un
ücretsiz planı 1 GB. Bu yüzden Blob arşiv değil **kayan pencere**:

| Betik | Ne yapar |
|---|---|
| `blob-pencere-calistir.sh` | **Tek giriş noktası.** launchd 6 saatte bir çağırıyor; elle de çalışır |
| `pencere-hazirla.py` | Neyin eksik olduğuna karar verir, dosyaları `~/mizac-pencere/`'ye kopyalar |
| `pencere-yukle.mjs` | `~/mizac-pencere/` içinde çalışıp yükler ve pencere dışını siler |
| `blob-dogrula.py` | Blob'dakiler yereldekiyle aynı mı — HEAD ile ölçer |
| `yukle.mjs` | Görselleri Blob'a yükler (videolar pencere betiğinin işi) |

İkiye bölünmesinin sebebi macOS: launchd altında node `~/Documents`'ı
okuyamıyor. Ayrıntı `pencere-hazirla.py`'nin başında.

## 3. Şablondan içerik (eski üretim, hâlâ karusel ve kareler için)

| Betik | Ne yapar |
|---|---|
| `uret.ts` | Bütün takvimi üretir — karusel/kare görselleri, METIN.txt'ler |
| `sablon.ts`, `temalar.ts`, `kaynak.ts` | `uret.ts`'in şablonları ve veri kaynağı |
| `kitaptan.py` | Bir konuya en yakın kitap pasajlarını bulur |
| `video.py`, `kurgu.py` | Eski slayt videoları (kitaptan üretim bunların yerini aldı) |
| `toplu-ses-cikart.py` | Seslendirilecek metinleri toplar |

**Karusel ve kare metinleri hâlâ şablondan geliyor, kitaptan değil** —
sıradaki iş bu. Kartlar fotoğraf değil, `sablon.ts` SVG kuruyor ve `sharp`
PNG'ye basıyor; yani görsel modeli gerekmiyor, iş tamamen metin işi.

## Emekli — 17 Eylül 2026'da silinebilir

`sirada.py`, `csv-url.py`: Publer'a CSV yükleme dönemine ait. Publer kuyruğu
17 Eylül'de boşalıyor; **o güne kadar da yükleme yapma**, çift post olur.

`tarih-sikistir.py`: yazıldı, denendi, hiç uygulanmadı. Publer'ın 5 gönderi
sınırı kalkınca gerekçesi zayıfladı.

## cikti/ (git'te değil, yeniden üretilebilir)

| Klasör | Boyut | Ne |
|---|---|---|
| `gunluk/` | takvim | Günlük gönderi klasörleri — paylaşımın okuduğu yer |
| `gonderiler/` | 7.5 GB | Kurgulanmış videoların asılları |
| `ham/` | 7.5 GB | Sunucudan inen ses + planlar; yalnız yeniden kurgu için gerekli |
| `ses-onbellek/` | 844 MB | Eski boru hattının seslendirmeleri |
| `tarifler/` | 1.2 MB | Kitaptan üretilen 315 tarif |
