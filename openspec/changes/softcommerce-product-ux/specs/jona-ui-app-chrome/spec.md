# Spec: jona-ui-app-chrome

The application frame pieces of `jona-ui`: `JAppShell`, `JTreeNav`, `JWorkspaceTabs` (and `JTabs keepMounted`), `JPageHeader`, `JUserMenu`, `JContextChip`, `JShortcutSheet` and `JAuthLayout`. Existing lib labels (`Abrir menú`, `Cerrar menú`, `Menú de navegación`) are kept.
Marker legend: **[ASSUMPTION]** = working assumption, easy to revise. Requirements R-CHR-1..9, scenarios S-CHR-1..27.

## Requirements

### R-CHR-1 JAppShell landmarks and layout
`JAppShell` MUST render three landmarks: a `banner` (the topbar, 48 px), a named `navigation` (the sidebar) and a `main` (the content).
- From 1024 px (`lg`) the sidebar is inline: 264 px wide, or a 56 px rail when collapsed. A toggle button with `aria-expanded` and `aria-controls` collapses it.
- Below `lg` the sidebar is an off-canvas drawer, opened by the `Abrir menú` button (`aria-expanded`) and closed by `Cerrar menú`, by Esc or by selecting an item. On open, focus moves into the drawer. On close, focus returns to `Abrir menú`.
- The `Abrir menú` button MUST be hidden from `lg` (jona-ui-foundations R-FND-2).
- The sidebar content is a render function that receives the shell API (close the drawer, the collapsed state).

### R-CHR-2 JTreeNav roles and keyboard
`JTreeNav` MUST render `role="tree"` with an accessible name. Each node is a `treeitem` with `aria-level`, and a branch also carries `aria-expanded`. The tree is one tab stop with a roving focus.

| Key | Effect |
|---|---|
| ↓ / ↑ | next / previous visible node |
| → | on a closed branch: expand it; on an open branch: move to its first child |
| ← | on an open branch: collapse it; otherwise: move to the parent |
| Home / End | first / last visible node |
| Enter / Space | on a leaf: `onSelect(id)`; on a branch: `onToggle(id)` |
| printable characters | type-ahead to the next visible node whose label starts with them |

A click on a branch toggles it, and a click on a leaf selects it. The node whose id equals `activeId` MUST carry `aria-current="page"` and a visible highlight. A `disabled` node MUST set `aria-disabled="true"`, MUST still be focusable, and MUST still report `onSelect(id)`, so the host can explain why it is unavailable. A node `badge` MUST be exposed as the node's accessible description, never as part of its name.

### R-CHR-3 JTreeNav filter
With a `filter` value, the tree MUST show only the leaves whose label contains it, ignoring case and accents **[ASSUMPTION]**, together with their ancestors, which show expanded. With no match, a no-match message shows (default `Sin resultados` **[ASSUMPTION]**). Clearing the filter MUST restore the expansion the tree had before filtering; while a filter is active, expanding or collapsing is local to the filtered view and is not reported through `onToggle`. The filter input is a search box with an accessible name, and it reports `onFilterChange(text)`. A host can focus it without querying the DOM through the `focusFilter()` handle of a `JTreeNav` ref, which also selects its text (for shortcuts such as Ctrl+K or `/`; additive in 1.6.0).

### R-CHR-4 JTreeNav checkbox variant
With `variant="checkbox"`, each node MUST carry `aria-checked`. An optional `maxHeight` caps the scroll area of the tree, in any variant. Space (or a click on the checkbox) MUST call `onCheckedChange(id, checked)` for that node only, with no propagation to parents or children. A click on the node text MUST only focus and select it (`onSelect(id)`), keeping text and checkbox as separate targets. In this variant the arrow keys also select the node they move to, and the branch chevron and Enter expand or collapse. A `disabled` node is not checked.

