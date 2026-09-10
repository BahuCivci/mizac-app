# Yapılacaklar

Bağlam sıkıştığında ya da yeni bir oturum açıldığında **önce burayı oku**.
Ayrıntı `CLAUDE.md`, `paylasim/README.md` ve `paylasim/basvuru.md`'de.

Son güncelleme: 10 Eylül 2026.

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

## 1b. ACİL — Blob mağazası ASKIDA (10 Eyl 2026)

**Vercel Blob mağazası `mizac-medya` faturalandırma durumu "Inactive".**
Bütün 832 dosya herkese açık okumada **403** dönüyor. Token'la listeleme ve
yazma çalışıyor; kırılan yalnız herkese açık okuma.

    vercel blob get-store        # Billing State: Inactive

**Zaman çizelgesi:** 9 Eyl ~23:00 → 842 dosyanın hepsi 200. 10 Eyl 07:36 →
pencere ajanı dosya yükleyebildi (yazma sağlam). 10 Eyl **11:40** → mağazanın
"Updated At"i. 12:00 → Actions paylaşımı indirme adımında düştü.

**Sebebi büyük olasılıkla 9 Eyl'deki kota aşımı** (1197 MB / 1000 MB).
Temizlikten sonra 334 MB'a indi ama askı kendiliğinden kalkmadı.

**SENDEN GEREKEN:** Vercel paneli → Storage → `mizac-medya`. Askıyı kaldıran
bir uyarı/düğme olmalı; yoksa ödeme yöntemi ya da Pro gerekebilir.
Panel tarayıcıda oturum istiyor, oraya giremem.

**SON TARİH: 12 Eylül 2026.** O gün `instagram-karusel` var ve Instagram
görselleri herkese açık adresten çekiyor. 10 ve 11 Eylül Publer'dan çıktı,
17 Eylül de öyle; aradaki 12-16 Eylül bizim modülün işi.

**Bugün gönderi KAÇMADI** — 10 Eylül'ünkini Publer zaten atmıştı. Actions
koşusu gönderiye sıra gelmeden, indirme adımında düştü.

**Tasarım kusuru, ayrıca not:** iş akışı önce medyayı indiriyor, sonra
defterde "zaten paylaşılmış mı" diye bakıyor. Publer'ın kapattığı günlerde
bu boşuna iş ve şimdi gürültülü hata üretiyor. Sıra tersine çevrilmeli.

**Yedek yol (askı uzarsa):** görseller küçük (40 KB), `public/medya/` altına
konup `mizac.xyz` üzerinden sunulabilir; 12-16 Eylül'ün hepsi görsel.
Instagram Reels videosu (30 MB) ilk 18 Eylül'de, ona kadar zaman var.

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

## 3. YouTube — kimlik KURULDU, **başvuru DOLDURULMAYI bekliyor**

**10 Eyl 2026: eksik hiçbir bilgi kalmadı.** Yasal ad, ülke, şehir, adres ve
posta kodu kullanıcıdan alındı ve `paylasim/gizli/youtube-basvuru-kisisel.md`
içinde duruyor — **gizli tarafta, çünkü bu depo public**. Ekran görüntüleri
de hazır (`paylasim/youtube-basvuru-ekler/`). Formun bütün cevapları
`paylasim/youtube-basvuru.md`'de kelimesi kelimesine yazılı.

Geriye yalnız formu doldurup göndermek kaldı.

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

## 6. Kitaptan video — ÜRETİM BİTTİ (9 Eyl 2026)

