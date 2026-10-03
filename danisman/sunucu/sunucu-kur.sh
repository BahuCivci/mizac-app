#!/bin/bash
# Üniversite sunucusunu SIFIRDAN kurar. MAC'TE çalışır, sunucuya kendisi bağlanır.
#
#     bash danisman/sunucu/sunucu-kur.sh --deneme      # hiçbir şey yapma, ne olacağını yaz
#     bash danisman/sunucu/sunucu-kur.sh --danisman    # yalnız danışman (en hızlı)
#     bash danisman/sunucu/sunucu-kur.sh --tam         # + video ve ses üretimi
#
# NEDEN VAR (3 Eki 2026)
# Sunucudaki hesap kapanırsa ya da bir süre kullanılmazsa oradaki her şey
# gider: Ollama, modeller, vekil, tünel, sanal ortamlar ve — asıl tehlikeli
# olanı — YALNIZ ORADA DURAN BETİKLER. 3 Eki'de bakıldığında 23 betiğin 14'ü
# depoda yoktu ve `nobetci.sh`in depodaki kopyası ESKİYDİ: sunucudaki sürümde
# olan üç düzeltme (en boş kartı seçme, cron'da `$USER` boş olduğu için 2181
# süreç biriktiren hatanın onarımı, adres deseni) depoda yoktu. Hesap silinse
# geri kurulan sistem o hataları geri getirirdi. Artık hepsi burada.
#
# NE BOZULUR, NE BOZULMAZ (sunucu yokken)
#   BOZULUR : mizac.xyz/danisman — model sunucuda, site ona tünelle gidiyor.
#             Kitaptan alıntı da oradan geliyor (vekil `GET /kitap`).
#             Yeni video/ses üretimi.
#   BOZULMAZ: Günlük sosyal medya paylaşımı. Videolar üretilmiş durumda,
#             medya GitHub Releases'te, zamanlayıcı GitHub Actions'ta.
#             24 Tem 2027'ye kadarki içerik sunucuya hiç ihtiyaç duymuyor.
#
# SÜRE — dürüst olmak gerekirse "anında" değil, indirme süresi:
#   --danisman : ~20-40 dk (Ollama + gemma3:27b 17 GB)
#   --tam      : üstüne 1-2 saat (torch + Wan 2.2 ~32 GB, HF önbelleği)
# Betik bekleyen indirmeyi başlatıp çıkar; ilerlemeyi sunucudaki log'a yazar.
#
# TEKRAR ÇALIŞTIRILABİLİR: var olanı atlar, eksiği tamamlar.
set -u

SUNUCU="${MIZAC_SUNUCU:-mta_kullanici@192.168.1.40}"
KOK="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
UZAK="mizac-lab"
MOD="danisman"
DENEME=0

for arg in "$@"; do
  case "$arg" in
    --deneme) DENEME=1 ;;
    --danisman) MOD="danisman" ;;
    --tam) MOD="tam" ;;
    --sunucu=*) SUNUCU="${arg#*=}" ;;
    *) echo "bilinmeyen seçenek: $arg" >&2; exit 2 ;;
  esac
done

yaz() { printf '%s\n' "$*"; }
uzak() { ssh -o BatchMode=yes -o ConnectTimeout=15 "$SUNUCU" "$@"; }

# --- 1. Ön kontrol -----------------------------------------------------------
yaz "== ön kontrol ($SUNUCU, mod: $MOD)"
if ! uzak 'echo ok' >/dev/null 2>&1; then
  yaz "sunucuya SSH ile ulaşılamıyor. VPN açık mı? (nc -z 192.168.1.40 22)"
  exit 1
fi
GPU=$(uzak 'nvidia-smi --query-gpu=index --format=csv,noheader 2>/dev/null | wc -l')
BOS=$(uzak 'df -BG --output=avail ~ | tail -1 | tr -dc 0-9')
yaz "   GPU: ${GPU:-0} kart, boş disk: ${BOS:-?} GB"
GEREKEN=60; [ "$MOD" = "tam" ] && GEREKEN=120
if [ "${BOS:-0}" -lt "$GEREKEN" ]; then
  yaz "   UYARI: $MOD için ~$GEREKEN GB öneriliyor, ${BOS} GB var."
