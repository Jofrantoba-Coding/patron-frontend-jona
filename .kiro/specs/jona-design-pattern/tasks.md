# Implementation Plan: JONA Design Pattern

## Overview

Formalización del patrón JONA (Joint Orchestrated N-layer Architecture) mediante la creación del arquetipo de referencia en React 18 + TypeScript 5 + Vite + Tailwind CSS + React Router v6, con las cuatro implementaciones de paradigma, property-based tests con fast-check y documentación del patrón.

## Tasks

- [ ] 1. Configurar arquetipo base (React hooks — paradigma principal)
  - [ ] 1.1 Inicializar proyecto con Vite + React 18 + TypeScript 5
    - Crear `package.json` con dependencias: react 18, react-dom, react-router-dom v6, typescript 5, vite, tailwindcss, postcss, autoprefixer
    - Crear `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
    - Crear `tailwind.config.js` y `postcss.config.js`
    - Crear `index.html` y `src/main.tsx` con `ReactDOM.createRoot`
    - _Requirements: 8.2, 8.6_

  - [ ] 1.2 Configurar dependencias de testing
    - Agregar `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check` a `devDependencies`
    - Crear `vitest.config.ts` con `environment: 'jsdom'` y `setupFiles`
    - Crear `src/test/setup.ts` con import de `@testing-library/jest-dom` y stub de `window.alert`
    - _Requirements: 8.2_

  - [ ] 1.3 Crear estructura de carpetas base del arquetipo
    - Crear directorios: `src/views/`, `src/services/`, `src/uilayouts/`, `src/uiutils/`, `src/resources/css/`
    - Crear `src/resources/css/BorderLayout.css` e `src/resources/css/index.css`
    - Crear `src/index.css` con directivas Tailwind (`@tailwind base/components/utilities`)
    - _Requirements: 5.1, 8.1_

- [ ] 2. Implementar AuthService y ProtectedRoute
  - [ ] 2.1 Crear AuthService con mock de autenticación
    - Crear `src/services/AuthService.ts` con interfaz `AuthResponse` y método `login(email, password): Promise<AuthResponse>`
    - Incluir usuarios mock y simulación de latencia de red
    - Documentar inline que es la capa de servicios (solo accesible desde Implementation)
    - _Requirements: 8.3, 3.3_

  - [ ] 2.2 Crear ProtectedRoute para rutas protegidas
    - Crear `src/protectedRoute.tsx` que lea `jona_authenticated` de `localStorage` y redirija a `/login` si no está autenticado
    - Usar `<Outlet />` de React Router v6 para rutas anidadas
    - _Requirements: 8.4_

  - [ ]* 2.3 Escribir unit tests para AuthService y ProtectedRoute
    - Test: `AuthService.login` resuelve con token y user para credenciales válidas
    - Test: `AuthService.login` rechaza con mensaje de error para credenciales inválidas
    - Test: `ProtectedRoute` redirige a `/login` cuando `jona_authenticated` no está en localStorage
    - Test: `ProtectedRoute` renderiza `<Outlet />` cuando `jona_authenticated` es `'true'`
    - _Requirements: 8.3, 8.4_

- [ ] 3. Implementar vista UiIniciarSesion (paradigma React hooks)
  - [ ] 3.1 Crear Interface `InterUiIniciarSesion`
    - Crear `src/views/uiiniciarsesion/InterUiIniciarSesion.tsx`
    - Declarar firmas: `login`, `goToCreateAccount`, `goToRecoverPassword`, `isValidData`
    - Sin imports externos, sin lógica, sin estado
    - Documentar inline que es la capa Interface (contrato puro)
    - _Requirements: 1.1, 1.2, 1.3, 5.2_

  - [ ] 3.2 Crear Template `useUiIniciarSesion` + componente visual `UiIniciarSesion`
    - Crear `src/views/uiiniciarsesion/UiIniciarSesion.tsx`
    - Hook `useUiIniciarSesion`: estado `email`/`password` con `useState`, métodos stub del contrato, handlers que delegan al contrato
    - Componente visual `UiIniciarSesion`: JSX con form, inputs controlados, botones; acepta props inyectadas desde fuera
    - Sin imports de servicios, navegación ni storage
    - Documentar inline que es la capa Template
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 5.2_

  - [ ]* 3.3 Escribir property test — Property 1: Template implementa el contrato completo
    - Crear `src/views/uiiniciarsesion/__tests__/UiIniciarSesion.property.test.ts`
    - **Property 1: Template implementa el contrato completo**
    - Usar `fc.record({ email: fc.string(), password: fc.string() })` para generar inputs
    - Verificar que todos los métodos del contrato son invocables sin lanzar excepciones
    - Tag: `// Feature: jona-design-pattern, Property 1`
    - **Validates: Requirements 2.1, 2.6**
    - _Requirements: 2.1, 2.6_

  - [ ]* 3.4 Escribir property test — Property 2: Handlers del Template delegan al contrato
    - **Property 2: Handlers del Template delegan al contrato**
    - Usar `fc.record({ email: fc.emailAddress(), password: fc.string({ minLength: 1 }) })`
    - Verificar que `handlerLogin` invoca `login` con los argumentos correctos usando `vi.spyOn`
    - Tag: `// Feature: jona-design-pattern, Property 2`
    - **Validates: Requirements 2.5**
    - _Requirements: 2.5_

  - [ ] 3.5 Crear Implementation `useUiIniciarSesionImpl`
    - Crear `src/views/uiiniciarsesion/UiIniciarSesionImpl.tsx`
    - Hook `useUiIniciarSesionImpl`: compone `useUiIniciarSesion()`, sobreescribe `login` con llamada a `AuthService`, maneja `.catch` sin propagar excepciones, usa `useNavigate` para redirigir
    - Sin JSX, sin imports de componentes visuales ni CSS
    - Documentar inline que es la capa Implementation
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 5.2_

  - [ ]* 3.6 Escribir property test — Property 3: Implementation sobreescribe con lógica real
    - **Property 3: Implementation sobreescribe el contrato con lógica real**
    - Mockear `AuthService.login` con `vi.fn().mockResolvedValue(...)`
    - Verificar que el método `login` de la Implementation invoca `AuthService.login` (no el stub del Template)
    - Tag: `// Feature: jona-design-pattern, Property 3`
    - **Validates: Requirements 3.1**
    - _Requirements: 3.1_

  - [ ]* 3.7 Escribir property test — Property 4: Implementation maneja errores sin propagar excepciones
    - **Property 4: Implementation maneja errores de servicios sin propagar excepciones**
    - Usar `fc.string()` para generar mensajes de error arbitrarios
    - Mockear `AuthService.login` con `vi.fn().mockRejectedValue(new Error(errorMsg))`
    - Verificar que `impl.login(email, password)` no lanza excepción
    - Tag: `// Feature: jona-design-pattern, Property 4`
    - **Validates: Requirements 3.6**
    - _Requirements: 3.6_

  - [ ] 3.8 Crear View Orchestrator `UiIniciarSesionView`
    - Crear `src/views/uiiniciarsesion/UiIniciarSesionView.tsx` (o usar `UiHomeView` como patrón)
    - Instanciar `useUiIniciarSesionImpl()` y hacer spread de props al componente visual `UiIniciarSesion`
    - Sin lógica de negocio ni estado propio
    - Documentar inline que es el View Orchestrator
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.2_

  - [ ]* 3.9 Escribir property test — Property 6: Orchestrator provee todas las props requeridas
    - **Property 6: Orchestrator provee todas las props requeridas al componente visual**
    - Renderizar `UiIniciarSesionView` con `@testing-library/react` dentro de `MemoryRouter`
    - Verificar que ninguna prop requerida (email, password, handlers) es `undefined` en el primer render
    - Tag: `// Feature: jona-design-pattern, Property 6`
    - **Validates: Requirements 4.1, 4.5**
    - _Requirements: 4.1, 4.5_

