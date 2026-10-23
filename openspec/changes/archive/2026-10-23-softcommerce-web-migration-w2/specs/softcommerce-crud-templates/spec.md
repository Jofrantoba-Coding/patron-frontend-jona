# Delta for softcommerce-crud-templates

Adds the field kinds G1-G8, the formatted and joined columns (G13), the read-only server code (G14) and the mapping of server rule errors to fields. Existing requirement ids are kept; new ones continue at R-CRUD-11 and S-CRUD-24. No requirement is removed or renumbered.

## ADDED Requirements

### R-CRUD-11 Field kinds
A field config MUST support these kinds, with typed wire payloads (form state stays string-based and is converted by a per-kind codec at the boundary): `text` (with `max`, or `maxWhen` / `minLenWhen` when the length depends on another field, and `compose` when the value is the join of other fields); `code` (R-CRUD-14); `number` with `scale` (0 = integer, digits only, `max` digits, a value range through `range: { min, max }` and its `messages.range`; scale > 0 = decimal with input pattern `-?[0-9]*(\.[0-9]*)?`, where `scale` only marks the field as decimal and caps no precision, with optional `min` / `exclusiveMin`; an edit that no longer matches the pattern is ignored whole; a complete decimal of at most 15 significant digits is sent as a number, anything else stays the string so the rules judge it; a plain integer is sent as a number and a padded one such as `hora` `05` stays the padded string); `boolean` (checkbox or switch, payload boolean); `date` (masked `dd/MM/yyyy`, payload ISO `yyyy-MM-dd`, optional `min`, `notFuture`, `afterField: <field>`, default today); `select` over a catalog (`source` with optional static `where`, value = id, placeholder `--- Seleccione ---`, options from `GET /v1/lookups/{slug}`; optional `defaultOption: 'first'` selects the first option after each load or parent change); `options` over a static list (select or radio group, value = option code). A blank required `select`, `options` or `date`, an unparsable date and a `number` outside its range MUST block submit with a per-field error. Wave 1 `text`, `select` over `empresas` and the ubigeo `cascade` MUST keep working unchanged.

### R-CRUD-12 Dependent selects
Any `select` MAY declare `dependsOn`, a list of parents `{ field, filterKey }` (several parents are allowed, for example UsuarioCorrelativo tipo de documento by punto de venta). The child MUST be disabled and empty until all its parents have a value (INSERT, UPDATE and CLONE only), MUST reload its options sending each parent value as its `filterKey` (indirect keys are resolved server-side), MUST clear its value on every parent change (also through `clearsOnChange` for non-select fields), and MUST clear and reload the whole sub-chain below a changed or cleared level. In UPDATE, DELETE, DETAIL and CLONE every level MUST be restored from the record with its options loaded. A response for a superseded parent value MUST be ignored. Chains of any depth and several independent chains in one form MUST work. The Wave 1 ubigeo cascade MUST be re-implemented on this mechanism: `CascadeSelect` is N chained nodes of the shared dependent engine (filter key `parent`) with the same exports, props and behavior, and gains an optional static `filter` (sent as the second argument of `loadChildren` only when given). A registry `select` over `ubigeo` renders as that cascade (the UI field stays `kind: 'cascade'`); it MAY declare `transient: true` (no level travels, the leaf included), `restoreFrom { field, prefixLen }` on the cascade itself (the form rebuilds the levels from a ubigeo code the record carries, cut to `prefixLen`), and a static `filter` such as `{ has: 'zonas' }`. A cascade MAY be the parent of another select (ZonaDistancia zona); an optional cascade does not block it.

### R-CRUD-13 Conditional fields
A field MAY declare `visibleWhen`, `enabledWhen` and `requiredWhen` as `{ field, in: [...] }` over another field's value, evaluated by the same predicate evaluator as the server. A hidden or disabled field MUST NOT be validated; when hidden the UI MUST send `null` instead of its typed value (the server stores an empty string), and its error state MUST be cleared. Re-showing a field MUST NOT restore a value that was cleared: an edit empties every conditional field it just hid, with its error. A disabled field is shown read-only. The client blocks submit on a blank `requiredWhen` field only when the entry's declared validation order places no server-only step (unique, ref) before it; otherwise the server reports it after the passing step (Correlativo ticket fields, R-REF-8). Rule-driven state (the `docIdentidad` rule) applies the same way through one shared `fieldState`.

### R-CRUD-14 Read-only server code
The `code` field of a coded catalog MUST be shown read-only in UPDATE, DELETE and DETAIL, hidden in INSERT, and cleared (hidden) in CLONE. It MUST never be sent in a create payload and MUST NOT be editable by keyboard or paste.

