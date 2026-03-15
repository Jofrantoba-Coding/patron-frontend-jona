# Requirements Document

## Introduction

JONA (Joint Orchestrated N-layer Architecture) es un patrón de diseño frontend creado por @jofrantoba que formaliza la separación de responsabilidades en tres capas bien definidas: Interface (contrato), Template (estructura visual y lógica base) e Implementation (integración con servicios externos). Este spec formaliza el patrón y su arquetipo de proyecto, incluyendo las convenciones de nomenclatura, las reglas de cada capa, y las cuatro implementaciones de referencia en TypeScript/React que demuestran el patrón en distintos paradigmas.

---

## Glossary

- **JONA_Pattern**: El patrón de diseño Joint Orchestrated N-layer Architecture en su totalidad.
- **Interface**: Capa de contrato puro. Define los métodos que la vista puede ejecutar. No contiene lógica, estado ni renderizado.
- **Template**: Capa de estructura visual y lógica base. Implementa la Interface y provee estado, eventos y comportamiento por defecto. No contiene llamadas a servicios externos.
- **Implementation**: Capa de integración. Extiende o compone el Template y sobreescribe los métodos con lógica real (API calls, navegación, storage). No contiene código de UI.
- **View_Orchestrator**: Componente o archivo que instancia la Implementation y la inyecta en el Template visual. Punto de entrada de la vista.
- **Archetype**: Estructura de carpetas y archivos de referencia que materializa el patrón JONA para un paradigma dado.
- **Paradigm**: Variante de implementación del patrón (vanilla TypeScript, React class refs, React class state/props, React hooks).
- **Layer_Boundary**: Regla que prohíbe que una capa acceda a responsabilidades de otra capa.
- **Contract**: Conjunto de firmas de métodos definidas en la Interface que todas las capas deben respetar.
- **AuthService**: Servicio de autenticación usado como caso de uso de referencia en las implementaciones de ejemplo.
- **View**: Unidad funcional de UI compuesta por las tres capas JONA más el View_Orchestrator.

---

## Requirements

### Requirement 1: Definición del Contrato (Interface)

**User Story:** Como desarrollador frontend, quiero definir un contrato explícito para cada vista, para que todos los roles del equipo compartan un acuerdo único e inequívoco sobre las capacidades de la UI.

#### Acceptance Criteria

1. THE JONA_Pattern SHALL requerir que cada View tenga exactamente un archivo Interface que declare las firmas de todos los métodos públicos de la vista.
2. THE Interface SHALL contener únicamente declaraciones de métodos (firmas), sin lógica, sin estado y sin código de renderizado.
3. WHEN se define una Interface, THE Interface SHALL usar nomenclatura `Inter[NombreVista]` (ejemplo: `InterUiIniciarSesion`).
4. THE Interface SHALL ser el único artefacto compartido entre la capa Template y la capa Implementation.
5. IF una firma de método cambia en la Interface, THEN THE JONA_Pattern SHALL requerir que tanto el Template como la Implementation actualicen sus implementaciones para mantener la conformidad con el Contract.

---

### Requirement 2: Capa Template (Estructura Visual y Lógica Base)

**User Story:** Como diseñador UI, quiero una capa dedicada para la estructura visual y el comportamiento base, para que pueda trabajar de forma independiente sin necesidad de conocer los servicios backend.

#### Acceptance Criteria

1. THE Template SHALL implementar la Interface correspondiente y proveer implementaciones por defecto de todos los métodos del Contract.
2. THE Template SHALL gestionar el estado local de la vista (inputs, flags de UI, datos de presentación).
3. THE Template SHALL contener el marcado visual (JSX/HTML) y los estilos de la vista.
4. THE Template SHALL usar nomenclatura `[NombreVista]` para el componente visual y `use[NombreVista]` para el hook de template (ejemplo: `UiIniciarSesion`, `useUiIniciarSesion`).
5. THE Template SHALL exponer los handlers de eventos como métodos que delegan a los métodos del Contract (ejemplo: `handlerLogin` llama a `login`).
6. IF el Template es usado en modo standalone (sin Implementation), THEN THE Template SHALL ejecutar comportamientos por defecto que no dependan de servicios externos (ejemplo: `console.log` o `window.alert`).
7. THE Template SHALL nunca contener llamadas a servicios externos, navegación programática ni acceso a storage.

