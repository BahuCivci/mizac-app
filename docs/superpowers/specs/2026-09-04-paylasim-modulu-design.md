# Paylaşım modülü — kendi zamanlayıcımız

**Tarih:** 2026-09-04
**Durum:** tasarım, onay bekliyor

## Neden

Site içeriği bugün **Publer** üzerinden paylaşılıyor. Publer'ın ücretsiz planı
aynı anda yalnız 5 bekleyen gönderi tutuyor, bu yüzden takvim 8-10 günde bir
elle besleniyor: tarayıcıda Publer'ı aç, doğru hesabı seç, CSV yükle, Submit'e
bas, deftere işle. Ağustos 2027'ye kadar bu iş ~40 kez daha yapılacak.

Karar: Publer'ı bırakıp paylaşımı kendimiz yapmak.

Malzeme kısmen hazır. `icerik/paylas.py` (347 satır) Instagram ve TikTok'un
resmî API'lerini kullanan, kuru çalışması varsayılan, mükerrer koruması olan
bir paylaşımcı. Eksik olan üç şey var ve üçü de bu tasarımın konusu.

### Eksik 1 — token yenileme yok, yani cron'a konamaz

`paylas.py` token'ları ortam değişkeninden okuyor ve hiç yenilemiyor.
Ölçülen ömürler:

| Token | Ömür | Yenileme |
|---|---|---|
| TikTok access token | **24 saat** | refresh token ile, kullanıcı onayı gerekmez |
| TikTok refresh token | 365 gün | — |
| Instagram uzun ömürlü token | 60 gün | en az 24 saatlik ve süresi dolmamışsa yenilenebilir |

Yani bugünkü haliyle cron'a konursa **ikinci gün çalışmaz**. Ve sessizce
değil, HTTP 401 ile — ama kimsenin okumadığı bir cron log'una. Bu, danışmanın
31 Ağustos'ta bir hafta boyunca fark edilmeden kesintide kalmasıyla aynı hata
sınıfı: gürültüsüz arıza.

### Eksik 2 — TikTok'un denetimi geçilmeden Direct Post işe yaramıyor

TikTok'un kuralı: *"Unaudited API Clients can only post contents in
`SELF_ONLY` viewership."* Denetimden geçmemiş uygulamanın attığı her video
gizli kalıyor — yüklenmiş oluyor ama kimse görmüyor.

Kaçış yolu **Upload to Inbox** (`video.upload` izni): program videoyu
gönderiyor, video TikTok uygulamasının taslaklarına düşüyor, kullanıcı
telefonda bildirimi açıp Post'a basıyor. Son adımı TikTok'un kendi uygulaması
yaptığı için `SELF_ONLY` kısıtı uygulanmıyor.

`paylas.py` yalnız Direct Post'u biliyor. Inbox yolu eklenmeli, ve hangisinin
kullanılacağı yapılandırılabilir olmalı — denetim geçilince tek satırla
Direct Post'a dönülsün diye.

### Eksik 3 — tek dosya, üç iş

Bugünkü `paylas.py` HTTP yardımcıları, Instagram akışı, TikTok akışı, medya
doğrulama, defter ve CLI'ı tek dosyada yapıyor. Üzerine token yenileme,
TikTok inbox ve YouTube gelince 600+ satır olur.

## Karar — modül sınırı nereden geçiyor

Ölçülen bağımlılıklar:

| Katman | Dil | Bağımlılığı |
|---|---|---|
| `icerik/uret.ts`, `kaynak.ts`, `sablon.ts`, `temalar.ts` | TypeScript | `lib/mizac-data`, `lib/uyum-data`, `lib/blog-data` |
| `icerik/yukle.mjs` | Node | `@vercel/blob` |
| `icerik/paylas.py`, `video.py`, `sirada.py` | Python | **hiçbiri** — saf stdlib |

Ayrım çizgisi zaten var: **üretim** uygulamanın verisine muhtaç, **paylaşım**
hiçbir şey bilmiyor — yalnız `icerik/cikti/gunluk/<gün>/<biçim>/` klasörünü
okuyor. O klasör arayüzün kendisi.

Karar: **aynı depo, ayrı üst-seviye modül.** `danisman/` ile aynı desen.

