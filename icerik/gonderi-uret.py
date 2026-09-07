#!/usr/bin/env python3
"""
Kitap pasajlarından gönderi tarifi üretir: anlatım + görsel istemleri.

    python3 icerik/gonderi-uret.py --kac 10          # ilk 10 pasaj
    python3 icerik/gonderi-uret.py --kac 10 --bas 50 # 50'den başla

NE ÜRETİYOR
Her pasaj için beş adımlık bir tarif: her adımda bir anlatım cümlesi
(seslendirilecek), bir altyazı (ekranda yazacak) ve bir görsel istemi
(videoyu üretecek). Çıktı `icerik/cikti/tarifler/<no>.json`.

TELİF — kullanıcının kararı (7 Eyl 2026)
Kitabın cümleleri OLDUĞU GİBİ OKUNMUYOR. Model pasajdaki bilgiyi alıp
kendi cümleleriyle anlatıyor; ekranda kaynak belirtiliyor. İzin olduğu
söylendi ama güvenli yol bu seçildi, ve OCR gürültüsü de böyle temizleniyor.

GÖRSEL İSTEMLERİNDE ÖĞRENİLENLER — 6-7 Eylül, hepsi ölçülerek
- "cinematic", "dim", "warm" YAZMA: model koyu kahverengi kareler veriyor
  ve sonuç tam da kaçtığımız yazı-kartı paletine dönüyor.
- Hareketi AÇIKÇA iste, yoksa plan neredeyse donuk çıkıyor.
- Kişilerin görünümünü belirt, yoksa Doğu Asyalı kişiler geliyor; Türkçe
  bir mizaç hesabında uyumsuz duruyor.
- Ekranda yazı isteme: altyazıyı biz basıyoruz, model yazıyı bozuk basıyor.

MODEL SUNUCUDA
`ssh -f -N -L 11435:127.0.0.1:11434 mta_kullanici@192.168.1.40` tüneli
gerekiyor; nöbetçi kurulu (`danisman/sunucu/xyz.mizac.tunel.plist`).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
PASAJLAR = KOK / "icerik" / "cikti" / "pasajlar.json"
TARIFLER = KOK / "icerik" / "cikti" / "tarifler"
OLLAMA = "http://127.0.0.1:11435/api/generate"
MODEL = "gemma3:27b"

YONERGE = """Sen "Varlığın Tahlili" adlı mizaç kitabından kısa video gönderileri
hazırlayan bir editörsün. Sana kitabın bir pasajı verilecek.

GÖREV: pasajı 5 adımlık bir video tarifine çevir.

ANLATIM KURALLARI
- Pasajdaki bilgiyi KENDİ CÜMLELERİNLE anlat. Kitabın cümlelerini kopyalama.
- Pasajda GEÇMEYEN hiçbir şey ekleme. Bilmiyorsan yazma.
- Pasajdaki en somut, en görüntülü ayrıntıyı MUTLAKA kullan. Genel ifade
  değil, okuyucunun sınayabileceği bir detay değerlidir.
- 1. adım KANCADIR ve en zor kısım budur. Kurallar:
  * "Mizaç" kelimesiyle BAŞLAMA. Tanım cümlesi kurma.
  * Soyut giriş yapma ("kişiliğimizin temelini oluşturur" gibi) — YASAK.
  * Pasajdaki EN SOMUT gözlemi al ve okuyucunun kendi hayatından
    tanıyacağı bir cümleye çevir. İkinci kişiye seslen.
  * En fazla 14 kelime.
  * Kanca YALNIZ BU PASAJDAN çıkmalı. Pasajda bebeklerden söz edilmiyorsa
    bebekten bahsetme; yemekten söz ediliyorsa yemekten bahset.
  KÖTÜ (tanım cümlesi): "Mizaç, kişiliğimizin temelini oluşturur."
  KÖTÜ (pasajla ilgisiz): pasaj felsefe tarihinden söz ederken
    "Bebeğin taklit etme hızına şaşırdın mı?" demek.

  * Biçim serbest: soru sorabilirsin, bir gözlem aktarabilirsin ya da
    doğrudan seslenebilirsin. Ama CÜMLENİN İÇERİĞİ tamamen bu pasajdan
    gelecek. Bu yönergede geçen hiçbir örnek ifadeyi kullanma.
- 5. adım KAPANIŞ ve tek bir yere çağırır: **mizac.xyz**.
  * Alan adını AYNEN "mizac.xyz" yaz. Başka alan adı UYDURMA.
  * Kitabı, yazarı ya da kitabın satın alınmasını TANITMA. Kitap kaynaktır,
    ürün değil. (Ölçüldü: 214 tarifin 186'sında kapanış kitabı tanıtıyordu,
    biri "varligintahlili.com" diye olmayan bir adres uydurmuştu.)
  * Her seferinde farklı cümle kur.
- Toplam 5 cümle, her biri 12-25 kelime. Tıbbi teşhis ya da tedavi vaadi kurma.

GÖRSEL İSTEMİ KURALLARI (İngilizce yaz)
- Parlak gündüz ışığı, yüksek kontrast, canlı renk. "cinematic", "dim",
  "warm", "moody" KELİMELERİNİ KULLANMA.
- Hareketi açıkça tarif et: "she leans forward", "he turns his head",
  "handheld camera", "visible movement".
- İnsan varsa: "Turkish", "Mediterranean features" yaz.
- Görüntüde YAZI OLMASIN: "no text, no letters, no captions".
- Dikey çekim düşün.

