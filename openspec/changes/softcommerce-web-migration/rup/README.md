# RUP artifacts — softcommerce-web-migration (wave 1)

This folder adds the RUP artifacts that SDD does not produce: a use-case model, use-case specifications, and robustness, collaboration and sequence diagrams per use case. Nothing in `proposal.md`, `design.md`, `specs/` or `tasks.md` is redone. The use cases organize and trace the existing `S-*` scenarios.

Wave 1 has no real backend. The diagrams model the React frontend (JONA view units + service seam) and the Node mock server as an external system. Frontend stereotypes (`«view»`, `«visual»`, `«impl»`, `«template»`, `«composer»`, `«service-contract»`, `«service-http»`, `«service-mock»`, `«mock-server»`, `«domain»`, `«session»`) are an explicit extension of the JONAxMPC vocabulary, declared in every legend. No frontend or mock-server element is drawn as controller, process, service or repository.

## RUP ↔ SDD phase mapping

| RUP phase | SDD phases | Artifacts (existing → added here) | Exit milestone |
|---|---|---|---|
| Inception | explore + proposal | `explore.md`, `proposal.md` (vision, scope, risks, open questions) → `uc-model.md` (actors, use-case list) | Lifecycle Objectives: scope and proposal accepted |
| Elaboration | spec + design (+ tasks) | `specs/*/spec.md` (106 scenarios), `design.md`, `tasks.md` → use-case specs, robustness/collaboration/sequence diagrams, JONA class view, traceability matrix | Lifecycle Architecture: seam, templates and mock contract fixed; every user scenario traced to a use case |
| Construction | apply + verify, one iteration per chained PR | 11 PRs W1a-1 … W1c-5 (see iteration plan) | Initial Operational Capability: all slices merged into `feat/softcommerce-w1`, gates green |
| Transition | archive | sdd-archive syncs delta specs; tracker PR merged to `main`; manual smoke in both `VITE_API_MODE` values | Product Release (demo-grade, per proposal assumption) |

## Iteration plan (Construction)

Each chained PR is one Construction iteration. "Use cases realized" lists the use cases whose scenarios the iteration's tasks own (from the `tasks.md` coverage table). Supporting = scenarios listed under supporting requirements.

| Iter. | PR / slice | Scope | Use cases realized | UC scenarios | Supporting scenarios | Tasks owning scenarios |
|---|---|---|---|---|---|---|
| 1 | W1a-1 | scaffold + mock core | — (supporting only: mock core rules and pinned dependency; enables CU-01..CU-04) | 0 | 7 | T1.1, T1.2, T1.3, T1.4 |
| 2 | W1a-2 | mock HTTP | — (supporting only: mock HTTP surface; enables CU-01..CU-04 in http mode) | 0 | 8 | T2.1, T2.2, T2.3 |
| 3 | W1a-3 | service seam | CU-01 | 5 | 0 | T3.1, T3.2 |
| 4 | W1a-4 | auth UI | CU-01, CU-02 | 16 | 0 | T4.1, T4.2, T4.3, T4.4 |
| 5 | W1b-1 | shell domain | CU-03 | 4 | 0 | T5.1, T5.2, T5.3 |
| 6 | W1b-2 | shell UI | CU-02, CU-03 | 12 | 0 | T6.1, T6.2, T6.3, T6.4, T6.5 |
| 7 | W1c-1 | list foundations | CU-04 | 7 | 0 | T7.1, T7.2, T7.4 |
| 8 | W1c-2 | list view | CU-04 | 1 | 0 | T8.3 |
| 9 | W1c-3 | register template | CU-04 | 14 | 1 | T9.2, T9.3, T9.4, T9.5, T9.6, T9.7 |
| 10 | W1c-4 | Localidad | CU-04, CU-04a, CU-04b | 19 | 0 | T10.2, T10.3, T10.4, T10.5, T10.6 |
| 11 | W1c-5 | inventory | — (supporting only: inventory tooling) | 0 | 12 | T11.1, T11.2, T11.3, T11.4, T11.5 |

