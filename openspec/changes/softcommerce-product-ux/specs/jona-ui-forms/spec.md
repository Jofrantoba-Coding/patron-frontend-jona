# Spec: jona-ui-forms

The form primitives of `jona-ui`: `JField`, `JFieldGrid`, `JFormSection`, `JErrorSummary`, `JInputGroup`, and the `JDatePicker` label/error/ref extension.
Marker legend: **[ASSUMPTION]** = working assumption, easy to revise. Requirements R-FRM-1..6, scenarios S-FRM-1..16.

## Requirements

### R-FRM-1 JField
`JField` MUST render a label, a control slot, an optional description and an optional error, with the ids wired for the control:
- the label names the control, so its accessible name equals the label text exactly;
- `aria-describedby` lists the description id, then the error id;
- `aria-invalid="true"` is set only while an error is present;
- `required` makes the control required (`required` or `aria-required`).
The visual required marker (`*`) MUST NOT change the control's accessible name. A field error MUST NOT be a live region of its own (no `role="alert"` per field), so a blocked submit does not announce many alerts at once: `JErrorSummary` announces them (R-FRM-4).

### R-FRM-2 JFieldGrid
`JFieldGrid` MUST lay out its fields on a 12-column grid from 768 px (`md`). Each field takes a span of 3, 4, 6 or 12 columns, and below `md` every field spans 12. The default is 2 columns from `md` **[ASSUMPTION]**. Every class the grid emits MUST be present in the built CSS.

### R-FRM-3 JFormSection
`JFormSection` MUST render a group (`fieldset` with `legend`, or `role="group"` with `aria-labelledby`) whose accessible name is its title. It MAY show a description. It MUST accept an error that is referenced by the group's `aria-describedby`, for errors that belong to a set of fields (for example a period range).

### R-FRM-4 JErrorSummary
`JErrorSummary` MUST render nothing when the error list is empty. Otherwise it MUST render a single `role="alert"` region with a title and one entry per error. Each entry is a button that shows the field label and the message, and activating it calls `onSelect(field)` (value-first), so the host can focus the field. The summary MUST NOT take focus by itself.

### R-FRM-5 JInputGroup
`JInputGroup` MUST join controls and addons into one visual unit: a `role="group"` with an accessible name, optional `addonStart` and `addonEnd`, and a lookup preset with the columns code, description and actions. From 640 px (`sm`) the preset shows the columns in one row (code about 10rem, the description filling the rest, the actions at their content width, bottom-aligned). Below `sm` the columns stack. Every class it emits MUST be present in the built CSS.

### R-FRM-6 JDatePicker label, error and ref
`JDatePicker` MUST accept `label` and `error` with the R-FRM-1 wiring, MUST set `aria-invalid` while an error is present, and MUST forward a ref to its text input. The recipe `mask="dd/MM/yyyy"` with `valueFormat="iso"` MUST show `dd/MM/yyyy` and report the ISO date `yyyy-MM-dd` for a complete valid entry, and MUST be documented in its story. Without the new props the 1.5.1 behavior MUST be unchanged.

## Scenarios

**S-FRM-1 stable name** — Given `<JField label="Usuario" required>` around a text box, Then `getByRole('textbox', { name: 'Usuario' })` matches exactly and the box is required.

**S-FRM-2 described by help and error** — Given a description `Máximo 50 caracteres` and the error `Ingrese Usuario`, Then the box's accessible description contains both, in that order, and `aria-invalid` is `true`. When the error is removed, Then `aria-invalid` is absent and the description keeps only the help.

**S-FRM-3 no per-field alert** — Given three `JField`s with errors, Then no element with `role="alert"` is inside any of them.

**S-FRM-4 marker outside the name** — Given a required field, Then a `*` marker is visible and hidden from assistive technology, and it is not part of the label's accessible text.

**S-FRM-5 grid spans** — Given a `JFieldGrid` holding fields with spans 6, 6 and 12, Then each field carries the span classes for `md` and up, and the 12-column class from base (present in the built CSS).

**S-FRM-6 section group** — Given `<JFormSection title="Período" error="La fecha final es menor a la inicial">`, Then `getByRole('group', { name: 'Período' })` exists and its accessible description contains the error.

**S-FRM-7 summary hidden when empty** — Given `errors=[]`, Then no `alert` is rendered.

**S-FRM-8 summary lists and selects** — Given two errors (`usuario`: `Ingrese Usuario`, `clave`: `Ingrese Clave`), Then one `alert` lists two buttons in order. When the second is clicked, Then `onSelect` receives `'clave'`.

**S-FRM-9 summary does not take focus** — Given focus on the submit button, When the summary appears, Then the submit button keeps focus (the host may move it).

**S-FRM-10 input group** — Given `JInputGroup` named `Transportista` with the lookup preset, a code box, a description box and two buttons, Then `getByRole('group', { name: 'Transportista' })` contains all four in that order.

**S-FRM-11 lookup preset classes** — Given the lookup preset, Then its row layout classes from `sm` exist in the built CSS (the 9 classes reported missing in 1.5.1 are covered or no longer needed).

**S-FRM-12 date picker label** — Given `<JDatePicker label="Desde">`, Then `getByLabelText('Desde')` returns its text input.

**S-FRM-13 date picker error** — Given `error="Fecha inválida"`, Then the input has `aria-invalid="true"` and its accessible description contains the error.

**S-FRM-14 date picker ref** — Given a ref passed to `JDatePicker`, Then `ref.current` is the text input, and `ref.current.focus()` focuses it.

**S-FRM-15 dd/MM/yyyy recipe** — Given `mask="dd/MM/yyyy"`, `valueFormat="iso"` and value `2026-01-15`, Then the input shows `15/01/2026`. When `01/02/2026` is typed, Then `onChange` receives `2026-02-01`.

**S-FRM-16 date picker unchanged** — Given a `JDatePicker` with no new props, Then its 1.5.1 tests pass unchanged.
