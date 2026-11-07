# GRANTLY — A -> D bounded r2 correction request

**Authority:** Chat A Integration Lead · `GRANTLY-A-G2-r1` candidate; frozen G1 contracts remain unchanged.

**Observed defect:** `src/plan/index.tsx` contains `<div className="g-kicker">YOUR DECISIONS / SAVED ON THIS DEVICE</div>`. This unconditional line overclaims persistence when localStorage read/write has failed or been blocked; the A-owned notice correctly says changes remain in this tab. Do not assert data was saved unless persistence is verified.

**Required smallest fix (D owns `src/plan/**`):** replace that header with neutral, non-persistence wording (for example, `YOUR DECISIONS / MY PLAN` or `YOUR DECISIONS / LOCAL WORKSPACE`). Do not edit root state, global notices, contracts or storage semantics. Inspect any other unconditionally affirmative storage copy in D-owned files. Keep save actions, tests, original-context question and review behaviour unchanged.

**Return:** `GRANTLY_D_G2_r2.zip` containing only changed D-owned paths, with exact changed file list, source test outcomes, and UNRUN cases. No shared-contract change requested.

**Acceptance:** on simulated failed write, no always-visible MyPlan text claims saved/persisted; A global warning is visible; on successful write, A global success notice remains authoritative. Validate regression in normal saved plan flow and keyboard navigation.
