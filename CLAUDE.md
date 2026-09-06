@AGENTS.md

# Mizaç Projesi — Claude Rehberi

> **Her oturumun başında [YAPILACAKLAR.md](YAPILACAKLAR.md)'ı oku.** Nerede
> kaldığımız, bekleyen işler ve sessiz arıza çıkaran tuzaklar orada. Bağlam
> sıkıştığında kaybolmayan tek yer o dosya.
>
> **İkisi farklı hızda değişir, karıştırma:**
> - Bir iş bittiğinde ya da yeni bir engel çıktığında → `YAPILACAKLAR.md`
> - Kalıcı bir bilgi öğrenildiğinde (bir tuzağın sebebi, bir kararın gerekçesi)
>   → buraya, `CLAUDE.md`'ye
>
> Durumu güncellemeden oturumu bitirme; bir sonraki oturum yalnız bu iki
> dosyayı görüyor.

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

**Ollama TEK GPU'ya sabit tutulmalı** (`CUDA_VISIBLE_DEVICES=5`). Sabitleme
olmadan model kartlara yayılıyor ve her katman kartlar arası PCIe trafiği
doğuruyor — bu makinede NVLink yok. Ölçüldü: yayılmış 1.4 jeton/sn, tek kartta
27.2 (19 kat). Danışman "cevap vermiyor" diye görünüyordu; aslında cevap
geliyordu ama 40+ saniyede.

Dahası, `CUDA_VISIBLE_DEVICES` **tek başına yetmiyor**: Vulkan arka ucu bu
değişkeni umursamayıp bütün kartları görüyor, Ollama da "daha çok kart sunan"
arka ucu seçip Vulkan'a gidiyordu. Vulkan kütüphanesi bu yüzden
`~/ollama-vulkan-yedek/` altına taşındı. Oraya geri konursa yavaşlık geri gelir.

**VPN nöbetçisi (6 Eyl 2026).** VPN sık kopuyordu ve her kopmada elle
bağlanmak gerekiyordu. `openfortivpn` bir LaunchDaemon olarak kuruldu;
`KeepAlive` ile launchd kopan bağlantıyı kendi kaldırıyor. Kurulum ve
tuzaklar: `danisman/sunucu/KURULUM.md` → "VPN nöbetçisi".

**Şifre sohbete girmez, girmemeli.** Oturum kaydı `~/.claude/projects/`
altında düz metin JSONL olarak diskte duruyor (bu oturum 61 MB) ve her adımda
modele yeniden gönderiliyor. Kimlik bilgisi `/etc/openfortivpn/config`'e
kullanıcı tarafından yazılıyor, root'a ait, mod 600.

**macOS'ta FortiClient'ın CLI'ı YOK** — `/Applications/FortiClient.app` yalnız
GUI ikilisi içeriyor. Yani şifre elde olsa bile betikle bağlanılamaz;
`openfortivpn` bu yüzden gerekli.

**GPU durumu değişken, ölçmeden varsayma.** 6 Eyl 2026 ölçümü: kart 4-7
%71-97 doluluk ve ~29 GB'la BAŞKASI tarafından kullanılıyor, 0'da da 29.5 GB'lık
bir iş var. **Boş olan yalnız 2 ve 3.** Eski plan notlarında "6 kart boş"
yazıyor — eskimiş. Her seferinde `nvidia-smi` ile bak.

Disk: 1.8 T'nin 251 G'si boş (%86 dolu). En büyük tüketici `~/.ollama`, 201 GB.
Yer gerekirse kullanılmayan Ollama modelleri ilk adaydır.

