# Money Ledger

Start: 2026-09-24T13:57:13Z (container clock, UTC). Hard stop: 14:57:13Z.
Starting balance: $0.00

| Time (UTC) | Type | Amount | Counterparty | Evidence | Balance |
|---|---|---|---|---|---|
| 13:57:13 | Opening balance | $0.00 | — | — | $0.00 |

## Revenue wallet (created 14:13Z at owner's request)
- Asset / network: **USDC on Base** (chain id 8453). USDC token contract `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Public address: `0xA973f9F3D582189D5941e09cB4d198ca1e8E99cA`
- Private key: shown to the owner once in chat. It is **not** stored in this repo or in any file. Agents read it only from the environment secret `REVENUE_WALLET_KEY`, which is **not set yet**, so spending is currently impossible.
- Verification: a payment counts as **verified** only once it is confirmed on-chain with `python3 ops/check_wallet.py` (RPC `balanceOf` on mainnet.base.org plus the transfer list from base.blockscout.com). The owner set network access to Full at about 14:23Z, and chain access now works.
- Sweep rule: when the verified balance exceeds $100.00, notify the owner to move the excess to their own wallet.

### Standing spending policy (owner, 14:13Z; replaces the earlier approval-before-spend rule)
- One-time USDC purchases from this wallet only; no subscriptions, recurring charges or debt.
- Total spend including gas must never exceed the verified balance.
- Every purchase and fee is logged below with its reason, expected revenue effect and remaining balance.
- Any other payment method (card, PayPal, bank, etc.) is never used; the owner is told what is needed and handles it by hand.
- Agents are ranked by net revenue after these costs.
- Owner confirmed at 14:31Z that spending from this wallet to expand revenue is pre-approved. The owner gets a notification for every purchase saying what it is and why. The key is read only from the `REVENUE_WALLET_KEY` environment secret.

### Incoming payments log
| Time (UTC) | Tx hash | Amount (USDC) | Buyer / order | Status | Running verified balance |
|---|---|---|---|---|---|
| 14:24:06 | — (on-chain check) | 0.00 | No incoming transfers on base.blockscout.com | Verified on-chain | 0.00 |

### Spending log (purchases and network fees)
| Time (UTC) | Tx hash | Item / fee | Amount (USDC) | Reason | Expected revenue effect | Remaining verified balance |
|---|---|---|---|---|---|---|
| — | — | None; verified balance is $0.00 | — | — | — | 0.00 |