- [ ] 4. Implementar vista UiHome y UiHomeSession (paradigma React hooks)
  - [ ] 4.1 Crear Interface, Template, Implementation y Orchestrator para `UiHome`
    - Crear `src/views/uihome/InterUiHome.tsx`, `UiHome.tsx`, `UiHomeImpl.ts`, `UiHomeView.tsx`
    - Template: estado y comportamiento base para la vista de inicio (pre-login)
    - Implementation: sin servicios externos (vista pública), puede incluir navegación a login
    - Orchestrator: registrado en la ruta `/login`
    - Documentar inline cada capa
    - _Requirements: 1.1–1.5, 2.1–2.7, 3.1–3.6, 4.1–4.5, 5.1–5.5_

  - [ ] 4.2 Crear Interface, Template, Implementation y Orchestrator para `UiHomeSession`
    - Crear `src/views/uihomesesion/InterUiHomeSession.tsx` (si no existe), `UiHomeSession.tsx`, `UiHomeSessionImpl.ts`, `UiHomeSessionView.tsx`
    - Template: muestra datos del usuario autenticado leídos desde localStorage
    - Implementation: lógica de logout (limpiar localStorage, navegar a `/login`)
    - Orchestrator: registrado en la ruta `/homesesion` bajo `ProtectedRoute`
    - _Requirements: 1.1–1.5, 2.1–2.7, 3.1–3.6, 4.1–4.5_

  - [ ] 4.3 Configurar App.tsx con React Router v6
    - Crear `src/App.tsx` con `BrowserRouter`, rutas `/login`, `/homesesion` (bajo `ProtectedRoute`), y wildcard `*` que redirige a `/login`
    - Registrar únicamente los View Orchestrators en las rutas
    - _Requirements: 4.3, 8.4_

