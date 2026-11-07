# GRANTLY — Chat A integration return, G2-r3

**Revision:** `GRANTLY-A-G2-r3`  
**Parent sources:** `GRANTLY-A-G2-r1` → A-owned `GRANTLY-A-G2-VISUAL-r2` → D-owned `GRANTLY_D_G2_r2`  
**Authority:** A-owned integration and application shell; no shared-contract or B/C business-rule change.

## Scope, evidence and disposition

- Incorporated D-r2 `src/plan/index.tsx` exactly; one heading text substitution from `SAVED ON THIS DEVICE` to `YOUR PLAN`. Added D's return note unchanged.
- E-G2-02's other unconditional browser storage claim was already removed in A's prior visual-r2 source. The context lead now says `Change any field to update the listed assessment below.` It never asserts persistence.
- E-G2-03 is a P3 advisory (not a confirmed failure). A now sends a selected-opportunity-specific live-region announcement derived from B's *new* `assess()` result after a profile change, keeping focus stationary and distinguishing fit, application and holding. Interactive screen-reader acceptance is still UNRUN.
- No B/C/D logic or model/storage adapter change; no package dependency, shared interface, or fixture-production boundary change.
- E's FAIL verdict refers ONLY to `GRANTLY-A-G2-r1`. The new candidate is NOT E-accepted. Independent integrated-browser, storage fault injection, signed-out repository/production, and organiser submission remain UNRUN or BLOCKED until actually verified.
- The editorial design changes from visual-r2 are retained. `design_reference/` remains static specimen evidence, not production UI testing.

## Checks

Run from ZIP root with Node 20.19+ and network access:

```powershell
npm.cmd ci
npm.cmd run verify:integrated
npm.cmd run test:plan
node scripts/release-check.mjs
npm.cmd run typecheck
npm.cmd run build
npm.cmd run preview
```

Then inspect real application at the preview URL, follow `E_G2_R3_RETEST_REQUEST.md` and submit full evidence to E. Use `npm.cmd run dev` for editing, not production acceptance. Do not claim a deployment or organiser submission without independently observed confirmation.

## Rollback / ownership

Preserve `GRANTLY_INTEGRATED_G2_r1.zip` and `GRANTLY_G2_VISUAL_r2.zip` for baseline diagnosis. All first-party changes here are in A-owned app/scripts/docs, plus verbatim D's approved patch under `src/plan/**`. C's visual-lane refinement remains a separate pending work item; do not infer its completion from A's stylesheet.
