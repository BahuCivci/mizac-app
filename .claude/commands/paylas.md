---
name: paylas
description: Günün sosyal medya içeriğini göster ve paylaşıma hazır mı doğrula (hiçbir şey göndermez)
allowed-tools: Read Bash(python3 icerik/paylas.py*) Bash(ls *) Bash(date*)
---

# Günün paylaşımı

Bu komut **hiçbir şey göndermez**. Günün içeriğini gösterir ve paylaşıma
hazır olup olmadığını doğrular. Gerçek paylaşım ayrı bir adımdır — aşağıda.

## 1. Bugün ne var

```!
cd /Users/bahu/Documents/mizac-app
GUN=${1:-$(date +%Y-%m-%d)}
echo "gün: $GUN"
if [ -d "icerik/cikti/gunluk/$GUN" ]; then
  cat "icerik/cikti/gunluk/$GUN/_BUGUN.txt" 2>/dev/null | head -20
  echo
  for k in icerik/cikti/gunluk/$GUN/*/; do
    [ -d "$k" ] && echo "  $(basename $k): $(ls "$k" | tr '\n' ' ')"
  done
else
  echo "Bu gün için içerik yok."
  echo "İlk gün: $(ls icerik/cikti/gunluk 2>/dev/null | head -1)"
  echo "Son gün : $(ls icerik/cikti/gunluk 2>/dev/null | tail -1)"
fi
```

## 2. Paylaşıma hazır mı (kuru çalışma)

```!
cd /Users/bahu/Documents/mizac-app
python3 icerik/paylas.py --gun ${1:-$(date +%Y-%m-%d)} 2>&1 | tail -15
```

## 3. Ne yapmalı

Yukarıdaki çıktıya bak:

- **`✓` satırları** → o post gönderilmeye hazır.
- **`MEDYA_TABAN_URL tanımlı değil`** → Instagram medyayı herkese açık bir
  adresten çekmek zorunda. Kurulum: `icerik/PAYLASIM-KURULUM.md`.
- **`IG_TOKEN` / `TIKTOK_TOKEN` tanımlı değil** → platform onayları henüz
  tamamlanmamış (Instagram 2-4 hafta, TikTok 2-6 hafta).
- **`video.mp4 yok`** → `python3 icerik/video.py` ile üret.

**Gerçekten paylaşmak için** — kullanıcı açıkça istediğinde, kendisi çalıştırır:

```
python3 icerik/paylas.py --gercek
```

Bu komut o adımı **çalıştırmaz**. Herkese açık ve geri alınamaz bir iş olduğu
için kararı ve komutu kullanıcıya bırakır.