- [ ] 5. Checkpoint — Verificar arquetipo React hooks
  - Asegurar que todos los tests pasan con `vitest --run`
  - Verificar que el proyecto compila sin errores con `tsc --noEmit`
  - Verificar que cada vista tiene exactamente cuatro archivos con nomenclatura canónica
  - Preguntar al usuario si hay ajustes antes de continuar con los otros paradigmas.

- [ ] 6. Implementar paradigma TypeScript puro (`appjona_ts_puro`)
  - [ ] 6.1 Crear estructura de proyecto TypeScript puro
    - Crear directorio `web_ts/appjona_ts_puro/src/views/uiiniciarsesion/`
    - Crear `package.json` mínimo con TypeScript y un bundler (esbuild o tsc directo)
    - _Requirements: 7.1, 8.1_

  - [ ] 6.2 Implementar las cuatro capas JONA en TypeScript puro
    - `InterUiIniciarSesion.ts`: interface con firmas `login`, `goToCreateAccount`, `goToRecoverPassword`, `isValidData`
    - `UiIniciarSesion.ts`: clase que implementa la Interface, manipula DOM con `document.getElementById`, métodos stub
    - `UiIniciarSesionImpl.ts`: clase que extiende `UiIniciarSesion` con `override`, llama a `AuthService`
    - `UiIniciarSesionView.ts`: instancia `UiIniciarSesionImpl` y conecta con el DOM
    - Documentar inline cada capa con su rol JONA
    - _Requirements: 7.1, 7.5, 7.6, 5.2_

  - [ ]* 6.3 Escribir property test — Property 5 (paradigma TS puro)
    - **Property 5: El patrón se mantiene en todos los paradigmas — TS puro**
    - Verificar que la implementación TS puro expone los mismos métodos del contrato que el paradigma hooks
    - Tag: `// Feature: jona-design-pattern, Property 5`
    - **Validates: Requirements 7.1, 7.5**
    - _Requirements: 7.1, 7.5_

- [ ] 7. Implementar paradigma React class + refs (`appjona_react_refs`)
  - [ ] 7.1 Implementar las cuatro capas JONA con React class components y createRef
    - `InterUiIniciarSesion.tsx`: interface idéntica al paradigma hooks
    - `UiIniciarSesion.tsx`: clase `extends React.Component` que implementa la Interface, usa `createRef` para inputs no controlados, método `render()` con JSX
    - `UiIniciarSesionImpl.tsx`: clase que extiende `UiIniciarSesion`, sobreescribe métodos del contrato con `override`, llama a `AuthService`
    - `UiIniciarSesionView.tsx`: componente funcional que instancia `UiIniciarSesionImpl` y lo renderiza
    - Documentar inline cada capa
    - _Requirements: 7.2, 7.5, 7.6, 5.5_

  - [ ]* 7.2 Escribir property test — Property 5 (paradigma React refs)
    - **Property 5: El patrón se mantiene en todos los paradigmas — React class refs**
    - Verificar que la clase Implementation expone los mismos métodos del contrato
    - Tag: `// Feature: jona-design-pattern, Property 5`
    - **Validates: Requirements 7.2, 7.5**
    - _Requirements: 7.2, 7.5_

- [ ] 8. Implementar paradigma React class + state/props (`appjona_react_state_props`)
  - [ ] 8.1 Implementar las cuatro capas JONA con React class components y state controlado
    - `InterUiIniciarSesion.tsx`: interface idéntica
    - `UiIniciarSesion.tsx`: clase `extends React.Component<P, S>` con `this.state` para inputs controlados, `this.setState` en `onChange`, método `render()` con JSX
    - `UiIniciarSesionImpl.tsx`: clase que extiende `UiIniciarSesion`, sobreescribe métodos con lógica real
    - `UiIniciarSesionView.tsx`: orquestador que instancia y renderiza
    - Documentar inline cada capa
    - _Requirements: 7.3, 7.5, 7.6, 5.5_

  - [ ]* 8.2 Escribir property test — Property 5 (paradigma React state/props)
    - **Property 5: El patrón se mantiene en todos los paradigmas — React class state/props**
    - Verificar que la clase Implementation expone los mismos métodos del contrato
    - Tag: `// Feature: jona-design-pattern, Property 5`
    - **Validates: Requirements 7.3, 7.5**
    - _Requirements: 7.3, 7.5_

