# Delta for softcommerce-catalog-registry

Extends the declarative entry with child entries, row actions, the `password` / `textarea` / `lookup` kinds, search fields and company-parameter gates, and promotes the `usuarios` and `trabajadores` lookups to writable masters. R-REG-2 (entry contents) stays as promoted: this delta ADDS the new attributes and the kind list extension in new requirements instead of rewriting it. Marker legend: **[ASSUMPTION]**, **[DEVIATION]**, **[INFERRED]**. Numbering continues the promoted spec (R-REG-1..12, S-REG-1..19).

## ADDED Requirements

### R-REG-13 Extended kinds and attributes
In addition to the field kinds of R-REG-2 (`code`, `text`, `number`, `boolean`, `date`, `select`, `options`) a field MAY have kind `password`, `textarea` or `lookup` (softcommerce-crud-templates R-CRUD-17..19). A `password` field MUST declare `max` and MAY declare `confirm` (default true). A `textarea` MAY declare `rows` and `max`. A `lookup` MUST declare `source` (`{ catalog, where? }`, the same shape as a `select`), the `search` fields of the picker, its `columns`, its `filters` (R-LKP-2), and MAY declare `display` (the joined display key), `pickLabel` and the `dependsOn` parents of R-CRUD-12. A `lookup` MUST be validated as a ref like a `select` (R-REG-6). The extended kinds are available to the UI config, `formRegistry` and both mocks from the same entry (R-REG-1).

### R-REG-14 Child entries
An entry MAY declare `children`: a map from the child name (the nested route segment, R-MOCK-19) to a child entry with its own `fields`, `columns`, `refs`, `joins`, `unique` (R-MD-6, among active siblings), `validation`, `messages`, `removal` (`deactivate` or `delete`, R-MD-4), `entry` (`dialog` or `inline`, R-MD-3), `tab` (the register tab title, R-MD-1) and an optional `gate` (R-REG-17). A child MUST NOT declare its own `slug`, `menu`, `formId`, `scope` or permissions: it inherits the parent's (R-REG-19). A child field `name` MUST NOT collide with the parent's stored-only columns or with the reserved child keys (`id`, `estado`, `op`). A child MAY declare `store: { entry, key }` when it is a filtered view of another entry's storage section (Vehiculos over `vehiculos` keyed by `id_anexo_empresa_transportista`; Series over `usuario-correlativos` keyed by `id_usuario`): its rows live in that entry's section and its seeds stay with the owning entry. Other child seeds are declared inside the parent's seed rows under the child name **[ASSUMPTION]**. The consistency test of R-REG-3 MUST cover every child: UI config, HTTP mock and in-browser mock MUST expose the same child fields, required flags, max lengths, refs, unique keys, removal kind and joins; drift MUST fail the test naming the parent, the child and the field.

### R-REG-15 Row actions
An entry or a child MAY declare `actions`: a list of `{ id, label, placement, flag, enabledWhen, dialog?, kind, confirm? }` (softcommerce-row-actions R-ACT-1). `flag` MUST be one of the 13 permission flags; `enabledWhen` MUST name only known fields of the entry or its children and the register modes; `kind` is `deferred` or `immediate`. An `immediate` action MUST name its server action (R-MOCK-22). The templates MUST render actions from this declaration only.

### R-REG-16 Search declaration
An entry MAY declare `search`, the list of field names (or joined display keys) searched by the free-text `q` parameter (R-MOCK-20) and offered as picker filters. Every name MUST be a known field or join; the per-field contains filters of R-MOCK-9 MAY name any field or join of the entry.

### R-REG-17 Company-parameter gates
A field, a tab, a child or an action MAY declare `gate: { param, in? }`: it exists only when the session company parameter `param` is true (or, with `in`, equals one of the listed values). `param` MUST belong to the closed set of the `GET /v1/params` keys (R-MOCK-24). A gated element MUST be absent (not hidden) from the UI when the gate is off, MUST be neither validated nor required, and the server MUST ignore a body value for a gated-off field and answer 404 with the error shape to nested routes of a gated-off child.

### R-REG-18 Promoted lookups
The entries `usuarios` and `trabajadores` (promoted in W2 as read-only lookups, R-REG-11) MUST become writable masters with their menu leaf and formId (`mi_usuario`, `miTrabajador`), declaring the modes of softcommerce-masters R-MST-1. They MUST keep their `slug`, `idKey`, `optionLabel` (`nombre`), the lookup row shape and the filters of R-MOCK-16, so every W2 consumer (UsuarioCorrelativo, TrabajadorPuntoVenta) stays unchanged. The `usuarios` entry is backed by the `users.json` store that the login also reads (softcommerce-auth-session R-AUTH-10): the W2 `project: 'users'` projection MUST be replaced by a read-write backing of that store (still tenant-filtered, still no password key, R-MOCK-23) **[ASSUMPTION]** with no copy of its rows; the `trabajadores` seed grows to the full master fields. The R-REG-11 rule "read-only entries MUST NOT appear in the menu" no longer applies to them.

