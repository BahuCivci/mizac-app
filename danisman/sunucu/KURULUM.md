# Danışmanı canlıya almak — üniversite sunucusu

**Durum: kurulu ve çalışıyor** (23 Ağu 2026). mizac.xyz/danisman canlı.
Ölçülen gecikme: soğuk açılış 16 sn, sıcak istek 5,5 sn / 120 jeton.

Aşağısı hem nasıl kurulduğunu hem de bozulduğunda nasıl onarılacağını anlatıyor.

## En kırılgan yer — önce bunu bil

Tünel `trycloudflare.com` üzerinde **geçici** bir adres kullanıyor. Tünel
süreci ölürse ya da sunucu yeniden başlarsa **adres değişir** ve mizac.xyz
sessizce çalışmaz hâle gelir — hata sayfası çıkmaz, danışman cevap vermez.

Süreçler `nohup` ile başlatıldı; `sudo` olmadığı için systemd servisi
yazılamıyor. Yani sunucu yeniden başlarsa ikisi de gider.

Kalıcı çözüm: Cloudflare hesabıyla **adlandırılmış tünel**. O zaman adres
sabitlenir (`danisman.mizac.xyz` gibi) ve yeniden başlatma adresi bozmaz.

## Sağlık kontrolü

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://mizac.xyz/danisman   # 200 olmalı

curl -s -m 60 -X POST https://mizac.xyz/api/danisman \
  -H 'Content-Type: application/json' \
  -d '{"mesajlar":[{"rol":"kullanici","metin":"Yazlari zor gecirivorum."}],"dil":"tr"}'
```

İkincisi boş dönüyorsa tünel kopmuştur: sunucuya girip 3. adımı tekrarla ve
yeni adresi `vercel env` ile güncelle.

## Neden tünel

`192.168.1.40` özel bir adres; yalnız üniversitenin ağı içinde var. Vercel de
ziyaretçiler de dışarıda. VPN **senin** erişimin için — istek senin Mac'inden
gelmediği sürece işe yaramıyor.

Çözüm, sunucunun **kendisinin dışarı doğru** bir bağlantı kurması. Cloudflare
Tunnel bunu yapıyor: içeri giren bağlantı yok, o yüzden BT'nin güvenlik
duvarında port açması gerekmiyor.

```
ziyaretçi → mizac.xyz (Vercel) → tünel adresi → vekil.py → Ollama
                                                  ↑
                                          anahtar burada doğrulanıyor
```

## Ollama'ya doğrudan bağlanma

Ollama'da kimlik doğrulama **yok**. Tünel 11434'e bağlanırsa adresi bulan
herkes GPU'da model çalıştırabilir, `/api/delete` ile 181 GB'lık modelleri
silebilir, `/api/pull` ile diski doldurabilir.

Tünel `vekil.py`'ye bağlanır. Ollama 127.0.0.1'de kalır.

---

## 1. Anahtarı üret (kendi bilgisayarında)

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Bu anahtar iki yere girecek: sunucuda `vekil.py`'ye, Vercel'de uygulamaya.
Başka hiçbir yere yazma.

## 2. Sunucuda vekili başlat

```bash
scp danisman/sunucu/vekil.py kun@192.168.1.40:~/mizac-lab/
ssh kun@192.168.1.40

cd ~/mizac-lab
export MIZAC_VEKIL_ANAHTAR='<üretilen anahtar>'
nohup python3 vekil.py --port 11500 > vekil.log 2>&1 &
```

Doğrula:

```bash
curl -s -o /dev/null -w '%{http_code}\n' localhost:11500/api/tags               # 401
curl -s -H "Authorization: Bearer $MIZAC_VEKIL_ANAHTAR" localhost:11500/api/tags # model listesi
```

## 3. Tüneli aç

`sudo` yok, o yüzden ikili dosya kullanıcı alanına iniyor:

```bash
mkdir -p ~/bin
curl -L -o ~/bin/cloudflared \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x ~/bin/cloudflared

nohup ~/bin/cloudflared tunnel --url http://127.0.0.1:11500 > tunel.log 2>&1 &
sleep 10
grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' tunel.log | head -1
```

Çıkan adres tünelin herkese açık kapısı.

**Bu hızlı tünel kalıcı değil:** her yeniden başlatmada adres değişiyor ve
Cloudflare hız sınırı uyguluyor. Deneme için yeterli. Kalıcı hâle getirmek
için Cloudflare hesabı açıp adlandırılmış tünel kurulmalı — o zaman adres
sabitlenir (`danisman.mizac.xyz` gibi).

## 4. Vercel'e anahtarları gir

```bash
vercel env add MIZAC_OLLAMA production          # tünel adresi
vercel env add MIZAC_OLLAMA_ANAHTAR production  # 1. adımdaki anahtar
vercel env add NEXT_PUBLIC_MIZAC_DANISMAN production   # değer: acik
vercel --prod
```

`NEXT_PUBLIC_MIZAC_DANISMAN` verilene kadar danışman kapalı kalır: sayfa,
footer linki, ana sayfa kartı ve API rotası hepsi bu bayrağa bağlı. Önce
tünelin çalıştığını doğrula, bayrağı **en son** aç.

---

## Bilinmesi gerekenler

**Soğuk açılış.** Ollama modeli boşta kalınca bellekten atıyor; `model.ts`
`keep_alive: 30m` gönderiyor, yani 30 dakika sessizlikten sonra ilk ziyaretçi
yüklemeyi bekler. gemma3:27b için bu dakikalar sürebilir. Alternatifi modeli
sürekli bellekte tutmak ama o da GPU'yu kalıcı işgal eder — makine paylaşımlı,
GPU 0-1'de `ahmet_ozcan` çalışıyordu.

**Süreçler oturuma bağlı.** `sudo` olmadığı için systemd servisi yazılamıyor.
`nohup` ile başlatılan süreçler sunucu yeniden başlayınca ölür ve siten
sessizce çalışmaz hâle gelir. Yeniden başlatmadan sonra 2. ve 3. adımlar
tekrarlanmalı. Bunu fark etmenin tek yolu düzenli kontrol:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST \
  -H "Authorization: Bearer $ANAHTAR" \
  <tünel-adresi>/api/tags
```

**Anahtar sızarsa** kaybın GPU zamanı olur; modeller ve disk vekilin yol
listesiyle korunuyor. Yine de sızarsa yeni anahtar üretip 2. ve 4. adımları
tekrarla.

**Bu kurulum üniversitenin kaynağına bağlı.** Oradan ayrıldığında ya da BT
politikası değiştiğinde danışman durur. Kalıcı ürün için `MIZAC_SAGLAYICI=claude`
ile Claude API'ye geçiş yolu `model.ts` içinde hazır duruyor.
