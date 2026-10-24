# Delta for softcommerce-crud-templates

Adds the `password` (with confirmation), `textarea` and `lookup` field kinds used by the Wave 3 masters. Marker legend as in the promoted spec: **[ASSUMPTION]**, **[DEVIATION]**; **[INFERRED]** = a fact the repository does not hold. Numbering continues the promoted spec (R-CRUD-1..16, S-CRUD-1..41).

## ADDED Requirements

### R-CRUD-17 Password field with confirmation
A field of kind `password` MUST render a masked single-line input with a show / hide control (the desktop `Mostrar caracteres`), the desktop-style `max` (S-CRUD-14 semantics), and a companion confirmation input `<name>_confirmacion` that exists only in the modes where the password can change. It MUST be required on INSERT and CLONE together with its confirmation; on UPDATE a blank password and a blank confirmation MUST mean "keep the stored value" and send neither; on DETAIL and DELETE the field MUST NOT render. The field MUST never be prefilled, in any mode (the server never returns it), MUST NOT be sent when blank on UPDATE, and its value MUST NOT appear in error messages, details or logs. A confirmation different from the password MUST block submit with a per-field error on the confirmation field, using a configured message (**[ASSUMPTION]** the text `La confirmación de la contraseña no coincide.`, a NEW message: the desktop has no confirmation), and the server MUST answer 422 on `<name>_confirmacion` for the same condition. The wire payload carries `<name>` and `<name>_confirmacion` as strings; form state stays string-based (R-CRUD-11).

### R-CRUD-18 Textarea field
A field of kind `textarea` MUST render a multi-line input (default 4 rows) with the `max` of S-CRUD-14 (typed and pasted), `upper` / `lower` normalization like `text`, and a trimmed string payload. Enter inside it MUST insert a line break and MUST NOT submit the register (R-CRUD-8); Esc keeps its R-CRUD-8 meaning. It MUST honor `required`, `visibleWhen`, `enabledWhen`, `requiredWhen` and `readOnlyOn` like `text`, and it is never a list column by default.

### R-CRUD-19 Lookup field
A field of kind `lookup` MUST store the id of one record of another catalog and render it as a read-only code plus a read-only description, a search button that opens the LookupDialog (softcommerce-lookup-dialog) configured by the field, and a clear action. It MUST resolve a typed code through R-LKP-6 before opening the dialog. In UPDATE, DELETE, DETAIL and CLONE the description MUST be restored from the record's joined display (R-REG-8), with no extra request when the join carries it; in DETAIL and DELETE the field MUST be read-only (no search, no clear). `required` MUST block a blank field with the configured per-field error; the server MUST validate the id as a ref (exists, active, belongs to the parent, R-MOCK-12) and answer 422 on the field otherwise. A lookup MAY be the parent of a dependent select (R-CRUD-12), clearing the child when the picked record changes. The field and the dialog are app-local components (R-CRUD-9); no `jona-ui` change is allowed and the pin stays `1.5.1`.

## MODIFIED Requirements

### R-CRUD-11 Field kinds
A field config MUST support these kinds, with typed wire payloads (form state stays string-based and is converted by a per-kind codec at the boundary): `text` (with `max`, or `maxWhen` / `minLenWhen` when the length depends on another field, and `compose` when the value is the join of other fields); `code` (R-CRUD-14); `number` with `scale` (0 = integer, digits only, `max` digits, a value range through `range: { min, max }` and its `messages.range`; scale > 0 = decimal with input pattern `-?[0-9]*(\.[0-9]*)?`, where `scale` only marks the field as decimal and caps no precision, with optional `min` / `exclusiveMin`; an edit that no longer matches the pattern is ignored whole; a complete decimal of at most 15 significant digits is sent as a number, anything else stays the string so the rules judge it; a plain integer is sent as a number and a padded one such as `hora` `05` stays the padded string); `boolean` (checkbox or switch, payload boolean); `date` (masked `dd/MM/yyyy`, payload ISO `yyyy-MM-dd`, optional `min`, `notFuture`, `afterField: <field>`, default today); `select` over a catalog (`source` with optional static `where`, value = id, placeholder `--- Seleccione ---`, options from `GET /v1/lookups/{slug}`; optional `defaultOption: 'first'` selects the first option after each load or parent change); `options` over a static list (select or radio group, value = option code); `password` with confirmation (R-CRUD-17, payload strings `<name>` and `<name>_confirmacion`); `textarea` (R-CRUD-18, payload string); `lookup` (R-CRUD-19, value = the id of the picked record). A blank required `select`, `options`, `lookup` or `date`, an unparsable date and a `number` outside its range MUST block submit with a per-field error. Wave 1 `text`, `select` over `empresas` and the ubigeo `cascade` MUST keep working unchanged.
(Previously: the kinds were `text`, `code`, `number`, `boolean`, `date`, `select` and `options`; no `password`, `textarea` or `lookup`.)

## ADDED Scenarios

**S-CRUD-42 password mask and toggle** — Given a `password` field with `max 20`, Then the input is masked; When the show control is used, Then the value is readable and the same value stays; When a 21st character is typed, Then it is ignored; a 10-character paste over 10 selected characters of a 20-character value is accepted because the result fits, and a 15-character paste there is ignored whole (S-CRUD-14; the W3-11a text said 15, which would make 25).

**S-CRUD-43 password confirmation** — Given INSERT with password `abc` and confirmation `abd`, When submitting, Then no request is sent and the confirmation field shows the configured error and is focused; Given equal values, Then the payload carries both strings; a direct API body with different values answers 422 on `<name>_confirmacion`.

**S-CRUD-44 password on UPDATE, DETAIL and CLONE** — Given UPDATE, Then both inputs are empty (never prefilled) and a blank pair submits a payload with neither key; Given a typed pair, Then both keys are sent; Given DETAIL or DELETE, Then the field is not rendered; Given CLONE, Then both inputs are empty and required.

**S-CRUD-45 password never leaks** — Given a 422 for the password, Then the message and details never contain its value, and no list or get response contains the field.

**S-CRUD-46 textarea** — Given a `textarea` with `max 500`, When Enter is pressed inside it, Then a line break is inserted and the register does not submit; When 501 characters are typed or pasted, Then the extra is ignored (S-CRUD-14); the payload is the trimmed string; `upper` uppercases typed and pasted text.

**S-CRUD-47 lookup open and pick** — Given a `lookup` over `trabajadores`, When the search button is pressed, Then the LookupDialog opens; When a row is picked, Then the field shows its code and description read-only and the payload carries the id; When the dialog is cancelled, Then the field is unchanged.

**S-CRUD-48 lookup required and clear** — Given a required `lookup` that is blank, When submitting, Then no request is sent and the field error shows with the configured message; When a picked value is cleared, Then code and description clear and a dependent select clears.

**S-CRUD-49 lookup modes** — Given a record with a picked trabajador, Then UPDATE shows code and description restored from the joined display, DETAIL and DELETE show them without search and clear, and CLONE copies the value; a direct API write of an inactive or unknown id answers 422 on the field.

**S-CRUD-50 Wave 1 / Wave 2 compatibility** — Given all W1 and W2 scenarios S-CRUD-1..41 (S-CRUD-39's two documented exceptions unchanged), When run against the templates with the new kinds, Then they pass unchanged.
