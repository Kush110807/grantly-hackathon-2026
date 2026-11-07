# GRANTLY — Chat A Integrated G2 r1 return note

**Date:** 2026-11-07; **Revision:** `GRANTLY-A-G2-r1`; **baseline:** `GRANTLY-A-G1.0`; **scope:** first merged source candidate, not a release.

## Inputs actually merged

| Owner | Bundle | Own source paths | Shared-contract/dependency change |
|---|---|---|---|
| B | GRANTLY_B_G1_r1.zip | `src/domain/index.ts`, `src/domain/oracle.check.ts` | None |
| C | GRANTLY_C_G1_r1.zip | `src/discovery/index.tsx`, `src/discovery/discovery.css`, `src/discovery/INTEGRATION.md` | None |
| D | GRANTLY_D_G1_r1.zip | `src/plan/index.tsx`, `src/plan/model.ts`, `src/plan/storage.ts`, `src/plan/plan.css`, `src/plan/tests/plan.test.mjs`, `src/plan/CHAT_D_RETURN.md` | None |

A changed the integration adapter `src/integration/live.tsx`, added `scripts/integration-check.mjs`, changed package scripts for integrated checking, and applied a scoped global CSS rule `.g-reading-single .gc-back` so desktop detail opened from My Plan offers the Back control. A retains original contracts/types and production entry. G1's original identity documents remain for history only.

## Checks performed here (actual, not inferred)

- **PASS** `npm run verify:integrated` — B's domain oracle **236/236**, A integrated static and B/D cross-lane assertions **35/35**.
- **PASS** `npm run test:plan` — D's pure model/storage tests **13/13**.
- **PASS (limited)** separate strict TypeScript check using temporary React declarations reported in the previous A integration audit. This is not equivalent to checking actual installed React types.
- **BLOCKED here** `npm run typecheck` — local `node_modules/@types/*` cache is incomplete. `TS2688` missing `babel__core`, `react`, `react-dom`, etc. No application TypeScript errors can be inferred from this.
- **BLOCKED here** `npm run build` — stops at the same missing type definitions, so no G2 production bundle was produced here.
- **UNRUN** integrated browser/keyboard/360/390/1440/200% tests, signed-out host test, deploy, independent E QA.
- **Independent Chat C evidence**, not an A integrated-browser PASS: C reported 27/27 isolated Playwright component checks.
- **G1-only check** `npm run g1:verify` intentionally rejects presence of B/C/D directories; not applicable after integration.

## Current source-level status

The actual B, C, D exports are wired into A's `src/integration/live.tsx`. App uses one current model and reevaluates B assessments for each profile change. Current stage outcomes are not persisted historically. C offers stable focus targets, and D's storage adapter owns `grantly.v1`. All specimen imports remain outside the production import graph. No production URL or source repository URL exists in this candidate.

**OPEN P2 copy defect (D-owned)**: MyPlan prints `YOUR DECISIONS / SAVED ON THIS DEVICE` unconditionally even when A and D correctly report a failed or unavailable storage write. Forward `A_TO_D_COPY_CORRECTION.md` to D. This must be fixed and independently retested before calling release PASS.

## Immediate operator/QA steps

1. On the user's Windows machine, extract this ZIP to a fresh folder, install from the exact lockfile with `npm.cmd ci`, run `npm.cmd run verify:integrated`, `npm.cmd run test:plan`, `npm.cmd run typecheck`, `npm.cmd run build`, then `npm.cmd run dev`. Share terminal errors and the actual local URL if blocked.
2. Open a fresh Chat E with approved `GRANTLY_Parallel_Handoff.zip` and this **integrated G2 r1 ZIP** (not three lane ZIPs). Ask E to audit against `DISPATCH/CHAT_E_QA.md` and `07_ACCEPTANCE_AND_DEMO.md`; E must report PASS/FAIL/UNRUN by case with screenshots and browser environment. Note local G2 build still requires verification.
3. Forward D the copy correction request concurrently, without editing D's files in A.
4. Relay any E reproducible bugs back to Chat A. A assigns owner, integrates bounded r2 fix, retests, and returns revised candidate to E.
5. Only after a successful integrated production build and acceptable E disposition, create/push the user-authorised source repository and deploy, then verify public URLs signed out. **The user must submit the actual links via the organiser portal and retain the confirmation.**

## Minimal manual smoke flow for first G2 browser launch

Start without saved data; search tuition, open Meridian, set year 1, select Campus Tuition Waiver, verify separate application-permitted vs holding-prohibited outcomes. Open Fieldwork and save pursue; open My plan, set Preparing and refresh; return via current terms. Open Bridge, save the CW clarification, change to Founders Tuition Award, verify current holding veto and original question aid label. Validate responsive Back at 390px and at desktop when opening terms from My Plan.

**Do not represent** this candidate as deployed, signed-off, or submitted.
