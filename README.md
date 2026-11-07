# GRANTLY — Scholarship Decision Desk

**Discover funding. Understand the terms. Make a deliberate next move.**

[**Open the live application**](https://grantly-hackathon-2026.onrender.com/) · [Source code](https://github.com/Kush110807/grantly-hackathon-2026)  
**Track:** The Outpost / Frontend Arena — GRANTLY: Unified Scholarship Discovery & Management Platform  
**Stack:** React 19, TypeScript, Vite 7, native CSS, browser-local persistence  
**Submission:** A functional, responsive **frontend-only MVP**, not an actual scholarship application provider.

## The problem and our approach

Students searching for education funding must compare different opportunities, determine which academic criteria they meet, understand conditional award terms, prepare documents and keep track of applications. Basic scholarship directories often show the monetary value without explaining whether an existing award conflicts with a new one.

GRANTLY turns these steps into a single **decision workspace**:

1. **Discover:** Search a curated six-opportunity demonstration catalogue, show open intakes, inspect benefits and inclusive deadlines.
2. **Understand fit:** Enter undergraduate year, field of study and existing aid. See criterion-specific results, including missing information instead of unjustified positive claims.
3. **Make two decisions, not one:** Compare permission to **apply** while receiving existing aid with permission to **hold both awards**. Both providers' fictional terms are independently considered at each stage. Explicit vetoes, missing terms and unresolved results remain distinct.
4. **Take action:** Review required documents, read the attributed term evidence and choose an available next action: pursue, save as alternative, or seek clarification.
5. **Manage a plan:** Keep saved intentions, self-reported progress, provider questions and reassessment notices after profile changes. Saved entries are stored in this browser when storage succeeds.

**Why two gates?** A student may be allowed to apply for a grant but forbidden to accept and retain it alongside an existing tuition award. Treating these as one eligibility badge would mislead the student.

## Start with a worked example

On the discovery page, select **Try a worked example**. This explicit user action sets **Undergraduate Year 1** and **Campus Tuition Waiver**, opens the **Meridian Study Grant**, and shows why applying can be permitted while holding both awards is prohibited. It **does not create an application or overwrite existing plan entries**; any previously saved plan is preserved and reassessed if its context changes.

## Demo journeys to test

| Scenario | Study context | Expected distinction |
| --- | --- | --- |
| Meridian Study Grant | Undergraduate year 1, Campus Tuition Waiver | Application **permitted**, simultaneous holding **prohibited** (Meridian veto) |
| Meridian Study Grant | Undergraduate year 1, Founders Tuition Award | Application **permitted**, holding **prohibited** (Founders veto) |
| Fieldwork Materials Grant | Undergraduate year 1, Campus Tuition Waiver | Both stages **permitted** by listed terms |
| Bridge Travel Bursary | Existing tuition aid | Application term exists; **missing holding term must not be treated as permission** |
| My Plan | Save Fieldwork; refresh browser | Saved intention reappears when localStorage succeeds; updates can require review |

The initial catalogue shows five open opportunities out of six; a closed intake can be inspected when the open-only filter is disabled.

## Product experience and accessibility

- **Decision Desk visual system:** deep-navy opportunity index, warm-paper editorial reading surface, cobalt interaction colour and separate green/red/amber semantics for outcomes. Outcome text and attributable evidence remain visible; colour is never the sole signal.
- **Responsive:** desktop side-by-side list/detail; mobile index-to-detail navigation with Back and focus return; compact study-context editor; reduced-motion rules and minimum-size primary actions.
- **Keyboard and assistive cues:** skip link, labelled inputs, visible focus styling, meaningful headings and live assessment announcements. Not all screen readers or native zoom settings have been independently evaluated.
- **Trustworthy state messages:** saving claims appear only after successful browser writes; an unsuccessful/unknown write retains in-tab state and surfaces a warning rather than asserting persistence.

## Architecture

```text
src/
  App.tsx                  React app shell, profile state, navigation, notices
  domain/                  fictional catalogue, attributed terms, pure assessment
  discovery/               search, opportunity index, details, two-stage verdicts
  plan/                    pure model commands, browser storage, plan UI, tests
  shared/                  frozen interfaces, defaults and focus targets
  integration/live.tsx     production-only adapter; no preview fixtures
  styles/                  global and responsive experience styling
scripts/
  integration-check.mjs    cross-lane/static/pure model assertions
  release-check.mjs        correction-presence regression
```

The application is frontend-only. It does not collect credentials, call scholarship APIs, store data in a remote database, submit an application or claim to verify an official grant decision. All demo provider names and clauses are **fictional**; the demo evaluation date is pinned to **7 November 2026** so repeatable tests do not change with the viewer's clock.

## Run locally

Requires Node.js **22.16+** (Node.js 20.19+ is sufficient for Vite; Node 22.16+ is used for the native TypeScript plan tests).

```bash
npm ci
npm run verify:integrated
npm run test:plan
node scripts/release-check.mjs
npm run typecheck
npm run build
npm run dev
```

Open the URL printed by Vite. To test the production build, run `npm run preview` after `npm run build`. Build output is `dist/`; development-only `preview.html` and `src/integration/fixtures.ts` are not imported by the production entry.

**Deployment:** Render Static Site; **Root Directory:** repository root; **Build Command:** `npm ci && npm run build`; **Publish Directory:** `dist`.

## Verification and limitations

The accepted r5 correction was developed against commit `a46c237569c8ed75f06bdd460e2a1b76854c9733`. Reported evidence includes passing TypeScript/build and rule/model tests, 54 measured viewport-fold checks across specified 1440×900, 390×844 and 360×780 cases, 30 contrast samples and 11 automated accessibility scans. The running public site was also browser-smoke-tested for Apply/Hold decisions and saving a plan after refresh.

**Limits:** 320px-wide screens may require vertical scrolling to reach the primary action; native 200% browser zoom and real screen-reader operation were not fully tested. The app is a transparent demonstration, not a comprehensive scholarship database, guarantee of aid eligibility, verification of provider terms or actual application-submission service. Progress is self-reported and persisted on the current device only.

## Design decision

Rather than flood students with grant cards and generic green eligibility badges, GRANTLY emphasises **one prominent reading pane, two independent rule gates, attributed evidence and one clear next action**. The concept intentionally prioritises decision quality and honest uncertainty over unsupported claims of automated award approval.

---

Built for **The Outpost / Frontend Arena**, 7 November 2026. Historical integration notes in the repository describe earlier development revisions; this README describes the current final frontend MVP.
