# GRANTLY · Chat A — Decision Desk visual conversion authorisation

**Decision:** APPROVE DESIGN DIRECTION / NOT RELEASE ACCEPTANCE  
**Date:** 7 November 2026  
**Base:** `GRANTLY-A-G2-r3` (source ZIP SHA-256 `500128c1b86712231987bb1e14a974021a64e153fc3e749d839bc994f8c694d9`)  
**Reference:** `GRANTLY_F_UX_X02(1).zip`, revision `GRANTLY-F-UX-X02`  
**Rollback:** immutable G2-r3 source/build, never overwritten during the design conversion.

## Authorised change

Accept F's **Decision Desk** navy/cobalt/linen visual language as an explicit visual variance from `02_EXPERIENCE_AND_VISUAL_SPEC.md`, only for a new, separate visual candidate. Use dark opportunity index, serif editorial detail, clear listed benefit/deadline hierarchy, two equally prominent independent **Apply** and **Hold both** outcome gates, provider evidence and outcome-specific next action. Mobile detail should show gates and primary CTA by 390 × 844 and avoid horizontal overflow at 360px. Search index remains the mobile entry, not a forced selected detail.

## Ownership

- **Chat C**: Implement `src/discovery/**` (Discover, OpportunityDetail, visibleRows and scoped styles) against unmodified shared `Row`/`Assessment`/`DetailProps` in G2-r3. Preserve `#g-detail-heading`, `#g-results-list`, `#g-opportunity-row-${id}` and `#g-required-documents`. Maintain source owner/clause IDs, true missing-term notices and all contracted callbacks. Never embed or import `ux-lab/runtime` or copy F's standalone engine/state/storage.
- **Chat A**: After receiving C's scoped patch, own `src/App.tsx`, `src/styles/global.css`, `src/styles/experience.css`, root state, shared palette and focus restoration. Keep verified G2-r3 storage copy and outcome-specific live announcement. Use the existing native profile controls and exact focus targets.
- **Chat B**: Frozen. No changes to `src/domain/**`.
- **Chat D**: Frozen for first visual merge. My Plan stays functional G2-r3 initially. D alone may later own an optional visual-only `src/plan/**` migration, but it is not release critical.
- **Chat F**: Prototype is design evidence only; no production source writes.
- **Chat E**: Must independently retest the *new exact integrated revision*; cannot transfer G2-r3 acceptance.

## Hard acceptance constraints

1. Exact B evaluator rules: every award, academic fit, inclusive deadline, CW/FT and independent application/holding outcomes. Unknown terms must remain **unresolved** unless an explicit veto exists. No global 'eligible' badge.
2. D-controlled `save`, `progress`, `acknowledge`, `updateQuestion`, `remove`, `read/write/reset`; preserve question's original aid context and no false storage/submission claims.
3. C index: name/purpose search, Open only, selected-row fallback, all six awards when filter disabled, empty state and mobile list/detail/back flow.
4. A navigation and accessibility: #g-profile-editor and all named focus targets, initial focus stability, explicit-detail heading focus and origin focus restoration, real outcome live announcement, native disclosures, keyboard interaction, reduced motion and readable statuses.
5. 1440×900, 390×844, 360px, actual 200% zoom, visual focus/no overflow, required evidence and primary action. Desktop 900px opening screen must show decisive outcome and action.
6. Source and build isolation: no production imports of F prototype, demo fixtures, static oracle harness, hardcoded fake result, new dependency or altered shared contract.

## Evidence and release gates

- C returns scoped source-only ZIP and **actual** browser screenshots/test outcomes. Distinguish isolated specimen from integrated application.
- A creates a new revision and manifest, executes npm ci, verify:integrated, test:plan, release-check, dependency-backed typecheck, production build and real integrated browser smoke.
- E independently retests the exact revision with actual React, native-origin storage, desktop/mobile, keyboard, contrast and production artifact where accessible.
- Review security audit for original Vite dev-server and PostCSS issues. Do not expose `vite --host 0.0.0.0` to untrusted networks; static production deployment only.
- Release only after successful production verification and organiser required deployment/repository checks. If conversion cannot complete safely before protected release window, submit stable G2-r3 (subject to its remaining QA and deployment requirements) rather than deploying the standalone F HTML as the application.

## Current F prototype audit observations (Chat A)

- F's evaluator and model/storage source snapshots are byte-identical to the matching G2-r3 files.
- F's isolated 30/30 edge checks and 16/16 contrast samples replayed successfully in our environment.
- F's 51/51 browser claim is partially affected by immediate focus assertions that race the `requestAnimationFrame` focus restoration. In repeated independent runs, focus appears after the scheduled frame at 320/360/375/390px; this is a test synchronisation concern, not yet evidence of a user-visible focus defect.
- 390×844 specimen presents both decisions and the action within its viewport. At 360×780 the full action may extend below the fold. This must be improved or documented.
- Standalone Chromium + simulated storage is not original React/browser/production evidence. No automatic release approval.

**Next coordination:** Owner may now create the GitHub repository for stable G2-r3. Run read-only Codex QA on that branch while C's visual conversion proceeds separately. Do not put F's prototype at the repository root as the application.
