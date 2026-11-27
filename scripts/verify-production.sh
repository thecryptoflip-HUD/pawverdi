#!/usr/bin/env bash
# Exercise the local production build with the same process environment as the server.
set -euo pipefail
cd "$(dirname "$0")/.."
port="${PAWVERDI_TEST_PORT:-3190}"
export BASE="http://127.0.0.1:${port}"
log_dir="$(mktemp -d)"
trap 'if [[ -n "${server_pid:-}" ]]; then kill "$server_pid" 2>/dev/null || true; fi; rm -rf "$log_dir"' EXIT
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port "$port" >"$log_dir/server.log" 2>&1 &
server_pid=$!
for attempt in {1..60}; do
  if ! kill -0 "$server_pid" 2>/dev/null; then cat "$log_dir/server.log"; exit 1; fi
  if curl --silent --fail "$BASE/api/health" > /dev/null; then break; fi
  sleep 0.5
done
curl --silent --fail "$BASE/api/health" > /dev/null || { cat "$log_dir/server.log"; exit 1; }
npm run verify
python3 scripts/test-navigation.py
