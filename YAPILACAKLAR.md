# Yapılacaklar

Bağlam sıkıştığında ya da yeni bir oturum açıldığında **önce burayı oku**.
Ayrıntı `CLAUDE.md`, `paylasim/README.md` ve `paylasim/basvuru.md`'de.

Son güncelleme: 6 Eylül 2026 (akşam).

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

**İlk gerçek otomatik gönderi: 7 Eylül 10:00**, `instagram-karusel`.
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

6 Eylül 2026'da kuruldu ve uçtan uca doğrulandı. Gerçek bir video yüklendi
(`pmnPXtlHJeU`, `private`, kanal "Bahunur Civci"), yani kod ve kimlik tamam.

| Ne | Durum |
|---|---|
| Google Cloud projesi `mizac-paylasim` | kuruldu, numara `256746085549` |
| YouTube Data API v3 | etkin |
| OAuth istemcisi + token | çalışıyor, GitHub sırlarında da var |
| Onay ekranı | **In production** — 7 günlük token ölümü tuzağı atlatıldı |
| Denetim | **YAPILMADI** — video yüklenir ama gizli kilitli kalır |

**Senden gereken iki şey** (ayrıntı `paylasim/youtube-basvuru.md`):

1. **Kanal doğru mu?** Yükleme `bahu.civci@gmail.com` altındaki tek kanala,
   "Bahunur Civci"ye gitti. mizac için ayrı bir kanal varsa söyle, o hesapla
   yeniden yetkilendirelim. Test videosu `private`, istersen Studio'dan sil.
2. **Adres bilgileri** — denetim formu tam yasal ad, ülke, adres, şehir, il
   ve posta kodu istiyor. Gerisi hazır.

**İlk gerçek YouTube gönderisi: 24 Eylül 2026.** O güne kadar denetim
gelmezse video yüklenir ama gizli kalır; `YOUTUBE_GIZLILIK` bu yüzden
`private` — kilidi görmezden gelmek yerine onunla aynı şeyi istiyoruz.

---

## 4. Küçük işler

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
- **İki zamanlayıcı = çift post.** launchd ve GitHub Actions ayrı defter
  tutuyor. Actions açılınca launchd kapatılmalı.
- **`gh` jetonunda `workflow` yetkisi yok.** `.github/workflows/` altına push
  reddediliyor ve contents API bunu **404** diye döndürüyor — "yetkin yok"
  demiyor, "yok" diyor. `gh auth refresh -h github.com -s workflow`.
- **`icerik-dizini.json` tazelenmezse** Actions yeni günü "içerik dizininde
  yok" deyip atlar. İçerik üretiminden sonra `paylasim.dizin --uret`.
- **`.env`** aynı anahtarı iki kez içeriyorsa son DOLU değer kazanır; boş bir
  satır dolu olanı gölgelemez (düzeltildi, testi var).
