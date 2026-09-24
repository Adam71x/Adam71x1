"""Read-only check of the revenue wallet: USDC balance and incoming transfers on Base.

Needs no private key. Requires the environment to allow mainnet.base.org and base.blockscout.com.
Usage: python3 ops/check_wallet.py
"""
import json
import urllib.request

WALLET = "0xA973f9F3D582189D5941e09cB4d198ca1e8E99cA"
USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
RPC = "https://mainnet.base.org"
EXPLORER = "https://base.blockscout.com/api/v2"


def get_json(url, data=None):
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json", "User-Agent": "revenue-wallet-check/1.0"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.load(r)


def usdc_balance():
    call = "0x70a08231" + WALLET[2:].lower().rjust(64, "0")  # balanceOf(address)
    body = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "eth_call",
                       "params": [{"to": USDC, "data": call}, "latest"]}).encode()
    return int(get_json(RPC, body)["result"], 16) / 1e6


def incoming_transfers():
    url = f"{EXPLORER}/addresses/{WALLET}/token-transfers?type=ERC-20&filter=to&token={USDC}"
    for t in get_json(url).get("items", []):
        yield t["timestamp"], t["transaction_hash"], int(t["total"]["value"]) / 1e6, t["from"]["hash"]


if __name__ == "__main__":
    print(f"Verified on-chain USDC balance: {usdc_balance():.2f}")
    for ts, tx, amount, sender in incoming_transfers():
        print(f"{ts}  {tx}  {amount:.2f} USDC  from {sender}")
