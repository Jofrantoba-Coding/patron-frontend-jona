# Apply Progress: softcommerce-web-migration

## Slice 1 (W1a-1) - branch `feat/softcommerce-w1a-1-scaffold-mock-core`

Mode: Strict TDD. Status: T1.0-T1.5 done (T1.6 gate/commit/PR left to the orchestrator). Gate (from `web_ts/softcommerce`): `npm test` 6 files / 51 tests passed; `npm run typecheck` exit 0 (also proven to fail on a seeded type error in both `src/` and `mock-server/core/*.js`); `npm run build` OK (29 modules).

### TDD Cycle Evidence
| Task | Test file | Layer | Safety net | RED observed | GREEN | Triangulate | Refactor |
|------|-----------|-------|------------|--------------|-------|-------------|----------|
| T1.1 | `test/pinned-deps.spec.ts` | Unit (node) | N/A (new) | 2/2 failed with `jona-ui` as `^1.3.0` and ranged deps | 2/2 pass after exact pins | 2 cases (jona-ui; all deps exact) | none |
| T1.2 | `mock-server/core/{store,errors}.spec.ts` | Unit | N/A (new) | suites failed: `./errors.js` / `./store.js` not found | 10/10 | reset (create, edit, delete), tenant isolation, seed immutability, unknown tenant | JSDoc types |
| T1.3 | `mock-server/core/catalog.spec.ts` | Unit | N/A (new) | suite failed: `./catalog.js` not found | 17/17 | paging, defaults/clamp, invalid paging, inactive, display names, filter, tenant isolation, CRUD, 422 | validators extracted to `validators.js`, 27/27 still green |
| T1.4 | `mock-server/core/ubigeo.spec.ts` | Unit | N/A (new) | suite failed: `./ubigeo.js` not found | 6/6 | 3 levels, unknown, malformed, distrito | simplified level derivation, still green |
| T1.5 | `mock-server/core/auth.spec.ts` | Unit | N/A (new) | suite failed: `./auth.js` not found | 16/16 | 401/403 x2, tenant membership, 13 flags, unknown form, partial seed, lookups | none |

### Work Unit Evidence
| Evidence | Value |
|---|---|
| Focused test command | `npx vitest run mock-server/core test/pinned-deps.spec.ts`: 6 files, 51 tests passed |
| Runtime harness | `npm run build` (empty app builds, 29 modules). Mock HTTP harness N/A: no server until slice 2 |
| Rollback boundary | `web_ts/softcommerce/**` only |

### Files (lines; package-lock.json 3221 excluded)
Total excluding lockfile: 1200 lines (exceeds the 800 budget; see risks).