fi

# Kitap metni telifli ve depoda yok; Mac'teki kopyadan gidiyor.
KITAP="$KOK/kaynak/kitap_tam_metin.txt"
[ -f "$KITAP" ] || yaz "   NOT: $KITAP yok — danışman kitapsız çalışır (bu bir arıza değil)."

if [ "$DENEME" = "1" ]; then
  yaz ""
  yaz "[DENEME] Yapılacaklar:"
  yaz "  1. ~/$UZAK oluştur, betikleri ve kitabı kopyala"
  yaz "  2. Ollama'yı ~/llm/ollama'ya kur (sudo YOK), gemma3:27b indir"
  yaz "  3. Vekil anahtarını üret (.anahtar), cloudflared'i ~/bin'e kur"
  yaz "  4. Nöbetçiyi crontab'a koy (5 dakikada bir), süreçleri başlat"
  [ "$MOD" = "tam" ] && yaz "  5. venv + venv-tts kur (gereksinimler/ içindeki sürümlerle)"
  yaz "  6. Tünel adresini ve YENİ anahtarı Vercel'e yaz, siteyi yeniden dağıt"
  yaz ""
  yaz "Hiçbir şey yapılmadı."
  exit 0
fi

# --- 2. Betikler ve kitap ----------------------------------------------------
yaz "== betikler kopyalanıyor"
uzak "mkdir -p ~/$UZAK ~/bin ~/llm"
BETIKLER=(nobetci.sh vekil.py vekil-yeniden-baslat.sh kart-sec.sh video-uret.py
          adim-seslendir.py anlatim.py toplu-seslendir.py toplu-baslat.sh is.sbatch)
for b in "${BETIKLER[@]}"; do
  scp -q "$KOK/danisman/sunucu/$b" "$SUNUCU:$UZAK/$b"
done
# gonderi-yap.py depoda icerik/ altında duruyor (Mac'ten de okunabiliyor).
scp -q "$KOK/icerik/gonderi-yap.py" "$SUNUCU:$UZAK/gonderi-yap.py"
uzak "chmod +x ~/$UZAK/*.sh"
yaz "   $(( ${#BETIKLER[@]} + 1 )) betik yerinde"

if [ -f "$KITAP" ]; then
  uzak "mkdir -p ~/$UZAK/kaynak && chmod 700 ~/$UZAK/kaynak"
  scp -q "$KITAP" "$SUNUCU:$UZAK/kaynak/kitap_tam_metin.txt"
  uzak "chmod 600 ~/$UZAK/kaynak/kitap_tam_metin.txt"
  yaz "   kitap metni kopyalandı (mod 600 — makine paylaşımlı)"
fi

# --- 3. Ollama ---------------------------------------------------------------
# sudo YOK: Ollama kullanıcının kendi dizinine kuruluyor. nobetci.sh de onu
# oradan başlatıyor ($HOME/llm/ollama/bin/ollama).
yaz "== Ollama"
if uzak "[ -x ~/llm/ollama/bin/ollama ]"; then
  yaz "   zaten kurulu"
else
  yaz "   indiriliyor (~1.5 GB)..."
  uzak 'set -e; cd ~/llm && curl -fsSL https://ollama.com/download/ollama-linux-amd64.tgz -o o.tgz && mkdir -p ollama && tar xzf o.tgz -C ollama && rm o.tgz' \
    || { yaz "   Ollama kurulamadı"; exit 1; }
  yaz "   kuruldu"
fi

# --- 4. Vekil anahtarı -------------------------------------------------------
# Anahtar SUNUCUDA üretiliyor ve buraya hiç yazdırılmıyor; oturum kaydı düz
# metin JSONL olarak diskte duruyor (CLAUDE.md, "Şifre sohbete girmez").
yaz "== vekil anahtarı"
if uzak "[ -s ~/$UZAK/.anahtar ]"; then
  yaz "   duruyor, dokunulmadı"
  YENI_ANAHTAR=0