### R-CHR-5 JWorkspaceTabs and JTabs keepMounted
`JWorkspaceTabs` MUST render a `tablist` that contains only `tab` elements. Each tab has `aria-selected` and `aria-controls` pointing at its `tabpanel`, and each panel is named by its tab.
- Every tab has a close button next to it, outside the `tab` element and outside the `tablist`, named `Cerrar pestaña {title}` by default. Only the active tab's close button is in the tab order.
- The close button and a middle-click on the tab call `onCloseRequest(id)`. The component MUST NOT remove a tab itself: the host decides.
- A `dirty` tab MUST show a dot and the accessible description `Cambios sin guardar` **[ASSUMPTION]**, with its name unchanged.
- ← / → / Home / End move between tabs and select them on focus **[ASSUMPTION]**.
- Inactive panels MUST stay mounted and `hidden`.
- When the tabs do not fit (`maxVisible`), the extra tabs MUST be listed in a menu button `Más pestañas` **[ASSUMPTION]**, and selecting an entry selects its tab. An overflowed active tab takes the last visible slot.

`JTabs` MUST accept `keepMounted`. With it, inactive `JTabsContent` panels stay mounted and `hidden`. Without it, the 1.5.1 behavior holds.

### R-CHR-6 JPageHeader
`JPageHeader` MUST render the title as a heading (level 1 by default) that can take focus programmatically (`tabIndex=-1`). It MAY show:
- a `count` next to the title, as `(134)`, outside the heading's accessible name;
- `breadcrumbs`, as a `navigation` named `Ruta` **[ASSUMPTION]**, with `aria-current="page"` on the last crumb and ancestors as buttons when they have `onSelect`;
- an `actions` slot and a `search` slot.

### R-CHR-7 JUserMenu and JContextChip
`JUserMenu` MUST be a menu button named by the user name, with `aria-haspopup="menu"` and `aria-expanded`. It opens a `menu` built from item groups: `menuitem`, a `menuitemradio` group with a label, an optional `danger` tone, and a non-interactive header with the name and subtitle. ↑ / ↓ move between items. Enter or Space activates an item. Esc closes the menu and returns focus to the button. Esc is handled on the menu's own root and does not propagate, so a dialog beneath stays open. An outside pointer press also closes the menu. The menu does not use `JDropdown`'s document listeners. Selecting an item calls its value-first handler and closes the menu. The same Esc rule applies to the `JWorkspaceTabs` overflow menu, the `JToolbar` overflow menu and the `JAppShell` drawer.
`JContextChip` MUST be read-only text: it joins the item values with ` · ` and exposes each `label: value` pair in its accessible description and tooltip. It MUST have no button role.

### R-CHR-8 JShortcutSheet
`JShortcutSheet` MUST render a dialog (default title `Atajos de teclado` **[ASSUMPTION]**) that lists groups. Each group has a heading, and each shortcut shows its keys as `kbd` elements beside its label. Esc, the backdrop and the close button (`Cerrar`, in the footer) close it, and focus returns to the invoker.

### R-CHR-9 JAuthLayout
`JAuthLayout` MUST render a `main` landmark with a card that shows the product name and the page heading.
- From 1024 px a brand panel shows the name and the optional tagline. Below 1024 px only the card shows, with 16 px gutters.
- With `steps`, it shows a `JStepper` whose current step (`currentStep`, a step id) carries `aria-current="step"`.
- It has a `footer` slot.
- It MUST hold no form logic: the host renders the form as children.

## Scenarios

**S-CHR-1 landmarks** — Given `JAppShell` with a topbar, a sidebar named `Menú principal` and content, Then one `banner`, one `navigation` named `Menú principal` and one `main` exist.

**S-CHR-2 rail toggle** — Given a desktop sidebar, When the collapse toggle is clicked, Then `aria-expanded` turns `false` and the rail classes apply (present in the built CSS).

**S-CHR-3 mobile drawer focus** — Given the mobile layout, When `Abrir menú` is clicked, Then focus is inside the drawer. When Esc is pressed, Then the drawer closes and `Abrir menú` has focus.

**S-CHR-4 hamburger hidden on desktop** — Given the built CSS, Then the `Abrir menú` container is hidden from `lg` (S-FND-4 mechanism).

**S-CHR-5 tree roles** — Given nodes `Maestros > Generales > Cliente`, Then `getByRole('tree')` holds `treeitem`s with `aria-level` 1, 2 and 3, and the two branches carry `aria-expanded`.

**S-CHR-6 tree arrows** — Given focus on a closed `Maestros`, When → is pressed, Then `onToggle('maestros')` is called. When → is pressed again on the open branch, Then focus moves to `Generales`. ← moves back to `Maestros`.

**S-CHR-7 tree activate** — Given focus on leaf `Cliente`, When Enter is pressed, Then `onSelect('cliente')` is called once. Space does the same.

