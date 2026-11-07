# GRANTLY · First integrated application (Chat A)

**Revision:** `GRANTLY-A-G2-r1` — source integration candidate, 7 November 2026. This integrates the actual A G1 foundation and B/C/D r1 scoped source. It is **not** a verified release, deployment, organiser submission or independent E PASS.

## Start on Windows / VS Code (PowerShell)

1. Extract `GRANTLY_INTEGRATED_G2_r1.zip` to a **new folder**; do not overwrite your G1 checkout.
2. Open the `GRANTLY_INTEGRATED_G2_r1` inner folder in VS Code. Node.js 20.19+ required.
3. Run in this sequence:

```powershell
node --version
npm.cmd ci
npm.cmd run verify:integrated
npm.cmd run test:plan
npm.cmd run typecheck
npm.cmd run build
npm.cmd run dev
```

Navigate to the Vite URL printed in your terminal (normally `http://localhost:5173/`). Check the exact URL; ports change when another Vite instance is running. Use `Ctrl+C` to stop Vite. To inspect built output instead, run `npm.cmd run preview` **after** the successful build and open the printed preview address.

**Do not run `npm.cmd run g1:verify` after integration**: it is the G1 foundation-only gate, and intentionally fails when B/C/D files exist.

## What is integrated

- `src/domain/**` (Chat B) — six fictional opportunities, two existing-aid presets, separate application/holding assessments, attributed provider evidence, rule oracle.
- `src/discovery/**` (Chat C) — search, filters, opportunity list and detail, assess/evidence presentation, navigation actions.
- `src/plan/**` (Chat D) — My Plan, pure commands/context key, guarded `grantly.v1` localStorage persistence, pure/storage tests.
- `src/App.tsx` (A) — single model, context controls, saving notices, reset confirmation, routing, focus return.
- `src/integration/live.tsx` (A) — production wiring to the real B/C/D exports, with **no fixture import**.

Fixtures (`src/integration/fixtures.ts`, `/preview.html`) are development-only. Vite's production HTML entry is explicitly only `index.html`. `src/integration/preview-main.tsx` is not imported by production.

## Verification, limitations and handoff

See `A_G2_INTEGRATION_RETURN.md` for outcomes, static checks and E acceptance instructions. The A local environment cannot complete dependency-backed `typecheck`, `build` or browser tests because the React dependency cache is incomplete. The user has previously demonstrated a successful **G1-only** Windows build; that does not establish an integrated G2 build. The first obligation is to test G2 in Windows, then hand G2 and the planning handoff to independent Chat E.

**Known issue needing D-owned fix:** My Plan's fixed header says “SAVED ON THIS DEVICE” even after a failed storage write. It should use neutral text; see `A_TO_D_COPY_CORRECTION.md`. The global A save warning is truthful, but the hardcoded D header is not. Do not claim release PASS while this remains unresolved.
