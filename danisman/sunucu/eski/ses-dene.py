import torch, torchaudio, time
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

METIN = ("Safravî ağrıyı nasıl tarif eder? Yanma. Cayır cayır yanıyor derler. "
         "Safra kesesi taşı, reflü, gastrit, mide krampları.")

t0 = time.time()
m = ChatterboxMultilingualTTS.from_pretrained(device="cuda")
print(f"model yüklendi: {time.time()-t0:.0f} sn", flush=True)

t1 = time.time()
wav = m.generate(METIN, language_id="tr")
print(f"üretim: {time.time()-t1:.0f} sn", flush=True)

torchaudio.save("/home/mta_kullanici/mizac-lab/ses-chatterbox.wav", wav.cpu(), m.sr)
print("YAZILDI ses-chatterbox.wav", flush=True)
