# Chat A — G1 foundation return note

**Checkpoint:** Foundation G1 (A only)  
**Base version:** `GRANTLY-A-G1.0`  
**Handoff authority:** `GRANTLY_Parallel_Handoff.zip`, SHA-256 `ac471bef83009f4458f0eec129899bdfaa4d09c354c41f1b3972386925744938`  
**Deadline:** 2026-11-07 17:00 IST; verified clock at 13:02:36 IST leaves 3h 57m 24s. Protect 16:20–17:00 IST.  
**Artifact:** `GRANTLY_BASE_G1.zip` (produced separately from planning ZIP).  
**Status:** A-owned foundation source assembled and structurally checked. Dependency install/runtime build cannot be verified in this sandbox because npm registry access is unavailable. **Not an integrated release or deployed application.**

## Added paths (all A-owned)

- `.gitignore`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `preview.html`, `README.md`, `G1_BASE_MANIFEST.json`, `G1_RETURN_NOTE.md`, `G1_SOURCE_SHA256.txt`, `scripts/g1-verify.mjs`
- `src/main.tsx`, `src/App.tsx`
- `src/shared/contracts.ts`, `src/shared/defaults.ts`, `src/shared/focus.ts`
- `src/styles/global.css`
- `src/integration/live.tsx`, `src/integration/fixtures.ts`, `src/integration/preview-main.tsx`, `src/integration/FOCUS_AND_TRANSFER.md`, `src/integration/REPLACE_LIVE_MODULES.md`

**Deleted / modified B/C/D paths:** none. No B/C/D source has been created or assumed to exist.

## Observable source behaviour and wiring

- React/Vite/TypeScript app and development-only preview entry point.
- Profile year, field and aid selectors, with none/unanswered defaults; selected list state; wide split and narrow detail route; native top navigation and reset confirmation.
- Root orchestration for model hydration, no implicit initial write, user-command persistence attempts, browser warning messages, review flags, return origin, focus management and announcement.
- A-only integration seam `src/integration/live.tsx` has temporary no-data implementations so the shell can mount before owners supply real modules. It contains no preview fixture imports. Replace it with named re-exports from B/C/D **only when all owned implementations arrive**.
- `src/integration/fixtures.ts` provides preview-only specimens: M/CW, F/FT, B/CW, M/no-aid, empty index, saved F needing review. A does not use their outcomes in production.
- CSS tokens, shared classes and responsive shell from 02; no illustrations, marketing blocks or invented provider interactions.
- Native select labels and stable focus targets documented in `src/integration/FOCUS_AND_TRANSFER.md`.

## Commands

Open the extracted folder in VS Code's PowerShell terminal:

```powershell
node --version
npm --version
npm install
npm run g1:verify
npm run dev
npm run typecheck
npm run build
npm run preview
```

Node must be 20.19+; Node 22 is recommended. Vite prints the development URL. At default configuration, G1 shell: `http://localhost:5173/`; *development-only* fixture desk: `http://localhost:5173/preview.html`. `npm run preview` serves the Vite-built production output (only after a successful build). Do not confuse a development preview with deployment.

## Actual check outcomes

| Check | Outcome | Evidence / limitation |
|---|---|---|
| Handoff archive inspected | PASS | 13 authoritative files, dispatch A first, 00–07 in order |
| G1 contract export and lock closure check | PASS | `npm run g1:verify`: 119 lock nodes, 29 exported declarations, complete dependency references, owner paths absent |
| Production fixture-import isolation (static) | PASS | `App.tsx`, `main.tsx`, `live.tsx` do not import fixtures; Vite production input is only `index.html` |
| Offline TS source structure with temporary, minimal React/JSX module declarations | PASS (limited) | `tsc --noEmit` exit 0 against disposable local shims; **not** a substitute for real installed React/Vite typecheck |
| `npm ci --offline --ignore-scripts --no-audit --no-fund` | BLOCKED | `ENOTCACHED`: registry packages unavailable locally |
| Actual `npm run typecheck` | BLOCKED | exit 2, missing React/Vite modules/types because `npm ci` could not install; this is **not** evidence of a passing typecheck |
| Actual `npm run build` | BLOCKED | exit 2 at TypeScript step for the same dependency absence; no verified production build |
| `npm run dev`, browser screens at 1440/390/360, 200% zoom | UNRUN | Dependencies not installed, no browser URL to test |
| Real B/C/D modules and M→CW→save smoke | UNRUN | Scoped deliveries not supplied yet |
| E adversarial QA, deployment, repository URL and organiser submission | UNRUN | Require integrated build and remote access |

