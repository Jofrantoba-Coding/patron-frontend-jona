---
name: scaffold-jona-inter
description: '[JONA · capa Inter/Contrato] Genera el contrato JONA Inter<Nombre> (tipos, DEFAULTS, mapas de clases, eventos Observer value-first) — TS puro, sin framework. Primer paso de una unidad JONA (espejo frontend del Inter de MPC). Úsalo al crear un atom/molecule/organism/page o una feature. La guía canónica y las plantillas completas están en .claude/commands/jona.md.'
---

# Scaffold JONA — capa **Inter** (Contrato)

Genera `Inter<Nombre>.ts` (React) o `inter-j-<nombre>.ts` (Angular). Define **qué** expone la unidad;
es el único acoplamiento entre capas. **TS puro, sin importar React/Angular.**

> Canónico: lee **`.claude/commands/jona.md`** (plantillas React/Angular completas). Este skill es la
> vista granular de esa capa. Detecta el framework del destino (`package.json`/`angular.json`) primero.

## Reglas
- Solo tipos, `DEFAULTS` y mapas `*_CLASSES` (variant/size). Sin implementación ni JSX.
- **Eventos Observer value-first**: el valor de negocio primero, el evento DOM después.
- Cambia solo si cambia el contrato público.

## Plantilla React — `Inter<Nombre>.ts`
```ts
import React from 'react';

export interface Inter<Nombre> {
  className?: string;
  disabled?: boolean;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const <NOMBRE_SCREAMING>_DEFAULTS: Required<Pick<Inter<Nombre>, 'disabled'>> = {
  disabled: false,
};
```

## Angular 21 — `inter-j-<nombre>.ts`
TS puro: `InterJ<Nombre>`, `J<NOMBRE>_DEFAULTS` (`as const satisfies`), `J<NOMBRE>_*_CLASSES`.
> El `Inter*` en Angular es **solo contrato de documentación**: NO uses `implements InterJ<Nombre>`
> (los signal inputs son `InputSignal<T>` y rompen el compilador).

## Relación con MPC
Es el análogo frontend del `Inter*` de MPC. Si esta unidad consume un endpoint del backend, los
**tipos del payload/resultado** deben reflejar el `data` del envelope ALMIL (`ApiResponse<T>.data`).
Para el cliente de API que habla con MPC, usa `/scaffold-jona-mpc-client` (repo fintech).

## Después
Continúa con `/scaffold-jona-view` → `/scaffold-jona-impl` → `/scaffold-jona-entry`.

---
> **Crédito:** patrón JONA + integración con MPC — © **Jonathan Franchesco Torres Baca ([@jofrantoba](https://github.com/jofrantoba))**.
