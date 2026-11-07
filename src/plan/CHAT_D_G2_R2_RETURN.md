# Chat D — GRANTLY G2 r2 Bounded Copy Correction

## Identity and scope

- Upstream integration baseline reported by owner: `GRANTLY-A-G2-r1` (Chat A integrated D-r1). The actual G2 integrated source ZIP was **not supplied** to Chat D for this correction.
- Patch source: `GRANTLY_D_G1_r1.zip`, specifically its existing `src/plan/index.tsx`.
- Output: `GRANTLY_D_G2_r2.zip`.
- Type: **incremental, replacement of one D-owned source file**, plus this newly added D-owned return note.
- Ownership: `src/plan/**` only.
- Deletions: none.
- Outside-lane files modified: none.
- Dependencies, shared contracts, root state, global CSS and build configuration: unchanged.

## Exact amendment

File: `src/plan/index.tsx` (line 67 in D-r1)

```diff
-        <div className="g-kicker">YOUR DECISIONS / SAVED ON THIS DEVICE</div>
+        <div className="g-kicker">YOUR DECISIONS / YOUR PLAN</div>
```

The new kicker describes the planning area without claiming confirmed storage persistence. No other code, imports, component API, event handlers, model operations, adapter logic or tests changed. SHA-256 of updated source: `55bd02aa0f9629b33e874d0cb31fe01d258352ae9b4a7c5a4f984752d31d72e6`.

## Checks actually executed

1. **Exact byte diff:** PASS — `src/plan/index.tsx` is byte-for-byte equal to the D-r1 file after substituting the one specified kicker string; one occurrence replaced; old string absent.
2. **Plan regression suite:** PASS — 13/13 existing tests, 0 failures; executed on the locally reconstructed D-owned source with `node --experimental-strip-types --test src/plan/tests/plan.test.mjs` (Node.js v22.16.0). This suite checks context-key relevance, saves, duplicate saves, independent progress, aid review/acknowledgement, saved clarification question, storage validation, read/write/reset failure cases.
3. **Archive check:** PASS — manifest contains only `src/plan/index.tsx` and `src/plan/CHAT_D_G2_R2_RETURN.md` (verified after packaging).

## UNRUN / limitations

- Full `GRANTLY-A-G2-r1` application typecheck/build: UNRUN; integrated G2 source and its installed dependencies were not provided here.
- Real-browser UI check with storage blocked/unavailable: UNRUN; requires A's integrated runnable build and browser tooling.
- Visual/accessibility browser regression: UNRUN; not a visual redesign and integrated browser session unavailable.
- D regression tests are unchanged and are **not bundled** in this incremental ZIP; they remain in the previous D-r1 source / A's integrated repository.

## Integration request to Chat A

1. On the `GRANTLY-A-G2-r1` baseline, verify the current `src/plan/index.tsx` still matches D-r1 before overwriting (or apply only the exact one-line substitution above if later integration edits are present).
2. Extract this ZIP at the repository root, retaining all other sources.
3. Run existing `npm run typecheck`, `npm run build`, plan regressions and a browser pass with storage deliberately disabled, confirming no permanent-save assertion appears in the corrected kicker.

## Remaining defects, missing dependencies, shared-contract requests

- New defects introduced by this patch: none found by scoped checks.
- Existing cross-lane defects: not evaluated without G2 integrated build.
- Missing input for full verification: G2-r1 integrated source/binary and running browser.
- Shared-contract or dependency change requests: **none**.
