import json, subprocess, sys, pathlib
planlar = json.load(open("/home/mta_kullanici/mizac-lab/planlar.json"))
kok = pathlib.Path("/home/mta_kullanici/mizac-lab/planlar")
kok.mkdir(exist_ok=True)
for p in planlar:
    hedef = kok / f"{p['ad']}.mp4"
    if hedef.exists():
        print("atlandı:", p["ad"], flush=True); continue
    print("üretiliyor:", p["ad"], flush=True)
    subprocess.run(["/home/mta_kullanici/mizac-lab/venv/bin/python",
        "/home/mta_kullanici/mizac-lab/video-uret.py",
        "--metin", p["istem"], "--cikti", str(hedef),
        "--kare", "121", "--en", "704", "--boy", "1280", "--adim", "30"],
        check=False)
print("BITTI", flush=True)
