# Chat D · GRANTLY Planning & Local Continuity · r1

**Checkpoint / authority:** D-G1-r1 · foundation `GRANTLY-A-G1.0` (actual `GRANTLY_BASE_G1.zip`), approved planning handoff. This is an **incremental source-only lane bundle**, **not** a foundation replacement, integrated app, or deployed release.

## Owned paths added (repository-relative)

- `src/plan/model.ts` — pure contextKey/applyCommand; exact G1 named exports.
- `src/plan/storage.ts` — read/write/reset; exact G1 signatures, guarded storage access and schema validation.
- `src/plan/index.tsx` — controlled MyPlan list, review, evidence, questions and callbacks.
- `src/plan/plan.css` — CSS scoped under `.gd-`/`.gd-plan` selectors; uses A's tokens and button classes.
- `src/plan/tests/plan.test.mjs` — disposable Node test harness with no production fixtures.
- `src/plan/CHAT_D_RETURN.md` — this integration and test return note.

**Changed outside this list:** none. **Deletions:** none. **Shared-contract changes:** none.

## Exactly how A integrates

1. Unzip at the **root of the existing G1.0 repository**, so files land under `src/plan/`. Do not replace the root, App.tsx, shared contracts, dependencies, global CSS or domain/discovery lanes. `src/plan/index.tsx` imports `./plan.css` itself.
2. When A has all B/C/D lanes, **A alone** changes its owned `src/integration/live.tsx` according to `src/integration/REPLACE_LIVE_MODULES.md`, importing/re-exporting `MyPlan` from `../plan`, `contextKey` and `applyCommand` from `../plan/model`, and `read`, `write`, `reset` from `../plan/storage`. This bundle does not edit that file.
3. A's existing App already supplies `rows` filtered and sorted by deadline/ID, `profile`, `onCommand`, `onOpen`, `onDiscover`, `onReset`, and computes `needsReview` using `contextKey`. No new props, root store or package dependencies are needed.
4. Keep A's `initialHydration`, `commitModel` and `resetDemo` orchestration. The storage adapter additionally refuses to write after a read observed invalid/unavailable data until an **explicit successful reset**; it never automatically clears another key. `write()` returns a truthful failure on exceptions or a failed read-back. The root should display success only when `.ok===true`.
5. Keyboard focus from A targets `#g-plan-heading` and `#g-plan-open-${id}` exactly. A owns `onOpen` routing and `onReset` confirmation; MyPlan merely emits them.
6. Run A's full `npm run typecheck`, `npm run build`, browser viewports (1440x900, 390x844, 360px, 200% zoom), keyboard/focus, refresh, confirmation and production smoke **after** integrating all three real lanes. The G1 foundation-only `npm run g1:verify` is **not applicable after B/C/D directories are created**: it explicitly asserts their absence and is expected to fail on a merged repository.

## Implemented behaviour

- Save `pursue`/`alternative`/`clarify`; duplicate same-intention save returns original model; new saves set notStarted and acknowledged relevant key.
- Intention changes preserve progress, saved question and acknowledgement. Progress changes independently. Remove deletes only that entry.
- Context key is exactly `JSON.stringify([year, requiredField===null?null:field, aid])`; changing unrelated field does not flag an unrestricted-field grant. Returning to the previously acknowledged tuple clears the flag.
- Only explicit `acknowledge` updates acknowledgedKey; the current rule assessment stays B-owned and is never stored historically.
- New clarification requires an actual current unresolved stage and a non-empty B-supplied question. Saved question keeps its original aid context across profile edits and acknowledgements. `updateQuestion` explicitly replaces text and aid only when a current unresolved question is supplied.
- Controlled MyPlan includes empty/find action, saved list, deadline, benefit, intention/progress selects, self-reported submission notice, review and both current stage explanations, expandable attributed evidence, question context, update, acknowledge, remove, current-detail action, and reset trigger including from empty state.
- Storage only uses `grantly.v1`: strict version/enum/shape/key/unique-ID checks, no historical assessment fields, guarded `window.localStorage` accessor and all storage methods, no implicit writes on hydration, readback verification and no data loss from failed operations.

## Checks actually executed — local Node/Linux environment

1. `node --experimental-strip-types --test src/plan/tests/plan.test.mjs` → **PASS 13/13** on final rerun. Cases: exact relevant-input key; save/duplicate/progress/intention; aid-change review/acknowledge; field ignored for F and relevant for L; question preservation/explicit replacement; invalid clarify/mismatched ID; save/read/reset with unrelated key unchanged; invalid values and unknown properties; malformed JSON and wrong version preserve bytes and block writes; inaccessible storage getter; getItem/setItem failures; removeItem throw/no-op; setItem no-op.
2. `tsc --noEmit --strict --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022,DOM src/plan/model.ts src/plan/storage.ts` → **PASS** (pure modules + shared types).
3. TypeScript `transpileModule` JSX/TS parse for `src/plan/index.tsx`, `model.ts`, `storage.ts` → **PASS** (syntax/emit only; **not** a React typecheck).
4. `npm ci --offline --no-audit --no-fund` → **BLOCKED** (`ENOTCACHED` for `yallist-3.1.1.tgz`, npm cache incomplete); therefore full React typecheck/build **UNRUN** here.
5. `node scripts/g1-verify.mjs` after adding `src/plan` → **EXPECTED FOUNDATION-ONLY ASSERTION FAILURE**, because this G1-only script asserts the `src/plan` directory must **not exist**. This is not evidence of a runtime/feature regression and must not be used as an integrated build gate.

**Initial harness correction:** The first test invocation failed one incorrect expected value in a test asserting a missing year with a *null* field; the fixture was corrected to supply `field:'stem'`. No source logic changed for that correction; the final full rerun passed 13/13.

## UNRUN / required A or E integration checks

- Browser-mount MyPlan in the real assembled B/C/D app and validate navigation and responsive display (the React dependencies are not installed here).
- Actual page refresh/reopen on one origin, including live B catalogue results; local JSON adapter read-after-write was exercised instead.
- A-owned cancelled/confirmed native reset dialog flow (adapter's actual removal/error behaviours were unit tested).
- End-to-end Fieldwork CW→FT review, Bridge FT veto and current details view; requires B's live evaluator and C's detail component.
- Real localStorage quota/security exceptions in a browser, visual accessibility, focus return, 200% zoom, live-origin and production verification.

## Known constraints / defects / requests

- No observed functional defect in the exercised pure transition/storage checks. Integrated visual, React strict-type and browser behaviour remains unverified (UNRUN), not presumed PASS.
- No live B catalogue or C detail module was delivered to this lane. Rendered review uses current assessments passed in by A, so accuracy depends on B; all evidence is attributed from those passed stage results.
- An already-saved clarification remains visible in its original aid context even if the current evaluation becomes prohibited rather than unresolved; update action is intentionally unavailable until a new unresolved question exists.
- A owns the *global* storage success/failure notice and reset confirmation. D cannot test either UI path as a standalone module.
- **External dependency:** A's merged app, dependencies, browser access. **Shared-contract request:** none.
