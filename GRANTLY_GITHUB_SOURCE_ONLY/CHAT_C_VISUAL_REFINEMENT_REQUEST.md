# GRANTLY · Chat C · Finite G2 experience refinement

**Authority:** G2 Visual r2 product direction from Chat A, 7 Nov 2026. **Base:** Use `GRANTLY_G2_VISUAL_r2.zip` as the currently integrated A-owned visual foundation; do not replace shared files. **Own only:** `src/discovery/**`.

## Core mandate
Make the **actual scholarship assessment** visually distinctive, not an ordinary stack of copied terms. The user's desired appearance is premium, recognisable and decision-centred. Keep the financial-aid-letter/editorial foundation, genuine task-first interactions and restrained green/ink/white palette. Do not rebuild as a generic dashboard or a marketing landing page.

1. Refine `OpportunityDetail` as a clear three-part assessment: **Listed criteria** → **Applying with existing aid** → **Holding both awards**. Each stage must show the existing exact `assessment` outcomes, reasons and source-attributed evidence, with no inferred eligibility or invented provider clearance. Distinguish a hard veto from a missing term.
2. Visually prioritise the **listed benefit**, **inclusive deadline**, **current assessment**, and **correct primary action**. At 1440×900 the user must see the next action in the opening viewport. On mobile the grant name, benefit, deadline, decision and action precede long documents/terms, and list/detail is not nested scrolling.
3. Use a considered three-state language for statuses: permitted, prohibited/restricted, unresolved. Colour is additional information, never the only information. Maintain 4.5:1 body text contrast, native focus, visible active selection, accessible status announcements and `prefers-reduced-motion` compliance.
4. Improve scanability of the left opportunity index while preserving name/purpose search, Open-only filter, existing sort, 6 fixtures, selected row and empty case.
5. Maintain the exact exports, `g-detail-heading`, `g-results-list`, and `g-opportunity-row-${id}` focus targets, action handlers and `onBack` behaviour. Do not alter B calculations or D persistence.
6. Return changed `src/discovery/**` only with desktop and mobile real-component screenshots, at minimum 1440×900, 390×844, and 375×812, and actual passing tests. Do not use static design specimens as functional QA evidence.

**Non-negotiable:** On Meridian Year 1 + CW, applying remains permitted and holding both remains prohibited; primary action is `Save as an alternative`. Fieldwork/CW allows pursue; Bridge/CW remains unresolved and offers clarification. With no aid, never claim provider compatibility. With missing study details, never claim final eligibility.

No shared-contract, package, root state, navigation or storage changes. Route any critical cross-owner issue to A as a precise change request. Release timing takes precedence over cosmetic animations.
