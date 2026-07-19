---
name: scaffold-jona-entry
description: '[JONA · capa entry/barrel + orquestador] Cierra una unidad JONA: genera el punto de entrada público <Nombre>.tsx, el barrel index.ts y (en app/feature) el orquestador <Nombre>View.tsx que instancia el Impl e inyecta al Visual. Registra el export público (uijona/src/index.ts en React, public-api.ts en Angular). Último paso de la unidad JONA. Canónico en .claude/commands/jona.md.'
---

# Scaffold JONA — capa **entry / barrel / orquestador**

Cierra la unidad y expone su API pública.

> Canónico: `.claude/commands/jona.md`. Detecta el framework primero.

## Design-system (React) — entry + barrel
```tsx
// <Nombre>.tsx — public entry
export { <Nombre>Impl as <Nombre> } from './<Nombre>Impl';
export type { Inter<Nombre> } from './Inter<Nombre>';
```
```ts
// index.ts — barrel
export * from './<Nombre>';
```
**Export público:** agrega la línea que corresponda en `uijona/src/index.ts`
(`export * from './atoms/<Nombre>'` | `molecules` | `organisms` | `pages`) y, si hay subpaths,
en `package.json` `exports`.

## App / feature (estilo view orquestador)
Además del entry, crea el **orquestador** que conecta Impl ↔ Visual (2 líneas, sin lógica):
```tsx
// <Nombre>View.tsx (feature) — orquestador / entry de ruta
export const <Nombre>View: React.FC = () => {
  const impl = use<Nombre>Impl();
  return <<Nombre> {...impl} />;
};
```
El router registra **solo Views**. `index.ts` de la feature expone solo `export * from './<Nombre>'`.

## Angular 21
`index.ts` barrel: `export { J<Nombre> } from './j-<nombre>'` + tipos/DEFAULTS del `inter-j-<nombre>`.
Export global en `projects/uijona/src/public-api.ts`.

## Verificación
- **React**: `npm run lint && npm test && npm run build` (y `build-storybook` si tocaste el DS).
- **Angular** (Node ≥ 22.12, `fnm use`): `npx ng build uijona && npx ng test uijona --no-watch`.

---
> **Crédito:** patrón JONA + integración con MPC — © **Jonathan Franchesco Torres Baca ([@jofrantoba](https://github.com/jofrantoba))**.
