import json, sys, urllib.request

YONERGE = """Sen Türkçe sosyal medya metni yazan bir editörsün. Mizaç (tıbb-ı nebevî)
üzerine bir Instagram hesabı için yazıyorsun.

Sana bir gönderinin MEVCUT metnini vereceğim. Sorunu şu: metin bir veritabanı
satırı gibi duruyor, kimseyi durdurmuyor.

Yeniden yaz. Kurallar:
1. İLK SATIR bir kanca olsun: mizaç kelimesini hiç duymamış birinin bile
   durup okuyacağı, kendi hayatından tanıyacağı bir cümle. Soru ya da
   çarpıcı bir tespit. En fazla 12 kelime.
2. Sonra 2-3 kısa satır: terim değil, YAŞANMIŞLIK anlat. "Sözel takdir"
   yerine "sana seni seviyorum demesi değil, yaptığın işi övmesi lazım".
3. Sonunda tek satır çağrı, her seferinde farklı cümle kurulsun.
4. 4-6 etiket. Her gönderide AYNI olmasın, konuya göre değişsin.
5. Emoji en fazla 1 tane, başta.
6. Abartma, tıbbi iddia kurma.

Yalnız yeni metni yaz, açıklama yapma."""

def sor(metin):
    istek = urllib.request.Request(
        "http://127.0.0.1:11434/api/generate",
        data=json.dumps({"model": "gemma3:27b",
                         "prompt": YONERGE + "\n\nMEVCUT METİN:\n" + metin,
                         "stream": False,
                         "options": {"num_ctx": 8192, "temperature": 0.9}}).encode(),
        headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(istek, timeout=600) as c:
        return json.load(c)["response"].strip()

for p in json.load(open("/home/mta_kullanici/mizac-lab/ornek-postlar.json")):
    print("=" * 60)
    print("### " + p["yol"])
    print("--- MEVCUT ---")
    print(p["mevcut"])
    print("--- YENİ ---")
    print(sor(p["mevcut"]))
    sys.stdout.flush()
