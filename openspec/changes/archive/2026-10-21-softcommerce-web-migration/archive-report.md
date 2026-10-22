# Archive Report: softcommerce-web-migration (Wave 1)

**Archive date**: 2026-10-21
**Mode**: hybrid (OpenSpec files + Engram)
**Repository**: `D:/Kiro Projects/patron-frontend-jona`, `main` at b55a437
**Archive status**: intentional-with-warnings. Specs merged. Folder move NOT performed by the archive executor (see "Pending operation"). Review gate: `disabled/unmanaged` (no review receipt).

## Final State at Close

Sources are ranked per the sdd-archive Final-State Authority. Numbers come from the highest-ranked source that covers them.

| Item | Final state | Source (rank) |
|------|-------------|---------------|
| Tasks | 56/56 `[x]`, 0 unchecked. T1.6 and T3.4 closed after their PRs merged. The edit is a working-tree change to `tasks.md`, not yet committed. | `tasks.md` on disk (rank 2); launch prompt (rank 3) |
| Verify verdict | PASS WITH WARNINGS, 0 CRITICAL at verify time. Warnings since resolved (see below). | `verify-report` obs #594 (rank 4, snapshot, commit d4ca951) |
| Scenario coverage | At verify time 103 covered, 3 partial, 0 missing of 106. S-LOC-1 is now covered (spec text corrected, now matches the 5-seeded / 4-shown test), so 104 covered, 2 partial, 0 missing. | Launch prompt (rank 3) over obs #594 (rank 4) |
| Open partial scenarios | S-CRUD-4 and S-SHELL-8: the CRUD toolbar keyboard shortcuts are not bound, so the shortcut half of those scenarios is not exercised. Click-path denial is covered. | `verify-report` obs #594 (rank 4), not contradicted by a higher source |
| Gate at chain tip | 51 test files, 413 tests passing; typecheck exit 0; build exit 0. | Launch prompt (rank 3) over obs #594 (rank 4). Obs #572 (50 files / 390 tests) is a slice-10 snapshot and is superseded. |
| Warning fixes | Stale jona-ui 1.3.0 text and S-LOC-1 spec text fixed in commit 8e28b51. RUP uc-01/uc-02 role labels fixed in 8e28b51. uc-03, uc-04, class diagram, design.md and RUP README role alignment in 5db5e2f. | Launch prompt (rank 3); the spec text on disk was checked by this run |
| jona-ui pin | `1.4.0` exact. Confirmed in `web_ts/softcommerce/package.json`, `tasks.md` T1.1 (bumped from 1.3.0 in W1b-1, commit 04f0652), and spec R-CRUD-9 and S-CRUD-21 on disk. | Repository evidence (rank 1 and 2). Obs #566, #567, #568 still say 1.3.0; those are superseded snapshots. |
| Delivery | 15 chained PRs #1 to #15 merged in order into tracker `feat/softcommerce-w1`. Tracker PR #16 merged into `main` as b55a437. Tracker tree verified identical to chain tip before merge. | Launch prompt (rank 3), not independently verified by this run (no git access) |
| Review gate | Receipt-driven development disabled by the user (`gentle-ai review mode disable`, global off) before archive. No review receipt exists. No review artifacts were fabricated. | Launch prompt (rank 3). Not independently verified by this run. |

## Review Gate Record

- `reviewGate.delivery`: `disabled/unmanaged`
- `reviewGate.result`: not `allow`. No review governs this change.
- Engram `sdd/softcommerce-web-migration/review/{transaction,ledger,receipt,gate-context}`: none found. A search for `sdd/softcommerce-web-migration/review` returned no memories.
- Consequence: no approved terminal receipt is claimed. Archive proceeds under the `disabled/unmanaged` relaxation only.

## Task Completion Gate

Checked `openspec/changes/softcommerce-web-migration/tasks.md` in full before any spec sync. Result: 56 `[x]`, 0 `[ ]`. No archive-time stale-checkbox reconciliation was needed or performed.

## Specs Synced

No main specs existed under `openspec/specs/` before this archive. All six delta specs are ADDED capabilities (the proposal states "Modified Capabilities: None"). Each was copied to a new main spec. The only change is removing the delta-only ` (ADDED)` suffix from the H1 title. Requirement and scenario content is otherwise unchanged.

