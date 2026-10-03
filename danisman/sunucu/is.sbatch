#!/bin/bash
#SBATCH --job-name=mizac-video
#SBATCH --partition=gpu-1
#SBATCH --gres=gpu:1
#SBATCH --time=01:00:00
#SBATCH --output=/home/mta_kullanici/mizac-lab/slurm-%j.log
cd "$HOME/mizac-lab" || exit 1
./venv/bin/python toplu-video.py