else
  uzak "python3 -c 'import secrets; print(secrets.token_urlsafe(32))' > ~/$UZAK/.anahtar && chmod 600 ~/$UZAK/.anahtar"
  yaz "   yeni anahtar üretildi (Vercel'e aşağıda yazılacak)"
  YENI_ANAHTAR=1
fi

# --- 5. cloudflared ----------------------------------------------------------
yaz "== cloudflared"
if uzak "[ -x ~/bin/cloudflared ]"; then
  yaz "   zaten kurulu"
else
  uzak 'curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o ~/bin/cloudflared && chmod +x ~/bin/cloudflared' \
    || { yaz "   cloudflared kurulamadı"; exit 1; }
  yaz "   kuruldu"
fi

# --- 6. Model ----------------------------------------------------------------
yaz "== gemma3:27b"
uzak "cd ~/$UZAK && (curl -s -o /dev/null -m 5 127.0.0.1:11434/api/tags || (CUDA_VISIBLE_DEVICES=0 nohup ~/llm/ollama/bin/ollama serve > ollama.log 2>&1 < /dev/null & sleep 8))"
if uzak "curl -s -m 10 127.0.0.1:11434/api/tags | grep -q gemma3:27b"; then
  yaz "   zaten inmiş"
else
  yaz "   indiriliyor (17 GB) — arka planda, log: ~/$UZAK/cekme.log"
  uzak "cd ~/$UZAK && setsid nohup ~/llm/ollama/bin/ollama pull gemma3:27b > cekme.log 2>&1 < /dev/null & disown" 2>/dev/null
fi

# --- 7. Nöbetçi --------------------------------------------------------------
# Vekili ve tüneli de nöbetçi ayağa kaldırıyor; burada yalnız crontab kaydı.
yaz "== nöbetçi (5 dakikada bir)"
if uzak "crontab -l 2>/dev/null | grep -q nobetci.sh"; then
  yaz "   crontab'da var"
else
  uzak "(crontab -l 2>/dev/null; echo '*/5 * * * * \$HOME/$UZAK/nobetci.sh') | crontab -"
  yaz "   crontab'a eklendi"
fi
uzak "cd ~/$UZAK && ./nobetci.sh" >/dev/null 2>&1
yaz "   bir tur çalıştırıldı"

# --- 8. Sanal ortamlar (yalnız --tam) ---------------------------------------
if [ "$MOD" = "tam" ]; then
  yaz "== video ve ses ortamları (uzun sürer, arka planda)"
  for ad in video:venv tts:venv-tts; do
    dosya="${ad%%:*}"; dizin="${ad##*:}"
    scp -q "$KOK/danisman/sunucu/gereksinimler/$dosya.txt" "$SUNUCU:$UZAK/gereksinim-$dosya.txt"
    if uzak "[ -x ~/$UZAK/$dizin/bin/python ]"; then
      yaz "   $dizin zaten var"
    else
      # İKİSİ AYRI ORTAMDA OLMAK ZORUNDA: Chatterbox torch'u geriye alıyor ve
      # video üretimini bozuyor (7 Eyl 2026, onarımı iki tur sürdü).
      uzak "cd ~/$UZAK && setsid nohup bash -c 'python3 -m venv $dizin && $dizin/bin/pip install -q -r gereksinim-$dosya.txt' > kurulum-$dosya.log 2>&1 < /dev/null & disown" 2>/dev/null
      yaz "   $dizin kuruluyor — log: ~/$UZAK/kurulum-$dosya.log"
    fi
  done
  # TARİFLER OLMADAN ÜRETİM YOK: gonderi-yap.py adımları, altyazıları ve
  # görüntü istemlerini buradan okuyor. Depoda değiller (icerik/cikti
  # .gitignore'da), yani tek kopya Mac'te — 315 dosya, 1.2 MB.
  if [ -d "$KOK/icerik/cikti/tarifler" ]; then
    uzak "mkdir -p ~/$UZAK/icerik/cikti/tarifler ~/$UZAK/gonderiler ~/$UZAK/gecici"
    (cd "$KOK/icerik/cikti" && tar cf - tarifler) | uzak "tar xf - -C ~/$UZAK/icerik/cikti"
    yaz "   $(ls "$KOK/icerik/cikti/tarifler" | wc -l | tr -d ' ') tarif kopyalandı"
  else
    yaz "   UYARI: tarifler Mac'te de yok — video üretimi kurulamaz."
  fi
  yaz "   NOT: Wan 2.2 (~32 GB) ilk video-uret.py calistirmasinda HF-den iniyor."
