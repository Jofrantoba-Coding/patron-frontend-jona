# Spec: jona-ui-feedback

The feedback pieces of `jona-ui`: a promise-based confirm (`useConfirm` with `ConfirmProvider`), `JOptionPane` record details, and the toast conventions (`ToastProvider`, `useToast`, `JToast`).
Marker legend: **[ASSUMPTION]** = working assumption, easy to revise. Requirements R-FBK-1..6, scenarios S-FBK-1..16.

## Requirements

### R-FBK-1 Promise confirm
The lib MUST provide `ConfirmProvider` and a `useConfirm` hook. The hook returns `confirm(options)`, which resolves to `true` (confirmed) or `false` (declined).
- Options: `title`, `description`, optional `details` (record summary content), `variant` (`danger`, `warning` or `info`), `confirmLabel`, `cancelLabel` and `initialFocus`.
- Omitted options take `CONFIRM_DEFAULTS`: `variant: 'info'` (not the `JOptionPane` default `danger`), `confirmLabel: 'Confirmar'`, `cancelLabel: 'Cancelar'`.
- The confirm MUST render as `JOptionPane`: an `alertdialog` named by the title and described by the description.
- `danger` MUST use the destructive button style for the confirm action.
- The confirm button resolves `true`. The cancel button, Esc and the close control resolve `false`.
- Each call MUST resolve exactly once.
- `useConfirm` outside a `ConfirmProvider` MUST throw an error that names `ConfirmProvider`.

### R-FBK-2 Confirm focus
On open, focus MUST move into the pane: to the cancel button for `danger` and to the confirm button otherwise **[ASSUMPTION]** (a destructive action is never one Enter away). Tab MUST stay inside the pane while it is open. On close, focus MUST return to the element that was focused before the call, if that element is still in the document.

### R-FBK-3 Stacking and Esc
While a confirm is open, Esc MUST resolve only that confirm and MUST NOT reach any dialog or drawer beneath it.
- With no `renderPane`, the provider installs a window-capture Esc interceptor while the confirm is open. The interceptor stops the event and resolves `false`.
- With `renderPane(pane)`, the host renders the pane and owns Esc. This is how the app's `DialogStackProvider` sees the confirm as its topmost layer (`GuardedOptionPane`). Concurrent calls MUST be shown one at a time, first in first out **[ASSUMPTION]**. Unmounting the provider MUST resolve every pending call with `false`.

### R-FBK-4 JOptionPane details
`JOptionPane` MUST accept an optional `details` node, rendered inside the pane between the description and the buttons and included in its accessible description. Without `details` the output MUST equal 1.5.1.

### R-FBK-5 Toast announcements and timing
- `default`, `success` and `info` toasts MUST be `role="status"` with `aria-live="polite"` and MUST auto-dismiss after the 4000 ms default.
- `danger` toasts (`useToastHelpers().error`) MUST be `role="alert"`. This is an a11y bug fix named in the CHANGELOG.
- A toast with `duration: 0` MUST stay until it is dismissed. The app passes `0` for errors **[ASSUMPTION]**.
- `ToastProvider` MUST accept `label`, `dismissLabel` and `offset`, without changing its 1.5.1 defaults.
- An auto-dismiss timer MUST pause while its toast is hovered or holds focus.
- Showing a toast MUST NOT move focus.
- Every toast MUST have a dismiss button with an accessible name.

### R-FBK-6 Toast position
`ToastProvider` MUST keep its `position` prop and its 1.5.1 default. The documentation and the stories MUST name `top-right` as the recommended position for data-entry apps, because a bottom position hides the pagination.

## Scenarios

**S-FBK-1 confirm resolves true** — Given `confirm({ title: 'Eliminar', description: 'Se eliminará el registro.', confirmLabel: 'Eliminar', cancelLabel: 'No', variant: 'danger' })`, When `Eliminar` is clicked, Then the promise resolves `true` and the `alertdialog` is gone.

**S-FBK-2 decline paths** — Given an open confirm, When `No` is clicked, or Esc is pressed, or the close control is used (the `JOptionPane` backdrop; the pane has no close button), Then the promise resolves `false` each time, and only once.

**S-FBK-3 accessible name and description** — Given the confirm of S-FBK-1, Then `getByRole('alertdialog', { name: 'Eliminar' })` exists and its accessible description contains `Se eliminará el registro.`.

**S-FBK-4 danger styling** — Given `variant: 'danger'`, Then the confirm button has the destructive variant. Given `info`, Then it has the default variant.

**S-FBK-5 outside the provider** — Given a component that calls `useConfirm` with no `ConfirmProvider`, When rendered, Then it throws an error whose message contains `ConfirmProvider`.

**S-FBK-6 initial focus** — Given a `danger` confirm, Then the cancel button has focus. Given an `info` confirm, Then the confirm button has focus.

**S-FBK-7 focus trap and restore** — Given a confirm opened from button `B`, When Tab is pressed repeatedly, Then focus stays inside the pane. When the confirm closes, Then `B` has focus.

**S-FBK-8 Esc reaches only the confirm** — Given a `JDialog` open with a confirm on top, When Esc is pressed once, Then the confirm resolves `false` and the dialog stays open. A second Esc closes the dialog.

**S-FBK-9 queue** — Given two calls made back to back, Then only the first pane is shown. After it resolves, Then the second shows, and each promise resolves with its own answer.

**S-FBK-10 unmount resolves false** — Given a pending confirm, When the provider unmounts, Then the promise resolves `false`.

**S-FBK-11 option pane details** — Given `JOptionPane` with `details` showing `000123 · ACME SAC`, Then that text is inside the `alertdialog` and in its accessible description. Given no `details`, Then the snapshot equals 1.5.1 (the approval snapshot is taken before the change, on the a2b-tokenized classes; a10 regenerates it once for the dark backdrop token, the only change being the `BACKDROP` class string).

**S-FBK-12 success toast** — Given `toast({ variant: 'success', title: 'Registro creado' })`, Then a `status` element with `aria-live="polite"` contains the title. After 4000 ms (fake timers), Then it is gone.

**S-FBK-13 error toast persists** — Given a `danger` toast with `duration: 0`, Then it is `role="alert"`. After 10 000 ms it is still shown. When its dismiss button is clicked, Then it is gone.

**S-FBK-14 timer pauses** — Given a success toast hovered at 3000 ms, When 5000 ms more pass, Then it is still shown. After pointer leave and 4000 ms, Then it is gone.

**S-FBK-15 no focus steal** — Given focus in a text box, When a toast is shown, Then the text box keeps focus.

**S-FBK-16 position unchanged** — Given `ToastProvider` with no `position`, Then the container uses the 1.5.1 default. Given `position="top-right"`, Then it uses the top-right placement classes (present in the built CSS).