**S-CHR-8 type-ahead** — Given visible leaves `Color`, `Cliente`, `Marca`, When `m` is typed, Then `Marca` has focus.

**S-CHR-9 active node** — Given `activeId='cliente'`, Then the `Cliente` treeitem has `aria-current="page"`.

**S-CHR-10 disabled node with badge** — Given a disabled leaf `Registro de Ventas` with badge `Próximamente`, Then `getByRole('treeitem', { name: 'Registro de Ventas' })` matches exactly, has `aria-disabled="true"`, and has the accessible description `Próximamente`. When it is activated, Then `onSelect` is still called.

**S-CHR-11 filter** — Given 49 leaves under `Generales`, When the filter is `cli`, Then only the leaves whose label contains `cli` (and `Clí`) show, with `Maestros` and `Generales` expanded. Given `zzz`, Then `Sin resultados` shows.

**S-CHR-12 filter restores expansion** — Given `Ventas` collapsed before filtering, When the filter is cleared, Then `Ventas` is collapsed again.

**S-CHR-13 checkbox variant** — Given `variant="checkbox"` and a checked parent, When Space is pressed on it, Then `onCheckedChange('p', false)` is called once and no child callback runs. When the node text is clicked, Then only `onSelect('p')` runs.

**S-CHR-14 tablist holds only tabs** — Given 3 workspace tabs, Then every child of the `tablist` with a role is a `tab`, and the buttons `Cerrar pestaña Alfa`, `Beta` and `Gama` exist outside the `tablist`.

**S-CHR-15 close is a request** — Given tab `Alfa`, When `Cerrar pestaña Alfa` is clicked or `Alfa` is middle-clicked, Then `onCloseRequest('alfa')` is called and the tab is still rendered until the host removes it.

**S-CHR-16 dirty tab** — Given `Alfa` dirty, Then `getByRole('tab', { name: 'Alfa' })` matches exactly and its accessible description is `Cambios sin guardar`.

**S-CHR-17 panels stay mounted** — Given tab B active, Then tab A's panel is in the document with `hidden`, and its inner state survives switching back.

**S-CHR-18 tab overflow** — Given 8 tabs and `maxVisible=5`, Then `Más pestañas` lists the other 3. Selecting one calls `onSelect` with its id.

**S-CHR-19 JTabs keepMounted** — Given `JTabs keepMounted` with two contents, Then the inactive content is mounted and `hidden`. Without the prop, it is unmounted as in 1.5.1.

**S-CHR-20 page header** — Given title `Cliente`, count 134 and two crumbs, Then `getByRole('heading', { level: 1, name: 'Cliente' })` exists with `tabIndex=-1`, `(134)` is visible, and the navigation `Ruta` marks the last crumb `aria-current="page"`.

**S-CHR-21 user menu keyboard** — Given `JUserMenu` named `Administrador`, When the button is activated, Then a `menu` opens with `aria-expanded="true"`. ↓ moves between items. Esc closes it and the button has focus.

**S-CHR-22 menu radio group** — Given a radio group `Tema` with `Sistema`, `Claro`, `Oscuro` and `Claro` checked, Then three `menuitemradio`s show and only `Claro` has `aria-checked="true"`. Selecting `Oscuro` calls its handler with `'dark'`.

**S-CHR-23 context chip** — Given items Empresa `Comercial Demo SAC`, PV `Tienda Central` and Período `01/01/2026–31/12/2026`, Then the text is `Comercial Demo SAC · Tienda Central · 01/01/2026–31/12/2026`, the accessible description holds the three `label: value` pairs, and no `button` role exists.

**S-CHR-24 shortcut sheet** — Given groups `Lista` and `Pestañas`, Then the dialog `Atajos de teclado` shows two headings and `kbd` elements. Esc closes it and the invoker has focus.

**S-CHR-25 auth layout** — Given brand `SoftCommerce` and two steps with the current step 2, Then a `main` exists, `SoftCommerce` is visible, and step 2 has `aria-current="step"`.

**S-CHR-26 auth layout below lg** — Given the built CSS, Then the brand panel is hidden below `lg` and the card shows the product name.

**S-CHR-27 auth layout holds no form logic** — Given children `<form aria-label="Ingreso">`, Then that form renders inside the card unchanged, and the layout adds no submit handler.