**SUNUCUDAKİ ÜRETİM BİTTİ (9 Eyl 2026).** 315 tarif, 315 ham gönderi
(ses + 5 plan). Yedi işçinin hepsi `KALAN_YOK` deyip durdu.

    ssh mta_kullanici@192.168.1.40
    ls ~/mizac-lab/gecici/*/sureler.json | wc -l     # 315
    ls ~/mizac-lab/icerik/cikti/tarifler/*.json | wc -l   # 315

**TARİFLER SUNUCUDA ÜRETİLİYOR, MAC'TE OLMAYABİLİR.** Kurgu altyazıyı
tariften okuyor; eksikse çakılır. Kurgudan önce:

    rsync -a mta_kullanici@192.168.1.40:'~/mizac-lab/icerik/cikti/tarifler/' \
      icerik/cikti/tarifler/

Kurgu Mac'te: `python3 icerik/kurgu-toplu.py --hepsi` (~35 sn/video).
Ölçüldü: 199 videonun hepsi 1080x1920, 29-47 sn, sesli, bozuk yok.

### Boru hattı

| Adım | Nerede | Dosya |
|---|---|---|
| Kitabı böl | Mac | `icerik/kitap-bol.py` |
| Tarif üret | Sunucu | `icerik/gonderi-uret.py` |
| Ses + planlar | Sunucu | `~/mizac-lab/gonderi-yap.py` |
| Kurgu | **Mac** | `icerik/kurgu-toplu.py` |

**Ölçüm:** gönderi başına ~30 dk (5 plan × ~6 dk). 7 işçiyle saatte ~14.

### Bu işte öğrenilenler — hepsi ölçülerek

- **Yönergeye somut örnek koyma**, model onu şablona çeviriyor. Üç kez oldu;
  311 kancanın 201'i iki örneğimin kopyasıydı.
- **OCR çöpü uydurma tetikliyor.** Anlamsız pasaj alan model makul bir şey
  uyduruyor (%68'inde pasajda olmayan bebekler). Filtre: sesli harfsiz ya da
  2 harften kısa kelime oranı > %18 → at. 557 pasajdan 315'i kaldı.
- **Kapanışta siteyi ADIYLA söyle.** "Siteye çağır" deyince model kaynak
  kitabı tanıttı (214'ün 186'sı) ve bir kez olmayan alan adı uydurdu.
- **İnsan varsa görünümü belirt**, yoksa Doğu Asyalı kişiler geliyor.
- **Chatterbox kaçıyor:** 17 kelimeye 28 sn ses üretti. Süre kelime sayısıyla
  denetleniyor, sapıtırsa yeniden üretiliyor.
- **drawtext'e satır sonu geçirilemiyor.** İki tür kaçırma da bozuldu;
  `textfile=` ile dosyadan okutmak tek çalışan yol.
- **`pgrep -f` kendi komutunu eşler.** İki kez yanılttı.
- **Aralık bölüşümü işçileri boşta bırakıyor.** Yedi işçiye baştan pay
  verilince üçü sabaha kalmadan bitirdi, 114 gönderi dördün üzerinde
  birikti. İşçi kendi işini `mkdir` kilidiyle kapıyor artık — dosya
  sisteminde atomik, ikinci deneme `FileExistsError` alıyor.
- **Toplu iş tek dosyaya takılıp ölmesin.** `kurgu-toplu.py --hepsi`
  listeyi sunucudan alıp tarifi yerelden okuyordu; 0015 Mac'te yoktu ve
  kurgu 185. videoda çakılıp kalan 130'u hiç denemedi.
- **Altyazıda satır sonu var, başlıkta olamaz.** Altyazılar ekranda ikiye
  bölünsün diye `\n` taşıyor; metnin başlığına öyle konunca YouTube
  başlığın yarısını alıyor ve gövde başlığa yapışıyor. Başlık tek satıra
  indiriliyor.

---

## 7. Takvim değişimi — KARAR VERİLDİ (8 Eyl 2026)

Kitaptan üretilen 315 video, takvimdeki **video yuvalarının** yerine geçecek.
Görsel gönderiler (karusel + kare) olduğu gibi kalacak.

**Bugünkü takvim:** 405 bekleyen gönderi, 345 gün, 23 Ağu 2027'de bitiyor.

| Tür | Adet | Ne olacak |
|---|---|---|
| tiktok-tiktok | 148 | yeni videoyla değişecek |
| instagram-reels | 49 | yeni videoyla değişecek |
| youtube-shorts | 48 | yeni videoyla değişecek |
| youtube-uzun | 11 | yeni videoyla değişecek |
| instagram-karusel | 100 | **kalacak** |
| instagram-kare | 49 | **kalacak** |

256 video yuvası var, elimizde 315 video olacak; kalan 59 takvimi uzatır.

**Neden hepsi değil:** yeni içerik dikey video; karusel ve kare görsel
gönderiler ve onların yerini tutamaz. Karusel Instagram'da kaydetme/paylaşma
oranı yüksek bir biçim, hepsini atmak kayıp olurdu.

**Uygulama** — `icerik/takvime-yerlestir.py` 2, 3 ve blob defteri
adımını birlikte yapıyor:

    python3 icerik/takvime-yerlestir.py --deneme --kac 6   # önce göz at
    python3 icerik/takvime-yerlestir.py
    node icerik/yukle.mjs                 # Blob'a (vercel env pull gerekiyor)
    python3 -m paylasim.dizin --uret      # YOKSA Actions günü atlar
    git commit paylasim/icerik-dizini.json

**17 Eylül'e kadar olan günlere dokunulmuyor** — o gönderiler Publer
kuyruğunda ve oradan çıkacak. Değiştirilebilir yuva: **254**.

**`youtube-uzun` yuvaları `youtube-shorts` oluyor.** Yeni içeriğin tamamı
1080x1920 ve ~35 sn; YouTube bunu zaten Short sayıyor, "uzun" kalırsa
açıklamaya `#Shorts` eklenmiyor ve keşfedilme yolu kapanıyor.

**BLOB DEFTERİ TUZAĞI.** `yukle.mjs` `cikti/blob-adresler.json`'da kaydı
olan dosyayı atlıyor. Video değişince kayıt silinmezse yeni dosya hiç
yüklenmez, Blob eskisini sunmaya devam eder ve paylaşım eskisini atar —
hiçbir yerde hata görünmez. `takvime-yerlestir.py` kaydı kendisi siliyor.

**BLOB KOTASI — kayan pencereye geçildi (9 Eyl akşamı).**
Videolar tam kalitede (ortalama 26 MB) duruyor ve yeniden kodlanmıyor. Ama
Blob'un ücretsiz planı 1 GB; ilk yükleme 218 dosyanın 183'ünde
"Storage quota exceeded" aldı ve kota aşılmışken üzerine yazma bile
reddediliyor. Kullanıcı seçti: sıkıştırma değil kayan pencere.

    bash icerik/blob-pencere-calistir.sh     # elle de aynı yol

Blob'da yalnız önümüzdeki 21 günün videosu duruyor; Mac'te launchd
6 saatte bir tazeliyor (`paylasim/xyz.mizac.blob-pencere.plist`, kuruldu ve
uçtan uca sınandı: penceredeki bir video Blob'dan silindi, ajan tek turda
geri koydu). Ölçüldü: 1197 MB → 321 MB, pencerede 16 video.
Gerekçesi ve Instagram'ın neden adres istediği CLAUDE.md'de.

**Doğrulama:** `python3 icerik/blob-dogrula.py` Blob'da duranların
yereldekiyle aynı olup olmadığını HEAD ile ölçüyor. "Yaklaşan günler
eksiksiz mi" sorusunun yeri o değil, `paylasim.durum`un "Blob penceresi"
satırı ya da `icerik/pencere-hazirla.py`.

**Sırada bekleyen ilgili iş:** karusel ve kare gönderilerin METİNLERİ de eski
şablondan geliyor (`lib/mizac-data.ts`), kitaptan değil. Kullanıcı bunu da
istedi.

**Sanıldığı kadar zor değil — görsel modeli GEREKMİYOR.** Karusel kartları
fotoğraf değil: `icerik/sablon.ts`'teki `kareSvg()` bir SVG kuruyor,
`uret.ts` onu `sharp` ile PNG'ye basıyor. Yani iş tamamen metin işi —
kitaptan slayt metinleri üretilip aynı şablona verilecek, çizim tarafına
hiç dokunulmayacak. Videolardaki tarif üretimi (`gonderi-uret.py`) örnek
alınabilir; oradaki üç tuzak burada da geçerli (örnek verme, OCR çöpünü
ele, kapanışta siteyi adıyla söyle).

---

## 7b. Karusel ve kare metinleri kitaptan — BİTTİ (10 Eyl 2026)

**146 yuvanın hepsi dolduruldu**: 98 karusel + 48 kare. Takvimdeki her
gönderi artık kitaptan geliyor.

| Parça | Ne yapar |
|---|---|
| `icerik/kart-uret.py` | Pasajlardan başlık + madde üretir (model, sıcaklık 0.4) |
| `icerik/kart-yerlestir.ts` | Aynı SVG şablonuyla PNG basıp takvime koyar |

Karusel üç ardışık pasajın sentezi, kare tek pasajdan. Görsel modeli
gerekmedi — kartlar `sablon.ts`'in SVG'si, `sharp` PNG'ye basıyor.

### Bu işte öğrenilenler

- **Denemeye SEBEBİ geri ver.** Körlemesine dört deneme 154 kartın 54'ünü
  kaybetti ve 51'i aynı iki kurala takılıyordu; sebep söylenince 18'i geldi.
- **Kuralların hepsi eşit değil.** Uzunluk/madde sayısı serttir (şablona
  sığmaz). "Yalın Mizaç ile başlama" ve "okuyucuya hitap et" ise videodaki
  SÖZLÜ KANCA kuralından devralınmıştı ve karusel kapağı okunuyor. Yuvayı
  boş bırakıp eski şablon metnini orada tutmak, düz bir başlıktan kötü.
  Yumuşak kurallar dört deneme zorlanıyor, sonra yedek kart kabul ediliyor
  ve kartın içine hangi kuralı geçemediği yazılıyor (29 kart böyle).
- **Sıcaklık 0.7 → 0.4.** 0.7'de Türkçe bozuluyordu ("Bir cümleye hayatını
  değiştirebilirsin"); 0.4'te bozukluk kalmadı ve kartlar birbirine benzemedi.
- **aya-expanse ELENDİ.** Türkçesi daha iyi ama biçime hiç uymuyor: 72
  karakterlik karta 180 karakterlik paragraf, 3 yerine 4 madde, ve tam da
  yasakladığımız soyutluk. Biçim uyumu daha zor kazanılan şey.
- **"sovdavi" HATA DEĞİL.** Kitabın taraması 88 kez öyle yazıyor, site 245
  kez "sevdavi". Kullanıcı ikisinin aynı olduğunu söyledi. Yayınlanan metin
  siteyle aynı olsun diye normalleştirildi — düzeltme değil, tutarlılık
  tercihi. Bu sayede 29 videonun sesini yeniden üretmek gerekmedi.
- **`yukle.mjs` VİDEOYA DOKUNMUYOR** (10 Eyl). Defterde kaydı olmayanı eksik
  sayıyor, dolayısıyla kayan pencere dışındaki 254 videoyu da yüklemek
  istiyordu: 6.2 GB, kotanın altı katı. Kuru çalışma okunarak yakalandı.

---

## 8. VPN sağlık nöbetçisi — BETİK VE PLIST HAZIR, KURULUM ROOT BEKLİYOR

`danisman/sunucu/vpn-saglik.sh` yazıldı ama yüklenmedi. Sebebi 7 Eylül'de
görüldü: VPN süreci yaşıyordu, `ppp0` ayaktaydı, log "Tunnel is up" diyordu
ama tek paket geçmiyordu. Mevcut nöbetçi yalnız süreç ölümüne bakıyor.

**10 Eyl 2026'da ÜÇÜNCÜ KEZ oldu** ve kart üretimini ortasından kesti:
`openfortivpn` süreci yaşıyor (PID vardı), `ppp0` ayakta ve adres almış,
ama `192.168.1.40`'a da VPN ağ geçidine de tek ping gitmiyor. Mevcut
`xyz.mizac.vpn` nöbetçisi yalnız süreç ölümüne baktığı için görmüyor.

Elle düzeltmesi: `sudo launchctl kickstart -k system/xyz.mizac.vpn`

Plist yazıldı (`danisman/sunucu/xyz.mizac.vpn-saglik.plist`) ve betikteki
kaçak karakter (satır 40, U+100000 klavye artığı) temizlendi.

Kurulum (root gerekiyor, tek seferlik):

    sudo cp danisman/sunucu/vpn-saglik.sh /usr/local/bin/
    sudo chmod 755 /usr/local/bin/vpn-saglik.sh
    sudo cp danisman/sunucu/xyz.mizac.vpn-saglik.plist /Library/LaunchDaemons/
    sudo launchctl bootstrap system /Library/LaunchDaemons/xyz.mizac.vpn-saglik.plist

İki dakikada bir 22. portu yokluyor, üç turda da geçmezse VPN'i yeniden
başlatıyor; iki müdahale arası en az 10 dakika. Bakmak:
`tail /var/log/mizac-vpn-saglik.log`

---

## 9. Şifre değiştir — iş bitince

VPN (`mta.vpn@kun.edu.tr`) ve sunucu (`mta_kullanici`) şifreleri 6 Eylül'de
sohbete yazıldı ve oturum kaydı `~/.claude/projects/` altında düz metin olarak
diskte duruyor. Sunucu tarafı artık SSH anahtarı kullanıyor, yani o şifre
gereksiz. VPN şifresi `/etc/openfortivpn/config`'de (root, 600).

**İkisini de değiştir**, VPN'inkini değiştirdikten sonra o dosyayı güncelle
(önce `sudo launchctl bootout system/xyz.mizac.vpn`, sonra düzelt, sonra
`bootstrap` — yanlış şifreyle döngü hesabı kilitletebilir).

---

## 9b. Klasör düzeni — toparlandı (9 Eyl 2026 gecesi)

Disk 35 GB'a düşmüştü; 41 GB'a çıktı.

- **6.5 GB çiftleme kaldırıldı.** `cikti/gunluk/` içindeki 254 video,
  `cikti/gonderiler/` içindeki asılların birebir kopyasıydı. Özdeş oldukları
  sağlamayla doğrulandı (254/254) ve **sabit bağlantıya** çevrildi.
  `takvime-yerlestir.py` artık kopyalamıyor, bağlıyor — bir daha birikmez.
- **browser-use'un iki venv'i silindi** (796 MB). Elle yazılmış üç dosya
  (`agent1.py`, `test_cloak.py`, `agent.rtf`) duruyor; klasör 20 KB.
- `icerik-paketi.zip` (38 MB, 9 Ağu, Publer dönemine ait), kökteki başıboş
  ekran görüntüleri ve `__pycache__`'ler silindi.
- `icerik/README.md` yeniden yazıldı: üç boru hattının hangi betikleri
  içerdiği ve hangisinin nerede çalıştığı orada. Karışık görünmesinin sebebi
  buydu — betikler üç ayrı işe ait ama hepsi tek klasörde.

**Dokunulmayanlar, sebebiyle:** `cikti/ham` (7.5 GB) yeniden kurgu için
gerekli, `cikti/ses-onbellek` (844 MB) eski boru hattının çıktısı. İkisi de
silinebilir ama önce kitaptan üretimin tamamen oturması beklenmeli.

---

## 10. Küçük işler

- **`browser-use/`** — venv'leri silindi (796 MB kazanıldı, 9 Eyl). Elle
  yazılmış üç dosya duruyor. Hiç çalışmamıştı; gerekirse `agent1.py`
  bakılacak tek yer.
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
