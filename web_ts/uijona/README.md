# @jona/ui

JONA Design System — Atomic Design + Observer pattern. Tree-shakeable React component library.

## Architecture

```
Atomic Design + JONA (Organisms) + Observer (Atoms/Molecules)
```

Every atom and molecule exposes an `InterEvents[Name].ts` interface that declares all events the component can emit. Consumers implement only the events they need.

```
Atom/Molecule
  └── InterEvents[Name].ts   ← Observer contract (event signatures)
  └── [Name].tsx             ← Component (props extends InterEvents)
```

## Installation

```bash
npm install @jona/ui
```

### Peer dependencies

```bash
npm install react react-dom
```

### Tailwind CSS setup

The library uses Tailwind utility classes. Add the library path to your `tailwind.config.js` content array:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@jona/ui/dist/**/*.js',  // ← add this
  ],
  theme: {
    extend: {
      colors: {
        primary:  { 600: '#2563eb', 700: '#1d4ed8', 500: '#3b82f6' },
        neutral:  { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 700: '#374151', 900: '#111827' },
        danger:   { 500: '#ef4444', 600: '#dc2626' },
        success:  { 500: '#22c55e', 600: '#16a34a' },
      },
    },
  },
};
```

## Usage

### Import individual components (tree-shakeable)

```tsx
import { ButtonAtom } from '@jona/ui/atoms/ButtonAtom';
import { FormFieldMolecule } from '@jona/ui/molecules/FormFieldMolecule';
```

### Import from barrel (all components)

```tsx
import { ButtonAtom, FormFieldMolecule, useToast } from '@jona/ui';
```

## Components

### Atoms

| Component | Description |
|-----------|-------------|
| `ButtonAtom` | Button with variants: default, outline, ghost, destructive, secondary, link |
| `InputAtom` | Text input — `onChange(value, event)` Observer pattern |
| `BadgeAtom` | Status badge with variants |
| `CheckboxAtom` | Accessible checkbox |
| `AvatarAtom` | Avatar with image + initials fallback |
| `SelectAtom` | Native select — `onChange(value, event)` Observer pattern |
| `SwitchAtom` | Toggle switch |
| `TextAtom` | Polymorphic text element |
| `LabelAtom` | Form label with required indicator |
| `ErrorMessageAtom` | Error/description message |
| `SpinnerAtom` | Loading spinner |
| `SeparatorAtom` | Horizontal/vertical divider |
| `ProgressAtom` | Progress bar |
| `SkeletonAtom` | Loading skeleton |
| `ToastAtom` | Toast notification unit |

### Molecules

| Component | Description |
|-----------|-------------|
| `CardMolecule` | Card with Header, Content, Footer slots |
| `AlertMolecule` | Alert banner |
| `FormFieldMolecule` | Input + label + error |
| `CheckboxFieldMolecule` | Checkbox + label + error |
| `SelectFieldMolecule` | Select + label + error |
| `SwitchFieldMolecule` | Switch + label + description |
| `UserAvatarMolecule` | Avatar + name + email |
| `DialogMolecule` | Modal dialog with portal |
| `TabsMolecule` | Tabs with pill/line variants |
| `DropdownMolecule` | Dropdown menu with portal |
| `PaginationMolecule` | Pagination controls |
| `TooltipMolecule` | Tooltip with portal |
| `TableMolecule` | Composable table |
| `BreadcrumbMolecule` | Breadcrumb navigation |
| `SkeletonPresets` | SkeletonUserRow, SkeletonCard, SkeletonForm, SkeletonTableRows |

### Hooks

| Hook | Description |
|------|-------------|
| `useToast` | Toast notifications — wrap app with `<ToastProvider>` |
| `useToastHelpers` | Convenience: `.success()`, `.error()`, `.warning()`, `.info()` |

## Observer Pattern

Each interactive component has an `InterEvents` interface:

```ts
// InterEventsInputAtom.ts
export interface InterEventsInputAtom {
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?:   (value: string, event: React.FocusEvent<HTMLInputElement>) => void;
  onEnterPress?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
}
```

Consumers implement only what they need:

```tsx
<InputAtom
  onChange={(value) => setEmail(value)}
  onEnterPress={(value) => handleSubmit(value)}
/>
```

## JONA Pattern (Organisms)

For organisms, use the full JONA pattern:

```
InterUiFeature.ts     ← Interface (contract)
UiFeatureImpl.tsx     ← Implementation (logic)
UiFeatureView.tsx     ← View (pure render)
UiFeature.tsx         ← Template (wires impl + view)
```