fi

# --- 9. Tünel adresi ve Vercel ----------------------------------------------
yaz "== tünel adresi"
ADRES=""
for i in $(seq 1 10); do
  ADRES=$(uzak "grep -o 'https://[a-z0-9]\+-[a-z0-9-]\+\.trycloudflare\.com' ~/$UZAK/tunel.log 2>/dev/null | tail -1")
  [ -n "$ADRES" ] && break
  sleep 6
done
if [ -z "$ADRES" ]; then
  yaz "   adres okunamadı. Nöbetçi birkaç dakikaya açar; sonra Mac'te:"
  yaz "   bash danisman/sunucu/tunel-adres-guncelle.sh"
  exit 0
fi
yaz "   $ADRES"

cd "$KOK" || exit 1
VERCEL=/opt/homebrew/bin/vercel
if [ -x "$VERCEL" ]; then
  "$VERCEL" env rm MIZAC_OLLAMA production --yes >/dev/null 2>&1
  printf '%s' "$ADRES" | "$VERCEL" env add MIZAC_OLLAMA production >/dev/null 2>&1 \
    && yaz "   MIZAC_OLLAMA yazıldı"
  if [ "$YENI_ANAHTAR" = "1" ]; then
    # Anahtar ekrana basılmadan boru ile geçiyor.
    "$VERCEL" env rm MIZAC_OLLAMA_ANAHTAR production --yes >/dev/null 2>&1
    uzak "cat ~/$UZAK/.anahtar" | tr -d '\n' | "$VERCEL" env add MIZAC_OLLAMA_ANAHTAR production >/dev/null 2>&1 \
      && yaz "   MIZAC_OLLAMA_ANAHTAR yazıldı (ekrana basılmadı)"
  fi
  # NEXT_PUBLIC_* gibi değil ama yine de: env değişikliği dağıtım ister.
  "$VERCEL" --prod --yes >/dev/null 2>&1 && yaz "   site yeniden dağıtıldı"
  echo "$ADRES" > "$HOME/.mizac-son-tunel-adresi"
else
  yaz "   vercel bulunamadı; adresi elle yaz: $ADRES"
fi

# --- 10. Doğrulama -----------------------------------------------------------
yaz "== doğrulama"
yaz "   ollama : $(uzak "curl -s -o /dev/null -w %{http_code} -m 10 127.0.0.1:11434/api/tags")"
yaz "   vekil  : $(uzak "curl -s -o /dev/null -w %{http_code} -m 10 127.0.0.1:11500/api/tags")  (401 = ayakta, kimlik istiyor)"
yaz "   kitap  : $(uzak "A=\$(cat ~/$UZAK/.anahtar); curl -s -o /dev/null -w %{http_code} -m 20 -H \"Authorization: Bearer \$A\" 127.0.0.1:11500/kitap")"
yaz "   tünel  : $(curl -s -o /dev/null -w '%{http_code}' -m 20 "$ADRES/api/tags")  (401 beklenir)"
yaz ""
yaz "Model inmesi sürüyorsa danışman birkaç dakika sonra cevap verir:"
yaz "  curl -s -m 60 -X POST https://mizac.xyz/api/danisman -H 'Content-Type: application/json' \\"
yaz "    -d '{\"mesajlar\":[{\"rol\":\"kullanici\",\"metin\":\"Merhaba\"}],\"dil\":\"tr\"}'"
