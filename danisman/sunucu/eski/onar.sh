#!/bin/bash
# Ana ortamı eski sürümlerine döndür, TTS'i AYRI ortama kur.
# Sebep: chatterbox-tts torch/transformers'ı geriye alıyor ve video
# üretimi (diffusers 0.40 + torch 2.13) bozuluyor.
set -u
cd "$HOME/mizac-lab" || exit 1

echo "=== 1) chatterbox ana ortamdan çıkarılıyor ==="
./venv/bin/pip uninstall -y chatterbox-tts 2>&1 | tail -2

echo "=== 2) ana ortam eski sürümlere ==="
./venv/bin/pip install -q \
  "torch==2.13.0" "torchaudio==2.11.0" "torchvision==0.28.0" \
  "transformers==5.15.1" "diffusers==0.40.0" 2>&1 | tail -3

echo "=== 3) ayrı TTS ortamı ==="
[ -d venv-tts ] || python3 -m venv venv-tts
./venv-tts/bin/pip install -q --upgrade pip 2>&1 | tail -1
./venv-tts/bin/pip install -q chatterbox-tts 2>&1 | tail -3

echo "=== 4) doğrulama ==="
echo -n "ana ortam torch: "; ./venv/bin/python -c "import torch;print(torch.__version__)" 2>&1 | tail -1
echo -n "ana ortam diffusers: "; ./venv/bin/python -c "import diffusers;print(diffusers.__version__)" 2>&1 | tail -1
echo -n "tts ortamı chatterbox: "; ./venv-tts/bin/python -c "import chatterbox;print('tamam')" 2>&1 | tail -1
echo "ONARIM_BITTI"
