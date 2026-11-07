# GRANTLY · visual release acceptance checklist

## Current A refinement evidence
- [x] A/B/C/D source file ownership preserved; only `src/App.tsx`, `src/main.tsx`, `src/styles/experience.css` changed/added.
- [x] G2 integration static/oracle check PASS (B 236 assertions + integrated 35).
- [x] D model/storage tests PASS (13 tests).
- [x] A App/Main TSX parsed without JSX syntax errors.
- [x] Non-production HTML specimens rendered with Chromium; 1440×900 displays primary action at y~811px; 390×844 shows first two discovery records partially in opening viewport after compact context edit.
- [x] Static specimens show no horizontal overflow at 320, 375 and 390 CSS px.
- [x] Sample contrast ratios checked on named shared text/background colours: 5.11:1 or greater for tested body labels.
- [ ] Official dependency-backed `npm ci`, `npm run typecheck`, `npm run build`: BLOCKED in A environment (npm tarballs not cached). Must be run on owner's Windows machine.
- [ ] Integrated dynamic browser smoke: UNRUN locally in this environment. E must inspect actual React build; design specimens are **not** dynamic UI acceptance evidence.
- [ ] C actual rendered component 1440/390/375 acceptance: pending C refinement.
- [ ] D false saved-on-device caption correction: pending D refinement.
- [ ] Real 200% zoom, full keyboard traversal, screen reader, contrast audit and persistence behaviour: pending E.
- [ ] Deployed production URL, repository revision and organiser submission: not established.

## Minimum dynamic smoke on owner's Windows machine
1. `npm.cmd ci` -> `npm.cmd run verify:integrated` -> `npm.cmd run test:plan` -> `npm.cmd run typecheck` -> `npm.cmd run build` -> `npm.cmd run dev`.
2. With no aid, verify the status is not a silent permission. Search and Open-only filter, open Bridge, return to result list and preserve focus.
3. Set Year 1 / STEM / CW; open Meridian. Confirm criteria met, application permitted, holding prohibited and primary `Save as an alternative`, then save. Open My plan, edit progress, return to terms. Change aid and verify review state with original question saved.
4. Set Year 1 / CW; open Fieldwork; confirm pursue. Open Bridge/CW; confirm unresolved holding and question-save action.
5. Mobile: collapsed context summary is visible, Edit expands the real fields; detail action and Back work; no overflow at 320/375/390. With keyboard focus on profile from detail, editor opens before focus restoration.
6. Assess at 200% zoom and reduced-motion, real browser console errors and production bundle. Check no demo fixtures imported in `src/main.tsx` or production dependency path.
7. Never claim deployed release or submitted application from a passing local build.
