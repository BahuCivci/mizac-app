"""Senaryonun beş adımını Chatterbox ile seslendirip tek ses izine yerleştirir.

Her adım kendi planının başlangıç saniyesine konuyor; aralar sessiz kalıyor.
Cümle cümle üretiliyor çünkü model tek seferde uzun metni kesiyor."""
import torch, torchaudio, time
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

# (başlangıç saniyesi, metin) — planlar 3,5,10,7,14 sn
ADIMLAR = [
    (0.0,  "Safravî ağrıyı nasıl tarif eder?"),
    (3.2,  "Yanma. Cayır cayır yanıyor derler."),
    (8.2,  "Safra kesesi taşı, reflü, gastrit, mide krampları."),
    (18.2, "Ciltte sivilce, ani kızarıklıklar, saç derisinde kaşıntı."),
    (25.2, "Kendi mizacını öğrenmek istersen mizac nokta xyz. Altmış soru, sekiz dakika, ücretsiz."),
]
TOPLAM = 39.0

m = ChatterboxMultilingualTTS.from_pretrained(device="cuda")
iz = torch.zeros(1, int(m.sr * TOPLAM))
for bas, metin in ADIMLAR:
    t = time.time()
    w = m.generate(metin, language_id="tr").cpu()
    n = w.shape[-1]
    i = int(bas * m.sr)
    if i + n > iz.shape[-1]:          # taşarsa kırp, süre sabit kalsın
        n = iz.shape[-1] - i
        w = w[:, :n]
    iz[:, i:i+n] = w
    print(f"  {bas:>5.1f} sn  uzunluk {n/m.sr:4.1f} sn  ({time.time()-t:.0f} sn)  {metin[:45]}", flush=True)

torchaudio.save("/home/mta_kullanici/mizac-lab/anlatim.wav", iz, m.sr)
print("YAZILDI anlatim.wav", flush=True)
