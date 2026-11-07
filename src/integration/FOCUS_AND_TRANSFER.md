# G1 focus/selection transfer contract · A-owned / binding

All lanes get this exact same document. B owns no DOM. C and D must supply semantic, stable focus targets in their owned components. No `autoFocus` on any initial control.

| Target | Required selector | Supplied by | Placement |
|---|---|---|---|
| Detail heading | `#g-detail-heading` | C `OpportunityDetail` | Unique `<h2 id="g-detail-heading" tabIndex={-1}>` at the top of reading pane; visible above assessment |
| Opportunity row / its open control | `#g-opportunity-row-M` etc. | C `Discover` | Focusable **View details** button/link per opportunity; `data-opportunity-id="M"`; keyed by real opportunity ID, not index |
| Results list | `#g-results-list` | C `Discover` | Focusable `<section role="region" aria-label="Scholarship results" id="g-results-list" tabIndex={-1}>` around actual list/empty state |
| Profile editor | `#g-profile-editor` | A `App.tsx` | Focusable labelled context section, actual selects are `#g-profile-year`, `#g-profile-field`, `#g-profile-aid` |
| Plan record open control | `#g-plan-open-M` etc. | D `MyPlan` | Focusable **View current terms** action per saved entry |
| Plan heading | `#g-plan-heading` | D `MyPlan` | Focusable `<h2 tabIndex={-1}>` at top of plan |
| Announcer | `#g-live-assessment` | A `App.tsx` | Role status, `aria-live="polite"`, concise context change; never force focus |

## Root-owned focus policy
1. No forced focus on initial load, automatic selection or profile changes. On desktop initial `selected` is the first *open* row (Bridge); C annotates it as selected using actual `selected` state.
2. C `onOpen(id)` calls A. If wide, A retains Discover and opens detail in the adjacent pane; if narrow, A renders a full-width detail page. After a React commit, A moves keyboard focus to C's `#g-detail-heading` using `requestAnimationFrame`.
3. A records the `g-opportunity-row-${id}` target and `window.scrollY` when entering detail from Discover. Mobile **Back to results** calls `onBack`, which restores Discover with query/filter/selected unchanged, then scroll/focus to the remembered row. C must keep the target stable for that ID.
4. D `onOpen(id)` calls A and sets the return origin to plan. **Back to My plan** returns to plan and focuses `#g-plan-open-${id}`. Do not confuse this with Compare opportunities.
5. `onCompare()` returns to Discover while preserving filters/query and focuses results, not a grant row. `onExplore()` resets filters to empty query and Open only true, selects first matching row and focuses results.
6. On filtering C calls `onList(completeNextList)`; A applies C `visibleRows()` and normalises selection. On empty results the canonical selection is null; no stale detail pane.
7. Profile editor access via `onProfile()` focuses A's editor. Changing select values immediately updates model but NEVER steals focus. D/C do not take focus for changing assessments.
8. App at <900 CSS px uses list->detail navigation; at >=900 CSS px uses index+reading pane. No nested scrolling drawer on mobile. Honor reduced-motion and 44px hit areas.

Important: `FOCUS` constants and `focusId()` live in `src/shared/focus.ts` owned by A. Read them but do not edit them.
