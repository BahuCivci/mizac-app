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

TANIM = {
    "safravi": "sıcak-kuru (safra/ateş) — hızlı, sabırsız, çabuk parlayıp çabuk "
               "sönen, az uyuyan, az terleyen, sıcaktan bunalan, atılgan, "
               "mükemmeliyetçi",
    "demevi": "sıcak-ıslak (kan/hava) — sosyal, coşkulu, bol terleyen, iştahlı, "
              "çok uyku isteyen, dağınık, çabuk kaynaşan, paylaşan",
    "balgami": "soğuk-ıslak (balgam/su) — sakin, ağır, geç kalkan, kilo alan, "
               "üşüyen, çatışmadan kaçan, rutine bağlı, yavaş ama kalıcı öğrenen",
    "sevdavi": "soğuk-kuru (sevda/toprak) — düşünceli, kaygılı, aşırı analiz eden, "
               "kuru ciltli, unutmayan, yalnız çalışan, kanıt isteyen, geç affeden",
}


def sistem_promptu(sira):
    """Mizaçların sunuş sırası ölçümün kendisini etkiliyor mu — `--sira` bunu sınar.

    Küçük modeller listenin sonundaki seçeneğe kayabiliyor. Sırayı değiştirip
    aynı sınavı koşmak, yanlılığın modelde mi promptta mı olduğunu ayırır.
    """
    return (
        "Sen tıbb-ı nebevî geleneğindeki dört mizaç sınıflandırmasında uzmansın.\n"
        + "".join("%s: %s\n" % (t, TANIM[t]) for t in sira)
        + "\nSana bir kişinin kendi ifadesi verilecek. Bu ifade hangi mizacın "
          "göstergesidir?\n"
          "SADECE şu dört kelimeden birini yaz, başka hiçbir şey yazma: "
        + ", ".join(sira)
    )


# Ölçümde görüldü: model sıcak/soğuk eksenini büyük ölçüde doğru okuyor,
# ıslak/kuru eksenini kaçırıyor (72B'nin 11 gerçekçi hatasının 7'si kendi
# sıcaklık grubu içinde, yanlış nem). Dört mizaç zaten iki nitelikten türediği
# için tek dörtlü seçim yerine iki ikili seçim sormak, doğru bilinen ekseni
# korur. EKSEN_SISTEM bunu sınar.
EKSEN = {
    ("sicak", "kuru"): "safravi",
    ("sicak", "islak"): "demevi",
    ("soguk", "islak"): "balgami",
    ("soguk", "kuru"): "sevdavi",
}

EKSEN_SISTEM = (
    "Sen tıbb-ı nebevî geleneğindeki mizaç niteliklerinde uzmansın. Her insanın "
    "mizacı iki nitelikten oluşur: ısı (sıcak/soğuk) ve nem (ıslak/kuru).\n\n"
    "ISI ekseni:\n"
    "  sıcak — çabuk ısınır, sıcaktan bunalır, hızlı tepki verir, enerjik, "
    "atılgan, yüzü kızarır, az uyur ya da uykusu hafiftir\n"
    "  soğuk — sürekli üşür, eli ayağı soğuktur, yavaş ve ağır hareket eder, "
    "geç tepki verir, kışın zorlanır\n\n"
    "NEM ekseni:\n"
    "  ıslak — bol terler, cildi nemli ve yumuşaktır, bedeni dolgundur, çok uyur, "
    "duyguları akıcıdır (kolay ağlar, kolay kaynaşır), balgam/kan fazlalığı\n"
    "  kuru — az terler ya da hiç terlemez, cildi kurudur ve çatlar, bedeni "
    "ince/kemiklidir, uykusu azdır ya da bölünür, katıdır, unutmaz\n\n"
    "Sana bir kişinin kendi ifadesi verilecek. Bu ifade hangi ısı ve hangi nem "
    "niteliğini gösteriyor?\n"
    "SADECE iki kelime yaz, aralarında bir boşluk, başka hiçbir şey yazma.\n"
    "Birinci kelime: sicak ya da soguk\n"
    "İkinci kelime: islak ya da kuru\n"
    "Örnek cevap: sicak kuru"
)


def eksen_cozumle(metin):
    """İki nitelikli cevabı mizaca çevirir."""
    k = (metin or "").lower()
    k = (k.replace("ı", "i").replace("İ", "i").replace("î", "i")
          .replace("ğ", "g").replace("ş", "s").replace("ç", "c"))
    isi = "sicak" if "sicak" in k else ("soguk" if "soguk" in k else None)
    nem = "islak" if "islak" in k else ("kuru" if "kuru" in k else None)
    if isi is None or nem is None:
        return None
    return EKSEN[(isi, nem)]


def sor(url, model, ifade, ctx, zaman_asimi, sistem):
    govde = {
        "model": model,
        "stream": False,
        "keep_alive": "30m",
        "options": {"temperature": 0, "num_predict": 12, "num_ctx": ctx},
        "messages": [
            {"role": "system", "content": sistem},
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
    p.add_argument("--sira", default=",".join(TIPLER),
                   help="mizaclarin promptta sunulus sirasi (yanlilik sinamasi)")
    p.add_argument("--eksen", action="store_true",
                   help="mizaci dogrudan sormak yerine isi+nem sorup esle")
    a = p.parse_args()

    sira = [t.strip() for t in a.sira.split(",")]
    if sorted(sira) != sorted(TIPLER):
        sys.exit("--sira dort mizaci da icermeli: " + ",".join(TIPLER))
    sistem = EKSEN_SISTEM if a.eksen else sistem_promptu(sira)
    ayristir = eksen_cozumle if a.eksen else cozumle

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
                ham, meta = sor(a.url, a.model, ifade, a.ctx, a.zaman_asimi, sistem)
                break
            except (urllib.error.URLError, RuntimeError, OSError) as e:
                hata = str(e)
                time.sleep(5 * (deneme + 1))

        tahmin = ayristir(ham) if ham is not None else None
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
        "model": a.model, "sinav": a.sinav, "ctx": a.ctx, "sira": sira, "eksen": a.eksen,
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