| Capability | Main spec path | Requirements | Scenarios |
|------------|----------------|--------------|-----------|
| softcommerce-mock-api | `openspec/specs/softcommerce-mock-api/spec.md` | 8 (R-MOCK-1 to R-MOCK-8) | 14 |
| softcommerce-auth-session | `openspec/specs/softcommerce-auth-session/spec.md` | 9 (R-AUTH-1 to R-AUTH-9) | 22 |
| softcommerce-shell-workspace | `openspec/specs/softcommerce-shell-workspace/spec.md` | 6 (R-SHELL-1 to R-SHELL-6) | 16 |
| softcommerce-crud-templates | `openspec/specs/softcommerce-crud-templates/spec.md` | 9 (R-CRUD-1 to R-CRUD-9) | 22 |
| softcommerce-localidad-catalog | `openspec/specs/softcommerce-localidad-catalog/spec.md` | 7 (R-LOC-1 to R-LOC-7) | 20 |
| softcommerce-gui-inventory | `openspec/specs/softcommerce-gui-inventory/spec.md` | 6 (R-INV-1 to R-INV-6) | 12 |

Total: 45 requirements, 106 scenarios.

## Pending Operation: Folder Move

The archive executor had no shell or move capability. A copy-based move would leave the active change in place and create a duplicate, so none was made.

The following is still pending:

1. Move `openspec/changes/softcommerce-web-migration/` to `openspec/changes/archive/2026-10-21-softcommerce-web-migration/`.
2. Create `openspec/changes/archive/` first if it is missing.
3. Keep every file, including `proposal.md`, `explore.md`, `design.md`, `tasks.md`, `specs/`, `apply-progress.md`, `verify-report.md`, `rup/` and `rup/diagrams/`.
4. Keep this `archive-report.md`. It was staged in the active folder so it moves with the rest.

Example (PowerShell, not git):
```
New-Item -ItemType Directory -Force "D:\Kiro Projects\patron-frontend-jona\openspec\changes\archive"
Move-Item -LiteralPath "D:\Kiro Projects\patron-frontend-jona\openspec\changes\softcommerce-web-migration" -Destination "D:\Kiro Projects\patron-frontend-jona\openspec\changes\archive\2026-10-21-softcommerce-web-migration"
```

After the move, re-check that `openspec/changes/softcommerce-web-migration/` no longer exists.

## Observation IDs (Traceability)

| Artifact | Engram ID | Topic key | Notes |
|----------|-----------|-----------|-------|
| proposal | #566 | `sdd/softcommerce-web-migration/proposal` | Still says jona-ui 1.3.0 (superseded, see pin row) |
| spec | #567 | `sdd/softcommerce-web-migration/spec` | Pre-correction summary. Current text is on disk in `specs/`. |
| design | #568 | `sdd/softcommerce-web-migration/design` | Rev 2. Says 1.3.0 (superseded). |
| tasks | #569 | `sdd/softcommerce-web-migration/tasks` | Summary mirror. Authoritative text is `tasks.md` (56/56 `[x]`). |
| verify-report | #594 | `sdd/softcommerce-web-migration/verify-report` | Snapshot at commit d4ca951. Warnings since resolved. |
| apply-progress | #572 | `sdd/softcommerce-web-migration/apply-progress` | Slice-10 snapshot (50 files / 390 tests). Superseded. |
| review transaction / ledger / receipt / gate-context | none | `sdd/softcommerce-web-migration/review/*` | Not present. Review disabled. |

## Open Follow-ups (not blockers)

1. CRUD toolbar keyboard shortcuts are unbound (S-CRUD-4, S-SHELL-8 shortcut half).
2. CascadeSelect shows no error on level-load failure.
3. Inventory `WAVE_RULES` leaves W4 (Ventas) empty; sales screens are in `view.formularios`.
4. uijona gaps: sidebar does not accept free content; JTableHead sort button is 44px; P2 mobile items.
5. Manual smoke of Localidad in mock and http modes was not run.
6. uc-04 collaboration edge 2.2 still leaves the UiCrudListView box. The label is correct and the layout is untouched.
7. Four tasks used mutation checks instead of a genuine RED: T9.6, T10.4, T10.5, T10.6.

## Risks and Notes

- Review gate was disabled by the user. No review evidence exists for this change.
- The executor did not run git. Delivery facts (PR numbers, merge order, b55a437, tree identity) are orchestrator-provided.
- Engram observations #566, #567 and #568 contain the 1.3.0 pin. Current repository evidence is 1.4.0. Those observations were not rewritten.
- The tasks.md working-tree edit is uncommitted and must be kept by the orchestrator's commit.
