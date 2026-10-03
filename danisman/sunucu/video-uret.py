"""
Wan 2.2 TI2V-5B ile tek bir dikey video planı üretir.

NEDEN
Mevcut sosyal medya videoları kahverengi zemin üzerinde kayan yazıdan
ibaret; izlenecek bir şey yok. Bu betik senaryodaki bir adımı gerçek
görüntüye çeviriyor.

LİSANS: Wan 2.2 Apache-2.0. FLUX.1-dev ve LTX-Video bilerek kullanılmıyor,
ikisi de "other" lisanslı ve site ticari (reklam + rapor satışı).

KART SEÇİMİ: CUDA_VISIBLE_DEVICES ile dışarıdan veriliyor. Makine paylaşımlı,
6 Eylül 2026 ölçümünde yalnız 2 ve 3 boştu — çalıştırmadan önce nvidia-smi.
"""
import argparse, time, torch
from diffusers import DiffusionPipeline
from diffusers.utils import export_to_video

a = argparse.ArgumentParser()
a.add_argument("--metin", required=True)
a.add_argument("--cikti", default="plan.mp4")
a.add_argument("--kare", type=int, default=49)
a.add_argument("--en", type=int, default=704)
a.add_argument("--boy", type=int, default=1280)
a.add_argument("--adim", type=int, default=30)
k = a.parse_args()

t0 = time.time()
boru = DiffusionPipeline.from_pretrained(
    "Wan-AI/Wan2.2-TI2V-5B-Diffusers", torch_dtype=torch.bfloat16)
# 5B + UMT5-XXL tek karta sığmayabiliyor; offload emniyet kemeri.
boru.enable_model_cpu_offload()
print(f"model yüklendi: {time.time()-t0:.0f} sn", flush=True)

t1 = time.time()
kareler = boru(
    prompt=k.metin,
    negative_prompt="yazı, harf, logo, bulanık, bozuk el, fazladan parmak",
    height=k.boy, width=k.en,
    num_frames=k.kare,
    num_inference_steps=k.adim,
).frames[0]
print(f"üretim: {time.time()-t1:.0f} sn", flush=True)

export_to_video(kareler, k.cikti, fps=24)
print("YAZILDI:", k.cikti, flush=True)