**Lockfile status:** A supplied a resolved, version-pinned npm v3 dependency graph aligned to the declared packages, but it could not be downloaded or verified in this environment; integrity fields are not attested here. `npm install` on an internet-connected Windows workstation is the recommended first step; inspect/review the resulting lockfile before committing. Do not claim `npm ci` is passing until run. No executable compiled output is included.

## Focus contract (stable)

| Selector | Supplied by | A's behaviour |
|---|---|---|
| `#g-detail-heading` | C `OpportunityDetail` | Focus after explicit Open, never on context edits |
| `#g-opportunity-row-${id}` with `data-opportunity-id` | C `Discover` | On mobile Back, restore remembered row focus and scrolling; ID never position |
| `#g-results-list` | C `Discover` | Focus after Compare, Explore or Discover nav; empty selection normalised to null |
| `#g-profile-editor` | A `App.tsx` | Focus only on explicit Study details request; selects retain focus on updates |
| `#g-plan-open-${id}`, `#g-plan-heading` | D `MyPlan` | Return from plan detail to same originating record |
| `#g-live-assessment` | A `App.tsx` | Polite text announcement on relevant action; no forced focus |

See `src/integration/FOCUS_AND_TRANSFER.md` for exact markup and accessibility instructions. `src/shared/focus.ts` contains the A-owned constants.

## Transfers / first checkpoint

Immediately send **both** the approved planning `GRANTLY_Parallel_Handoff.zip` **and the same actual** `GRANTLY_BASE_G1.zip` to B, C and D. Do not send one lane a different foundation. Each should use their own DISPATCH, no replacement root/package files, and return only their owned paths:

- B: `GRANTLY_B_G1_r1.zip` containing `src/domain/**`; first runnable M/F/B + CW/FT evaluator/records.
- C: `GRANTLY_C_G1_r1.zip` containing `src/discovery/**`; first searchable index/detail + mobile/desktop render observations and focus targets.
- D: `GRANTLY_D_G1_r1.zip` containing `src/plan/**`; first model commands/storage adapter/minimal MyPlan, with failed-I/O evidence if possible.

**First owner-slice transfer target:** 2026-11-07 **13:40 IST**. Participant relays each available scoped ZIP to A as it arrives; do **not** wait for all three. A validates paths, applies one at a time, runs available checks, and publishes a runnable integrated revision as soon as M→CW→save→reopen works. **First integrated smoke target:** 2026-11-07 **14:05 IST**; send that actual build/URL to E, not G1 placeholders. These are coordination targets, not claims that modules or QA exist.

**Release protection:** feature freeze target 16:00 IST; 16:20–17:00 is protected for build, URL verification and submission, target submission 16:50. This schedule must be recalculated if transfers arrive late.

## External dependencies and changes

- Missing: B/C/D code bundles, reachable npm registry in this environment, actual participant repository remote, hosting account/access and deployment configuration. No repo/hosting URL is invented.
- Requested shared contract changes: **none**.
- Only A may change `src/App.tsx`, `src/integration/live.tsx`, `src/shared`, `src/styles`, package files and lockfile. B/C/D may suggest formal changes for shared contract/interface/dependencies; only an A-issued G1.1 is binding.
- Final organiser submission remains **not confirmed**; participant submits after source and live URLs are verified.
