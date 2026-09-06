# Yapılacaklar

Bağlam sıkıştığında ya da yeni bir oturum açıldığında **önce burayı oku**.
Ayrıntı `CLAUDE.md`, `paylasim/README.md` ve `paylasim/basvuru.md`'de.

Son güncelleme: 6 Eylül 2026 (gece).

---

## Şu an çalışan sistem

`paylasim/` modülü Publer'ın yerini aldı. Kontrol: `python3 -m paylasim.durum`.

Tetikleyen **GitHub Actions** (özel depo `mizac-paylasim-durum`, her sabah
10:00 Europe/Istanbul). Mac'teki launchd bilerek kapatıldı — madde 1.

| Platform | Durum | Elle iş var mı |
|---|---|---|
| Instagram | Çalışıyor, gerçek post atıldı | Hayır |
| TikTok | Çalışıyor (sandbox) | **Evet — günde bir dokunuş** |
| YouTube | Kimlik tamam, denetim yok — video gizli kalır | Hayır |

---

## 1. GitHub Actions — **kuruldu ve çalışıyor** (6 Eyl akşamı)

Paylaşım artık Mac'e bağlı değil. Özel depo
`BahuCivci/mizac-paylasim-durum`, her sabah 07:00 UTC = 10:00 Europe/Istanbul.

Doğrulandı: kuru çalışma 11 saniyede yeşil, içerik Blob'dan indi, sırlar
log'da `***` maskeli; gerçek çalıştırma bugünün iki gönderisini de "zaten
paylaşılmış" deyip atladı ve deftere dokunmadı.

**launchd KAPATILDI** — `~/Library/LaunchAgents/xyz.mizac.paylasim.plist`
`.devre-disi` olarak yeniden adlandırıldı. İkisi ayrı defter tutuyor; ikisi
birden açık olsaydı yarın aynı gönderi iki kez giderdi. Geri açmak
gerekirse: adı düzelt, sonra `launchctl bootstrap gui/$(id -u) <plist>` —
**ama önce Actions'ı durdur.**

