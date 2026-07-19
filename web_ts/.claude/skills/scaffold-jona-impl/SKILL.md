---
name: scaffold-jona-impl
description: '[JONA · capa Impl/Integración] Genera la implementación JONA <Nombre>Impl.tsx (React forwardRef + defaults + estado + handlers + side effects) o la clase @Component con signals (Angular). Es la capa que integra con el backend: aquí se llaman servicios/APIs (el Control de MPC vía envelope ALMIL). Consume la View y resuelve el contrato Inter. La guía canónica está en .claude/commands/jona.md.'
---

# Scaffold JONA — capa **Impl** (Lógica e integración)

Genera `<Nombre>Impl.tsx` (React) o la **clase `@Component`** (Angular). Resuelve defaults, gestiona
estado (controlado/no-controlado), handlers, validación y **side effects** (incl. llamadas al backend).

> Canónico: `.claude/commands/jona.md`. Detecta el framework primero.

## Reglas
- **Sin JSX propio**: consume la `View` y le pasa props resueltas.
- React: `React.forwardRef`, `const resolved = { ...<NOMBRE>_DEFAULTS, ...props }`.
- Aquí (y **solo** aquí) viven: llamadas a servicios/API, navegación, `useEffect`/efectos, storage.
- En el estilo "app view" (docs/patron), el Impl **hereda del template** y **sobreescribe solo** lo que
  necesita lógica real (`const base = useTemplate(); return { ...base, login }`).

## Plantilla React — `<Nombre>Impl.tsx`
```tsx
import React from 'react';
import { Inter<Nombre>, <NOMBRE_SCREAMING>_DEFAULTS } from './Inter<Nombre>';
import { <Nombre>View } from './<Nombre>View';

export const <Nombre>Impl = React.forwardRef<HTMLInputElement, Inter<Nombre>>((props, ref) => {
  const resolved = { ...<NOMBRE_SCREAMING>_DEFAULTS, ...props };
  return <<Nombre>View {...resolved} forwardedRef={ref} />;
});
<Nombre>Impl.displayName = '<Nombre>';
```

## Angular 21
La clase `@Component` (standalone, `OnPush`, `host:{class:'contents'}`): entradas `input()/input.required()`,
salidas `output()`, two-way `model()`; clases del template con `computed()`. Formularios: `model()` +
`ControlValueAccessor`. **NO** `implements InterJ<Nombre>`.

## Integración con MPC (el punto clave del framework)
La Impl es **la costura frontend↔backend**. Cuando la unidad consume el backend MPC:
- **No** llames `fetch` crudo aquí: usa el **cliente de API** que habla el envelope **ALMIL**
  (`ApiRequest<T>` → `ApiResponse<T>`), generado con `/scaffold-jona-mpc-client` (repo fintech).
- El cliente arma `{ requestId, tenant, data }`, envía `Authorization: Bearer` + `X-Trace-Id`, y
  desempaqueta `ApiResponse.data` (éxito) o `ApiResponse.errors` (400/422).
- La Impl mapea ese resultado al estado de la vista y a los eventos Observer del contrato.

```
JONA View → JONA Impl → apiClient (ALMIL) → Gateway → MPC Control → Process → Model → DB
```

## Después
Cierra la unidad con `/scaffold-jona-entry`.

---
> **Crédito:** patrón JONA + integración con MPC — © **Jonathan Franchesco Torres Baca ([@jofrantoba](https://github.com/jofrantoba))**.
