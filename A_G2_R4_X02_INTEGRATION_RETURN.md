# GRANTLY — A G2-r4 UX-X02 integration (7 November 2026)

## Revision binding
- Revision: `GRANTLY-A-G2-r4-UX-X02`
- Parent: exact `GRANTLY-A-G2-r3`, archive SHA-256 `500128c1b86712231987bb1e14a974021a64e153fc3e749d839bc994f8c694d9`.
- Design authorisation: `GRANTLY_X02_A_VISUAL_AUTHORIZATION.md`.
- C component source: `GRANTLY_C_UX_X02_r1(1).zip` (source exactly preserved).
- A shell: Decision Desk navy/linen/cobalt re-skin and compact mobile detail layout. Intro headline adjusted to match design.
- Immutable rollback: previous G2-r3 ZIP and independent Windows build evidence. **Do not overwrite the G2-r3 Git branch or artifact.**

## Production changed files
- `src/discovery/index.tsx` — C-owned complete scoped replacement, exact C handoff bytes.
- `src/discovery/discovery.css` — C-owned complete scoped replacement, exact C handoff bytes.
- `src/discovery/UX_X02_INTEGRATION.md` — C-owned integration instructions added.
- `src/App.tsx` — A-owned shell class for page-specific styling; headline only, no handler/contract change.
- `src/styles/experience.css` — A-owned visual-only rewrite; removes old green overrides that conflicted with X02; preserves responsive profile editor and focus states.
- `G2_INTEGRATION_MANIFEST.json` — revision-bound hash inventory refreshed. Historical G1/G2 files are archival, not current checks.

No changes to B domain rules, D plan/model/storage/tests, shared contracts, integration adapter, package-lock, dependencies or Vite config. No F prototype script or fixture imported into production.

## Verified here (NOT real React/browser release acceptance)
- B oracle `236/236`, cross-lane `35/35`, D plan/storage `13/13`, release-copy `9/9` — PASS.
- TypeScript source transpilation syntax — PASS; limited `tsc --noEmit` with temporary React declaration shim — PASS, **not official dependency-backed typecheck**.
- PostCSS parse of C, D, global and new A CSS — PASS.
- C's isolated browser evidence (separate ZIP): 56 PASS, includes 390x844 / 1440x900 primary CTA, not an integrated React test.
- Actual `npm ci` in this runtime: BLOCKED by uncached registry archive `yallist@3.1.1`.
- Actual `npm run typecheck`, `npm run build`, `npm run preview` on exact r4: UNRUN/BLOCKED here; perform on Windows or Codex cloud.
- Integrated React browser, real storage, keyboard, 200% zoom, accessibility, host/deployment/submission: UNRUN.

## Commands (from this folder; Windows PowerShell)
```powershell
npm.cmd ci
npm.cmd run verify:integrated
npm.cmd run test:plan
node scripts/release-check.mjs
npm.cmd run typecheck
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1
```
Run real Chromium browser on the built preview (not C specimen). Check CW/FT and all 11 oracle rows, navigation, Back focus, primary action visibility, plan saved state/refresh, storage-failure warnings, no overflow at 1440x900, 390x844, 360x780, native 200% zoom and keyboard. Obtain E's independent exact-r4 disposition before promoting this candidate.

## Security restrictions
The frozen `vite@7.3.1` dependency has network-exposed development-server advisories. Do not expose `npm run dev` / `vite preview` on the network, and do not deploy a Vite server as production. Use a static build host and classify the exact `npm audit` and `npm audit --omit=dev` JSON for this revision before sign-off. Do not run `npm audit fix --force` without controlled release review.

## Release discipline
G2-r3 remains fallback; UX-X02 is **not release accepted**. Require a new E QA report bound to this exact r4 manifest and code revision. Deploy only signed-off static assets. Document exact repository URL, commit, production URL, and organiser submission receipt separately.
