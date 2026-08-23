---
name: paylas
description: Publer'a sırada hangi CSV'nin yükleneceğini söyler (hiçbir şey göndermez)
allowed-tools: Read Bash(python3 icerik/sirada.py*) Bash(python3 icerik/paylas.py*) Bash(open icerik/*) Bash(ls *) Bash(date*)
---

# Sıradaki paylaşım

Bu komut **hiçbir şey göndermez**. Publer'a elle yüklenecek sıradaki dosyayı
söyler.

Ücretsiz planda aynı anda 5 bekleyen gönderi tutulabiliyor, yani takvim 8-10
günde bir besleniyor. Hangi parçanın sırada olduğunu hatırlamak gerekmesin
diye bu komut var.

## Sırada ne var

```!
cd /Users/bahu/Documents/mizac-app && python3 icerik/sirada.py
```

## Ne yapmalı

Yukarıda **ŞİMDİ YÜKLE** yazan varsa:

1. Publer → **Create** → **Bulk Options** → **Import CSV**
2. `cikti/zamanlayici/publer/parcali/` içinden o dosyayı seç
3. Önizlemede ilk gönderiye bak, en alta inip **Submit**

**yayında** yazıyorsa yapacak bir şey yok; belirtilen günde tekrar bak.

Klasörü açmak için: `open icerik/cikti/zamanlayici/publer/parcali`

## İçerik tazeleme

Yeni gönderi üretildiyse sırayla:

```
python3 icerik/video.py     # eksik videoları üret
vercel env pull             # BLOB_READ_WRITE_TOKEN
node icerik/yukle.mjs       # medyayı Blob'a yükle
python3 icerik/csv-url.py   # CSV'leri ve parçaları tazele
```

## API ile otomatik paylaşım

Meta ve TikTok onayları geldiğinde `paylas.py` devreye girer ve Publer'a
gerek kalmaz. Onaylar yoksa aşağıdaki komut zaten hata verir:

```
python3 icerik/paylas.py            # kuru çalışma
python3 icerik/paylas.py --gercek   # gerçek paylaşım — kullanıcı çalıştırır
```

Bu komut o adımı **çalıştırmaz**. Herkese açık ve geri alınamaz bir iş olduğu
için kararı ve komutu kullanıcıya bırakır. Ayrıntı: `icerik/PAYLASIM-KURULUM.md`
