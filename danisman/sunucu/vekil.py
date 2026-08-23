#!/usr/bin/env python3
"""
Ollama'nın önüne konan kimlik doğrulamalı kapı.

    MIZAC_VEKIL_ANAHTAR=... python3 vekil.py            # 127.0.0.1:11500
    MIZAC_VEKIL_ANAHTAR=... python3 vekil.py --port 11500

NEDEN VAR
Ollama'da kimlik doğrulama yok. Tünel doğrudan 11434'e bağlanırsa adresi bulan
herkes üniversitenin GPU'sunda model çalıştırabilir; `/api/delete` ile modelleri
silebilir, `/api/pull` ile 500 GB'lık diski doldurabilir. Açık bir çıkarım
uç noktası internette birkaç gün içinde taranıp bulunuyor.

Bu vekil iki şey yapıyor ve başka hiçbir şey yapmıyor:
  1. `Authorization: Bearer <anahtar>` yoksa 401 döner
  2. Yalnız izin verilen yolları geçirir — model indirme/silme hiç ulaşmaz

Tünel buna bağlanır, Ollama'ya değil. Ollama 127.0.0.1'de kalır.

BU BİR GÜVENLİK SINIRI, KOLAYLIK DEĞİL.
Anahtar sızarsa saldırganın kazandığı şey GPU zamanı; modeller ve disk yine
korunur çünkü o yollar burada kapalı. Kaybı sınırlamak bilinçli.
"""
import argparse
import http.server
import json
import os
import secrets
import sys
import threading
import urllib.error
import urllib.request

# Arka uçlar virgülle ayrılır. Her biri kendi GPU'sunda ayrı bir Ollama örneği:
#   MIZAC_OLLAMA_ARKA=http://127.0.0.1:11434,http://127.0.0.1:11435
# Tek adres verilirse dağıtım devre dışı kalır, davranış eskisiyle aynıdır.
ARKA_UCLAR = [
    a.strip()
    for a in os.environ.get("MIZAC_OLLAMA_ARKA", "http://127.0.0.1:11434").split(",")
    if a.strip()
]

# Yalnız bunlar geçer. Liste bilerek kısa: danışmanın ihtiyacı bu kadar.
# /api/pull, /api/delete, /api/create, /api/push kasıtlı olarak yok.
IZINLI = {
    ("POST", "/api/chat"),
    ("POST", "/api/generate"),
    ("GET", "/api/tags"),   # sağlık kontrolü
    ("GET", "/api/ps"),     # modelin bellekte olup olmadığı
}

# İstek gövdesi üst sınırı. Ollama'ya devasa bir bağlam gönderip belleği
# şişirmeyi engelliyor; danışmanın en uzun istemi bunun çok altında.
EN_FAZLA_GOVDE = 512 * 1024


class Dagitici:
    """
    İsteği en az meşgul arka uca yollar.

    Sıralı dağıtım (round-robin) burada yanlış olurdu: LLM istekleri çok farklı
    sürüyor (kısa yansıtma ~2 sn, uzun özet ~10 sn), sırayla dağıtınca uzun bir
    isteğin arkasına kısa istekler diziliyor ve boştaki GPU'lar beklerken
    kullanıcı bekliyor. Anlık yük sayısına bakmak bunu çözüyor.
    """

    def __init__(self, adresler: list[str]):
        self.adresler = adresler
        self.yuk = {a: 0 for a in adresler}
        self.kilit = threading.Lock()

    def sec(self) -> str:
        with self.kilit:
            adres = min(self.adresler, key=lambda a: self.yuk[a])
            self.yuk[adres] += 1
            return adres

    def birak(self, adres: str) -> None:
        with self.kilit:
            self.yuk[adres] -= 1

    def durum(self) -> dict[str, int]:
        with self.kilit:
            return dict(self.yuk)