- [ ] 9. Escribir property test cross-paradigma — Property 5 completa
  - [ ] 9.1 Crear test que verifica los cuatro paradigmas en un solo assert
    - Crear `src/test/crossParadigm.property.test.ts` en el proyecto hooks (o en un directorio de tests compartido)
    - Instanciar representantes de los cuatro paradigmas: `getHooksImpl()`, `getClassRefsImpl()`, `getClassStatePropsImpl()`, `getTsPuroImpl()`
    - Usar `fc.constantFrom(...paradigms)` para iterar sobre todos
    - Verificar que cada paradigma expone `login`, `goToCreateAccount`, `goToRecoverPassword`, `isValidData` como funciones
    - Tag: `// Feature: jona-design-pattern, Property 5`
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
    - _Requirements: 7.1–7.5_

- [ ] 10. Escribir property test — Property 7: Archetype contiene todos los artefactos JONA
  - [ ] 10.1 Crear test de estructura de archivos del arquetipo
    - Crear `src/test/archetype.property.test.ts`
    - Para cada vista de ejemplo (`uiiniciarsesion`, `uihome`, `uihomesesion`), verificar que existen los cuatro archivos canónicos usando `fs.existsSync`
    - Verificar que `package.json` contiene las dependencias requeridas (react ^18, typescript ^5, vite, tailwindcss, react-router-dom ^6)
    - Verificar que existen `src/services/AuthService.ts` y `src/protectedRoute.tsx`
    - Tag: `// Feature: jona-design-pattern, Property 7`
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**
    - _Requirements: 8.1–8.4_

- [ ] 11. Checkpoint — Verificar todos los paradigmas y property tests
  - Ejecutar `vitest --run` en el proyecto hooks y verificar que los 7 property tests pasan
  - Verificar que los proyectos `appjona_react_refs` y `appjona_react_state_props` compilan sin errores
  - Preguntar al usuario si hay ajustes antes de continuar con la documentación.

- [ ] 12. Documentación inline y README del patrón
  - [ ] 12.1 Agregar documentación inline a todos los archivos del arquetipo hooks
    - Cada archivo debe tener un comentario de cabecera que identifique: capa JONA, responsabilidades, restricciones de importación
    - Formato: `// [NombreArchivo].tsx\n// Capa: [Interface|Template|Implementation|Orchestrator]\n// Responsabilidad: ...\n// Restricciones: ...`
    - _Requirements: 8.5, 9.1_

  - [ ] 12.2 Crear README del patrón JONA
    - Crear `README.md` en la raíz del arquetipo hooks (o en `.kiro/specs/jona-design-pattern/`)
    - Incluir: descripción de las tres capas + Orchestrator, diagrama ASCII de arquitectura, tabla de comparación con patrones GoF/MVP/MVVM/Clean Architecture, ejemplos de código para paradigma hooks y class components
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 12.3 Crear checklist de Layer Boundary
    - Agregar sección "Layer Boundary Checklist" al README con lista de verificación para revisiones de código
    - Incluir reglas verificables: Interface sin imports, Template sin servicios, Implementation sin JSX, Orchestrator sin lógica de negocio
    - _Requirements: 6.5, 9.5_

- [ ] 13. Checkpoint final — Verificar todo el spec
  - Ejecutar `vitest --run` y verificar que todos los tests pasan
  - Verificar que `npm install && npm run dev` funciona sin errores en el arquetipo hooks
  - Verificar que los cuatro paradigmas tienen las tres capas + Orchestrator con nomenclatura canónica
  - Preguntar al usuario si hay ajustes finales.

## Notes

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- El paradigma React hooks (`appjona_react_hooks`) es el paradigma principal y debe completarse primero
- Los property tests usan fast-check con `numRuns: 100` por defecto
- Cada property test debe incluir el tag `// Feature: jona-design-pattern, Property N`
- Los checkpoints en tareas 5, 11 y 13 son puntos de validación incremental
- La nomenclatura canónica es: `Inter[Vista].tsx`, `[Vista].tsx`, `[Vista]Impl.tsx`, `[Vista]View.tsx`
