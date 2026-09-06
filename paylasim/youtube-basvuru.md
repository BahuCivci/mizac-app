# YouTube Data API — denetim başvurusu

**HENÜZ GÖNDERİLMEDİ.** Formda yalnız senin bilebileceğin iki alan var (adres
ve ekran görüntüleri); gerisi burada hazır.

Form: `support.google.com/youtube/contact/yt_api_form`
("YouTube Data API Servisleri — Denetim ve Kota Artırma Formu")

## Neden gerekiyor

Denetimden geçmemiş bir API projesinden yüklenen her video **gizli
kilitleniyor** ve bu **geri alınamıyor** — itiraz hakkı yok. Kanalın senin
olması muafiyet değil; ölçüt projenin denetimden geçmiş olması.

6 Eylül 2026'da uçtan uca denendi ve doğrulandı: yükleme çalışıyor
(video `pmnPXtlHJeU`, `private`), yani eksik olan tek şey denetim.

TikTok'u kurtaran "taslağa bırak" numarasının YouTube'da karşılığı yok —
Data API'de taslağa yükleme uç noktası bulunmuyor.

## FORMU PARÇA PARÇA DOLDURMA

7 bölümün hepsi zorunlu ve dosya yüklemesi istiyor. TikTok formundaki gibi
davranacağını varsay: her şey hazır olmadan başlama.

## Kurulmuş olanlar (6 Eyl 2026)

| Ne | Değer |
|---|---|
| Google Cloud projesi | `mizac-paylasim` |
| **Proje numarası** (form bunu istiyor, ID'yi değil) | `256746085549` |
| YouTube Data API v3 | etkin |
| OAuth istemcisi | Web application, yönlendirme `https://mizac.xyz/` |
| Onay ekranı | **In production** — 7 günlük token ölümü böylece yok |
| Kapsam | yalnız `https://www.googleapis.com/auth/youtube.upload` |
| Kanal | `UCNToCxBTI-RO6NLyVt_4GGA` (Bahunur Civci), bahu.civci@gmail.com |

## Bölüm bölüm cevaplar

**1. İstek türü:** "Ek kota istemek için uygunluk denetimini tamamlama".
Kota artışı istemiyoruz (aşağıya bak), ama denetim için tek yol bu seçenek.

**2. Kuruluş ve iletişim:** "Bireysel kullanıcı olarak".
Kuruluş büyüklüğü: "Bağımsız Geliştirici/Şahıs Şirketi".
Birincil web sitesi: `https://mizac.xyz`.
İletişim: Bahunur Civci, bahu.civci@gmail.com.

> **SENDEN GEREKEN:** Tam yasal ad, ülke, adres, şehir, il, posta kodu.
> Bunları ben dolduramam.

**3. İş modeli:**

> mizac.xyz is a Turkish-language educational site about classical
> temperament theory (mizac), live since August 2026. It publishes one short
> educational video per day, produced from our own written content. The API
> client uploads that day's video to the site owner's own YouTube channel.
> It serves no other users and has no customers.

Hedef kitle: **Kamu** (site herkese açık) + **Dahili Kullanıcılar**
(API istemcisini yalnız site sahibi kullanıyor).
Para kazanma: **Ücretsiz hizmet**. YouTube içeriği üzerinde reklam YOK.
Google iş ortağı yöneticisi: **Hayır**.

**4. API istemcisi:**
- Ad: `mizac.xyz` — adında "YouTube" **geçmiyor** (geçmesi yasak).
- Birincil erişim URL'si: `https://mizac.xyz/`
- Gizlilik Politikası URL'si: `https://mizac.xyz/gizlilik`
- Hizmet Şartları URL'si: `https://mizac.xyz/kullanim-kosullari`
- Herkes erişebilir mi: **Hayır** (yükleyen yalnız site sahibi).
  Demo hesabı gerekmiyor; yükleme arayüzü yok, zamanlanmış bir iş.

**5. Kullanım alanı ve kota:**
- Proje sayısı: 1, numara `256746085549`
- Kategori: **Video Yükleme ve Hesap Yönetimi**
- OAuth zorunlu mu: **Evet**
- Kullanılan uç nokta: yalnız `youtube.videos.insert`
- Kota: **Değişiklik yok / varsayılan (10.000)**. Günde en fazla 1 yükleme
  × 1600 birim = 1600. Varsayılanın altında; artış istemiyoruz.
- Beklenen hacim: ~1600 birim/gün, yılda ~64 video.

**7. Onaylar:** hepsi işaretlenecek.

## Zorunlu ekran görüntüleri — SENDEN GEREKEN

1. **Gizlilik politikası ekran görüntüleri.** Google şunları görmek istiyor:
   YouTube bölümleri, Google Gizlilik Politikası bağlantısı, veri silme
   politikası. **6 Eylül'de `/gizlilik` sayfasına "8. YouTube API Servisleri"
   bölümü eklendi ve üçü de orada.** Sayfanın o bölümünün görüntüsü yeter.
2. **Ana sayfa ekran görüntüsü** — gizlilik politikası bağlantısının
   göründüğü yer (footer).
3. **Hizmet şartları belgesi** — `/kullanim-kosullari` sayfasının çıktısı.

## Reddedilirse ne olur

Hiçbir şey bozulmaz: yükleme çalışmaya devam eder, videolar `private` kalır.
Kayıp, YouTube'un otomatik paylaşımdan çıkması olur — o zaman ya elle
yüklenir ya da o günün YouTube gönderisi atlanır.

`YOUTUBE_GIZLILIK` denetim geçene kadar **`private` kalmalı**. `public`
yapmak videoyu herkese açık yapmıyor; sadece kilidi görünmez kılıyor.
