---
name: video
description: Senaryolardan eksik videoları üret (macOS sesi + ffmpeg, maliyet sıfır)
allowed-tools: Read Bash(python3 icerik/video.py*) Bash(find icerik/*) Bash(ls *)
---

# Video üretimi

Senaryolardaki sahneleri Türkçe sistem sesiyle seslendirip kapak görseli ve
marka renkli kartlarla birleştirir, sonda mizac.xyz kartı ekler. Dışarıya
hiçbir şey gitmez, hiçbir servise ödeme yapılmaz.

## Durum

```!
cd /Users/bahu/Documents/mizac-app
if [ ! -d icerik/cikti/gunluk ]; then
  echo "İçerik üretilmemiş. Önce: npm run icerik"
else
  V=$(find icerik/cikti/gunluk -name video.mp4 2>/dev/null | wc -l | tr -d ' ')
  G=$(find icerik/cikti/gunluk -mindepth 2 -maxdepth 2 -type d \( -name 'tiktok-*' -o -name '*-reels' -o -name '*-shorts' -o -name '*-uzun' \) | wc -l | tr -d ' ')
  echo "video: $V / $G"
  echo
  find icerik/cikti/gunluk -name video.mp4 | sed 's|.*/\([^/]*\)/video.mp4|\1|' | sort | uniq -c
fi
```

## Eksikleri üret

Eksik varsa aşağıdaki komut çalıştırılır. Video başına ~9 saniye; tamamı
boşsa yaklaşık 40 dakika sürer, o yüzden arka planda çalıştırmak gerekir.

```
python3 icerik/video.py            # eksik olan hepsi
python3 icerik/video.py --gun 2026-08-24
python3 icerik/video.py --sinir 5  # önce 5 tanesiyle dene
```

## Bilinmesi gereken

Bunlar **slayt videolarıdır** — yüz, gerçek ses ve çekim yok. Kişilik testi
içeriğinde bu format tutuyor ama "kendi videom" değil; kendi çekimini istersen
senaryolar `icerik/cikti/postlar/` klasöründe duruyor.

`youtube-uzun` senaryoları 5-6 dakikalık bir video varsayıyor ama her sahnenin
metni tek satır olduğu için üretilen video ~31 saniye çıkıyor. O 12 tanesi
gerçekten uzun içerik istiyorsa elle çekilmeli.
