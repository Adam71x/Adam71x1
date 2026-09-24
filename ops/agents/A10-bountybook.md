# BountyBook (orchestrator + A10)

- 14:38:12Z: the orchestrator signed in to api.bountybook.ai as the revenue wallet, using the owner's pre-approved key. It signed a login nonce only: no transaction, no gas, no spending. The key was passed in memory to a single process and written to no file.
- Claimed and submitted job 6b626f9c (Caesar cipher, $1.50) and job 6c541fc3 (slugify, $2.00). Both solutions pass the jobs' own test_code locally.
- Result: **both marked failed** (`/agents/0xA973…` shows jobs_failed 2, total_earned 0) and the jobs reopened. The API gives no reason. The most likely cause is our `outputData` shape (`{"files": {...}}`), which the docs don't specify for code_test jobs.
- Risk found: of 20 recently verified code jobs, **15 show `payout_status: "failed"`** even though verification passed. So payouts on this platform are unreliable.
- Decision: stop submitting this hour. Failures count against reputation, and we can't see why they fail. A10 was told to stop early; its solved files stay in scratchpad and were not submitted.
- Metrics: ~12 min, 2 claims, 2 submissions, qualified buyer responses 0, paid commitments 0, verified money $0.00.
- A10 (stopped early) solved 9 more jobs worth $22.50 in total; every one passes its own test_code locally. Files are in scratchpad and were not submitted.
- 14:39:55Z: one diagnostic retry on job 64376d89 (csv_merge, $3.50) with a different output shape (a files list plus a filename key). It also reopened at once with no reason, so the output shape was not the cause. We now have 3 failed submissions on BountyBook. **Channel paused.** Retrying blind would only hurt reputation further.
- 14:41Z check: every open research, content and data job (~20, $2.50–$7) comes from poster 0xcef19483, the same poster whose code payouts mostly fail. The "confirmed" find payouts are $0.01 each. Nothing on BountyBook worth pursuing this hour.