`sudo pmset repeat wakeorpoweron ... 09:55` hâlâ kurulu ve artık gereksiz.
Zararı yok (Mac 9:55'te uyanıyor); istersen `sudo pmset repeat cancel`.


Kontrol: `gh run list --repo BahuCivci/mizac-paylasim-durum`

**Yeni içerik ürettiğinde:** `python3 -m paylasim.dizin --uret` çalıştırıp
commit et. Runner'da `icerik/cikti/gunluk/` yok; o dizin tazelenmezse yeni
gün sessizce atlanır.

---

## 2. TikTok incelemesi — cevap bekleniyor

**Durum:** In review (6 Eyl 00:05). App ID `7682004239296038919`.
Talep: `video.publish` (Direct Post), yani günlük dokunuşun kalkması.

Cevap nereye gelir: panelde **Review comments**, ve `safra943@gmail.com`.
TikTok süre taahhüt etmiyor; birkaç hafta.

**Onaylanırsa üç adım** (üçüncüsü atlanıyor, dikkat):

1. `paylasim/gizli/.env` → `TIKTOK_YOL=direct`
2. Aynı dosyada production anahtarlarına dön — `.env`'de yorum satırında
   duruyorlar (`awurd...`), sandbox'ınkiler (`sbawks...`) yerine
3. **Yeniden yetkilendir:** eldeki token sandbox'a ait ve `video.upload`
   izinli. Direct Post için production anahtarları ve `video.publish`
   kapsamıyla yeni bir OAuth turu şart:
   `python3 -m paylasim.kur --platform tiktok --yetkilendir`

**Reddedilirse:** hiçbir şey yapma. Sandbox yolu aynen çalışmaya devam eder.
İstenirse eksik giderilip yeniden gönderilebilir (TikTok revizyon kabul
ediyor; açıklama alanına "bu sürümde ne değişti" yazılıyor).

---

## 3. YouTube — kimlik KURULDU, **denetim başvurusu bekliyor**

6 Eylül 2026'da kuruldu ve uçtan uca doğrulandı. Token `safra943@gmail.com`
hesabından alındı; test videosu **doğru kanala** (`UCWmrrOKDhdhFt537KczSiHw`)
yüklendi ve sonra silindi. Kod, kimlik ve kanal tamam.

| Ne | Durum |
|---|---|
| Google Cloud projesi `mizac-paylasim` | kuruldu, numara `256746085549` |
| YouTube Data API v3 | etkin |
| OAuth istemcisi + token | çalışıyor, GitHub sırlarında da var |
| Onay ekranı | **In production** — 7 günlük token ölümü tuzağı atlatıldı |
| Denetim | **YAPILMADI** — video yüklenir ama gizli kilitli kalır |

**Senden gereken tek şey** (ayrıntı `paylasim/youtube-basvuru.md`):

1. **Adres bilgileri** — denetim formu tam yasal ad, ülke, adres, şehir, il
   ve posta kodu istiyor. Gerisi hazır.

**İlk gerçek YouTube gönderisi: 24 Eylül 2026.** O güne kadar denetim
gelmezse video yüklenir ama gizli kalır; `YOUTUBE_GIZLILIK` bu yüzden
`private` — kilidi görmezden gelmek yerine onunla aynı şeyi istiyoruz.

---

## 4. Video kalitesi — asıl iş burada

**Sorun:** paylaşılan videolar kahverengi zemin üzerinde kayan yazıdan ibaret.
40 saniye boyunca hareket yok, görsel yok, kesme yok. Ölçüm bunu destekliyor:
125 takipçi, gönderi başına 2.0 beğeni. Erişim sorunu paylaşım yönteminde
değil, izlenecek bir şey olmamasında.

**Kurulan altyapı (6 Eyl 2026):**

- VPN nöbetçisi çalışıyor, sunucuya SSH anahtarıyla giriliyor (şifresiz)
- `~/mizac-lab/venv`'e `diffusers 0.40` kuruldu
- `Wan-AI/Wan2.2-TI2V-5B-Diffusers` indiriliyor (Apache-2.0, kapısız)
- Üretim betiği: `~/mizac-lab/video-uret.py` (sunucuda)

**Lisans tuzağı — FLUX.1-dev ve LTX-Video KULLANILAMAZ.** İkisi de `other`
lisanslı, site ticari. XTTS'in elenme sebebiyle aynı. Ayrıntı ve doğrulanmış
temiz liste `CLAUDE.md`'de.

**Sıradaki adım:** tek bir 2 saniyelik plan üretip kullanıcıya göstermek.
Beğenilirse boru hattı: senaryonun 5 adımı → 5 plan → mevcut TTS ve altyazıyla
kurgu.

**Ayrıca konuşulması gereken:** "yapay zekâ ile yapıldığı belli" şikâyetini
yapay zekâ videosu tam çözmeyebilir. En büyük sahicilik sıçraması kullanıcının
kendi sesiyle anlatması olurdu; bu bedava ve modelden bağımsız.

---

## 5. Cloudflare tünel adresi — danışmanı rastgele öldürüyor

**Belirti:** `mizac.xyz/danisman` haber vermeden cevap vermez oluyor. Hata
sayfası çıkmıyor, sessizce ölüyor.

**Sebep:** danışman sunucusuna `trycloudflare.com` üzerinden geçici bir
tünelle gidiliyor ve tünel her yeniden başladığında **adres değişiyor**.
Vercel'deki `MIZAC_OLLAMA` eski adrese bakmaya devam ediyor.

6 Eylül 2026'da ölçüldü: adres **tek oturumda üç kez** değişti
(`pcs-kruger-ing-thinks` → `peter-pathology-dramatically-whats` →
`bargains-networking-run-preview`). Vercel `nylon-moment-picnic-then` diye
log'larda izi bile olmayan çok eski bir adrese bakıyordu; danışman ölüydü.
Elle güncellenip deploy edildi, ama adres yine değişti — yani elle güncelleme
çözüm değil, sadece geciktirme.

Ayrıca **iki `cloudflared` süreci birden** çalışıyordu; nöbetçi mükerrer
başlatmış olabilir, o da ayrıca bakılmalı.

**Kalıcı çözüm seçenekleri** (hiçbiri denenmedi):

1. **Adlandırılmış Cloudflare tüneli** — ücretsiz, ama Cloudflare hesabı ve
   bir alan adı gerekiyor. `mizac.xyz` zaten var. Adres sabit kalır, sorun
   büsbütün biter. En doğru çözüm bu görünüyor.
2. **Nöbetçi Vercel'i kendi güncellesin** — adres değişince `vercel env` ile
   yazsın. CLAUDE.md'de bilerek yapılmadığı yazılı: Vercel kimlik bilgisini
   üniversite sunucusuna koymak ayrı bir güvenlik riski. Bu gerekçe hâlâ
   geçerli.
3. **Danışmanı Claude API'ye taşı** — `danisman/model.ts` içinde
   `MIZAC_SAGLAYICI=claude` yolu hazır duruyor. Tünel, VPN ve GPU
   bağımlılığının tamamı ortadan kalkar; bedeli API ücreti.

---

## 6. Video boru hattı — nerede kaldık (6 Eyl gecesi)

`Wan-AI/Wan2.2-TI2V-5B` (Apache-2.0) Kapadokya sunucusunda, **kart 2**'de
çalışıyor. Üretim betiği `~/mizac-lab/video-uret.py`, toplu iş
`~/mizac-lab/toplu-video.py`, plan tarifi `~/mizac-lab/planlar.json`.
Kurgu betiği depoda: `icerik/kurgu.py` (planları senaryo sürelerine uzatıp
mevcut sesi ve altyazıyı bindiriyor — HENÜZ ÇALIŞTIRILMADI).

**Ölçüm:** 704x1280, 121 kare (5 sn), 30 adım → **plan başına ~5 dakika**.
Beş planlık bir gönderi ≈ 25 dakika.

**Deneme gönderisi:** 6 Eyl'in TikTok senaryosu (`2026-09-06/tiktok-tiktok`,
"Safravî ağrıyı nasıl tarif eder?"). Amaç aynı metin + aynı sesle eski/yeni
karşılaştırması. Planlar sunucuda `~/mizac-lab/planlar/` altında.

