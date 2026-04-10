#!/bin/bash
# PostToolUse hook: TypeScript check after file edits
# Reads JSON from stdin, checks if edited file is .ts/.tsx, runs tsc

INPUT=$(cat)
FILE=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except:
    print('')
" 2>/dev/null)

# Only run for .ts/.tsx files outside node_modules
if [[ "$FILE" == *.tsx || "$FILE" == *.ts ]] && [[ "$FILE" != */node_modules/* ]]; then
  cd "$CLAUDE_PROJECT_DIR" || exit 0
  ERRORS=$(npx tsc --noEmit --skipLibCheck 2>&1 | grep -v "node_modules" | grep -v "npm notice" | grep "error TS" | head -10)
  if [ -n "$ERRORS" ]; then
    echo "TypeScript hatası bulundu:"
    echo "$ERRORS"
    exit 2
  fi
fi

exit 0
