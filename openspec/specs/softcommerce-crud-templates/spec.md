# Spec: softcommerce-crud-templates

Config-driven list and register templates. A catalog is described by a config object (columns, fields, validations, endpoints, form id); no catalog-specific template code.

## Requirements

### R-CRUD-1 List template
Given a config, the list template MUST render a toolbar, a filter input, a sortable paginated table, loading/empty/error states. Double-clicking a row MUST open the register in DETAIL mode (requires `details`). Columns MUST support, besides text: joined display columns resolved from refs (for example `empresa`, `familia`), `bool` columns (Sí / No), `date` columns (`dd/MM/yyyy`), `dec` columns (as stored, no rounding) and option columns (the option label, not the code). The filter MUST also match joined and option labels. A missing joined value MUST render empty.

### R-CRUD-2 Toolbar gating
Toolbar actions (add, modify, eliminate, clone, details, search, refresh, export where configured) MUST be enabled only when the matching permission flag is true. Row-dependent actions (modify, eliminate, clone, details) MUST additionally require a selected row.

### R-CRUD-3 Filter and sort
Filter MUST narrow the rows case-insensitively over configured columns. Header click MUST toggle sort asc/desc on sortable columns.

### R-CRUD-4 Register modes
The register template MUST support INSERT, UPDATE, DELETE, DETAIL, CLONE:
- INSERT: empty form, submit calls create.
- UPDATE: prefilled editable form, submit calls update.
- DELETE: prefilled read-only form with confirmation, submit calls logical delete. **[ASSUMPTION] logical delete only.**
- DETAIL: prefilled read-only, no submit, close only.
- CLONE: prefilled editable form without the id, submit calls create.
ANULAR is out of scope.

### R-CRUD-5 Register flow
Order MUST be: load lookups (including the dependent chains restored from the record), init mode, load record (non-INSERT), validate on submit (all required fields and constraints, skipping hidden or disabled fields), confirm, execute, then close, refresh the parent list and reselect the affected row.