ÇIKTI: yalnız JSON, başka hiçbir şey yazma. Biçim:
{"adimlar":[{"anlatim":"...","altyazi":"...","istem":"..."}, ... 5 tane]}
altyazi anlatımın kısaltılmış hali olsun, en fazla 8 kelime, gerekirse
tek \\n ile iki satır."""


def sor(pasaj: str, model: str = MODEL, uc: str = OLLAMA,
        zaman_asimi: int = 900) -> dict:
    istek = urllib.request.Request(
        uc,
        data=json.dumps({
            "model": model,
            "prompt": f"{YONERGE}\n\nPASAJ:\n{pasaj}",
            "stream": False,
            "format": "json",          # modelin JSON dışına çıkmasını engeller
            "options": {"num_ctx": 8192, "temperature": 0.7},
        }).encode(),
        headers={"Content-Type": "application/json"})
    # BAĞLANTI KOPARSA BEKLE VE YENİDEN DENE, çıkma.
    # VPN ve SSH tüneli gün içinde birkaç kez düşüyor; nöbetçiler onları
    # geri getiriyor ama saniyeler sürüyor. Betik ilk hatada çıkınca
    # 7 Eylül'de üretim üç kez yarıda kaldı (en son 155/315'te).
    son = None
    for deneme in range(6):
        try:
            with urllib.request.urlopen(istek, timeout=zaman_asimi) as c:
                ham = json.load(c)["response"]
            break
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            son = e
            time.sleep(min(30 * (deneme + 1), 120))
    else:
        raise SystemExit(
            f"modele 6 denemede ulaşılamadı ({son}). Tünel açık mı?\n"
            "  launchctl list | grep mizac.tunel")

    try:
        return json.loads(ham)
    except json.JSONDecodeError:
        # format=json'a rağmen bazen etrafına metin sarıyor
        m = re.search(r"\{.*\}", ham, re.S)
        if not m:
            raise
        return json.loads(m.group(0))


def gecerli(tarif: dict) -> str:
    """Tarif kullanılabilir mi; değilse sebebini döndürür."""
    a = tarif.get("adimlar")
    if not isinstance(a, list) or len(a) != 5:
        return f"5 adım bekleniyordu, {len(a) if isinstance(a, list) else 0} geldi"
    for i, x in enumerate(a, 1):
        for alan in ("anlatim", "altyazi", "istem"):
            if not isinstance(x.get(alan), str) or not x[alan].strip():
                return f"{i}. adımda '{alan}' eksik"
        # Görsel isteminde yasak kelimeler — ölçülerek eklendi
        for yasak in ("cinematic", "dim ", "moody"):
            if yasak in x["istem"].lower():
                return f"{i}. adımın isteminde '{yasak.strip()}' geçiyor"

    # KALIP KİLİDİ. Bu model yönergedeki somut örnekleri şablon olarak
    # kopyalıyor: 311 kancanın 201'i iki örneğimin tekrarıydı ("aynanın
    # karşısına geçip" 156 kez, "sabah kalkar kalkmaz" 45 kez). Örnekler
    # yönergeden çıkarıldı, ama bir daha sızarsa burada yakalansın.
    kapanis = a[4]["anlatim"].lower()
    if "mizac.xyz" not in kapanis.replace(" ", ""):
        return "kapanışta mizac.xyz geçmiyor"
    if re.search(r"varl[iı][gğ][iı]ntahlili\.|\.com\b", kapanis):
        return "kapanışta uydurma alan adı var"

    kanca = a[0]["anlatim"].lower()
    for kalip in ("aynanın karşısına", "sabah kalkar kalkmaz"):
        if kalip in kanca:
            return f"kanca ezberlenmiş kalıbı tekrarlıyor: '{kalip}'"
    return ""


def main() -> int:
    a = argparse.ArgumentParser(prog="gonderi-uret")
    a.add_argument("--kac", type=int, default=10)
    a.add_argument("--bas", type=int, default=0)
    a.add_argument("--model", default=MODEL)
    k = a.parse_args()

    if not PASAJLAR.exists():
        print(f"pasajlar yok: {PASAJLAR}\n  python3 icerik/kitap-bol.py --yaz",
              file=sys.stderr)
        return 1

    pasajlar = json.loads(PASAJLAR.read_text(encoding="utf-8"))
    TARIFLER.mkdir(parents=True, exist_ok=True)
    basarili = atlanan = 0

    for no in range(k.bas, min(k.bas + k.kac, len(pasajlar))):
        p = pasajlar[no]
        hedef = TARIFLER / f"{no:04d}.json"
        if hedef.exists():
            print(f"  {no:04d} atlandı (var)")
            continue
        try:
            tarif = sor(p["metin"], k.model)
        except Exception as e:
            print(f"  {no:04d} HATA: {type(e).__name__}: {e}")
            atlanan += 1
            continue

        sorun = gecerli(tarif)
        if sorun:
            print(f"  {no:04d} REDDEDİLDİ: {sorun}")
            atlanan += 1
            continue

        tarif.update({"pasaj_no": no, "sayfa": p["sayfa"], "bolum": p["bolum"],
                      "kaynak": "Varlığın Tahlili — Zeynep Işık Büyükbay"})
        hedef.write_text(json.dumps(tarif, ensure_ascii=False, indent=1),
                         encoding="utf-8")
        basarili += 1
        print(f"  {no:04d} ✓ {tarif['adimlar'][0]['anlatim'][:60]}")

    print(f"\n{basarili} tarif yazıldı, {atlanan} atlandı → {TARIFLER}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
