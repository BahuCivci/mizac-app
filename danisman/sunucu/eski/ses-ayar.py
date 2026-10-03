"""Aynı cümleyi farklı tonlama ayarlarıyla üretir; kullanıcı seçsin.

exaggeration: duygu/vurgu miktarı. Yüksek = teatral, düşük = sakin.
cfg_weight:   metne bağlılık. Düşük = daha akıcı ve yavaş, yüksek = tekdüze.
temperature:  çeşitlilik. Yüksek = daha canlı ama daha riskli."""
import torch, torchaudio, time
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

METIN = ("Safravî ağrıyı nasıl tarif eder? Yanma. "
         "Cayır cayır yanıyor derler.")

AYARLAR = [
    ("A-varsayilan", dict(exaggeration=0.5, cfg_weight=0.5, temperature=0.8)),
    ("B-sakin",      dict(exaggeration=0.3, cfg_weight=0.3, temperature=0.7)),
    ("C-sohbet",     dict(exaggeration=0.4, cfg_weight=0.25, temperature=0.9)),
    ("D-vurgulu",    dict(exaggeration=0.7, cfg_weight=0.4, temperature=0.8)),
]

m = ChatterboxMultilingualTTS.from_pretrained(device="cuda")
for ad, p in AYARLAR:
    t = time.time()
    parcalar = []
    for c in [x.strip() for x in METIN.split("?") if x.strip()]:
        c = c if c.endswith(".") else c + "?"
        parcalar.append(m.generate(c, language_id="tr", **p).cpu())
        parcalar.append(torch.zeros(1, int(m.sr * 0.3)))
    torchaudio.save(f"/home/mta_kullanici/mizac-lab/ses-{ad}.wav",
                    torch.cat(parcalar, dim=-1), m.sr)
    print(f"  {ad}: {time.time()-t:.0f} sn", flush=True)
print("YAZILDI", flush=True)
