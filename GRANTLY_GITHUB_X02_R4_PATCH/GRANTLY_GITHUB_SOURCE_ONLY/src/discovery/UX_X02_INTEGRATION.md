# GRANTLY Chat C · UX-X02 r1 integration handoff

**Authority:** A-issued `GRANTLY_X02_A_VISUAL_AUTHORIZATION.md` (7 Nov 2026). **Base:** exact `GRANTLY-A-G2-r3` ZIP SHA-256 `500128c1b86712231987bb1e14a974021a64e153fc3e749d839bc994f8c694d9`.

## Patch operation

Incremental patch with **complete file replacements** for two Chat C-owned production files only:

- `src/discovery/index.tsx` — replace G2-r3 version.
- `src/discovery/discovery.css` — replace G2-r3 version.

`src/discovery/UX_X02_INTEGRATION.md` is newly added documentation. No deletions. No changes or requests to the G2-r3 shared contracts, exports, dependencies, A root state, B evaluator or D model/storage. `Discover`, `OpportunityDetail`, `visibleRows` exports and props stay exact. A focus IDs retained: `g-results-list`, `g-opportunity-row-${id}`, `g-detail-heading`, `g-required-documents`.

Apply on a **new copy or isolated branch** of G2-r3, not the rollback source. Do not copy F's `ux-lab`, engine snapshots, test storage, scripts, fixtures or prototype code into production. Keep A's native profile editor, focus and live-announcement logic. C's stylesheet defines only `.gc-x02` component-local design tokens and scoped selectors. Existing A green component overrides are superseded where applicable; A owns coordinating the surrounding header/intro/profile/Plan palette with the approved navy/linen design.

## Behaviour and scope

- Ordered dark index, case-insensitive name/purpose search, Open only, all six records when off, empty/reset; selected row focus/ARIA and the mobile entry route remain A-owned via unchanged `onList`/`onOpen` props.
- Editorial scholarship dossier shows original amount, term/conditions, inclusive deadline, intended audience and required documents verbatim.
- Two independent numbered **Apply** and **Hold both** gates come directly from `row.assessment.application` and `.holding`. Condensed first-view explanation is based only on those exact stage outcomes and attributed `evidence`; the **full original B `stage.reason`** and both providers' clause IDs/text are always available in the native source disclosure. Missing Bridge term is an editorial notice, never a quoted clause or permission.
- Academic criteria separately show B's exact `fit` and every `reason`; no combined eligibility badge. No aid shows a distinct non-applicable comparison explanation.
- Primary CTA obeys B's `assessment.primary` and the pre-existing saved-entry precedence; all commands still travel through `onCommand` to D. Clarification question and original aid remain D-owned; saved plans retain review, acknowledge and update-question actions.
- Mobile CTA is placed immediately after `04 / Your next move` heading, with explanatory copy below the CTA, to improve the 360px fold without removing information.

## Evidence from isolated C browser specimen

- Chromium/Playwright: **56 PASS, 0 FAIL** functional/visual assertions, plus one documented **320×720 fold limitation** (action ends at y=808px; still no horizontal overflow).
- 1440×900 M/CW: two gates and CTA visible, CTA bottom **856px** in isolated shell.
- 390×844 M/CW: CTA bottom **761px**; no overflow.
- 360×780 M/CW: CTA bottom **759px**; no overflow.
- 375×812 M/CW: CTA bottom **776px**; no overflow.
- Strict isolated TypeScript typecheck against genuine G2-r3 contracts PASS (test-only React declaration bridge, **not** dependency-backed React typecheck).
- Static integrated B/D assertions 35/35, B domain oracle 236/236; release-correction static assertions 9/9. PostCSS parse passes (204 rules).
- Additional cascade probe using G2-r3 global/experience CSS loaded *after* C CSS: dark index `rgb(16,39,59)`, flat transparent offer, correct green/red gate backgrounds, navy CTA; no 1440px overflow.

**Important limitations:** source was rendered using an isolated DOM JSX specimen with live G2-r3 B evaluation/D model transitions, **not the real React runtime**, installed npm dependency tree, A integrated shell, real persistent device storage or production build. `npm ci --offline` was blocked by missing cached `yallist@3.1.1`; ordinary npm install failed with npm CLI "Exit handler never called!" in this runtime. True native 200% zoom, end-to-end focus choreography, browser storage, screen-reader QA and E independent acceptance remain **UNRUN**.

## A's integration/release obligations

1. Copy the two production files into a new G2-r3 candidate and review the exact diff; preserve an immutable rollback.
2. A may update only its own `src/App.tsx`, `src/styles/global.css`, `src/styles/experience.css`, navigation and profile shell for coherent Decision Desk presentation. Do not change frozen B/D contracts or semantics.
3. On a normal Windows/npm environment: `npm ci`, `npm run verify:integrated`, `npm run test:plan`, `node scripts/release-check.mjs`, `npm run typecheck`, `npm run build`.
4. Real integrated React browser test at 1440×900, 390×844, 360×780, native 200% zoom, no overflow, keyboard and focus return, actual-origin storage, no-aid, M/CW, F/CW, B/CW, B/FT, C/CW, Lab, Digital/closed, search/reset, save/question/review. Check any shell height increase does not push the 360 CTA below the fold.
5. Have E retest the **exact newly merged revision**. This C patch is **not deployment or release acceptance**.
