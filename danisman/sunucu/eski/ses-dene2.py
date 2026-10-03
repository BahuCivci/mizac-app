import torch, torchaudio, time
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

# Cümle cümle: model tek seferde uzun metni kesiyor (7.4 sn / 18 sn ölçüldü).
CUMLELER = [
    "Safravî ağrıyı nasıl tarif eder?",
    "Yanma. Cayır cayır yanıyor derler.",
    "Safra kesesi taşı, reflü, gastrit, mide krampları.",
]
m = ChatterboxMultilingualTTS.from_pretrained(device="cuda")
parcalar = []
sessizlik = torch.zeros(1, int(m.sr * 0.35))
for c in CUMLELER:
    t = time.time()
    w = m.generate(c, language_id="tr").cpu()
    print(f"  {w.shape[-1]/m.sr:.1f} sn  ({time.time()-t:.0f} sn sürdü)  {c[:40]}", flush=True)
    parcalar += [w, sessizlik]
tam = torch.cat(parcalar, dim=-1)
torchaudio.save("/home/mta_kullanici/mizac-lab/ses-chatterbox.wav", tam, m.sr)
print(f"TOPLAM {tam.shape[-1]/m.sr:.1f} sn", flush=True)
print("YAZILDI", flush=True)