---

### Requirement 3: Capa Implementation (Integración con Servicios)

**User Story:** Como integrador frontend, quiero una capa dedicada para la lógica de integración, para que pueda conectar la UI con los servicios backend sin modificar la estructura visual.

#### Acceptance Criteria

1. THE Implementation SHALL extender o componer el Template y sobreescribir los métodos del Contract con lógica real de integración.
2. THE Implementation SHALL usar nomenclatura `[NombreVista]Impl` para la clase o `use[NombreVista]Impl` para el hook (ejemplo: `UiIniciarSesionImpl`, `useUiIniciarSesionImpl`).
3. THE Implementation SHALL ser la única capa autorizada a realizar llamadas a servicios externos, navegación programática y operaciones de storage.
4. THE Implementation SHALL nunca contener código de marcado visual (JSX/HTML) ni estilos.
5. WHEN la Implementation sobreescribe un método del Contract, THE Implementation SHALL mantener la misma firma de método definida en la Interface.
6. IF una llamada a servicio externo falla, THEN THE Implementation SHALL manejar el error y comunicarlo al usuario sin propagar excepciones no controladas a la capa Template.

---

### Requirement 4: View Orchestrator

**User Story:** Como desarrollador frontend, quiero un punto de entrada único para cada vista, para que la instanciación de capas y la inyección de dependencias estén centralizadas y sean predecibles.

#### Acceptance Criteria

1. THE View_Orchestrator SHALL instanciar la Implementation y proveer todos los métodos y estado al componente visual del Template mediante props o spread.
2. THE View_Orchestrator SHALL usar nomenclatura `[NombreVista]View` (ejemplo: `UiHomeView`, `UiIniciarSesionView`).
3. THE View_Orchestrator SHALL ser el único punto de entrada registrado en el sistema de rutas de la aplicación.
4. THE View_Orchestrator SHALL no contener lógica de negocio, estado propio ni código de renderizado más allá de la instanciación y composición de capas.
5. WHEN el View_Orchestrator es montado, THE View_Orchestrator SHALL instanciar la Implementation antes de renderizar el componente visual.

---

### Requirement 5: Convenciones de Nomenclatura y Estructura de Archivos

**User Story:** Como miembro del equipo, quiero convenciones de nomenclatura consistentes y predecibles, para que pueda localizar cualquier capa de cualquier vista sin ambigüedad.

#### Acceptance Criteria

1. THE JONA_Pattern SHALL requerir que cada View resida en su propia carpeta bajo `src/views/[nombreVista]/`.
2. THE JONA_Pattern SHALL requerir que los cuatro archivos de cada View sigan la convención: `Inter[Vista].tsx`, `[Vista].tsx`, `[Vista]Impl.tsx`, `[Vista]View.tsx`.
3. THE JONA_Pattern SHALL requerir que los nombres de archivos y carpetas usen camelCase con prefijo `ui` para las vistas (ejemplo: `uiiniciarsesion`, `UiIniciarSesion`).
4. WHERE el paradigma es React hooks, THE JONA_Pattern SHALL requerir que los hooks de Template e Implementation usen el prefijo `use` seguido del nombre de la vista (ejemplo: `useUiIniciarSesion`, `useUiIniciarSesionImpl`).
5. WHERE el paradigma es React class components, THE JONA_Pattern SHALL requerir que Template e Implementation sean clases que extiendan `React.Component` con la clase Implementation extendiendo la clase Template.

---

### Requirement 6: Separación de Roles y Layer Boundaries

**User Story:** Como líder técnico, quiero que las reglas de separación de capas sean verificables, para que el equipo pueda trabajar en paralelo sin conflictos y el código sea auditable.

#### Acceptance Criteria