### R-REG-19 Menu, permissions and custom screens
Every entry with a `menu` node MUST appear in `menu.json` with its `formId` and be granted the 13 flags in `permissions.json` (R-REG-9); children and actions MUST NOT have their own node or formId and MUST be gated by the parent's flags (R-ACT-2). The two Wave 3 screens that are not registry catalogs, `mi_SeguridadPerfil` (perfil permissions) and `miAccionSocio` (Socio acciones, a custom resource, R-MOCK-26), MUST be listed in a custom-screen list read by the same consistency test: each MUST appear in `menu.json` with its `formId` and in `permissions.json`. The test MUST fail naming the `formId` when any of them disagrees.

### R-REG-20 Registry validation at load (Wave 3)
In addition to R-REG-4 the registry MUST fail fast at load, before any request, when: a child `unique`, `refs`, `joins`, `columns` or `validation` names an unknown field; a child `removal` or `entry` is not one of its closed values; two children of an entry share a name or a child name collides with a parent field or a reserved route word (`actions`); a `lookup` has no `source` or no `search` fields, or its source is not a registered catalog; a `password` has no `max`; a `gate.param` is not a known params key; an action `flag` is not one of the 13 flags, or its `enabledWhen` names an unknown field; a `search` name is unknown; a lookup or select chain is cyclic.

### R-REG-21 Named rules in Wave 3
The closed set of named pure rules (R-REG-2) MUST be extended only with: `docIdentidad` applied also to Banco, Transportista, Cliente and Proveedor (the Wave 2 rule with its params, unchanged, plus `entity` for the message wording, R-MST-2); `activacion` (the single-active-row rule and derived `estado` of R-ANX-5 / R-ACT-5); `padron` (the same-padrón and incompatibility rules of R-ANX-7); and the lookup filters `ubigeoChildren` and `ubigeoHasActive` reused by the Cliente direcciones. Each MUST be a pure function of its inputs, run by both mocks and, for client-side hooks, by the UI, with identical results.

## ADDED Scenarios

**S-REG-20 child entry drives nested routes and grid** — Given an entry declaring a `contactos` child with its fields, When the app starts, Then `GET /v1/{slug}/{id}/contactos`, the child dialog and the grid work against both sources with no other code change, and the child inherits the parent's formId and permissions.

**S-REG-21 child consistency** — Given a child whose `max` differs between the UI config and the HTTP mock, When the consistency test runs, Then it fails naming the parent, the child and the field.

**S-REG-22 child validation at load** — Given a child `unique` naming a missing field, or a child named `actions`, or two children with the same name, When the registry loads, Then it throws a configuration error naming the entry and the child.

**S-REG-23 lookup validation at load** — Given a `lookup` whose source is not a registered catalog, or without `search` fields, When the registry loads, Then it throws a configuration error naming the field.

**S-REG-24 password and gate validation at load** — Given a `password` without `max`, or a `gate.param` that is not a params key, When the registry loads, Then it throws a configuration error naming the field.

**S-REG-25 gate removes the element** — Given a child gated by `IS_CLIENTE_SUSTITUTO` and the parameter false, Then the tab is absent from the register, a nested `POST` answers 404 and a body value for it is ignored; with the parameter true it works.

**S-REG-26 action flag validation** — Given an action with `flag: 'foo'`, When the registry loads, Then it throws a configuration error; Given `flag: 'modify'`, Then the action renders gated by the parent's `modify`.

**S-REG-27 custom screens in the consistency test** — Given `mi_SeguridadPerfil` missing in `permissions.json`, When the consistency test runs, Then it fails naming the `formId`; likewise for `miAccionSocio` and for a master with a `menu` node missing in `menu.json`.

**S-REG-28 promoted lookups** — Given the `usuarios` and `trabajadores` entries, Then both are writable with their menu leaf, `GET /v1/lookups/usuarios|trabajadores` keep the W2 shape, the W2 `usuario-correlativos` and `trabajador-punto-venta` suites pass unchanged, and no `usuarios` response carries a password key.

**S-REG-30 store-backed child** — Given the `vehiculos` child of `transportistas` with `store: { entry: 'vehiculos', key: 'id_anexo_empresa_transportista' }`, Then no seed of its own exists, the nested list equals the owning entry's rows filtered by the key, and a write through either route is visible in the other.

**S-REG-29 W1 / W2 unchanged** — Given the W1 and W2 suites (S-REG-1..19, S-LOC-1..20 and the W2 catalog suites), When run against the registry with the Wave 3 additions, Then they pass unchanged except the documented amendments of R-MOCK-15 / R-REF-11 (usuarios and trabajadores no longer read-only).