### R-CRUD-15 Input normalization and defaults
A field MUST support config `normalize`, a list of `upper`, `lower`, `digits` and `padLeft:n` (`padLeft` applied on blur to non-empty values; the same normalization also runs on the server), `default` (a value, `today`, or a per-mode map; a per-mode default overrides the cloned value, for example TipoCambio CLONE sets today), `blankToDefault` on blur, and `readOnlyOn` (a list of modes). The shared `estado` preset is `default {INSERT: true}` with `readOnlyOn [INSERT, CLONE, DETAIL, DELETE]`, so UPDATE is editable and CLONE copies the source value (Socio uses all modes). Normalization MUST apply to typed input, pasted input and prefilled values.

### R-CRUD-16 Mode capability
The config MAY restrict the supported modes. Toolbar actions for unsupported modes MUST NOT be rendered (not merely disabled), their shortcuts MUST NOT fire, and double-click MUST honor only the supported modes.

## MODIFIED Requirements

### R-CRUD-1 List template
Given a config, the list template MUST render a toolbar, a filter input, a sortable paginated table, loading/empty/error states. Double-clicking a row MUST open the register in DETAIL mode (requires `details`). Columns MUST support, besides text: joined display columns resolved from refs (for example `empresa`, `familia`), `bool` columns (Sí / No), `date` columns (`dd/MM/yyyy`), `dec` columns (as stored, no rounding) and option columns (the option label, not the code). The filter MUST also match joined and option labels. A missing joined value MUST render empty.
(Previously: only plain text columns were specified.)

### R-CRUD-5 Register flow
Order MUST be: load lookups (including the dependent chains restored from the record), init mode, load record (non-INSERT), validate on submit (all required fields and constraints, skipping hidden or disabled fields), confirm, execute, then close, refresh the parent list and reselect the affected row.
(Previously: load lookups did not mention dependent chains and validation did not skip conditional fields.)

