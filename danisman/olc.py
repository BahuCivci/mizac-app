#!/usr/bin/env python3
"""
Mizaç okuma ölçümü — bir modeli sınav dosyasına karşı çalıştırır.

Sunucuda çalışır (yalnız standart kütüphane; Node/pip gerekmez):
    python3 olc.py --model qwen2.5vl:32b --sinav sinav-taban.jsonl --ctx 8192

Çıktı: doğruluk + karışıklık matrisi + her maddenin sonucu (JSON).
Yarıda kalırsa aynı komut kaldığı yerden devam eder (--devam).
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

TIPLER = ["safravi", "demevi", "balgami", "sevdavi"]

SISTEM = (
    "Sen tıbb-ı nebevî geleneğindeki dört mizaç sınıflandırmasında uzmansın.\n"
    "safravi: sıcak-kuru (safra/ateş) — hızlı, sabırsız, çabuk parlayıp çabuk sönen, "
    "az uyuyan, az terleyen, sıcaktan bunalan, atılgan, mükemmeliyetçi\n"
    "demevi: sıcak-ıslak (kan/hava) — sosyal, coşkulu, bol terleyen, iştahlı, "
    "çok uyku isteyen, dağınık, çabuk kaynaşan, paylaşan\n"
    "balgami: soğuk-ıslak (balgam/su) — sakin, ağır, geç kalkan, kilo alan, "
    "üşüyen, çatışmadan kaçan, rutine bağlı, yavaş ama kalıcı öğrenen\n"
    "sevdavi: soğuk-kuru (sevda/toprak) — düşünceli, kaygılı, aşırı analiz eden, "
    "kuru ciltli, unutmayan, yalnız çalışan, kanıt isteyen, geç affeden\n\n"
    "Sana bir kişinin kendi ifadesi verilecek. Bu ifade hangi mizacın göstergesidir?\n"
    "SADECE şu dört kelimeden birini yaz, başka hiçbir şey yazma: "
    "safravi, demevi, balgami, sevdavi"
)


def sor(url, model, ifade, ctx, zaman_asimi):
    govde = {
        "model": model,
        "stream": False,
        "keep_alive": "30m",
        "options": {"temperature": 0, "num_predict": 8, "num_ctx": ctx},
        "messages": [
            {"role": "system", "content": SISTEM},
            {"role": "user", "content": ifade},
        ],
    }
    istek = urllib.request.Request(
        url + "/api/chat",
        data=json.dumps(govde).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(istek, timeout=zaman_asimi) as cevap:
        d = json.loads(cevap.read().decode("utf-8"))
    if "error" in d:
        raise RuntimeError(d["error"])
    return d["message"]["content"], d


def cozumle(metin):
    """Modelin serbest cevabından mizaç adını çıkarır."""
    k = metin.lower().replace("î", "i").replace("â", "a").replace("İ", "i")
    for t in TIPLER:
        if t in k:
            return t
    # 'safravî', 'demevî' gibi ekli/bozuk yazımlar için kök eşleme
    for t, kok in (("safravi", "safra"), ("demevi", "demev"),
                   ("balgami", "balgam"), ("sevdavi", "sevda")):
        if kok in k:
            return t
    return None


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--model", required=True)
    p.add_argument("--sinav", required=True)
    p.add_argument("--ctx", type=int, default=8192)
    p.add_argument("--url", default="http://localhost:11434")
    p.add_argument("--zaman-asimi", type=int, default=900)
    p.add_argument("--sinir", type=int, default=0, help="ilk N madde (0=hepsi)")
    p.add_argument("--cikti", default="")
    p.add_argument("--devam", action="store_true")
    a = p.parse_args()

    maddeler = [json.loads(s) for s in open(a.sinav, encoding="utf-8") if s.strip()]
    if a.sinir:
        maddeler = maddeler[: a.sinir]

    cikti = a.cikti or "sonuc-%s-%s.json" % (
        a.model.replace(":", "_").replace("/", "_"),
        os.path.basename(a.sinav).replace(".jsonl", ""),
    )

    sonuclar = []
    if a.devam and os.path.exists(cikti):
        sonuclar = json.load(open(cikti, encoding="utf-8"))["sonuclar"]
        print("devam: %d madde zaten yapilmis" % len(sonuclar), flush=True)

    baslangic = time.time()
    for i, m in enumerate(maddeler):
        if i < len(sonuclar):
            continue
        ifade = m["ifade"]
        # Taban sınavında soru bağlamı da verilir; gerçekçi sınavda bağlam yok.
        if m.get("baglam"):
            ifade = "Soru: %s\nKişinin cevabı: %s" % (m["baglam"], ifade)

        ham, meta = None, {}
        hata = None
        for deneme in range(3):
            try:
                ham, meta = sor(a.url, a.model, ifade, a.ctx, a.zaman_asimi)
                break
            except (urllib.error.URLError, RuntimeError, OSError) as e:
                hata = str(e)
                time.sleep(5 * (deneme + 1))

        tahmin = cozumle(ham) if ham is not None else None
        sonuclar.append({
            "id": m.get("id", m.get("soru_id")),
            "dogru": m["dogru"],
            "tahmin": tahmin,
            "ham": (ham or "")[:80],
            "hata": hata if ham is None else None,
        })

        if (i + 1) % 10 == 0 or i + 1 == len(maddeler):
            d = sum(1 for s in sonuclar if s["tahmin"] == s["dogru"])
            gecen = time.time() - baslangic
            print("%3d/%d  dogru=%d (%.1f%%)  %.1f sn/madde"
                  % (i + 1, len(maddeler), d, 100.0 * d / len(sonuclar),
                     gecen / (i + 1)),
                  flush=True)
            json.dump({"model": a.model, "sinav": a.sinav, "ctx": a.ctx,
                       "sonuclar": sonuclar}, open(cikti, "w", encoding="utf-8"),
                      ensure_ascii=False)

    # Karışıklık matrisi: satır = gerçek, sütun = tahmin
    matris = {g: {t: 0 for t in TIPLER + ["?"]} for g in TIPLER}
    for s in sonuclar:
        matris[s["dogru"]][s["tahmin"] if s["tahmin"] in TIPLER else "?"] += 1

    dogru = sum(1 for s in sonuclar if s["tahmin"] == s["dogru"])
    ozet = {
        "model": a.model, "sinav": a.sinav, "ctx": a.ctx,
        "madde": len(sonuclar), "dogru": dogru,
        "dogruluk": round(100.0 * dogru / max(len(sonuclar), 1), 1),
        "cevapsiz": sum(1 for s in sonuclar if s["tahmin"] is None),
        "sure_sn": round(time.time() - baslangic, 1),
        "matris": matris,
    }
    json.dump({**ozet, "sonuclar": sonuclar}, open(cikti, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)

    print("\n=== %s / %s ===" % (a.model, os.path.basename(a.sinav)))
    print("dogruluk: %.1f%% (%d/%d), cevapsiz: %d, sure: %.0f sn"
          % (ozet["dogruluk"], dogru, len(sonuclar), ozet["cevapsiz"], ozet["sure_sn"]))
    print("\ngercek \\ tahmin   " + "".join("%9s" % t[:8] for t in TIPLER + ["?"]))
    for g in TIPLER:
        print("%-18s" % g + "".join("%9d" % matris[g][t] for t in TIPLER + ["?"]))
    print("\nayrinti: " + cikti)


if __name__ == "__main__":
    sys.exit(main())
