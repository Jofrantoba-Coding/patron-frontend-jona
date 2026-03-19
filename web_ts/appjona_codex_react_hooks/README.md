# appjona_codex_react_hooks

Arquetipo de referencia para explicar **cómo se implementa JONA en React hooks** cuando el foco está en el patrón, no en el conteo de archivos.

Este ejemplo prioriza:

- `Interface` como contrato explícito.
- `Template` como base visual y lógica local.
- `Implementation` como integración con servicios, router y storage.
- `View Orchestrator` como punto único de entrada registrado en rutas.
- `Atoms`, `Molecules` y `Design Template` reutilizables.

La capa visual usa CSS plano a propósito para que el ejemplo enseñe la arquitectura sin ruido extra de la toolchain de estilos.

## Qué hace que esto sea JONA

El patrón no se define por tener "4 archivos" solamente. Se define por estas invariantes:

1. La vista tiene un **contrato público explícito** en la `Interface`.
2. El `Template` **no depende de backend, router ni storage**.
3. El `Impl` **no renderiza JSX para resolver negocio**; resuelve integraciones.
4. El `View` **solo instancia la implementación y la entrega a la UI**.
5. La UI se compone con piezas reutilizables: `atoms`, `molecules`, `organisms`, `uilayouts`.
6. Para entender una capacidad de negocio, el equipo **lee primero la Interface** y no el archivo visual completo.

## Estructura

```text
web_ts/appjona_codex_react_hooks/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── appStorage.ts
    ├── protectedRoute.tsx
    ├── services/
    │   └── AuthService.ts
    ├── atoms/
    │   ├── AvatarAtom.tsx
    │   ├── ButtonAtom.tsx
    │   ├── ErrorMessageAtom.tsx
    │   ├── InputAtom.tsx
    │   ├── LabelAtom.tsx
    │   └── TextAtom.tsx
    ├── molecules/
    │   ├── FormFieldMolecule.tsx
    │   └── UserAvatarMolecule.tsx
    ├── uilayouts/
    │   └── BorderLayout.tsx
    ├── uiutils/
    │   ├── AppFooter.tsx
    │   └── AppHeader.tsx
    └── views/
        ├── uihome/
        │   ├── InterUiHome.ts
        │   ├── UiHome.tsx
        │   ├── UiHomeImpl.ts
        │   └── UiHomeView.tsx
        ├── uihomesesion/
        │   ├── InterUiHomeSession.ts
        │   ├── UiHomeSession.tsx
        │   ├── UiHomeSessionImpl.ts
        │   └── UiHomeSessionView.tsx
        └── uiiniciarsesion/
            ├── InterUiIniciarSesion.ts
            ├── UiIniciarSesion.tsx
            ├── UiIniciarSesionImpl.ts
            └── UiIniciarSesionView.tsx
```

## Cómo leer el arquetipo

### 1. Empieza por la Interface

Ejemplo: `src/views/uiiniciarsesion/InterUiIniciarSesion.ts`

Ahí están las capacidades públicas del organismo:

- `login`
- `goToCreateAccount`
- `goToRecoverPassword`
- `isValidData`

Si alguien pregunta "¿qué puede hacer esta vista?", la respuesta debe estar primero ahí.

### 2. Después ve al Template

Ejemplo: `src/views/uiiniciarsesion/UiIniciarSesion.tsx`

Ese archivo:

- mantiene `email`, `password`, errores y flags visuales;
- define handlers;
- compone `FormFieldMolecule`, `ButtonAtom` y `TextAtom`;
- puede ejecutarse en modo base sin backend.

Lo importante es que el Template **no sabe autenticar**, **no navega** y **no toca storage**.

### 3. Luego mira el Impl

Ejemplo: `src/views/uiiniciarsesion/UiIniciarSesionImpl.ts`

Ese archivo:

- llama a `AuthService`;
- persiste sesión;
- navega a `/homesesion`;
- captura errores externos.

La regla es simple: **todo lo que conecte con el exterior vive aquí**.

### 4. El View solo conecta capas

Ejemplo: `src/views/uihome/UiHomeView.tsx`

El View:

- instancia `useUiHomeImpl()`;
- entrega el resultado a `UiHome`;
- se registra en el router.

No tiene negocio propio.

## Arquetipo propuesto en React hooks

En React hooks no existe herencia de clases, así que el equivalente del patrón es:

```ts
const base = useUiXxx();
return {
  ...base,
  metodoDelContrato: overrideReal,
  handlerQueDependeDelContrato: nuevoHandler,
};
```

### Nota importante sobre hooks

Cuando un `handler` del Template llama a un método del contrato, ese handler captura la versión base en su cierre.

Por eso, en React hooks:

- si el `Impl` sobreescribe un método del contrato;
- y el `handler` del Template depende de ese método;
- entonces el `Impl` también debe sobreescribir ese `handler`.

Eso se muestra en `UiIniciarSesionImpl.ts`.

## Flujo de rutas en este ejemplo

```text
/login
  -> UiHomeView
     -> useUiHomeImpl()
        -> useUiHome()                [Template page organism]
        -> useUiIniciarSesionImpl()   [Child organism integrated]
           -> useUiIniciarSesion()    [Template child organism]

/homesesion
  -> UiHomeSessionView
     -> useUiHomeSessionImpl()
        -> useUiHomeSession()
```

## Checklist de boundaries

Usa esto cuando agregues un nuevo organismo:

- La `Interface` tiene solo firmas públicas.
- El `Template` no importa servicios, router ni `localStorage`.
- El `Impl` no contiene JSX de negocio ni estilos nuevos para resolver integración.
- El `View` no inventa estado ni pasa mocks para "hacer que compile".
- El organismo visual compone `atoms` y `molecules`, no hace lógica de backend.
- Si el organismo necesita datos persistidos, el `Impl` los hidrata y el `Template` solo los presenta.

## Credenciales mock

- `architect@jona.dev / codex123`
- `integrator@jona.dev / codex123`

## Cómo extender el arquetipo

Para agregar una nueva vista `UiPerfil`:

1. Crea `InterUiPerfil.ts` con el contrato.
2. Crea `UiPerfil.tsx` con estado local, handlers y estructura visual.
3. Crea `UiPerfilImpl.ts` con la integración real.
4. Crea `UiPerfilView.tsx` como entry point.
5. Registra solo `UiPerfilView` en rutas.
6. Si compone otros organismos, pásales contratos o props claras, nunca referencias directas al backend desde el Template.

## Idea central

La meta del patrón es que un desarrollador no tenga que recorrer archivos visuales largos para descubrir la intención de una pantalla. La intención está en la `Interface`. La forma está en el `Template`. La integración está en el `Impl`. La ruta entra por el `View`.
