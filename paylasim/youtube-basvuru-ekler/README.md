# YouTube denetim başvurusu — ekran görüntüleri

Formun zorunlu kanıtları. 9 Eylül 2026'da canlı siteden alındı
(1440 px genişlik, gerçek çözünürlük).

| Dosya | Formda nereye | Ne gösteriyor |
|---|---|---|
| `yt-1-gizlilik-youtube-bolumu.png` | Gizlilik politikası kanıtı | `/gizlilik` sayfasındaki **8. YouTube API Servisleri** bölümü. Google'ın istediği üç şeyin üçü de bu tek görüntüde: YouTube Hizmet Şartları bağlantısı, Google Gizlilik Politikası bağlantısı, ve verinin nasıl silindiği. |
| `yt-2-anasayfa-altbilgi.png` | Gizlilik politikasının sitede bulunabildiği | Ana sayfa altbilgisi; **Gizlilik Politikası** bağlantısı çerçeveyle işaretli, yanında Kullanım Koşulları. |
| `yt-3-kullanim-kosullari.png` | Hizmet şartları belgesi | `/kullanim-kosullari` sayfasının tamamı, tek parça. |

## Yeniden almak gerekirse

Sayfalar değişirse görüntüler eskir. Alma yöntemi: tarayıcıyı 1440x900'e
ayarla, ilgili sayfaya git, `/gizlilik`'te 8. bölümün `<section>`'ını
hedefleyerek öğe görüntüsü al; ana sayfada altbilgiyi görünür kılıp
gizlilik bağlantısını çerçevele; koşullar sayfasında tam sayfa görüntü al.

| `yt-4-oauth-ve-yukleme-akisi.png` | 1. proje — KOŞULLU kanıt | OAuth rıza ekranı, tek kapsam (`youtube.upload`), yükleme akışı (arayüz yok, zamanlanmış iş) ve yetki iptali. `yt-4a/4b/4c` bunun ham parçaları. |
| `yt-5-gonderim-onayi.png` | — | Google'ın gönderim onayı |

## Durum: GÖNDERİLDİ (10 Eylül 2026)

Form dolduruldu ve gönderildi. Cevap `safra943@gmail.com`'a gelecek.

**Koşullu kanıt neden gerekti:** OAuth türü "Evet" ve kullanım alanı "Video
Yükleme" seçilince form dördüncü bir dosya istiyor. İlk gönderim denemesi
bu yüzden reddedildi; `yt-4` o boşluk için üretildi.
