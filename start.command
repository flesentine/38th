#!/bin/bash
cd "$(dirname "$0")"
PORT=8080
python3 -m http.server "$PORT" &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null' EXIT INT TERM
sleep 1
open "http://localhost:${PORT}"
wait "$SERVER_PID"