class Kapi(http.server.BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    anahtar = ""
    dagitici: "Dagitici"

    def log_message(self, bicim, *arg):
        # Varsayılan kayıt her isteği stderr'e döküyor; anahtar başlığı da
        # kazara oraya düşmesin diye yalnız yol ve sonuç yazılıyor.
        sys.stderr.write(f"{self.command} {self.path} {arg[1] if len(arg) > 1 else ''}\n")

    def yaz(self, kod: int, govde: bytes, tur: str = "application/json"):
        self.send_response(kod)
        self.send_header("Content-Type", tur)
        self.send_header("Content-Length", str(len(govde)))
        self.end_headers()
        self.wfile.write(govde)

    def yetkili_mi(self) -> bool:
        basli = self.headers.get("Authorization", "")
        if not basli.startswith("Bearer "):
            return False
        # Sabit süreli karşılaştırma: anahtarı karakter karakter tahmin etmeyi
        # ölçülebilir kılan zamanlama farkını kapatıyor.
        return secrets.compare_digest(basli[7:], self.anahtar)

    def gecir(self, yontem: str):
        if (yontem, self.path.split("?")[0]) not in IZINLI:
            self.yaz(404, b'{"error":"yol kapali"}')
            return
        if not self.yetkili_mi():
            self.yaz(401, b'{"error":"yetkisiz"}')
            return

        uzunluk = int(self.headers.get("Content-Length") or 0)
        if uzunluk > EN_FAZLA_GOVDE:
            self.yaz(413, b'{"error":"govde cok buyuk"}')
            return
        govde = self.rfile.read(uzunluk) if uzunluk else None

        arka = self.dagitici.sec()
        istek = urllib.request.Request(
            arka + self.path,
            data=govde,
            method=yontem,
            headers={"Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(istek, timeout=600) as cevap:
                self.send_response(cevap.status)
                self.send_header("Content-Type", cevap.headers.get("Content-Type", "application/json"))
                # Uzunluk bilinmiyor: Ollama NDJSON akıtıyor, parça parça
                # geçirilmeli yoksa ilk jeton bütün cevap bitene kadar beklenir.
                self.send_header("Transfer-Encoding", "chunked")
                self.end_headers()
                # read() değil read1(): read(8192) tampon dolana kadar BLOKLUYOR.
                # Ollama jetonları ~100 baytlık satırlar hâlinde gönderdiği için
                # bu, ilk jetonu ~80 jeton birikene kadar geciktiriyordu —
                # ölçüldü: ilk jeton 4,56 sn. read1 eldeki veriyi hemen verir.
                while parca := cevap.read1(65536):
                    self.wfile.write(f"{len(parca):X}\r\n".encode())
                    self.wfile.write(parca)
                    self.wfile.write(b"\r\n")
                    self.wfile.flush()
                self.wfile.write(b"0\r\n\r\n")
        except urllib.error.HTTPError as e:
            self.yaz(e.code, e.read()[:2000])
        except Exception as e:  # noqa: BLE001 - tek istek hatası vekili düşürmemeli
            self.yaz(502, json.dumps({"error": str(e)[:200]}).encode())
        finally:
            # Sayacı her hâlükârda düşür: hata yolunda unutulursa o arka uç
            # kalıcı olarak "meşgul" görünür ve bir daha hiç seçilmez.
            self.dagitici.birak(arka)

    def do_POST(self):
        self.gecir("POST")

    def do_GET(self):
        self.gecir("GET")


def main() -> int:
    a = argparse.ArgumentParser()
    a.add_argument("--port", type=int, default=11500)
    ayar = a.parse_args()

    anahtar = os.environ.get("MIZAC_VEKIL_ANAHTAR", "")
    if len(anahtar) < 32:
        print(
            "MIZAC_VEKIL_ANAHTAR en az 32 karakter olmalı.\n"
            "Üret: python3 -c \"import secrets; print(secrets.token_urlsafe(32))\"",
            file=sys.stderr,
        )
        return 1

    Kapi.anahtar = anahtar
    Kapi.dagitici = Dagitici(ARKA_UCLAR)
    sunucu = http.server.ThreadingHTTPServer(("127.0.0.1", ayar.port), Kapi)
    print(f"vekil 127.0.0.1:{ayar.port} → {len(ARKA_UCLAR)} arka uç", flush=True)
    for a in ARKA_UCLAR:
        print(f"  {a}", flush=True)
    print(f"izinli yollar: {sorted(y for _, y in IZINLI)}", flush=True)
    try:
        sunucu.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
