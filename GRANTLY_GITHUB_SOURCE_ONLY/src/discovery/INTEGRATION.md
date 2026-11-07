# Chat C · GRANTLY Discovery / Opportunity Detail · G1 r1

**Authoritative integration base:** `GRANTLY-A-G1.0` from the actual `GRANTLY_BASE_G1.zip`. This is NOT the planning handoff and NOT a runnable integrated release. The approved planning reference is `GRANTLY_Parallel_Handoff.zip`.

**Delivery:** `GRANTLY_C_G1_r1.zip`. Extract at the EXISTING repository root. The archive is a **complete replacement of Chat C's `src/discovery/**` lane only**, not a replacement project scaffold. No files outside this directory are written, deleted or included. No dependencies added.

## Included paths

- `src/discovery/index.tsx` — named exports `Discover`, `OpportunityDetail`, `visibleRows`
- `src/discovery/discovery.css` — scoped responsive styles using G1 colour/spacing tokens
- `src/discovery/INTEGRATION.md` — this integration/validation note; safe to omit from production packaging

**Deletions:** none. **Shared contract requests:** none. **Root/App/global CSS edits:** none. **New files outside ownership:** none.

## A's integration steps (A-owned work; NOT performed in this bundle)

1. Retain A's current G1.0 repository, `src/shared/contracts.ts`, `src/styles/global.css`, `App.tsx`, `package.json`, package lock and Vite config. Do not replace them with any parallel chat's scaffold.
2. Extract `GRANTLY_C_G1_r1.zip` at the existing repository root, preserving `src/discovery/index.tsx` and its adjacent stylesheet. `index.tsx` imports its stylesheet with `import './discovery.css'`.
3. In A-owned `src/integration/live.tsx`, when integrating live B/C/D exports, re-export exactly:

   ```ts
   export { Discover, OpportunityDetail, visibleRows } from '../discovery';
   ```

   Keep B's `catalogue/assess` and D's `MyPlan/model/storage` exports wired by A as documented in the G1.0 seam. C never imports the preview specimens into production.
4. Build rows in A's `App` using B's live assessment; pass the existing `DiscoverProps` and `DetailProps`. A already normalises selected ID after each list change. No new props, model fields or route package are required.
5. With all owners integrated, run `npm run typecheck && npm run build`, then test six live rows and the M+CW → F+CW → B+CW → My plan path. The owner must not treat C's fixture screenshot or isolated checks as a production QA pass.

## Observable behaviour in r1

- Pure `visibleRows()` trims and searches opportunity name/purpose case-insensitively; open-only combines with search; sorts by inclusive applicant date string then ID. It never mutates the passed rows or re-evaluates assessment meaning.
- `Discover` renders controlled search and native Open only checkbox, count, deadline-sorted opportunity rows, benefit/frequency, audience and visible **View details** target. `onList` always receives a complete next `ListState`. `onOpen(id)` fires on the row control. Empty state includes the specified wording and reset (query `''`, `openOnly:false`, `selected:null`; A normalises selected). Selected IDs use `aria-current`, the `g-selected` shared class and a visible reading indicator.
- Stable `#g-results-list` (region, `tabIndex=-1`) and `#g-opportunity-row-${id}` (`data-opportunity-id=${id}`) targets. C does not attempt A's focus restoration or change root scroll on its own.
- `OpportunityDetail`: stable `#g-detail-heading` (`tabIndex=-1`), benefit/frequency/condition/deadline/audience before analysis, B-authored fit/reasons and both independent comparison stages, no-aid collapsed state, primary and secondary commands using `DetailProps`, required documents, attributed clause evidence by stage, saved questions and original aid label, review notification/acknowledgement, and current-terms disclosure. All clauses are presented as authored evidence, not recomputed permission. No external application, uploads or provider links.
- Native buttons and disclosure; 44px minimum controls; keyboard focus ring supplied by A. Reduced-motion CSS follows A's global rule. Responsive list/detail under 900px relies on A's page switch; C does not implement a duplicate router/store.
- Existing entry replaces the save action with **View in My plan**. Saved intention/progress and existing question remain displayed; update-question is an explicit command only when a current unresolved question exists and differs from saved question/context.

## Actual validation (isolated C harness, 7 Nov 2026)

**27 PASS, 0 FAIL, 0 page errors** in Playwright Chromium headless using actual transpiled `src/discovery/index.tsx`, G1.0 tokens and A's authored M/F/B specimens. Source compiled in a **disposable type-check configuration with limited React JSX declaration shims** and strict/no-unused/noUncheckedIndexedAccess; exit 0. This is a LIMITED check, not `npm run typecheck` against the official React 19 dependency graph.

Browser observations include: 1440×900 split pane, 390×844 index and routed detail, 360 CSS-px index, no horizontal overflow; first action reachable in opening 1440×900 and scrolled-to-heading 390×844 view; case-insensitive purpose search; no matches and reset; exact emitted save/clarify/acknowledge/list/open callbacks; both owners' clause evidence; no-aid comparison collapse; saved review and no duplicated save. Pure helper test with three **synthetic, test-only** additional rows verified five open/six total, closed sorting and name/purpose match. Synthetic rows remain outside production source and screenshots. Screenshot set and machine-readable results are in the separately supplied evidence ZIP.

**Preview caveat:** The browser environment blocks HTTP and file-navigation, and npm packages are not available. Evidence was rendered using the actual Chat C TSX transpiled into an in-memory browser specimen. The preview uses an isolated A-like shell, A's original M/F/B fixture objects, and a legacy preinstalled React UMD with a preview-only JSX-fragment adapter. It does **not** verify React 19 bundling, real B evaluator, D persistence or A integration. Do not confuse the specimen header with the actual application shell.

**Blocked:** `npm ci --offline --ignore-scripts --no-audit --no-fund` fails `ENOTCACHED` for registry tarballs; `npm view` reports `EAI_AGAIN`. Real `npm run typecheck`, `npm run build`, Vite serve and deployment: **UNRUN/BLOCKED in this sandbox**. A's internet-connected workstation must run the actual commands.

**UNRUN:** final six-row B live catalogue, A/D integration, real localStorage and persistence failure handling, independent E adversarial QA, actual browser 200% zoom, complete keyboard/contrast audit, deployment and signed-out production verification.

**Known UX contract limit:** `DetailProps` does not expose whether `onBack` will return to Discover or My plan. The visible button therefore says **Back to previous view** (accurate for either origin) rather than guessing a misleading destination. This is not a blocker; A's `onBack()` restores the correct surface and focus. If exact origin-specific copy becomes necessary, A must issue a contract revision, not silently fork this lane.

**Final release disposition:** Scoped C source delivered against G1.0 with test evidence. Integration and independent release acceptance still belong to A and E respectively.