1. THE JONA_Pattern SHALL definir tres roles explícitos: Diseñador UI (dueño de Interface + Template), Desarrollador Frontend (definición de Interface), e Integrador (dueño de Implementation).
2. THE Layer_Boundary SHALL prohibir que el Template importe o referencie servicios externos, módulos de navegación o APIs de storage.
3. THE Layer_Boundary SHALL prohibir que la Implementation importe o referencie componentes visuales, archivos de estilos o marcado JSX/HTML.
4. THE Layer_Boundary SHALL prohibir que la Interface contenga implementaciones de métodos, estado o imports de dependencias externas.
5. WHEN se realiza una revisión de código, THE JONA_Pattern SHALL proveer una lista de verificación de Layer_Boundary que permita detectar violaciones de forma sistemática.

---

### Requirement 7: Soporte Multi-Paradigma

**User Story:** Como arquitecto de software, quiero que el patrón JONA sea aplicable en distintos paradigmas de React y TypeScript, para que el equipo pueda adoptarlo independientemente del estilo de código del proyecto.

#### Acceptance Criteria

1. THE JONA_Pattern SHALL soportar el paradigma de TypeScript puro con manipulación directa del DOM mediante herencia de clases.
2. THE JONA_Pattern SHALL soportar el paradigma de React class components con `createRef` para inputs no controlados.
3. THE JONA_Pattern SHALL soportar el paradigma de React class components con `state` y `props` para inputs controlados.
4. THE JONA_Pattern SHALL soportar el paradigma de React functional components con composición de hooks (`useTemplate` + `useImpl`).
5. WHEN se implementa el patrón en cualquier paradigma, THE JONA_Pattern SHALL mantener las mismas tres capas (Interface, Template, Implementation) y el mismo View_Orchestrator.
6. THE JONA_Pattern SHALL documentar las diferencias de mecanismo de extensión por paradigma: herencia de clases para class components, composición de hooks para functional components.

---

### Requirement 8: Arquetipo de Proyecto (Project Archetype)

**User Story:** Como desarrollador que adopta JONA, quiero un arquetipo de proyecto listo para usar, para que pueda iniciar un nuevo proyecto con la estructura correcta sin configuración manual.

#### Acceptance Criteria

1. THE Archetype SHALL proveer una estructura de carpetas base con al menos una View de ejemplo completa (Interface + Template + Implementation + View_Orchestrator).
2. THE Archetype SHALL incluir configuración de React 18, TypeScript 5, Vite, Tailwind CSS y React Router v6.
3. THE Archetype SHALL incluir un servicio de ejemplo (`AuthService`) que demuestre el patrón de integración desde la capa Implementation.
4. THE Archetype SHALL incluir un sistema de rutas protegidas (`ProtectedRoute`) que demuestre la integración del View_Orchestrator con React Router.
5. THE Archetype SHALL incluir documentación inline en cada archivo generado que identifique explícitamente a qué capa JONA pertenece y cuáles son las responsabilidades de esa capa.
6. WHEN un desarrollador clona el Archetype, THE Archetype SHALL ejecutarse sin errores con `npm install && npm run dev`.

---

### Requirement 9: Documentación del Patrón

**User Story:** Como nuevo miembro del equipo, quiero documentación clara del patrón JONA, para que pueda entender las reglas y aplicarlas correctamente sin necesidad de revisar el código de referencia.

#### Acceptance Criteria

1. THE JONA_Pattern SHALL proveer un documento README que explique las tres capas, sus responsabilidades y sus restricciones.
2. THE JONA_Pattern SHALL proveer ejemplos de código para cada capa en al menos dos paradigmas (hooks y class components).
3. THE JONA_Pattern SHALL proveer un diagrama de arquitectura que muestre las relaciones entre Interface, Template, Implementation y View_Orchestrator.
4. THE JONA_Pattern SHALL proveer una tabla de comparación con patrones establecidos (Template Method GoF, MVP, Clean Architecture, MVVM).
5. THE JONA_Pattern SHALL proveer una lista de verificación (checklist) de Layer_Boundary para uso en revisiones de código.
6. WHEN se agrega un nuevo paradigma al repositorio, THE JONA_Pattern SHALL requerir que la documentación sea actualizada para incluir el nuevo paradigma con ejemplos de código equivalentes.
