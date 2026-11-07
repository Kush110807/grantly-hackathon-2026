# GRANTLY · A-owned experience refinement · G2 visual r2

**Origin:** `GRANTLY-A-G2-r1`. **Candidate:** `GRANTLY-A-G2-VISUAL-r2`. **Date:** 7 November 2026.

## Authority and change boundary
This revision changes only `src/App.tsx`, `src/main.tsx`, and new A-owned `src/styles/experience.css`. It does not change contracts, domain, discovery or plan source files, dependencies, commands, rules, persistence, fixtures, focus IDs, tests, or app navigation. The stylesheet contains shared visual styling for B/C/D-rendered surfaces and is temporary A-controlled integration polish; C/D should reconcile their scoped CSS for final source ownership where appropriate.

## Visual direction
**Funding Decision Editorial**: an accessible, content-first interface that looks like a carefully typeset product instead of a template dashboard. The identity uses an ink-green masthead, a restrained G emblem, contemporary serif opportunity headlines, disciplined 10/14/21 px textual scale, warm neutral workspace, highly readable white award pane, a softly differentiated opportunity index, meaningful border and selection states, and a raised data-driven aid comparison. No hero illustration, stock art, gratuitous glass effects, floating panels, animated counters or unverifiable AI claims.

## Why
The G2 baseline gives award amount, deadline, listed criteria, aid-stage compatibility and intended action too similar a visual weight. The product's differentiator is application-vs-holding compatibility, not a decorative homepage. This refinement addresses information priority while retaining policy and accessible text.

## Changed interactions
A new **presentation-only mobile Edit/Done toggle** collapses or expands the existing single study-context editor; it does not duplicate the editor, fields, IDs, state, or storage. A profile-edit request from detail expands the controls before focusing the existing `g-profile-editor` target. All profile changes still update assessment, all intents use the same applyCommand, the same D storage adapter remains, and navigation/focus identifiers remain stable. A's profile description no longer implies a successful device write before it happens.

## QA to complete on user's Windows installation
```
npm.cmd ci
npm.cmd run verify:integrated
npm.cmd run test:plan
npm.cmd run typecheck
npm.cmd run build
npm.cmd run dev
```
In Chromium inspect 1440×900, 1280×800, 900×700, 390×844, 375×812 and 320×720. Check 200% zoom, horizontal overflow, one-pixel focus targets, selection/return, keyboard interactions, screen-reader announcements, colour contrast and no misrepresented outcomes. This environment cannot confirm a full dependency-backed React build.

## Remaining UX owner issues
1. **C lane:** In the detail surface, the two-stage results should be more recognisable as a coherent *Apply / Hold* decision; make an evidence affordance visible without exposing all terms at once, while retaining exact text and caveats. On mobile preserve benefit/deadline/fit/next action before long evidence.
2. **D lane:** Replace the unconditional "YOUR DECISIONS / SAVED ON THIS DEVICE" caption with neutral copy because persistence can fail; preserve all existing model and storage behaviour. For saved plan entries, improve intention/review/status hierarchy without claiming an application has been sent.
3. **E independent QA:** no full integrated browser acceptance has been run in this environment. Existing lane-isolated evidence is not production acceptance.

## Source controls
No deployment, repository push or organiser submission has been made. This is a candidate, not an accepted release. Keep official G2-r1 available as a rollback archive until E signs off.
