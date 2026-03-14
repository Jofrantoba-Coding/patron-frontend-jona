# appjona_react_hooks

Implementación del patrón JONA en React con functional components y hooks.

## Descripción

Esta demo adapta el patrón JONA al paradigma funcional de React. En lugar de herencia de clases, la extensión se logra mediante composición de hooks: el hook de implementación consume el hook plantilla y sobreescribe los métodos que necesita.

## Patrón JONA aplicado

| Archivo | Rol |
|---|---|
| `InterUiIniciarSesion.tsx` | Interfaz — define el contrato de métodos |
| `UiIniciarSesion.tsx` | Hook plantilla + componente visual — `useUiIniciarSesion` y `UiIniciarSesion` |
| `UiIniciarSesionImpl.tsx` | Hook implementación — `useUiIniciarSesionImpl`, solo métodos, sin JSX |

## Cómo funciona

`useUiIniciarSesion` provee el estado (`email`, `password`) y los métodos base. `useUiIniciarSesionImpl` llama al hook plantilla internamente y sobreescribe los métodos de negocio mediante spread. El componente visual `UiIniciarSesion` es un functional component puro que recibe todo por props. `UiHome` orquesta: instancia el hook de implementación e inyecta sus métodos en el componente visual.

```
useUiIniciarSesionImpl
  └── useUiIniciarSesion   (estado base)
        └── UiIniciarSesion (UI)
```

## Levantar el proyecto

```bash
npm install
npm run dev
```

Abrir: `http://localhost:5173/login`
