#!/usr/bin/env bash
# Run the visual regression suite locally with browsers inside the same
# Playwright Docker image CI uses, so screenshots match the baselines.
#
#   e2e/run.sh                      compare against baselines
#   e2e/run.sh --update-snapshots   accept current screenshots as baselines
#   e2e/run.sh record               re-record server fixtures and HAR traffic
#
# Extra arguments are passed to `playwright test`.
set -euo pipefail
cd "$(dirname "$0")/.."

pw_version=$(node -p "require('@playwright/test/package.json').version")
image="mcr.microsoft.com/playwright:v${pw_version}-noble"
port=${E2E_PORT:-3100}
ws_port=${E2E_WS_PORT:-3333}

mode=replay
record_har=0
if [ "${1:-}" = record ]; then
  mode=record
  record_har=1
  shift
fi

NOTION_FIXTURES=$mode pnpm exec next build

if lsof -ti "tcp:$port" >/dev/null 2>&1; then
  echo "port $port is already in use" >&2
  exit 1
fi
docker rm -f blog-pw-server >/dev/null 2>&1 || true

# start next directly (not via pnpm) so the cleanup trap stops the server
NOTION_FIXTURES=$mode node_modules/.bin/next start -p "$port" &
server_pid=$!
docker run -d --rm --name blog-pw-server -p "$ws_port:$ws_port" \
  --add-host=host.docker.internal:host-gateway --init "$image" \
  /bin/sh -c "npx -y playwright@${pw_version} run-server --port ${ws_port} --host 0.0.0.0" \
  >/dev/null
trap 'kill $server_pid 2>/dev/null; docker rm -f blog-pw-server >/dev/null 2>&1' EXIT

for _ in $(seq 1 120); do
  if curl -s -o /dev/null "http://localhost:$port" &&
    docker logs blog-pw-server 2>&1 | grep -q "Listening"; then
    break
  fi
  sleep 1
done

if [ "$mode" = record ]; then
  # render each page once, sequentially, so server fixtures are recorded
  # completely before browsers hit the server in parallel
  for path in $(node -p "require('./e2e/pages.json').map((p) => p.path).join(' ')"); do
    curl -sf -o /dev/null --max-time 300 "http://localhost:$port$path" ||
      { echo "failed to render $path while recording" >&2; exit 1; }
  done
fi

E2E_NO_SERVER=1 \
  E2E_RECORD_HAR=$record_har \
  E2E_BASE_URL="http://host.docker.internal:$port" \
  PW_WS_ENDPOINT="ws://127.0.0.1:$ws_port/" \
  pnpm exec playwright test "$@" || status=$?

if [ "$mode" = record ]; then
  node e2e/clean-har.mjs
fi

exit "${status:-0}"
