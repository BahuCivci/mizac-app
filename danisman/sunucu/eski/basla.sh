#!/bin/bash
cd ~/mizac-lab
setsid nohup bash test32.sh "$1" "$2" > test32.log 2>&1 < /dev/null &
disown 2>/dev/null
echo "baslatildi"
exit 0