### Öğrenilenler — istem yazarken

- **"cinematic", "dim", "warm" YAZMA.** İlk turda hepsi vardı ve model koyu
  kahverengi, neredeyse tek renk kareler verdi — yani eski yazı kartlarının
  paletine geri döndük. Telefonda akışta koyu kare seçilmiyor.
  Yerine: `bright`, `daylight`, `high key`, `vivid colours`, `crisp`.
- **Hareketi AÇIKÇA iste.** `visible movement`, `handheld camera`,
  `she leans forward` gibi. Yoksa neredeyse hareketsiz plan geliyor.
- **KİŞİLERİN GÖRÜNÜMÜNÜ BELİRT — hâlâ düzeltilmedi.** Belirtilmeyince model
  Doğu Asyalı kişiler üretiyor; Türk izleyiciye tıbb-ı nebevî anlatan bir
  hesapta uyumsuz. İstemlere "Turkish man/woman, Mediterranean features"
  eklenip planlar YENİDEN üretilmeli.

### Tuzak: zombi GPU süreci

`setsid` ile başlatılan üretim `pkill -f` ile ölmüyor ve kartta 17 GB tutmaya
devam ediyor; sonraki üretim `CUDA out of memory` alıyor. Durdurmadan önce
`nvidia-smi --query-compute-apps=pid --format=csv,noheader -i <kart>` ile
gerçek pid'e bak. 6 Eyl'de bir plan tam bu yüzden çöktü.

### Sıradaki adım

1. Beş plan tamamlanınca `icerik/kurgu.py` ile kurgula, kullanıcıya gönder
2. Kullanıcı yönü onaylarsa: istemlere görünüm ekle, yeniden üret
3. Sonra karar: bu iş üniversite sunucusunda mı sürecek? (aşağıya bak)

### Açık soru — kullanıcı sordu, cevaplanmadı

Video üretimi Kapadokya sunucusunda yapılıyor ve **mizac.xyz ticari** (reklam
+ ₺99 rapor). Deneme başka, üretim başka. Kullanıcı "sen bunları Kapadokya
sunucusunda mı ürettiriyon" diye sordu; kurumsal tarafı ona bırakıldı.
Alternatifler: kiralık GPU (~0.4 $/saat, gönderi başına ~0.2 $) ya da hazır
video API'si.

---

## 7. Şifre değiştir — iş bitince

