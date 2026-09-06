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

---

## VPN nöbetçisi — kopmayı kendiliğinden onarsın

**Sorun:** üniversite ağına FortiClient SSL-VPN ile giriliyor ve bağlantı sık
kopuyor. Koptuğunda 192.168.1.40 erişilemiyor; elle bağlanmak her seferinde
uygulamayı açıp şifre girmek demek.

**Çözüm:** `openfortivpn` bir LaunchDaemon olarak root'ta çalışır, `KeepAlive`
ile launchd her koptuğunda yeniden bağlar. Sunucudaki `nobetci.sh`'ın Mac
karşılığı. Plist: `danisman/sunucu/xyz.mizac.vpn.plist`.

**Şifre sohbete GİRMEZ.** Ayar dosyasını sen oluşturuyorsun, root'a ait ve
yalnız root okuyabiliyor (mod 600).

### 1. Aracı kur

    brew install openfortivpn      # 6 Eyl 2026'da kuruldu, 1.24.1

### 2. Ayar dosyası — bunu SEN yazıyorsun

    sudo mkdir -p /etc/openfortivpn
    sudo nano /etc/openfortivpn/config

İçerik (kendi bilgilerinle):

    host = vpn.<üniversite adresi>
    port = 443
    username = <kullanıcı adın>
    password = <şifren>

Sonra izinleri kilitle:

    sudo chown root:wheel /etc/openfortivpn/config
    sudo chmod 600 /etc/openfortivpn/config

### 3. Elle bir kez dene

    sudo /opt/homebrew/bin/openfortivpn -c /etc/openfortivpn/config

Sertifikadan şikâyet ederse ekrana bir parmak izi yazıyor; onu ayar dosyasına
`trusted-cert = <parmak izi>` satırı olarak ekle ve tekrar dene.
Bağlanınca başka bir terminalde doğrula:

    nc -z -G 5 192.168.1.40 22 && echo "sunucuya ulaşılıyor"

Sonra Ctrl-C ile kes; kalıcısını launchd çalıştıracak.

### 4. Nöbetçiyi kur

    sudo cp danisman/sunucu/xyz.mizac.vpn.plist /Library/LaunchDaemons/
    sudo chown root:wheel /Library/LaunchDaemons/xyz.mizac.vpn.plist
    sudo chmod 644 /Library/LaunchDaemons/xyz.mizac.vpn.plist
    sudo launchctl bootstrap system /Library/LaunchDaemons/xyz.mizac.vpn.plist

Durum ve log:

    sudo launchctl print system/xyz.mizac.vpn | head -20
    tail -f /var/log/mizac-vpn.log

Durdurmak:

    sudo launchctl bootout system/xyz.mizac.vpn

### Bilinmesi gerekenler

- **FortiClient uygulamasıyla aynı anda çalıştırma.** İkisi de tun arayüzü
  açıyor; çakışırlar. Nöbetçi kurulduktan sonra uygulamayı açma.
- **Tüm trafik üniversiteden geçebilir.** Kurum "full tunnel" dayatıyorsa
  VPN açıkken bütün internet trafiğin oradan akar — sürekli açık bir VPN'de
  bunu bilerek kabul ediyorsun. Yalnız 192.168.1.40'a giden trafiği
  yönlendirmek istersen `openfortivpn --half-internet-routes` seçeneğine bak.
- **Yanlış şifreyle döngüye girmesin.** `ThrottleInterval 60` bu yüzden var:
  launchd saniyede bir denerse üniversitenin kapısını döver ve hesabı
  kilitletebilir. Şifre değişirse önce nöbetçiyi durdur, sonra ayar dosyasını
  güncelle.
- **Şifre diskte düz metin.** `/etc/openfortivpn/config` root'a ait ve 600;
  ama Mac'in tam disk yedeği alınıyorsa o yedekte de düz metin durur.
