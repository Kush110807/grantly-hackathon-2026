# Wiring step on receipt of scoped B, C, D bundles (A ONLY)

G1 builds a runnable shell without pretending to have integrated domain, discovery and plan modules. `src/integration/live.tsx` is a temporary **production-safe placeholder adapter**. It contains no specimen imports.

After applying B/C/D owned paths, replace the entire body of `src/integration/live.tsx` with exactly:

```ts
export { catalogue, presets, DEMO_DAY, assess } from '../domain';
export { Discover, OpportunityDetail, visibleRows } from '../discovery';
export { MyPlan } from '../plan';
export { contextKey, applyCommand } from '../plan/model';
export { read, write, reset } from '../plan/storage';
```

No extra package or shared contract edits. Then run `npm run typecheck`, `npm run build`, browser smoke and exact 04 rule checks. Ensure exported source matches 03. Source must contain **no imports from `integration/fixtures`** reachable from `index.html` or the runtime.

Read result `invalid` and `unavailable` block writes in A until confirmed reset. A never writes on hydration. D must guard every localStorage accessor and method. MyPlan is passed saved rows sorted by applicant deadline and ID, containing current B assessments and D review flags, not historical assessments.

See `FOCUS_AND_TRANSFER.md`. The fixture harness is `/preview.html` in development only and deliberately absent from Vite's production HTML inputs.
