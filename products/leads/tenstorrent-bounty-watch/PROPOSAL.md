# Lead: Tenstorrent tt-metal bounty program: NO-GO (watch only)

**Status: no spec work done and no proposal drafted. Recommend not pursuing it.**

| Issue | Posted | Budget | Why it fails the < 1 day, AI-assisted test |
| --- | --- | --- | --- |
| https://github.com/tenstorrent/tt-metal/issues/56908 "Fix distributed LayerNorm/RMSNorm 2D-core-grid row-stride corruption" | 2026-09-17 | $3,000 | Needs Wormhole hardware for validation. Already assigned to another contributor. A multi-day kernel fix. |
| https://github.com/tenstorrent/tt-metal/issues/56290 "ttnn.quantize/requantize uint8 lower-bound saturation" | 2026-09-11 (outside 7-day window) | $500 | Needs Tenstorrent hardware to run tests. 16 comments, so it's contested. |
| https://github.com/tenstorrent/tt-metal/issues/56277 "Remove legacy sqrt/rsqrt/reciprocal compatibility paths" | 2026-09-11 (outside window) | $7,500 | Large refactor. |

Legitimacy: high. This is a real company with a public bounty program and stated USD amounts.
Fit: **1/10** for this experiment. None of these can be delivered in a day without the hardware.
Why it's listed: of all the sources the sandbox could reach, it's the only one with a verified, meaningful cash budget posted in the last 7 days. It might be worth watching for small doc or test bounties later.