Ayrı depo elenmiş durumda: `icerik/*.ts` taşınamıyor (`lib/`'e muhtaç), yani
hattı ikiye bölüp aralarında çıktı klasörü senkronlamak gerekirdi. Tek kişilik
bir projede bedeli var, karşılığı yok.

### Modülü modül tutan kural

> `paylasim/` yalnız iki şeyi bilir: `cikti/gunluk/` klasörünün biçimi ve
> ortam değişkenleri. `lib/`'e, Next'e, React'e, `icerik/*.ts`'e dokunmaz;
> `icerik/cikti/` altına **yazmaz**, yalnız okur.

Bu kural tutulduğu sürece ayrı depoya taşımak ileride bir `git mv` işi olur.
Yani bugün bedelini ödemeden o kapıyı açık tutuyoruz.

## Yapı

```
paylasim/
  README.md        kurulum; hangi anahtar nereden alınır
  ayar.py          ortam değişkenleri ve yollar, tek yerde
  kimlik.py        token saklama ve yenileme
  gunluk.py        cikti/gunluk/<gün>/ okur, iş listesi çıkarır
  defter.py        neyin paylaşıldığı; mükerrer koruması
  http.py          urllib sarmalayıcıları, Durdur hatası
  instagram.py     Graph API
  tiktok.py        Content Posting API — inbox ve direct post
  paylas.py        CLI; kuru çalışma varsayılan
  durum.py         sağlık raporu; her oturumda çalıştırılır
  gizli/           token.json — .gitignore'da
  veri/            paylasildi.json, gun.log — .gitignore'da
```

İki ayrı yerel klasör var çünkü içlerindekinin cinsi farklı: `gizli/` sır
tutuyor, `veri/` tutmuyor. Adın kendisi bir uyarı olsun diye ayrıldılar.
Klasör `durum/` değil `veri/`, çünkü `paylasim/durum.py` ile aynı pakette
çakışırdı.

`icerik/` böylece tek işe iniyor: üretim.

### Her modülün sorumluluğu

**`ayar.py`** — ortam değişkenlerini ve yolları tek yerden veriyor. İçerik
klasörü `ICERIK_KLASOR` ile değiştirilebilir, varsayılanı
`<depo>/icerik/cikti/gunluk`. Eksik bir anahtar sorulduğunda ne olduğunu ve
nereden alınacağını söyleyen bir hata veriyor, `KeyError` değil.

**`kimlik.py`** — modülün kalbi. Sabit sırlar (`.env`'de, elle konur):

```
TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET
IG_KULLANICI_ID, IG_UYGULAMA_ID, IG_UYGULAMA_SIRRI
MEDYA_TABAN_URL
```

Değişen token'lar `paylasim/gizli/token.json`'da:

```json
{
  "tiktok": {"access": "...", "refresh": "...", "biter": "2026-09-05T14:00:00"},
  "instagram": {"access": "...", "biter": "2026-11-03T00:00:00"}
}
```

`token(platform)` çağrıldığında son kullanma tarihine bakıyor; TikTok'ta
1 saatten, Instagram'da 7 günden az kalmışsa yeniliyor ve dosyaya yazıyor.

**Yenileme başarısızsa hiçbir şey paylaşılmıyor** — yarım işe girişmek yerine
gürültülü duruyor. Bu bilinçli: sessiz arıza bu projede bir kez bir haftaya
mal oldu.

**`gunluk.py`** — bir günün klasörünü okuyup `[(klasör, platform, tür)]`
listesi çıkarıyor. `BICIM` haritası burada yaşıyor. Yeni platform eklemek
bu haritaya bir satır.

**`defter.py`** — bugünkü `paylasildi.json` mantığı, ama dosya artık
`paylasim/veri/paylasildi.json`. Anahtar `<gün>/<klasör>`. Sebep: `paylasim/`
`icerik/cikti/` altına yazmıyor.

**`instagram.py`** — bugünkü `instagram_paylas` olduğu gibi taşınıyor:
karusel/tek/reels, kapsayıcı oluştur → video ise FINISHED bekle → yayınla.
Kuru çalışmada her medya adresini HEAD ile yokluyor; biri açık değilse
paylaşımı hiç denemiyor.

**`tiktok.py`** — iki yol:

| Yol | Uç nokta | İzin | Sonuç |
|---|---|---|---|
| `inbox` | `/v2/post/publish/inbox/video/init/` | `video.upload` | taslağa düşer, kullanıcı telefonda Post'a basar |
| `direct` | `/v2/post/publish/video/init/` | `video.publish` | doğrudan yayına girer; denetimsizse `SELF_ONLY` |

`TIKTOK_YOL` ortam değişkeniyle seçiliyor, **varsayılan `inbox`**. Denetim
geçilince tek satır değişiyor.

**`paylas.py`** — CLI. Bugünkü arayüz aynen korunuyor:

```
python3 -m paylasim.paylas                    # bugünü dener, hiçbir şey paylaşmaz
python3 -m paylasim.paylas --gun 2026-09-04
python3 -m paylasim.paylas --gercek           # gerçekten paylaşır
```

**Varsayılan kuru çalışma.** Bu araç geri alınamaz, herkese açık post atıyor.

**`durum.py`** — sağlık raporu: token'lar ne zaman biter, son paylaşım ne
zamandı, dün bir şey kaçtı mı, hangi günlerin videosu üretilmemiş.

Bu, cron'un sessiz arızasına karşı savunma. Ayrı bir bildirim altyapısı
kurmak yerine projenin var olan alışkanlığını kullanıyor: CLAUDE.md
`sirada.py`'ı her oturumda çalıştırmayı zaten söylüyor. `durum.py` de aynı
listeye giriyor. Nöbetçi ayrı bir servis değil, oturumun kendisi.

## Hata halleri

| Durum | Davranış |
|---|---|
| Token yenilenemedi | Hiçbir şey paylaşma, sıfırdan farklı çıkış kodu, sebebi yaz |
| `video.mp4` yok | O postu atla, diğerlerine devam, sonda özet |
| Medya adresi açık değil | Instagram'ı hiç deneme (Instagram medyayı kendi çekiyor) |
| Zaten paylaşılmış | Sessizce atla — cron iki kez tetiklenirse sorun olmasın |
| TikTok 401 | Bir kez yenileyip tekrar dene, yine olmazsa dur |
| Bir post hata verdi | Diğerleri devam etsin; çıkış kodu 1 |

Hatalar bugünkü `Durdur` istisnasıyla taşınıyor; sınıf `http.py`'a geçiyor.

## Cron

```
0 10 * * *  cd /Users/bahu/Documents/mizac-app && \
            /usr/bin/python3 -m paylasim.paylas --gercek >> paylasim/veri/gun.log 2>&1
```

Mac uykudayken cron çalışmıyor; bu bilinen bir kısıt. `durum.py` kaçan günü
gösteriyor, elle telafi edilebiliyor. Kalıcı çözüm (`launchd` + `wake`) bu
tasarımın kapsamında değil.

## Göç

1. `git mv icerik/paylas.py paylasim/paylas.py` — geçmiş takip etsin
2. Ayrı commit'lerde parçalara böl; her adımda kuru çalışma yeşil kalsın
3. `icerik/cikti/paylasildi.json` varsa `paylasim/veri/` altına taşı
4. `.gitignore`'a `paylasim/gizli/` ve `paylasim/veri/`
5. CLAUDE.md: paylaşım bölümünü güncelle, `durum.py`'ı oturum listesine ekle

`icerik/sirada.py`, `csv-url.py` ve Publer bölümü **şimdilik duruyor** —
Instagram ve TikTok yeni yoldan doğrulanana kadar geri çekilme yolu onlar.
İkisi de tuttuğunda ayrı bir commit'te siliniyor.

## Doğrulama

1. `python3 -m paylasim.paylas --gun 2026-09-04` — kuru çalışma, her iki
   platform için de "ne yapacağını" doğru yazıyor
2. **Token yenileme:** `token.json`'daki `biter` alanı elle geçmişe çekilip
   çalıştırılıyor; yenileme tetikleniyor, yeni token yazılıyor. Bu testi
   yapmadan cron'a konmuyor — modülün varlık sebebi bu.
3. **Instagram gerçek post:** Development modunda tek bir post; App Review
   olmadan yayına girip girmediği burada anlaşılıyor
4. **TikTok inbox:** tek video; telefonda bildirim geliyor mu, taslaktan
   herkese açık paylaşılabiliyor mu
5. Mükerrer koruması: aynı gün iki kez `--gercek`, ikincisi hiçbir şey atmıyor
6. `npm run lint && npx tsc --noEmit` — `paylasim/` Python, uygulamayı
   etkilememeli; bu, sınır kuralının testi

## Kapsam dışı

- **YouTube.** Yapı yerini bırakıyor (`youtube.py`) ama v1'de yok; Data API v3
  de doğrulanmamış uygulamada yüklenen videoyu kilitliyor, yani TikTok'la aynı
  cinsten bir engel. Ayrı iş.
- **TikTok denetim başvurusu.** Kod değil, form. Paralel yürüyecek; onay
  gelince `TIKTOK_YOL=direct` olacak ve telefondaki dokunuş da bitecek.
- **Tarayıcı otomasyonu.** `browser-use/` taslağı bu tasarımın hiçbir yerinde
  kullanılmıyor. Gerekçe: platformların şartlarına aykırı, tespiti sessiz
  (gölge ban), ve kazancı günde tek dokunuş. Ayrıca inbox yolunda taslak
  telefondaki uygulamaya düştüğü için tarayıcı botu o adımı zaten yapamaz.
- **Publer otomasyonu.** Bu tasarım Publer'ı otomatikleştirmiyor, yerine
  geçiyor.
