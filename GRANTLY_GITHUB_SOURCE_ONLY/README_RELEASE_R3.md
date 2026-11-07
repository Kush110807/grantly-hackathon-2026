# GRANTLY — G2-r3 integrated candidate

The current source is the **A/B/C/D integrated G2 experience** with A's editorial visual refinement, D's G2-r2 neutral storage-copy fix, and A's specific accessibility announcement refinement.

**Revision:** `GRANTLY-A-G2-r3`. This is **not a deployed, E-certified or submitted release**.

Open the project directory in VS Code, run on Windows PowerShell:

```powershell
npm.cmd ci
npm.cmd run verify:integrated
npm.cmd run test:plan
node scripts/release-check.mjs
npm.cmd run typecheck
npm.cmd run build
npm.cmd run preview
```

Use the preview URL printed by Vite (commonly `http://localhost:4173/`). Browser tests MUST run against this exact revision. For development: `npm.cmd run dev` (commonly `http://localhost:5173/`). No cloud URL has been created.

**Dispatch to E:** original `GRANTLY_Parallel_Handoff.zip` + this `GRANTLY_G2_r3.zip` + `E_G2_R3_RETEST_REQUEST.md` (included); attach existing E r1 QA report as historical prior evidence if useful. E's r1 FAIL remains in force for r1 and does not transfer as a new judgement of r3.

**Pending:** independent QA browser acceptance, candidate clean build (not executed in this offline environment if registry is blocked), deployment, source repository publication and confirmed organiser submission. C's additional flagship comparison interaction refinement is not incorporated unless a separate C-r2 source ZIP is supplied and integrated.