**MODEL LİSANSI — ikinci kez aynı duvar.** Site reklam gösteriyor ve ₺99'luk
rapor satıyor, yani ticari. XTTS bu yüzden elenmişti (CPML, "ad-supported
video"yu açıkça yasaklıyor). 6 Eylül'de aynısı görsel/video modellerinde
çıktı: **FLUX.1-dev ve LTX-Video `other` lisanslı**, kullanılamaz.
Doğrulanmış temiz olanlar (HF API `cardData.license`):

| Model | Lisans | Kapılı mı |
|---|---|---|
| `Wan-AI/Wan2.2-TI2V-5B-Diffusers` | apache-2.0 | hayır |
| `Wan-AI/Wan2.1-I2V-14B-480P-Diffusers` | apache-2.0 | hayır |
| `black-forest-labs/FLUX.1-schnell` | apache-2.0 | **EVET** (HF girişi şart) |
| `Qwen/Qwen-Image` | apache-2.0 | hayır |
| `Efficient-Large-Model/Sana_1600M_1024px_diffusers` | apache-2.0 | hayır |

Model seçmeden önce lisansı **doğrula**, hatırlama:

    curl -s https://huggingface.co/api/models/<repo> | python3 -c \
      "import sys,json;d=json.load(sys.stdin);print(d.get('gated'),d['cardData'].get('license'))"

Sunucu erişimi: `mta_kullanici@192.168.1.40`, **SSH anahtarıyla** (6 Eyl 2026'da
kuruldu, şifre gerekmiyor). FortiClient SSL-VPN gerekiyor.
Ollama yalnız `127.0.0.1:11434`'ü dinliyor — dışarıdan doğrudan erişilmez,
bu kasıtlı.

## Sosyal Medya Paylaşımı — düzenli iş

Site içeriği Instagram, TikTok ve YouTube'a **Publer** üzerinden paylaşılıyor.
429 gönderi (24 Ağu 2026 → 23 Ağu 2027) hazır, her günde en az bir gönderi var.

**Her oturumda kontrol et, kullanıcı sormasa bile:**

```bash
python3 -m paylasim.durum      # paylaşımın sağlığı — her oturumda çalıştır
```

`icerik/sirada.py` **emekli.** Publer'a bir daha CSV yüklenmiyor; kuyruğu
17 Eylül 2026'da boşalınca hesap kapatılabilir ve `sirada.py` ile
`csv-url.py` silinebilir. Yükleme yapılırsa aynı içerik iki kez çıkar.

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

**Publer'dan çıkış — 5 Eylül 2026 itibarıyla ikisi de kuruldu.**
`paylasim/` modülü resmî API'lerle paylaşıyor ve token'ları kendisi yeniliyor;
ayrıntı `paylasim/README.md`.

**Instagram:** Instagram Login yolu (`graph.instagram.com`), Facebook Sayfası
gerekmiyor — hesap Creator. Meta uygulaması Development modunda ve orada
kalmalı: App Review'u atlayan şey bu. Token 60 gün, kendiliğinden yenileniyor.

**TikTok:** **Sandbox** anahtarlarıyla çalışıyor, denetim GEREKMİYOR.
Production anahtarları inceleme geçmeden reddediliyor ve inceleme formu demo
video istiyor; sandbox o zincirin tamamını atlıyor. `inbox` yolunda video
taslağa düşüyor, telefonda tek dokunuşla paylaşılıyor — 5 Eylül'de uçtan uca
denendi, çalışıyor. Sebebi `paylasim/README.md`'de yazılı; production'a
dönmeye çalışan biri aynı duvara toslar.

**YouTube:** kimlik KURULDU (6 Eyl 2026). Google Cloud projesi
`mizac-paylasim`, proje numarası `256746085549`, kapsam yalnız
`youtube.upload`. Gerçek yükleme denendi ve çalıştı.

**KANAL: `UCWmrrOKDhdhFt537KczSiHw`, `safra943@gmail.com` altında** —
doğrulandı (test videosu oraya yüklendi, sonra silindi). Cloud projesi
bahu.civci@gmail.com'da duruyor ve bu sorun değil: uygulama *In production*
olduğu için yetkiyi başka bir Google hesabı verebiliyor.

**Yetkiyi VEREN hesap kanalı belirliyor, Cloud projesinin sahibi değil.**
İlk denemede yetkiyi bahu.civci verdi (tarayıcıda açık olan tek hesap oydu)
ve video onun boş kişisel kanalına gitti. Video silindi, yetki geri alındı.
Yeniden yetkilendirme gerekirse hesabı ÖNCE doğrula.

**Onay ekranı *In production*'a alındı** — *Testing*'de kalsaydı Google
refresh token'ı 7 GÜNDE iptal ederdi ve cron sekizinci gün sessizce ölürdü.

**Eksik olan tek şey denetim (audit), ve bu TikTok'takinden kötü:**
doğrulanmamış API projesinden yüklenen video gizli KİLİTLENİYOR, kanalın
senin olması muafiyet değil, ve **itiraz edilemiyor**. TikTok'u kurtaran
"taslağa bırak" numarasının karşılığı yok — Data API'de taslak uç noktası
bulunmuyor. Bu yüzden `YOUTUBE_GIZLILIK` varsayılanı `private`: kilidi
görmezden gelmek yerine onunla aynı şeyi istiyoruz.

Başvuru metni ve eksikler: `paylasim/youtube-basvuru.md`. Formun zorunlu
kanıtı olduğu için `/gizlilik` sayfasına "8. YouTube API Servisleri" bölümü
eklendi (YouTube şartları, Google Gizlilik Politikası bağlantısı, yetkinin
nasıl geri alınacağı, silme politikası).

**Zamanlayıcı GitHub'da — Mac artık dayanak değil.** (6 Eyl 2026)
Özel depo `BahuCivci/mizac-paylasim-durum` içinde bir Actions iş akışı var;
her sabah 07:00 UTC'de (10:00 Europe/Istanbul) çalışıyor, public depoyu
`main`'den klonluyor, token ve defteri kendi içinde tutuyor.

**İKİSİ AYNI ANDA ÇALIŞMAMALI.** launchd ve Actions ayrı defter tutuyor;
ikisi birden açıksa aynı gönderi iki kez gider. Bu yüzden launchd
kapatıldı ve plist'i `.devre-disi` olarak yeniden adlandırıldı. Birini
açmadan önce diğerini kapat.

**Neden ayrı, özel bir depo:** `mizac-app` public. Zamanlayıcı orada olsaydı
token'ları taşımak için bir PAT'i public deponun sırlarına koymak gerekirdi.
Bölünce public depoda tek bir sır kalmıyor — public depo kimlik gerektirmeden
klonlanıyor, sırlar özel tarafta, ve özel deponun kendi `GITHUB_TOKEN`'ı
durumu geri yazmaya yetiyor. Bedeli: özel depo Actions dakikası harcıyor
(ayda 2000 ücretsiz, bu iş günde ~1 dakika).

**`gh auth` jetonunda `workflow` yetkisi yok.** `.github/workflows/` altına
push GitHub tarafından reddediliyor, ve contents API bunu **404** diye
döndürüyor — yetki hatası demiyor, "yok" diyor. Çözüm:
`gh auth refresh -h github.com -s workflow`.

**İçerik uzakta:** `icerik/cikti/gunluk/` runner'da yok (225 MB, gitignore).
`paylasim/icerik-dizini.json` hangi günde hangi klasör/dosya/metin olduğunu
taşıyor, medya Vercel Blob'dan iniyor. **Yeni içerik üretildiğinde
`python3 -m paylasim.dizin --uret` çalıştırılıp commit edilmeli** — yoksa
Actions o günü "içerik dizininde yok" deyip atlar.

**launchd (KAPALI, tarihçe için duruyor).** Ajan her sabah 10:00'da
`paylasim/gunluk-calistir.sh`'ı çağırıyor. Plist'in kopyası depoda:
`paylasim/xyz.mizac.paylasim.plist` → `~/Library/LaunchAgents/`.
Log: `~/Library/Application Support/mizac/gun.log`.

**Saatte bir çalışıyor, 10:00 tercih edilen saat.** İlk kurulumda yalnız
`StartCalendarInterval` (10:00) vardı ve **6 Eylül 2026'da tetiklenmedi**:
Mac derin uykudaydı, 13:18'de uyandı, launchd kaçan takvim işini telafi
ETMEDİ (`runs = 0`). Belgelerin vaadi buydu, pratikte olmadı. Bu yüzden
`StartInterval 3600` eklendi — makine gün içinde bir kez uyanırsa gönderi
çıkıyor. Fazladan çalışma zararsız: defter aynı postu iki kez atmıyor.
Bedeli, Mac 10:00'da uykudaysa postun daha geç saatte çıkması.

**TCC tuzağı — tekrar kurulursa gerekecek.** macOS `~/Documents`'ı koruyor ve
zamanlanmış iş terminalin iznini devralmıyor. İzin verilmeden şöyle görünüyor:

    cd: tamam
    ls: 0 öğe
    head paylasim/ayar.py: Operation not permitted

Çözüm: Sistem Ayarları → Gizlilik ve Güvenlik → **Tam Disk Erişimi** →
`/bin/bash`. (Erişilebilirlik listesi DEĞİL — ikisi yan yana, karışıyor.)
Verildiği `sqlite3 /Library/Application\ Support/com.apple.TCC/TCC.db
"select client,auth_value from access where
service='kTCCServiceSystemPolicyAllFiles' and auth_value=2;"` ile görülür.

Log dosyası da `~/Documents` dışında olmalı: launchd oradaki bir log'u
açamayıp `EX_CONFIG (78)` veriyor, iş hiç başlamıyor.

Doğrulamak için 10:00'ı bekleme: `launchctl start xyz.mizac.paylasim` deyip
log'a bak.

`icerik/sirada.py` ve `csv-url.py` hâlâ duruyor ama artık geri çekilme yolu:
Publer kuyruğu 17 Eylül'de boşalıyor, sonrasında silinebilirler.
**Publer'a bir daha CSV yükleme** — çift post olur.

Ayrıntı: `icerik/ZAMANLAYICI.md`. API ile tam otomasyon (Meta/TikTok onayı
bekliyor): `icerik/PAYLASIM-KURULUM.md`.

## AdSense — birim kuruldu, onay bekleniyor

Yayıncı: `ca-pub-2287930384527699` (`safra943@gmail.com`).

**Durum 6 Eyl 2026: site "Hazırlanıyor"** — yani AdSense incelemesi sürüyor
(30 Ağu'dan beri). Onay gelene kadar reklam kutuları boş kalır; bu normal.

**Neden hiç reklam görünmüyordu:** onay eksikliğinden ÖNCE bir kurulum
eksiği vardı. AdSense'te **hiç reklam birimi oluşturulmamıştı**, dolayısıyla
`NEXT_PUBLIC_ADSENSE_SLOT_MAKALE` boştu, ve `components/reklam.tsx`
`if (!REKLAM_ACIK || !slot) return null` ile hiçbir şey çizmiyordu. Betik
yükleniyordu ama tek bir `<ins>` bile yoktu.

6 Eylül'de `makale` adlı görüntülü birim oluşturuldu (slot `3366517986`),
Vercel'e `NEXT_PUBLIC_ADSENSE_SLOT_MAKALE` eklendi ve deploy edildi.
Doğrulandı: `/blog/mizac-testi-nedir` sayfasında 2 birim basılıyor.

**`NEXT_PUBLIC_*` derleme zamanında gömülüyor** — değişkeni eklemek yetmez,
yeniden deploy şart.

**ads.txt yayında ve doğru** (`/ads.txt`, HTTP 200). AdSense panelinde
"Bulunamadı" yazıyor ama bu eski bir tarama: dosya 31 Ağu 19:58'de eklendi,
panelin son güncellemesi 30 Ağu 21:56. Yapılacak bir şey yok.

**Reklam nereye konmaz — bilinçli:** test, sonuç, danışman ve ödeme
sayfalarında reklam yok. Gerekçe `lib/reklam.ts`'in başında.

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