VPN (`mta.vpn@kun.edu.tr`) ve sunucu (`mta_kullanici`) şifreleri 6 Eylül'de
sohbete yazıldı ve oturum kaydı `~/.claude/projects/` altında düz metin olarak
diskte duruyor. Sunucu tarafı artık SSH anahtarı kullanıyor, yani o şifre
gereksiz. VPN şifresi `/etc/openfortivpn/config`'de (root, 600).

**İkisini de değiştir**, VPN'inkini değiştirdikten sonra o dosyayı güncelle
(önce `sudo launchctl bootout system/xyz.mizac.vpn`, sonra düzelt, sonra
`bootstrap` — yanlış şifreyle döngü hesabı kilitletebilir).

---

## 8. Küçük işler

- **`browser-use/`** — 795 MB, hiç çalışmadı (dört ayrı katmanda kırık), bugün
  lint'i ve Vercel deploy'unu bozdu. Artık yok sayılıyor ama silinmedi.
  Kullanıcıya soruldu, cevap gelmedi.
- **`icerik/tarih-sikistir.py`** — yazıldı, kuru çalışması doğrulandı, hiç
  uygulanmadı, commit'lenmedi. Takvimi sıkıştırıp üç platformda da her gün
  paylaşım yapmak içindi. Publer'dan çıkınca 5 gönderi sınırı kalktığı için
  gerekçesi zayıfladı — uygulanacaksa yeniden düşünülmeli.
- **Instagram erişim ölçümü** — `paylasim/olcum.py` beğeni/yorum ile
  karşılaştırıyor. Gerçek erişim için `instagram_business_manage_insights`
  izni Meta uygulamasına eklenip yeniden yetkilendirme gerekiyor.
- **Publer** — emekliye ayrıldı (6 Eyl). `sirada.py` artık yükleme demiyor,
  uyarıyor. Kalan kuyruk: Instagram 7 ve 9 Eyl, YouTube 10 ve 17 Eyl —
  **silinmedi, bilerek**: içerik aynı, bizim modül de aynısını atardı, ve
  YouTube'un yerini dolduramıyoruz (kimlik yok + denetim öncesi gizli kalır).
  17 Eylül'de kuyruk boşalınca hesap kapatılabilir, `sirada.py` ve
  `csv-url.py` silinebilir.

---

## Bilinmesi gereken tuzaklar

Hepsi sessizce arıza çıkaran cinsten; sebepleriyle birlikte `CLAUDE.md`'de.

- **macOS TCC** — zamanlanmış iş `~/Documents`'ı okuyamaz. `/bin/bash`'e Tam
  Disk Erişimi verildi. Verilmezse cron/launchd sessizce hiçbir şey yapmaz.
- **launchd, cron değil** — laptop uykudayken cron o günü kaçırır, launchd
  uyanınca telafi eder.
- **TikTok Production formu** zorunlu alanların hepsi (demo video dahil)
  dolmadan hiçbir şeyi kaydetmez. Önceden doldurup bekletmek işe yaramaz.
- **Instagram** her kapsayıcıyı yayınlamadan önce FINISHED bekler — yalnız
  videoları değil, karuselleri de.
- **YouTube yetkisini VEREN hesap, videonun gideceği kanaldır.** Cloud
  projesinin hangi hesapta olduğu değil. 6 Eyl 2026'da yetkiyi yanlış hesap
  verdi ve video onun kanalına gitti. Yetkilendirmeden önce hesabı doğrula.
- **İki zamanlayıcı = çift post.** launchd ve GitHub Actions ayrı defter
  tutuyor. Actions açılınca launchd kapatılmalı.
- **`gh` jetonunda `workflow` yetkisi yok.** `.github/workflows/` altına push
  reddediliyor ve contents API bunu **404** diye döndürüyor — "yetkin yok"
  demiyor, "yok" diyor. `gh auth refresh -h github.com -s workflow`.
- **`icerik-dizini.json` tazelenmezse** Actions yeni günü "içerik dizininde
  yok" deyip atlar. İçerik üretiminden sonra `paylasim.dizin --uret`.
- **`.env`** aynı anahtarı iki kez içeriyorsa son DOLU değer kazanır; boş bir
  satır dolu olanı gölgelemez (düzeltildi, testi var).
