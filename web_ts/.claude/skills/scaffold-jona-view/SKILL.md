---
name: scaffold-jona-view
description: '[JONA · capa View/Visual] Genera la vista pura JONA <Nombre>View.tsx (React) o el template del @Component (Angular) — solo render con props ya resueltas: sin useState/useEffect, sin async, sin navegación, sin servicios. La puede tocar un UI designer sin conocer la lógica. La guía canónica está en .claude/commands/jona.md.'
---

# Scaffold JONA — capa **View** (Visual puro)

Genera `<Nombre>View.tsx` (React) o el **template** del `@Component` (Angular). Renderiza UI con
**props ya resueltas**. Es la capa que un diseñador puede modificar de forma aislada (Storybook).

> Canónico: `.claude/commands/jona.md`. Detecta el framework del destino primero.

## Reglas
- Solo JSX + Tailwind/CSS. **Prohibido**: `useState`, `useEffect`, llamadas async, navegación, imports de servicios.
- Todo (estado y handlers) entra por props.
- Tailwind mobile-first (`w-full`, `min-w-0`, `max-w-full`, `text-sm`, `flex flex-col` → `sm:flex-row`).
- Accesibilidad mínima: `aria-label` en botones sin texto, `aria-invalid`/`aria-describedby` en inputs con error.

## Plantilla React — `<Nombre>View.tsx`
```tsx
import React from 'react';
import { cn } from '../../lib/cn';
import { Inter<Nombre> } from './Inter<Nombre>';

interface <Nombre>ViewProps extends Inter<Nombre> {
  forwardedRef?: React.Ref<HTMLInputElement>;
}

export const <Nombre>View: React.FC<<Nombre>ViewProps> = ({ className, forwardedRef, ...props }) => (
  <input
    ref={forwardedRef}
    className={cn('w-full min-w-0 rounded-md border px-3 py-2 text-sm', className)}
    {...props}
  />
);
```

## Angular 21
La "vista pura" es el **template** del `@Component` (inline o `.html`); las clases se calculan con
`computed(() => cn(...))`. Slots (`ReactNode`) → proyección con `<ng-content>` / `<ng-content select="[jX]">`.

## Después
Continúa con `/scaffold-jona-impl` (la lógica) y `/scaffold-jona-entry`.

---
> **Crédito:** patrón JONA + integración con MPC — © **Jonathan Franchesco Torres Baca ([@jofrantoba](https://github.com/jofrantoba))**.
