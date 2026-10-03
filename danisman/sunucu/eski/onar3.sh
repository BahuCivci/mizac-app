#!/bin/bash
# cu12'leri kaldırmak ortak nvidia/ dizinindeki cu13 dosyalarını da
# sildi: paketler kayıtlı görünüyor ama .so'lar yok. Hepsini zorla
# yeniden kur.
set -u
cd "$HOME/mizac-lab" || exit 1
CU13=$(./venv/bin/pip list --format=freeze 2>/dev/null | grep -oE "^nvidia-[a-z0-9-]+-cu13" | sort -u | tr '\n' ' ')
echo "yeniden kurulacak: $CU13"
./venv/bin/pip install -q --force-reinstall --no-deps $CU13 2>&1 | tail -3
echo "=== doğrulama ==="
echo -n "nccl dosyaları: "; ls site-packages 2>/dev/null; ls ./venv/lib/python3.12/site-packages/nvidia/nccl/lib/ 2>/dev/null | head -2
echo -n "torch: "; ./venv/bin/python -c "import torch;print(torch.__version__,'cuda:',torch.cuda.is_available())" 2>&1 | tail -1
echo -n "diffusers: "; ./venv/bin/python -c "import diffusers;print(diffusers.__version__)" 2>&1 | tail -1
echo "ONARIM3_BITTI"
