# A-owned execution evidence — GRANTLY-A-G2-r3

Date: 7 November 2026. This report is an A-owned integration check, **not independent Chat E acceptance**.

| Check | Command / method | Direct outcome | Boundary |
|---|---|---|---|
| D-r2 scoped patch provenance | Compare original D file and incoming D-r2 | **PASS:** exact one-line heading substitution; no other code changes | Source bytes only |
| E-G2-01 absent | `node scripts/release-check.mjs` | **PASS**, part of 9/9 static assertions | Browser storage-failure UI still unrun |
| E-G2-02 absent | `node scripts/release-check.mjs` | **PASS**, part of 9/9 static assertions | Browser storage-failure UI still unrun |
| E-G2-03 changed | Source inspection and `node scripts/release-check.mjs` | **PASS source assertion**: announcements compute current B-owned application and holding outcomes | Screen-reader acceptance **UNRUN** |
| B rule oracle | `node scripts/integration-check.mjs` | **PASS: 236/236 domain assertions** | Owner-authored pure logic |
| A B/D cross-lane and static gate | `node scripts/integration-check.mjs` | **PASS: 35/35 assertions** | Owner-authored, no browser |
| D model/storage tests | `npm run test:plan` | **PASS: 13/13** | Mock storage; no integrated browser |
| Correction source guard | `node scripts/release-check.mjs` | **PASS: 9/9** | Static source checks only |
| Offline dependency installation | `npm ci --offline --ignore-scripts --no-audit --no-fund` | **BLOCKED:** `ENOTCACHED` for `yallist-3.1.1.tgz` | Registry unavailable in execution environment |
| Actual dependency-backed typecheck | `npm run typecheck` after failed install | **BLOCKED:** missing `react` and other type packages (`TS2307` etc.) | Not evidence of application type errors |
| Source type inspection using temporary minimal React declarations | `tsc` using external shim | **Limited PASS** with `noImplicitAny=false`; stricter shim emits 2 pre-existing contextual React event-typing errors in `src/plan/index.tsx` lines 113 and 123 | NOT a real React typecheck; shims omit actual JSX context |
| Production Vite build | `npm run build` | **UNRUN on r3** due missing dependencies | Windows/other connected build needed |
| Real integrated UI 1440/390/360/200% | Browser-based end-to-end run | **UNRUN** | Visual specimens are static only |
| E independent retest | Chat E revised report | **UNRUN / pending** | Old r1 FAIL remains historical |
| Public repository, production deployment, organiser submission | URLs and confirmation | **UNRUN** | None has been performed here |

The ZIP `G2_INTEGRATION_MANIFEST.json` hashes all packaged files except itself. The archive is verified before handoff. Do not infer production readiness from any PASS above.