### R-CRUD-6 Validation
Required, max length, range, date and normalization rules MUST come from config for every field kind. Invalid submit MUST block execution and show per-field errors using the configured message and focus the first invalid field in config order (the entry's declared `validation` order; for W2 entries validation stops at the first failing step, as on the desktop, while Localidad keeps reporting every invalid field as in W1). Message templates and literals MUST be data in the config (never in the template code).
(Previously: only required, max length and uppercase normalization were specified.)

### R-CRUD-7 Errors
Server errors on execute MUST keep the dialog open, show the message and keep entered data. A `409` or `422` response whose `details` name form fields MUST show each detail message under its field and focus the first named field in config order. Details naming unknown fields, and errors without details, MUST show as a form-level message. Fixing a mapped field MUST clear its server error.
(Previously: only generic server errors were specified; no mapping to fields.)

### R-CRUD-9 Local components
Missing uijona components (permission toolbar, uppercase input, lookup combo, date, numeric, dependent select) MUST be app-local under `src/shared/ui` (the numeric `NumberField` sits on `JTextBox` with `inputMode="numeric"`, not on `JNumberInput`, which cannot show a padded `05` and whose `max` is a clamp; the date field sits on `JDatePicker`), following InterUi/Impl/View, with value-first callbacks and DEFAULTS without state values; `jona-ui` is pinned to npm `1.5.1` exact (mobile-first release; was `1.4.0`).
(Previously: pinned to `1.4.0` and the missing components list did not include date, numeric and dependent select.)

## MODIFIED Scenarios

**S-CRUD-17 server error** — Given execute fails with 500, Then the dialog stays open, the message shows and entered values remain. Given execute fails with 409 and `details: [{ field: "serie", message: "..." }]`, Then the message shows under `serie`, `serie` is focused and entered values remain.

**S-CRUD-21 pinned dependency** — Given `package.json`, Then `jona-ui` equals `"1.5.1"` with no range operator.

## ADDED Scenarios

**S-CRUD-24 bool field** — Given a `boolean` field with default `true` and `readOnlyOn: [INSERT]`, Then INSERT shows it checked and not editable, UPDATE shows it editable, and the payload carries a boolean.

**S-CRUD-25 number fields** — Given a `number` field with `scale 0` and `max 2`, When `123` is typed, Then only `12` is accepted; letters are ignored. Given a `number` field with `scale 2`, When `1.5.2` or `abc` is typed, Then the invalid characters are ignored; `-3` is accepted by the input and rejected by a `min > 0` rule on submit.

**S-CRUD-26 decimal default and blank** — Given a decimal `number` field with `default 0.0` and `blankToDefault`, When it is cleared and focus leaves, Then it shows `0.0`.

**S-CRUD-27 date field** — Given a `date` field, Then the INSERT default is today; When `31/02/2026` is typed, Then submit is blocked with the date error; When `15/01/2026` is typed, Then the payload carries `2026-01-15`.

**S-CRUD-28 date range and not-future** — Given `notFuture`, When tomorrow is entered, Then submit is blocked with the configured message; Given `afterField: fecha_ini`, When `fecha_fin` precedes `fecha_ini`, Then submit is blocked with the error on `fecha_fin`; equal dates are accepted. Capability available but unused: no Wave 2 catalog enables `notFuture` or `afterField` (Promocion has no date rules in the desktop), so it is tested with a test-only config.

**S-CRUD-29 catalog select** — Given a `select` over a lookup, When the dialog opens, Then options load from the lookup; When a value is chosen, Then the payload carries its id; Given the lookup fails, Then S-CRUD-20 applies.

**S-CRUD-30 static options** — Given an `options` field `A:Activo | I:Inactivo` with default `A`, Then the form shows `Activo` and the payload carries `A`; the list column shows the label `Activo`.

**S-CRUD-31 dependent chain reset** — Given the chain A -> B -> C with values chosen, When A changes, Then B and C clear, B reloads filtered by the new A and C is disabled; When B changes, Then C clears and reloads and A is unchanged.

**S-CRUD-32 dependent chain restore and stale** — Given a record, When UPDATE opens, Then every level is selected with its options loaded; Given A changes twice quickly and the first response arrives last, Then B reflects only the latest A.

**S-CRUD-33 conditional field** — Given field X with `visibleWhen: tipo = "TI"` and `requiredWhen` the same, When tipo is `TI` and X is blank, Then submit is blocked; When tipo changes to another value, Then X hides, its error clears, and the payload carries `null`. This client block applies to a config whose declared order has no server-only step before X; for Correlativo (unique step first) the blank ticket field is reported by the server (S-REF-15 last row).

**S-CRUD-34 read-only code** — Given a coded catalog, Then INSERT hides the code field, CLONE clears and hides it, UPDATE shows the code, and the create payload contains no id.

**S-CRUD-35 padLeft and case** — Given `padLeft:4` and `upper`, When `f1` is typed and focus leaves, Then it shows `00F1`; an empty value stays empty.

**S-CRUD-36 mode capability** — Given modes `[UPDATE, DETAIL]`, Then no add, eliminate or clone button is rendered, Alt+A does nothing, and double-click opens DETAIL.

**S-CRUD-37 joined and formatted columns** — Given rows with a join, a `boolean`, a `date` and a decimal `number`, Then the list shows the joined name, `Sí`/`No`, `dd/MM/yyyy` and the decimal as stored; typing the joined name in the filter narrows the rows.

**S-CRUD-38 field-error mapping** — Given a 422 with details for two fields, Then both show their message, the first in config order is focused, and editing one clears only its own error; a detail naming an unknown field shows as a form-level message.

**S-CRUD-40 multi-parent select** — Given a select with `dependsOn` `[punto_venta, tipo_doc]`, Then it stays disabled until both have a value, a change of either clears it and reloads with both `filterKey`s, and a stale response is ignored.

**S-CRUD-41 defaultOption first** — Given a select with `defaultOption: 'first'`, When its parent changes and options load, Then the first option is selected; when the load returns no options, Then the value is empty. The pick is reported through the register's `onFieldDefault`, which also updates the form baseline, so an untouched INSERT closes without the discard confirmation. A value the loaded options hold stays (UPDATE restores it), a missing or stale one is replaced by the first option, and a read-only select is never touched. The server does not apply the default (a body without the value is a 422).

**S-CRUD-39 Wave 1 compatibility** — Given the Localidad config and all Wave 1 scenarios S-CRUD-1..23 (with S-CRUD-17 and S-CRUD-21 as modified above), When run against the generalized templates, Then they pass unchanged. Two documented exceptions. First, the W1 `formRegistry.spec` sample `miTipoCambio`, which asserts the name is unregistered, was renamed to `miFormularioInexistente` when TipoCambio registered (W2-7). Second: the four W1 assertions that pinned the seeded menu at exactly 7 nodes (`auth.spec`, `shellServiceContract`, `AppServicesMock.spec`, `menuTree.spec`) compare against the menu seed instead, because every Wave 2 catalog adds its menu leaf (R-REG-9); the W1 nodes and their order are still asserted.
