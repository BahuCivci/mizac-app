#!/bin/bash
# cu12 artıklarını temizle. Chatterbox (torch 2.6) bunları getirdi;
# ortamdaki torch 2.13 cu13 istiyor ve cu12 kütüphanesini bulunca
# "undefined symbol: ncclCommResume" ile patlıyor.
set -u
cd "$HOME/mizac-lab" || exit 1

CU12=$(./venv/bin/pip list --format=freeze 2>/dev/null | grep -oE "^nvidia-[a-z0-9-]+-cu12" | sort -u)
echo "temizlenecek cu12 paketleri:"; echo "$CU12" | sed 's/^/  /'
[ -n "$CU12" ] && ./venv/bin/pip uninstall -y $CU12 2>&1 | tail -2

echo "=== torch zinciri yeniden ==="
./venv/bin/pip install -q --force-reinstall --no-deps \
  "torch==2.13.0" "torchaudio==2.11.0" "torchvision==0.28.0" 2>&1 | tail -2
./venv/bin/pip install -q "torch==2.13.0" 2>&1 | tail -2

echo "=== doğrulama ==="
echo -n "torch: "; ./venv/bin/python -c "import torch;print(torch.__version__, 'cuda:', torch.cuda.is_available())" 2>&1 | tail -1
echo -n "diffusers: "; ./venv/bin/python -c "import diffusers;print(diffusers.__version__)" 2>&1 | tail -1
echo "ONARIM2_BITTI"