### R-CRUD-6 Validation
Required, max length, range, date and normalization rules MUST come from config for every field kind. Invalid submit MUST block execution and show per-field errors using the configured message and focus the first invalid field in config order (the entry's declared `validation` order; for W2 entries validation stops at the first failing step, as on the desktop, while Localidad keeps reporting every invalid field as in W1). Message templates and literals MUST be data in the config (never in the template code).

### R-CRUD-7 Errors
Server errors on execute MUST keep the dialog open, show the message and keep entered data. A `409` or `422` response whose `details` name form fields MUST show each detail message under its field and focus the first named field in config order. Details naming unknown fields, and errors without details, MUST show as a form-level message. Fixing a mapped field MUST clear its server error.

### R-CRUD-8 Keyboard **[ASSUMPTION]**
Enter submits the register form (not from a multiline field or when focused on a button other than submit); Esc closes the dialog without executing, asking confirmation if the form is dirty.

### R-CRUD-9 Local components
Missing uijona components (permission toolbar, uppercase input, lookup combo, date, numeric, dependent select) MUST be app-local under `src/shared/ui` (the numeric `NumberField` sits on `JTextBox` with `inputMode="numeric"`, not on `JNumberInput`, which cannot show a padded `05` and whose `max` is a clamp; the date field sits on `JDatePicker`), following InterUi/Impl/View, with value-first callbacks and DEFAULTS without state values; `jona-ui` is pinned to npm `1.5.1` exact (mobile-first release; was `1.4.0`).

### R-CRUD-10 Toolbar shortcuts
Toolbar actions MUST have the desktop Alt+letter shortcuts (`PanelControlView`), defined once as data: add Alt+A, modify Alt+M, eliminate Alt+E, clone Alt+N, details Alt+Z, search Alt+B, refresh Alt+R, export Alt+X, print Alt+I, printFast Alt+F, close Alt+S; nullify and report have none. A shortcut MUST fire only for an action shown in the current toolbar and through the same gate as a click (permission, selected row). Keys MUST match by physical key (`KeyA`…) with Alt and without Ctrl/Meta/Shift, and the browser default MUST be prevented only when a shortcut is handled. The listener MUST be scoped to the list's container (never `window`), so an inactive hidden tab never reacts, and MUST stay quiet while any dialog is open. Each button MUST expose its shortcut (`aria-keyshortcuts`, title "Agregar (Alt+A)").

### R-CRUD-11 Field kinds
A field config MUST support these kinds, with typed wire payloads (form state stays string-based and is converted by a per-kind codec at the boundary): `text` (with `max`, or `maxWhen` / `minLenWhen` when the length depends on another field, and `compose` when the value is the join of other fields); `code` (R-CRUD-14); `number` with `scale` (0 = integer, digits only, `max` digits, a value range through `range: { min, max }` and its `messages.range`; scale > 0 = decimal with input pattern `-?[0-9]*(\.[0-9]*)?`, where `scale` only marks the field as decimal and caps no precision, with optional `min` / `exclusiveMin`; an edit that no longer matches the pattern is ignored whole; a complete decimal of at most 15 significant digits is sent as a number, anything else stays the string so the rules judge it; a plain integer is sent as a number and a padded one such as `hora` `05` stays the padded string); `boolean` (checkbox or switch, payload boolean); `date` (masked `dd/MM/yyyy`, payload ISO `yyyy-MM-dd`, optional `min`, `notFuture`, `afterField: <field>`, default today); `select` over a catalog (`source` with optional static `where`, value = id, placeholder `--- Seleccione ---`, options from `GET /v1/lookups/{slug}`; optional `defaultOption: 'first'` selects the first option after each load or parent change); `options` over a static list (select or radio group, value = option code); `password` with confirmation (R-CRUD-17, payload strings `<name>` and `<name>_confirmacion`); `textarea` (R-CRUD-18, payload string); `lookup` (R-CRUD-19, value = the id of the picked record). A blank required `select`, `options`, `lookup` or `date`, an unparsable date and a `number` outside its range MUST block submit with a per-field error. Wave 1 `text`, `select` over `empresas` and the ubigeo `cascade` MUST keep working unchanged.

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

### R-CRUD-17 Password field with confirmation
A field of kind `password` MUST render a masked single-line input with a show / hide control (the desktop `Mostrar caracteres`), the desktop-style `max` (S-CRUD-14 semantics), and a companion confirmation input `<name>_confirmacion` that exists only in the modes where the password can change. It MUST be required on INSERT and CLONE together with its confirmation; on UPDATE a blank password and a blank confirmation MUST mean "keep the stored value" and send neither; on DETAIL and DELETE the field MUST NOT render. The field MUST never be prefilled, in any mode (the server never returns it), MUST NOT be sent when blank on UPDATE, and its value MUST NOT appear in error messages, details or logs. A confirmation different from the password MUST block submit with a per-field error on the confirmation field, using a configured message (**[ASSUMPTION]** the text `La confirmación de la contraseña no coincide.`, a NEW message: the desktop has no confirmation), and the server MUST answer 422 on `<name>_confirmacion` for the same condition. The wire payload carries `<name>` and `<name>_confirmacion` as strings; form state stays string-based (R-CRUD-11).

### R-CRUD-18 Textarea field
A field of kind `textarea` MUST render a multi-line input (default 4 rows) with the `max` of S-CRUD-14 (typed and pasted), `upper` / `lower` normalization like `text`, and a trimmed string payload. Enter inside it MUST insert a line break and MUST NOT submit the register (R-CRUD-8); Esc keeps its R-CRUD-8 meaning. It MUST honor `required`, `visibleWhen`, `enabledWhen`, `requiredWhen` and `readOnlyOn` like `text`, and it is never a list column by default.

### R-CRUD-19 Lookup field
A field of kind `lookup` MUST store the id of one record of another catalog and render it as a read-only code plus a read-only description, a search button that opens the LookupDialog (softcommerce-lookup-dialog) configured by the field, and a clear action. It MUST resolve a typed code through R-LKP-6 before opening the dialog. In UPDATE, DELETE, DETAIL and CLONE the description MUST be restored from the record's joined display (R-REG-8), with no extra request when the join carries it; in DETAIL and DELETE the field MUST be read-only (no search, no clear). `required` MUST block a blank field with the configured per-field error; the server MUST validate the id as a ref (exists, active, belongs to the parent, R-MOCK-12) and answer 422 on the field otherwise. A lookup MAY be the parent of a dependent select (R-CRUD-12), clearing the child when the picked record changes. The field and the dialog are app-local components (R-CRUD-9); no `jona-ui` change is allowed and the pin stays `1.5.1`.

## Scenarios

**S-CRUD-1 list states** — Given pending request, Then loading shows; Given empty items, Then an empty message; Given failure, Then an error with retry.

**S-CRUD-2 toolbar by permissions** — Given flags `add=true, modify=false`, Then Add is enabled and Modify is disabled even with a row selected.

**S-CRUD-3 row-dependent actions** — Given `modify=true` and no selected row, Then Modify is disabled; after selecting a row it is enabled.

**S-CRUD-4 permission-denied activation** — Given `eliminate=false`, When the user triggers Delete by click or shortcut (Alt+E, R-CRUD-10), Then no dialog opens and no request is sent.

**S-CRUD-5 filter** — Given rows "LIMA", "CUSCO", When typing "lim", Then only LIMA shows; clearing restores both.

**S-CRUD-6 sort** — Given a sortable column, When header clicked twice, Then rows sort ascending then descending.

**S-CRUD-7 double-click details** — Given `details=true`, When a row is double-clicked, Then register opens in DETAIL mode; Given `details=false`, Then nothing opens.

**S-CRUD-8 INSERT** — Given Add, When valid data is submitted and confirmed, Then create is called once with the data, the dialog closes, the list refreshes and the new row is selected.

**S-CRUD-9 UPDATE** — Given a selected row, When Modify, Then fields are prefilled; submit calls update with the id; list refreshes and row stays selected.

**S-CRUD-10 DELETE** — Given a selected row, When Delete, Then fields are read-only and a confirmation is required; confirming calls logical delete; cancelling sends nothing.

**S-CRUD-11 DETAIL** — Given DETAIL mode, Then fields are read-only, no submit button exists, and Enter does nothing.

**S-CRUD-12 CLONE** — Given a selected row, When Clone, Then fields are prefilled except id, submit calls create (not update), and the original row is unchanged.

**S-CRUD-13 required missing** — Given a required field empty, When submitting, Then no request is sent, the field error shows and focus moves to the first invalid field.

**S-CRUD-14 max length** — Given a field with max 100 holding 100 characters, When one more character is typed, Then the insertion is ignored and the value is unchanged. Given the field holds 95 characters, When 10 characters are pasted, Then the whole paste is ignored (no truncation, no error) and the value is unchanged. Given 5 of the 95 characters are selected, When 10 characters are pasted over them, Then the result (100 characters) is accepted.

**S-CRUD-15 uppercase** — Given an uppercase field, When "lima" is typed, Then the value becomes "LIMA".

**S-CRUD-16 confirm cancelled** — Given valid data, When the confirmation is declined, Then nothing is sent and the form stays open.

**S-CRUD-17 server error** — Given execute fails with 500, Then the dialog stays open, the message shows and entered values remain. Given execute fails with 409 and `details: [{ field: "serie", message: "..." }]`, Then the message shows under `serie`, `serie` is focused and entered values remain.

**S-CRUD-18 Enter submits** — Given an editable form with valid data, When Enter is pressed in a single-line field, Then submit runs once.

**S-CRUD-19 Esc closes** — Given an untouched form, When Esc, Then it closes with no request; Given a dirty form, Then a discard confirmation shows first.

**S-CRUD-20 lookup load failure** — Given a lookup request fails on open, Then the dialog shows an error and submit is disabled.

**S-CRUD-21 pinned dependency** — Given `package.json`, Then `jona-ui` equals `"1.5.1"` with no range operator.

**S-CRUD-22 config-only catalog** — Given a second minimal catalog config, Then list and register render and function without new template code.

**S-CRUD-23 toolbar shortcuts** — Given a list with focus anywhere inside it and no dialog open, When Alt+A is pressed with `add=true`, Then the register opens once; Given a denied action, a row-dependent action without a selection, an open dialog, focus outside the list, or Ctrl/Shift/Meta held, Then nothing fires.

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

**S-CRUD-39 Wave 1 compatibility** — Given the Localidad config and all Wave 1 scenarios S-CRUD-1..23 (with S-CRUD-17 and S-CRUD-21 as modified above), When run against the generalized templates, Then they pass unchanged. Two documented exceptions. First, the W1 `formRegistry.spec` sample `miTipoCambio`, which asserts the name is unregistered, was renamed to `miFormularioInexistente` when TipoCambio registered (W2-7). Second: the four W1 assertions that pinned the seeded menu at exactly 7 nodes (`auth.spec`, `shellServiceContract`, `AppServicesMock.spec`, `menuTree.spec`) compare against the menu seed instead, because every Wave 2 catalog adds its menu leaf (R-REG-9); the W1 nodes and their order are still asserted.

**S-CRUD-40 multi-parent select** — Given a select with `dependsOn` `[punto_venta, tipo_doc]`, Then it stays disabled until both have a value, a change of either clears it and reloads with both `filterKey`s, and a stale response is ignored.

**S-CRUD-41 defaultOption first** — Given a select with `defaultOption: 'first'`, When its parent changes and options load, Then the first option is selected; when the load returns no options, Then the value is empty. The pick is reported through the register's `onFieldDefault`, which also updates the form baseline, so an untouched INSERT closes without the discard confirmation. A value the loaded options hold stays (UPDATE restores it), a missing or stale one is replaced by the first option, and a read-only select is never touched. The server does not apply the default (a body without the value is a 422).

**S-CRUD-42 password mask and toggle** — Given a `password` field with `max 20`, Then the input is masked; When the show control is used, Then the value is readable and the same value stays; When a 21st character is typed, Then it is ignored; a 10-character paste over 10 selected characters of a 20-character value is accepted because the result fits, and a 15-character paste there is ignored whole (S-CRUD-14; the W3-11a text said 15, which would make 25).

**S-CRUD-43 password confirmation** — Given INSERT with password `abc` and confirmation `abd`, When submitting, Then no request is sent and the confirmation field shows the configured error and is focused; Given equal values, Then the payload carries both strings; a direct API body with different values answers 422 on `<name>_confirmacion`.

**S-CRUD-44 password on UPDATE, DETAIL and CLONE** — Given UPDATE, Then both inputs are empty (never prefilled) and a blank pair submits a payload with neither key; Given a typed pair, Then both keys are sent; Given DETAIL or DELETE, Then the field is not rendered; Given CLONE, Then both inputs are empty and required.

**S-CRUD-45 password never leaks** — Given a 422 for the password, Then the message and details never contain its value, and no list or get response contains the field.

**S-CRUD-46 textarea** — Given a `textarea` with `max 500`, When Enter is pressed inside it, Then a line break is inserted and the register does not submit; When 501 characters are typed or pasted, Then the extra is ignored (S-CRUD-14); the payload is the trimmed string; `upper` uppercases typed and pasted text.

**S-CRUD-47 lookup open and pick** — Given a `lookup` over `trabajadores`, When the search button is pressed, Then the LookupDialog opens; When a row is picked, Then the field shows its code and description read-only and the payload carries the id; When the dialog is cancelled, Then the field is unchanged.

**S-CRUD-48 lookup required and clear** — Given a required `lookup` that is blank, When submitting, Then no request is sent and the field error shows with the configured message; When a picked value is cleared, Then code and description clear and a dependent select clears.

**S-CRUD-49 lookup modes** — Given a record with a picked trabajador, Then UPDATE shows code and description restored from the joined display, DETAIL and DELETE show them without search and clear, and CLONE copies the value; a direct API write of an inactive or unknown id answers 422 on the field.

**S-CRUD-50 Wave 1 / Wave 2 compatibility** — Given all W1 and W2 scenarios S-CRUD-1..41 (S-CRUD-39's two documented exceptions unchanged), When run against the templates with the new kinds, Then they pass unchanged.
