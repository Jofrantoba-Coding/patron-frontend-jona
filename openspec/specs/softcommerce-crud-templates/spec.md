# Spec: softcommerce-crud-templates

Config-driven list and register templates. A catalog is described by a config object (columns, fields, validations, endpoints, form id); no catalog-specific template code.

## Requirements

### R-CRUD-1 List template
Given a config, the list template MUST render a toolbar, a filter input, a sortable paginated table, loading/empty/error states. Double-clicking a row MUST open the register in DETAIL mode (requires `details`).

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
Order MUST be: load lookups, init mode, load record (non-INSERT), validate on submit (all required fields and constraints), confirm, execute, then close, refresh the parent list and reselect the affected row.

### R-CRUD-6 Validation
Required, max length and uppercase-normalization rules MUST come from config. Invalid submit MUST block execution and show per-field errors and focus the first invalid field.

### R-CRUD-7 Errors
Server errors on execute MUST keep the dialog open, show the message and keep entered data.

### R-CRUD-8 Keyboard **[ASSUMPTION]**
Enter submits the register form (not from a multiline field or when focused on a button other than submit); Esc closes the dialog without executing, asking confirmation if the form is dirty.

### R-CRUD-9 Local components
Missing uijona components (permission toolbar, uppercase input, lookup combo) MUST be app-local under `src/shared/ui`, following InterUi/Impl/View, with value-first callbacks and DEFAULTS without state values; `jona-ui` is pinned to npm `1.4.0` exact (mobile-first release; was `1.3.0`).

## Scenarios

**S-CRUD-1 list states** — Given pending request, Then loading shows; Given empty items, Then an empty message; Given failure, Then an error with retry.

**S-CRUD-2 toolbar by permissions** — Given flags `add=true, modify=false`, Then Add is enabled and Modify is disabled even with a row selected.

**S-CRUD-3 row-dependent actions** — Given `modify=true` and no selected row, Then Modify is disabled; after selecting a row it is enabled.

**S-CRUD-4 permission-denied activation** — Given `eliminate=false`, When the user triggers Delete by click or shortcut, Then no dialog opens and no request is sent.

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

**S-CRUD-17 server error** — Given execute fails with 500, Then the dialog stays open, the message shows and entered values remain.

**S-CRUD-18 Enter submits** — Given an editable form with valid data, When Enter is pressed in a single-line field, Then submit runs once.

**S-CRUD-19 Esc closes** — Given an untouched form, When Esc, Then it closes with no request; Given a dirty form, Then a discard confirmation shows first.

**S-CRUD-20 lookup load failure** — Given a lookup request fails on open, Then the dialog shows an error and submit is disabled.

**S-CRUD-21 pinned dependency** — Given `package.json`, Then `jona-ui` equals `"1.4.0"` with no range operator.

**S-CRUD-22 config-only catalog** — Given a second minimal catalog config, Then list and register render and function without new template code.
