# appjona_codex_react_hooks

Arquetipo de referencia para aplicar el patron JONA en React con hooks, separando responsabilidades por capas y contratos.

## Objetivo

Este proyecto muestra como implementar una vista para que:

- el contrato publico viva en una interfaz clara,
- la UI no mezcle integracion externa con render,
- la logica de backend/router/storage quede aislada en `Impl`,
- la entrada por rutas se haga solo desde `View`.

La meta del patron no es "tener N archivos", sino mantener boundaries tecnicos claros.

## Stack

- React 18 + TypeScript
- React Router 6
- Vite 5

## Comandos

Desde `web_ts/appjona_codex_react_hooks`:

```bash
npm install
npm run dev
```

Comandos utiles:

```bash
npm run typecheck
npm run build
npm run preview
```

## Rutas

- `/login` -> `UiHomeView`
- `/homesesion` -> `UiHomeSessionView` (protegida por `ProtectedRoute`)
- `/` y `*` redirigen a `/login`

## Capas del patron (React hooks)

Cada vista se organiza asi:

1. `InterUiXxx.ts`
Contrato publico: solo firmas.

2. `UiXxxProps.ts`
Contrato de props para el componente visual.

3. `UiXxxTemplateModel.ts`
Modelo base con estado local y handlers base (`useUiXxx`).

4. `UiXxx.tsx`
Template visual: JSX + composicion de atoms/molecules/layouts.

5. `UiXxxImpl.ts`
Integracion real con servicios, router, storage y errores externos.

6. `UiXxxView.tsx`
Orquestador de entrada: instancia `useUiXxxImpl()` y lo pasa al template.

## Ejemplo real en este repo

### uiiniciarsesion

- `InterUiIniciarSesion.ts`: define `login`, `goToCreateAccount`, `goToRecoverPassword`, `isValidData`.
- `UiIniciarSesionTemplateModel.ts`: estado local (`email`, `password`, errores, flags) y handlers base.
- `UiIniciarSesion.tsx`: formulario y composicion visual.
- `UiIniciarSesionImpl.ts`: usa `AuthService`, persiste sesion y navega a `/homesesion`.

### uihome

- `UiHomeTemplateModel.ts`: estado local del panel de guia.
- `UiHomeImpl.ts`: integra storage para persistir si la guia fue cerrada.
- `UiHome.tsx`: compone contenido y renderiza `UiIniciarSesion`.

### uihomesesion

- `UiHomeSessionTemplateModel.ts`: estado base de usuario mostrado.
- `UiHomeSessionImpl.ts`: hidrata usuario desde storage y resuelve logout/navegacion.
- `UiHomeSession.tsx`: presenta sesion autenticada.

## Caracteristicas que definen el patron (mas alla del numero de archivos)

- Contrato explicito por interfaz (`InterUiXxx`).
- Separacion estricta UI vs integracion externa.
- Componentes reutilizables (`atoms`, `molecules`, `uilayouts`, `uiutils`).
- Capas con responsabilidad unica.
- View como unico entrypoint de ruta.
- Lectura de negocio guiada por contrato, no por archivos visuales largos.
- Evolucion por extension (`Impl`) sin romper la base (`TemplateModel` + `Template`).

## Regla importante en React hooks

Si `Impl` sobreescribe un metodo del contrato y un handler base dependia de ese metodo, ese handler tambien debe sobreescribirse en `Impl` para evitar cierres con referencias antiguas.

## Credenciales mock

- `architect@jona.dev / codex123`
- `integrator@jona.dev / codex123`

## Checklist rapido para nuevas vistas

1. Define el contrato en `InterUiXxx.ts`.
2. Declara props visuales en `UiXxxProps.ts`.
3. Implementa base local en `UiXxxTemplateModel.ts`.
4. Crea template visual en `UiXxx.tsx` sin backend/router/storage.
5. Conecta integraciones reales en `UiXxxImpl.ts`.
6. Expone entrada en `UiXxxView.tsx` y registra esa vista en rutas.

## Estructura principal

```text
web_ts/appjona_codex_react_hooks/
+-- package.json
+-- README.md
`-- src/
    +-- App.tsx
    +-- appStorage.ts
    +-- protectedRoute.tsx
    +-- services/
    |   `-- AuthService.ts
    +-- atoms/
    +-- molecules/
    +-- uilayouts/
    +-- uiutils/
    `-- views/
        +-- uihome/
        |   +-- InterUiHome.ts
        |   +-- UiHomeProps.ts
        |   +-- UiHomeTemplateModel.ts
        |   +-- UiHome.tsx
        |   +-- UiHomeImpl.ts
        |   `-- UiHomeView.tsx
        +-- uihomesesion/
        |   +-- InterUiHomeSession.ts
        |   +-- UiHomeSessionProps.ts
        |   +-- UiHomeSessionTemplateModel.ts
        |   +-- UiHomeSession.tsx
        |   +-- UiHomeSessionImpl.ts
        |   `-- UiHomeSessionView.tsx
        `-- uiiniciarsesion/
            +-- InterUiIniciarSesion.ts
            +-- UiIniciarSesionProps.ts
            +-- UiIniciarSesionTemplateModel.ts
            +-- UiIniciarSesion.tsx
            +-- UiIniciarSesionImpl.ts
            `-- UiIniciarSesionView.tsx
```