Iterations 3–4 complete CU-01 and CU-02 (CU-02's S-AUTH-17 lands in iteration 6 with the shell header). Iterations 5–6 complete CU-03. Iterations 7–10 complete CU-04 and its includes.

## Artifact index

| Artifact | File | Diagrams |
|---|---|---|
| Use-case model | [uc-model.md](uc-model.md) | [uc-model.drawio](diagrams/uc-model.drawio) |
| CU-01 Iniciar sesión (tenant + credenciales) | [uc-01-iniciar-sesion.md](uc-01-iniciar-sesion.md) | [robustez](diagrams/uc-01-robustez.drawio) · [colaboración](diagrams/uc-01-colaboracion.drawio) · [secuencia](diagrams/uc-01-secuencia.drawio) |
| CU-02 Seleccionar contexto de trabajo (empresa, punto de venta, período) | [uc-02-seleccionar-contexto.md](uc-02-seleccionar-contexto.md) | [robustez](diagrams/uc-02-robustez.drawio) · [colaboración](diagrams/uc-02-colaboracion.drawio) · [secuencia](diagrams/uc-02-secuencia.drawio) |
| CU-03 Navegar menú y abrir formulario (menú, permisos, pestañas) | [uc-03-navegar-menu-abrir-formulario.md](uc-03-navegar-menu-abrir-formulario.md) | [robustez](diagrams/uc-03-robustez.drawio) · [colaboración](diagrams/uc-03-colaboracion.drawio) · [secuencia](diagrams/uc-03-secuencia.drawio) |
| CU-04 Mantener Localidad | [uc-04-mantener-localidad.md](uc-04-mantener-localidad.md) | [robustez](diagrams/uc-04-robustez.drawio) · [colaboración](diagrams/uc-04-colaboracion.drawio) · [secuencia](diagrams/uc-04-secuencia.drawio) |
| JONA frontend class view (unit + service seam) | — | [jona-frontend-clases.drawio](diagrams/jona-frontend-clases.drawio) |

All `.drawio` files are uncompressed mxGraph XML with an embedded "Leyenda" swimlane. Open them in app.diagrams.net or the draw.io desktop app.

## Traceability matrix: use case → scenario → task

### CU-01 Iniciar sesión (tenant + credenciales)

Spec: [uc-01-iniciar-sesion.md](uc-01-iniciar-sesion.md)

| Scenario | Title | Capability | Task | Iteration |
|---|---|---|---|---|
| S-AUTH-1 | composer picks mock | `softcommerce-auth-session` | T3.2 | W1a-3 |
| S-AUTH-2 | composer picks http | `softcommerce-auth-session` | T3.2 | W1a-3 |
| S-AUTH-3 | composer invalid mode | `softcommerce-auth-session` | T3.2 | W1a-3 |
| S-AUTH-4 | composer http without URL | `softcommerce-auth-session` | T3.2 | W1a-3 |
| S-AUTH-5 | empty fields | `softcommerce-auth-session` | T4.3 | W1a-4 |
| S-AUTH-6 | disabled user | `softcommerce-auth-session` | T4.3 | W1a-4 |
| S-AUTH-7 | no desktop access | `softcommerce-auth-session` | T4.3 | W1a-4 |
| S-AUTH-8 | bad credentials | `softcommerce-auth-session` | T4.3 | W1a-4 |
| S-AUTH-18 | logout | `softcommerce-auth-session` | T4.2 | W1a-4 |
| S-AUTH-19 | guard | `softcommerce-auth-session` | T4.2 | W1a-4 |
| S-AUTH-20 | Enter submits | `softcommerce-auth-session` | T4.3 | W1a-4 |
| S-AUTH-21 | server error | `softcommerce-auth-session` | T4.3 | W1a-4 |
| S-AUTH-22 | tenant header | `softcommerce-auth-session` | T3.1 | W1a-3 |

### CU-02 Seleccionar contexto de trabajo (empresa, punto de venta, período)

Spec: [uc-02-seleccionar-contexto.md](uc-02-seleccionar-contexto.md)

| Scenario | Title | Capability | Task | Iteration |
|---|---|---|---|---|
| S-AUTH-9 | valid login to step 2 | `softcommerce-auth-session` | T4.4 | W1a-4 |
| S-AUTH-10 | punto de venta filtered | `softcommerce-auth-session` | T4.4 | W1a-4 |
| S-AUTH-11 | period: invalid date | `softcommerce-auth-session` | T4.1 | W1a-4 |
| S-AUTH-12 | period: before INICIO_ACTIVIDADES | `softcommerce-auth-session` | T4.1 | W1a-4 |
| S-AUTH-13 | period: fin before inicio | `softcommerce-auth-session` | T4.1 | W1a-4 |
| S-AUTH-14 | period: different accounting year | `softcommerce-auth-session` | T4.1 | W1a-4 |
| S-AUTH-15 | period: boundary valid | `softcommerce-auth-session` | T4.1 | W1a-4 |
| S-AUTH-16 | successful session | `softcommerce-auth-session` | T4.4 | W1a-4 |
| S-AUTH-17 | period immutable | `softcommerce-auth-session` | T6.5 | W1b-2 |

### CU-03 Navegar menú y abrir formulario (menú, permisos, pestañas)

Spec: [uc-03-navegar-menu-abrir-formulario.md](uc-03-navegar-menu-abrir-formulario.md)

| Scenario | Title | Capability | Task | Iteration |
|---|---|---|---|---|
| S-SHELL-1 | menu renders | `softcommerce-shell-workspace` | T5.1 | W1b-1 |
| S-SHELL-2 | menu from seed swap | `softcommerce-shell-workspace` | T5.1 | W1b-1 |
| S-SHELL-3 | submenu toggle | `softcommerce-shell-workspace` | T5.2 | W1b-1 |
| S-SHELL-4 | leaf opens tab | `softcommerce-shell-workspace` | T6.3 | W1b-2 |
| S-SHELL-5 | unknown leaf | `softcommerce-shell-workspace` | T6.4 | W1b-2 |
| S-SHELL-6 | menu error | `softcommerce-shell-workspace` | T6.4 | W1b-2 |
| S-SHELL-7 | permissions loaded | `softcommerce-shell-workspace` | T6.2 | W1b-2 |
| S-SHELL-9 | permission fetch fails | `softcommerce-shell-workspace` | T6.2 | W1b-2 |
| S-SHELL-10 | re-select open tab | `softcommerce-shell-workspace` | T6.3 | W1b-2 |
| S-SHELL-11 | two forms two tabs | `softcommerce-shell-workspace` | T6.3 | W1b-2 |
| S-SHELL-12 | close active tab | `softcommerce-shell-workspace` | T5.3 | W1b-1 |
| S-SHELL-13 | close last tab | `softcommerce-shell-workspace` | T6.3 | W1b-2 |
| S-SHELL-14 | reopen after close | `softcommerce-shell-workspace` | T6.3 | W1b-2 |
| S-SHELL-15 | header | `softcommerce-shell-workspace` | T6.5 | W1b-2 |
| S-SHELL-16 | Esc closes dialog | `softcommerce-shell-workspace` | T6.1 | W1b-2 |

### CU-04 Mantener Localidad

Spec: [uc-04-mantener-localidad.md](uc-04-mantener-localidad.md)

| Scenario | Title | Capability | Task | Iteration |
|---|---|---|---|---|
| S-SHELL-8 | permission denied action | `softcommerce-shell-workspace` | T7.4 | W1c-1 |
| S-CRUD-1 | list states | `softcommerce-crud-templates` | T8.3 | W1c-2 |
| S-CRUD-2 | toolbar by permissions | `softcommerce-crud-templates` | T7.4 | W1c-1 |
| S-CRUD-3 | row-dependent actions | `softcommerce-crud-templates` | T7.4 | W1c-1 |
| S-CRUD-4 | permission-denied activation | `softcommerce-crud-templates` | T7.4 | W1c-1 |
| S-CRUD-5 | filter | `softcommerce-crud-templates` | T7.2 | W1c-1 |
| S-CRUD-6 | sort | `softcommerce-crud-templates` | T7.2 | W1c-1 |
| S-CRUD-7 | double-click details | `softcommerce-crud-templates` | T9.7 | W1c-3 |
| S-CRUD-8 | INSERT | `softcommerce-crud-templates` | T9.3 | W1c-3 |
| S-CRUD-9 | UPDATE | `softcommerce-crud-templates` | T9.3 | W1c-3 |
| S-CRUD-10 | DELETE | `softcommerce-crud-templates` | T9.3 | W1c-3 |
| S-CRUD-11 | DETAIL | `softcommerce-crud-templates` | T9.5 | W1c-3 |
| S-CRUD-12 | CLONE | `softcommerce-crud-templates` | T9.3 | W1c-3 |
| S-CRUD-13 | required missing | `softcommerce-crud-templates` | T9.4 | W1c-3 |
| S-CRUD-14 | max length | `softcommerce-crud-templates` | T9.2 | W1c-3 |
| S-CRUD-15 | uppercase | `softcommerce-crud-templates` | T9.2 | W1c-3 |
| S-CRUD-16 | confirm cancelled | `softcommerce-crud-templates` | T9.3 | W1c-3 |
| S-CRUD-17 | server error | `softcommerce-crud-templates` | T9.3 | W1c-3 |
| S-CRUD-18 | Enter submits | `softcommerce-crud-templates` | T9.5 | W1c-3 |
| S-CRUD-19 | Esc closes | `softcommerce-crud-templates` | T9.5 | W1c-3 |
| S-CRUD-20 | lookup load failure | `softcommerce-crud-templates` | T9.6 | W1c-3 |
| S-LOC-1 | list columns | `softcommerce-localidad-catalog` | T10.3 | W1c-4 |
| S-LOC-2 | INSERT happy path | `softcommerce-localidad-catalog` | T10.4 | W1c-4 |
| S-LOC-4 | descripcion limit | `softcommerce-localidad-catalog` | T10.3 | W1c-4 |
| S-LOC-12 | UPDATE | `softcommerce-localidad-catalog` | T10.4 | W1c-4 |
| S-LOC-13 | DELETE logical | `softcommerce-localidad-catalog` | T10.4 | W1c-4 |
| S-LOC-14 | DELETE denied | `softcommerce-localidad-catalog` | T10.4 | W1c-4 |
| S-LOC-15 | DETAIL | `softcommerce-localidad-catalog` | T10.4 | W1c-4 |
| S-LOC-16 | CLONE | `softcommerce-localidad-catalog` | T10.4 | W1c-4 |
| S-LOC-17 | no physical delete | `softcommerce-localidad-catalog` | T10.5 | W1c-4 |
| S-LOC-18 | composer mock mode | `softcommerce-localidad-catalog` | T10.6 | W1c-4 |
| S-LOC-19 | composer http mode | `softcommerce-localidad-catalog` | T10.6 | W1c-4 |
| S-LOC-20 | composer invalid config | `softcommerce-localidad-catalog` | T7.1 | W1c-1 |

### CU-04a Seleccionar Ubigeo en cascada («include» de CU-04)

Spec: [uc-04-mantener-localidad.md](uc-04-mantener-localidad.md#cu-04a-seleccionar-ubigeo-en-cascada-include)

| Scenario | Title | Capability | Task | Iteration |
|---|---|---|---|---|
| S-LOC-5 | ubigeo required | `softcommerce-localidad-catalog` | T10.3 | W1c-4 |
| S-LOC-6 | initial cascade | `softcommerce-localidad-catalog` | T10.2 | W1c-4 |
| S-LOC-7 | cascade reset on departamento | `softcommerce-localidad-catalog` | T10.2 | W1c-4 |
| S-LOC-8 | cascade reset on provincia | `softcommerce-localidad-catalog` | T10.2 | W1c-4 |
| S-LOC-9 | distrito change | `softcommerce-localidad-catalog` | T10.2 | W1c-4 |
| S-LOC-10 | stale response ignored | `softcommerce-localidad-catalog` | T10.2 | W1c-4 |
| S-LOC-11 | UPDATE restores ubigeo | `softcommerce-localidad-catalog` | T10.4 | W1c-4 |

### CU-04b Seleccionar Empresa («include» de CU-04)

Spec: [uc-04-mantener-localidad.md](uc-04-mantener-localidad.md#cu-04b-seleccionar-empresa-include)

| Scenario | Title | Capability | Task | Iteration |
|---|---|---|---|---|
| S-LOC-3 | empresa required | `softcommerce-localidad-catalog` | T10.3 | W1c-4 |

### Supporting / non-use-case requirements

**Mock API infrastructure (`softcommerce-mock-api`).** Contract, error shape, tenant gate, correlation id, seed and reset of the mock server. No user goal: they are the system actor's (Servidor mock (API)) obligations that CU-01..CU-04 rely on.

**GUI inventory script (`softcommerce-gui-inventory`).** Developer tooling that scans the Java tree to plan later waves. No end-user actor and no UI.

**Build constraint.** Pins `jona-ui` to `1.3.0`. A dependency rule checked on `package.json`, not user behavior.

**Template extensibility.** A second minimal config renders with no new template code. A maintainability quality attribute of the CRUD templates, not an operator goal (it proves CU-04's template is reusable).

| Scenario | Title | Capability | Supports | Task | Iteration |
|---|---|---|---|---|---|
| S-INV-1 | lists a screen | `softcommerce-gui-inventory` | — (tooling) | T11.1 | W1c-5 |
| S-INV-2 | multi-line extends | `softcommerce-gui-inventory` | — (tooling) | T11.1 | W1c-5 |
| S-INV-3 | base classes excluded | `softcommerce-gui-inventory` | — (tooling) | T11.2 | W1c-5 |
| S-INV-4 | renderers excluded | `softcommerce-gui-inventory` | — (tooling) | T11.2 | W1c-5 |
| S-INV-5 | tablemodel and conta tablas excluded | `softcommerce-gui-inventory` | — (tooling) | T11.2 | W1c-5 |
| S-INV-6 | combo models excluded | `softcommerce-gui-inventory` | — (tooling) | T11.2 | W1c-5 |
| S-INV-7 | encoding | `softcommerce-gui-inventory` | — (tooling) | T11.4 | W1c-5 |
| S-INV-8 | category mapping | `softcommerce-gui-inventory` | — (tooling) | T11.3 | W1c-5 |
| S-INV-9 | deterministic | `softcommerce-gui-inventory` | — (tooling) | T11.4 | W1c-5 |
| S-INV-10 | missing source root | `softcommerce-gui-inventory` | — (tooling) | T11.5 | W1c-5 |
| S-INV-11 | unreadable file | `softcommerce-gui-inventory` | — (tooling) | T11.5 | W1c-5 |
| S-INV-12 | read-only | `softcommerce-gui-inventory` | — (tooling) | T11.5 | W1c-5 |
| S-MOCK-1 | correlation echoed | `softcommerce-mock-api` | all | T2.1 | W1a-2 |
| S-MOCK-2 | correlation generated | `softcommerce-mock-api` | all | T2.1 | W1a-2 |
| S-MOCK-3 | error shape | `softcommerce-mock-api` | CU-04 | T2.1 | W1a-2 |
| S-MOCK-4 | missing tenant | `softcommerce-mock-api` | CU-03 | T2.1 | W1a-2 |
| S-MOCK-5 | unknown tenant | `softcommerce-mock-api` | all | T2.1 | W1a-2 |
| S-MOCK-6 | session options public | `softcommerce-mock-api` | CU-01 | T2.1 | W1a-2 |
| S-MOCK-7 | list envelope | `softcommerce-mock-api` | CU-04 | T1.3 | W1a-1 |
| S-MOCK-8 | ubigeo children | `softcommerce-mock-api` | CU-04a | T1.4 | W1a-1 |
| S-MOCK-9 | ubigeo bad parent | `softcommerce-mock-api` | CU-04a | T1.4 | W1a-1 |
| S-MOCK-10 | logical delete | `softcommerce-mock-api` | CU-04 | T1.3 | W1a-1 |
| S-MOCK-11 | no physical delete | `softcommerce-mock-api` | CU-04 | T2.2 | W1a-2 |
| S-MOCK-12 | validation error | `softcommerce-mock-api` | CU-04 | T1.3 | W1a-1 |
| S-MOCK-13 | seed isolation | `softcommerce-mock-api` | CU-03 | T2.3 | W1a-2 |
| S-MOCK-14 | reset | `softcommerce-mock-api` | all (tests) | T1.2 | W1a-1 |
| S-CRUD-21 | pinned dependency | `softcommerce-crud-templates` | all | T1.1 | W1a-1 |
| S-CRUD-22 | config-only catalog | `softcommerce-crud-templates` | CU-04 | T9.7 | W1c-3 |

## Coverage

| Group | Scenarios |
|---|---|
| CU-01 | 13 |
| CU-02 | 9 |
| CU-03 | 15 |
| CU-04 | 33 |
| CU-04a | 7 |
| CU-04b | 1 |
| **Mapped to use cases** | **78** |
| Supporting: mock API | 14 |
| Supporting: GUI inventory | 12 |
| Supporting: CRUD build/extensibility (S-CRUD-21, S-CRUD-22) | 2 |
| **Supporting total** | **28** |
| **Total in specs** | **106** (each listed exactly once above; unmapped: 0) |

User-facing capabilities (`auth-session`, `shell-workspace`, `crud-templates`, `localidad-catalog`) hold 80 scenarios; 78 map to a use case and 2 (S-CRUD-21, S-CRUD-22) are justified as supporting.

## Naming notes and deviations

- Composer: `design.md` names it `serviceComposer` (with `useServices()` and `lazyService`). The diagrams use that name; `appServicesComposer` does not appear in the design.
- Impl hooks: `design.md` fixes `useUiCrudListImpl(config)`; `tasks.md` fixes the files `UiLoginImpl.ts`, `UiCrudRegisterImpl`, `views/uicontexto/*` and `views/uishell/*`. The hook names `useUiLoginImpl`, `useUiContextoImpl`, `useUiShellImpl` and `useUiCrudRegisterImpl` follow the same `use<File>` convention (as in codex `useUiIniciarSesionImpl`). The view files `UiContextoView`, `UiShellView` and `UiCrudRegisterView` follow the five-file unit that T4.3/T4.4 fix for login and context (`Inter`, `Impl`, `View`, entry, `index`). Rename them in the diagrams if apply chooses differently.
- Template: wave 1 file lists have no separate `*TemplateModel` file. The class view shows the template role where the design puts it: `useUiCrudListImpl(config)` is the override point that a wave-3 Impl wraps.
- Seam reading: in every collaboration diagram a «service-contract» node is a dispatch point (a TS interface with no runtime). Returns go from the implementation back to the calling Impl, labeled with the type.
- Sequence diagrams show http mode; the mock branch (suffix `b` in collaboration) is noted on each one.
- Function names inside `period.ts` are not fixed by the design, so the diagrams name the rules, not functions.
