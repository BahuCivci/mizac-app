#!/bin/bash
# PreToolUse hook: Block dangerous Bash commands
# Reads JSON from stdin, checks command for dangerous patterns

INPUT=$(cat)
CMD=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('command', ''))
except:
    print('')
" 2>/dev/null)

# Block dangerous patterns
DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf ~"
  "DROP TABLE"
  "DROP DATABASE"
  "> /dev/sda"
  "mkfs"
  "dd if="
  "gh repo delete"
  "git push --force"
  "git push -f "
  "git reset --hard"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$CMD" | grep -q "$pattern"; then
    echo "{\"continue\": false, \"stopReason\": \"Tehlikeli komut engellendi: $pattern\"}"
    exit 2
  fi
done

exit 0
