"""
Minimal Pi agent example that POSTs telemetry to the aggregator.

Usage:
  python3 -m venv .venv
  source .venv/bin/activate
  pip install requests psutil
  python backend/agent_example.py --url http://localhost:8000

This script samples a few metrics and posts them every N seconds.
"""
import time
import json
import argparse
import socket

try:
    import psutil
except ImportError:
    psutil = None

import requests


def sample_metrics():
    if psutil:
        cpu = psutil.cpu_percent(interval=None) / 100.0
        mem = psutil.virtual_memory().available // (1024 * 1024)
    else:
        # fallback dummy values
        cpu = 0.15
        mem = 256

    return {
        "host": socket.gethostname(),
        "ip": socket.gethostbyname(socket.gethostname()),
        "cpu": cpu,
        "memFreeMb": mem,
        "ts": int(time.time())
    }


def run(url, interval=5):
    print(f"Agent: posting telemetry to {url} every {interval}s")
    while True:
        payload = sample_metrics()
        try:
            resp = requests.post(url.rstrip('/') + '/api/telemetry', json=payload, timeout=5)
            print("POST", resp.status_code, resp.text)
        except Exception as e:
            print("Error posting telemetry:", e)
        time.sleep(interval)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://localhost:8000', help='Aggregator base URL')
    parser.add_argument('--interval', type=int, default=5, help='Seconds between posts')
    args = parser.parse_args()
    run(args.url, args.interval)
