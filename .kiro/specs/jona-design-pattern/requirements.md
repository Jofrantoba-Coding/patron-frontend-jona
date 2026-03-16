# Requirements Document

## Introduction

JONA (Joint Orchestrated N-layer Architecture) es un patrón de diseño frontend creado por @jofrantoba que formaliza la separación de responsabilidades en tres capas bien definidas: Interface (contrato), Template (estructura visual y lógica base) e Implementation (integración con servicios externos). Este spec formaliza el patrón, su arquetipo de proyecto y su integración con el sistema de diseño Atomic Design, donde los **Organismos** son la unidad de composición que implementa el arquetipo JONA. El sistema cubre los cinco niveles de Atomic Design (Átomos, Moléculas, Organismos, Templates y Páginas) y sus implementaciones de referencia en Angular y React (hooks).

---

## Glossary

- **JONA_Pattern**: El patrón de diseño Joint Orchestrated N-layer Architecture en su totalidad.
- **Interface**: Capa de contrato puro. Define los métodos que la vista puede ejecutar. No contiene lógica, estado ni renderizado.
- **Template**: Capa de estructura visual y lógica base. Implementa la Interface y provee estado, eventos y comportamiento por defecto. No contiene llamadas a servicios externos.
- **Implementation**: Capa de integración. Extiende o compone el Template y sobreescribe los métodos con lógica real (API calls, navegación, storage). No contiene código de UI.
- **View_Orchestrator**: Componente o archivo que instancia la Implementation y la inyecta en el Template visual. Punto de entrada de la vista.
- **Archetype**: Estructura de carpetas y archivos de referencia que materializa el patrón JONA para un paradigma dado.
- **Paradigm**: Variante de implementación del patrón (Angular, React hooks).
- **Layer_Boundary**: Regla que prohíbe que una capa acceda a responsabilidades de otra capa.
- **Contract**: Conjunto de firmas de métodos definidas en la Interface que todas las capas deben respetar.
- **AuthService**: Servicio de autenticación usado como caso de uso de referencia en las implementaciones de ejemplo.
- **View**: Unidad funcional de UI compuesta por las tres capas JONA más el View_Orchestrator.
- **Atom**: Componente UI indivisible sin lógica de negocio (botón, input, label, icono). Nivel 1 de Atomic Design.
- **Molecule**: Composición de dos o más Átomos que forma una unidad funcional simple (campo de formulario con label + input + mensaje de error). Nivel 2 de Atomic Design.
- **Organism**: Composición de Moléculas y/o Átomos que implementa el arquetipo JONA completo (Interface + Template + Implementation + View_Orchestrator). Nivel 3 de Atomic Design. Es la unidad mínima que puede conectarse a servicios externos.
- **Design_Template**: Composición de Organismos y Moléculas que define la estructura de una página sin datos reales. Nivel 4 de Atomic Design. Equivale al layout de la vista.
- **Page**: Instancia concreta de un Design_Template con datos reales. Nivel 5 de Atomic Design. Corresponde a la ruta registrada en el router.
- **Atomic_Design_System**: El sistema de diseño completo que organiza los componentes en los cinco niveles de Atomic Design integrado con el patrón JONA.
- **Design_Token**: Variable de diseño (color, tipografía, espaciado, sombra) que garantiza consistencia visual entre todos los niveles del sistema.
- **BorderLayout**: Layout de cinco zonas (north, south, east, west, center) usado como Design_Template base en las implementaciones de referencia.

---

## Requirements

### Requirement 1: Definición del Contrato (Interface)

**User Story:** Como desarrollador frontend, quiero definir un contrato explícito para cada Organismo, para que todos los roles del equipo compartan un acuerdo único e inequívoco sobre las capacidades de la UI.

#### Acceptance Criteria

1. THE JONA_Pattern SHALL requerir que cada Organism tenga exactamente un archivo Interface que declare las firmas de todos los métodos públicos del Organismo.
2. THE Interface SHALL contener únicamente declaraciones de métodos (firmas), sin lógica, sin estado y sin código de renderizado.
3. WHEN se define una Interface, THE Interface SHALL usar nomenclatura `Inter[NombreOrganismo]` (ejemplo: `InterUiIniciarSesion`).
4. THE Interface SHALL ser el único artefacto compartido entre la capa Template y la capa Implementation.
5. IF una firma de método cambia en la Interface, THEN THE JONA_Pattern SHALL requerir que tanto el Template como la Implementation actualicen sus implementaciones para mantener la conformidad con el Contract.

---

### Requirement 2: Capa Template (Estructura Visual y Lógica Base)

**User Story:** Como diseñador UI, quiero una capa dedicada para la estructura visual y el comportamiento base del Organismo, para que pueda trabajar de forma independiente sin necesidad de conocer los servicios backend.

#### Acceptance Criteria

1. THE Template SHALL implementar la Interface correspondiente y proveer implementaciones por defecto de todos los métodos del Contract.
2. THE Template SHALL gestionar el estado local del Organismo (inputs, flags de UI, datos de presentación).
3. THE Template SHALL contener el marcado visual (JSX/HTML/Angular template) y los estilos del Organismo.
4. THE Template SHALL usar nomenclatura `[NombreOrganismo]` para el componente visual y `use[NombreOrganismo]` para el hook de template (ejemplo: `UiIniciarSesion`, `useUiIniciarSesion`).
5. THE Template SHALL exponer los handlers de eventos como métodos que delegan a los métodos del Contract (ejemplo: `handlerLogin` llama a `login`).
6. IF el Template es usado en modo standalone (sin Implementation), THEN THE Template SHALL ejecutar comportamientos por defecto que no dependan de servicios externos (ejemplo: `console.log` o `window.alert`).
7. THE Template SHALL nunca contener llamadas a servicios externos, navegación programática ni acceso a storage.
8. THE Template SHALL componer Moléculas y Átomos del sistema de diseño para construir la estructura visual del Organismo.

---

### Requirement 3: Capa Implementation (Integración con Servicios)

**User Story:** Como integrador frontend, quiero una capa dedicada para la lógica de integración del Organismo, para que pueda conectar la UI con los servicios backend sin modificar la estructura visual.

#### Acceptance Criteria

1. THE Implementation SHALL extender o componer el Template y sobreescribir los métodos del Contract con lógica real de integración.
2. THE Implementation SHALL usar nomenclatura `[NombreOrganismo]Impl` para la clase o `use[NombreOrganismo]Impl` para el hook (ejemplo: `UiIniciarSesionImpl`, `useUiIniciarSesionImpl`).
3. THE Implementation SHALL ser la única capa autorizada a realizar llamadas a servicios externos, navegación programática y operaciones de storage.
4. THE Implementation SHALL nunca contener código de marcado visual (JSX/HTML/Angular template) ni estilos.
5. WHEN la Implementation sobreescribe un método del Contract, THE Implementation SHALL mantener la misma firma de método definida en la Interface.
6. IF una llamada a servicio externo falla, THEN THE Implementation SHALL manejar el error y comunicarlo al usuario sin propagar excepciones no controladas a la capa Template.

---

### Requirement 4: View Orchestrator

**User Story:** Como desarrollador frontend, quiero un punto de entrada único para cada Organismo conectado a una ruta, para que la instanciación de capas y la inyección de dependencias estén centralizadas y sean predecibles.

#### Acceptance Criteria

1. THE View_Orchestrator SHALL instanciar la Implementation y proveer todos los métodos y estado al componente visual del Template mediante props o spread.
2. THE View_Orchestrator SHALL usar nomenclatura `[NombreOrganismo]View` (ejemplo: `UiHomeView`, `UiIniciarSesionView`).
3. THE View_Orchestrator SHALL ser el único punto de entrada registrado en el sistema de rutas de la aplicación.
4. THE View_Orchestrator SHALL no contener lógica de negocio, estado propio ni código de renderizado más allá de la instanciación y composición de capas.
5. WHEN el View_Orchestrator es montado, THE View_Orchestrator SHALL instanciar la Implementation antes de renderizar el componente visual.

---

### Requirement 5: Convenciones de Nomenclatura y Estructura de Archivos

**User Story:** Como miembro del equipo, quiero convenciones de nomenclatura consistentes y predecibles, para que pueda localizar cualquier capa de cualquier Organismo sin ambigüedad.

#### Acceptance Criteria

1. THE JONA_Pattern SHALL requerir que cada Organism resida en su propia carpeta bajo `src/views/[nombreOrganismo]/`.
2. THE JONA_Pattern SHALL requerir que los cuatro archivos de cada Organism sigan la convención: `Inter[Organismo].tsx`, `[Organismo].tsx`, `[Organismo]Impl.tsx`, `[Organismo]View.tsx`.
3. THE JONA_Pattern SHALL requerir que los nombres de archivos y carpetas usen camelCase con prefijo `ui` para los Organismos (ejemplo: `uiiniciarsesion`, `UiIniciarSesion`).
4. WHERE el paradigma es React hooks, THE JONA_Pattern SHALL requerir que los hooks de Template e Implementation usen el prefijo `use` seguido del nombre del Organismo (ejemplo: `useUiIniciarSesion`, `useUiIniciarSesionImpl`).
5. WHERE el paradigma es Angular, THE JONA_Pattern SHALL requerir que Template e Implementation sean componentes Angular standalone con el sufijo `Component` y que la Implementation extienda el Template.

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

### Requirement 7: Soporte Multi-Paradigma (Angular y React)

**User Story:** Como arquitecto de software, quiero que el patrón JONA sea aplicable en Angular y React hooks, para que el equipo pueda adoptarlo en los proyectos existentes del repositorio.

#### Acceptance Criteria

1. THE JONA_Pattern SHALL soportar el paradigma Angular con componentes standalone, donde el Template es un `@Component` que implementa la Interface y la Implementation extiende el Template.
2. THE JONA_Pattern SHALL soportar el paradigma de React functional components con composición de hooks (`useTemplate` + `useImpl`).
3. WHEN se implementa el patrón en cualquier paradigma, THE JONA_Pattern SHALL mantener las mismas tres capas (Interface, Template, Implementation) y el mismo View_Orchestrator.
4. THE JONA_Pattern SHALL documentar las diferencias de mecanismo de extensión por paradigma: herencia de clases para Angular components, composición de hooks para React functional components.
5. WHERE el paradigma es Angular, THE JONA_Pattern SHALL requerir que el View_Orchestrator sea un componente Angular standalone registrado en `app.routes.ts`.
6. WHERE el paradigma es React hooks, THE JONA_Pattern SHALL requerir que el View_Orchestrator sea un functional component registrado en el `BrowserRouter` de `App.tsx`.

---

### Requirement 8: Nivel 1 — Átomos del Sistema de Diseño

**User Story:** Como diseñador UI, quiero un catálogo de Átomos reutilizables, para que todos los componentes del sistema compartan la misma base visual y los Design_Tokens garanticen consistencia.

#### Acceptance Criteria

1. THE Atomic_Design_System SHALL definir un conjunto de Design_Tokens (colores, tipografía, espaciado, sombras, radios de borde) como variables CSS o tokens de Tailwind que todos los niveles del sistema consuman.
2. THE Atomic_Design_System SHALL proveer Átomos de entrada de datos: `InputAtom` (campo de texto), `PasswordInputAtom` (campo de contraseña con toggle de visibilidad), `CheckboxAtom`, `SelectAtom`.
3. THE Atomic_Design_System SHALL proveer Átomos de acción: `ButtonAtom` (con variantes primary, secondary, danger), `IconButtonAtom`, `LinkAtom`.
4. THE Atomic_Design_System SHALL proveer Átomos de presentación: `LabelAtom`, `TextAtom`, `IconAtom`, `AvatarAtom`, `BadgeAtom`.
5. THE Atomic_Design_System SHALL proveer Átomos de retroalimentación: `SpinnerAtom`, `ErrorMessageAtom`, `SuccessMessageAtom`.
6. WHEN un Atom recibe una prop inválida o fuera de rango, THE Atom SHALL renderizar un estado de error visual sin lanzar excepciones.
7. THE Atom SHALL no contener lógica de negocio, llamadas a servicios ni estado global.
8. WHERE el paradigma es Angular, THE Atom SHALL ser un componente Angular standalone con selector `app-[nombre]-atom`.
9. WHERE el paradigma es React hooks, THE Atom SHALL ser un functional component exportado desde `src/atoms/[NombreAtom].tsx`.

---

### Requirement 9: Nivel 2 — Moléculas del Sistema de Diseño

**User Story:** Como diseñador UI, quiero Moléculas que combinen Átomos en unidades funcionales simples, para que los Organismos puedan componer formularios y secciones de forma consistente.

#### Acceptance Criteria

1. THE Atomic_Design_System SHALL proveer una Molécula `FormFieldMolecule` que combine `LabelAtom` + un Atom de entrada + `ErrorMessageAtom` en una unidad cohesiva con validación visual.
2. THE Atomic_Design_System SHALL proveer una Molécula `SearchBarMolecule` que combine `InputAtom` + `IconButtonAtom` para búsquedas.
3. THE Atomic_Design_System SHALL proveer una Molécula `NavItemMolecule` que combine `IconAtom` + `LinkAtom` para ítems de navegación.
4. THE Atomic_Design_System SHALL proveer una Molécula `UserAvatarMolecule` que combine `AvatarAtom` + `TextAtom` para mostrar información del usuario autenticado.
5. THE Atomic_Design_System SHALL proveer una Molécula `AlertMolecule` que combine `IconAtom` + `TextAtom` + `ButtonAtom` para mensajes de alerta accionables.
6. THE Molecule SHALL componer únicamente Átomos del sistema de diseño y no contener lógica de negocio ni llamadas a servicios.
7. WHEN una Molecule recibe datos inválidos o nulos, THE Molecule SHALL renderizar un estado vacío o de error sin lanzar excepciones.
8. WHERE el paradigma es Angular, THE Molecule SHALL ser un componente Angular standalone con selector `app-[nombre]-molecule`.
9. WHERE el paradigma es React hooks, THE Molecule SHALL ser un functional component exportado desde `src/molecules/[NombreMolecule].tsx`.

---

### Requirement 10: Nivel 3 — Organismos como Arquetipo JONA

**User Story:** Como desarrollador frontend, quiero que cada Organismo implemente el arquetipo JONA completo, para que la separación de responsabilidades sea consistente en toda la aplicación.

#### Acceptance Criteria

1. THE Organism SHALL implementar el arquetipo JONA completo con los cuatro artefactos: Interface, Template, Implementation y View_Orchestrator.
2. THE Organism SHALL componer Moléculas y Átomos del sistema de diseño en su capa Template para construir la estructura visual.
3. THE Organism SHALL ser la unidad mínima del sistema que puede conectarse a servicios externos a través de su capa Implementation.
4. THE Atomic_Design_System SHALL proveer al menos los siguientes Organismos de referencia: `UiIniciarSesion` (formulario de login), `UiHome` (página de inicio pública), `UiHomeSession` (página de inicio autenticada).
5. WHEN un Organism es compuesto dentro de un Design_Template, THE Organism SHALL recibir sus dependencias de datos a través de props o inputs, no directamente desde servicios globales en la capa Template.
6. THE Organism SHALL residir en `src/views/[nombreOrganismo]/` con los cuatro archivos canónicos del arquetipo JONA.
7. IF un Organism necesita comunicarse con otro Organism, THEN THE Organism SHALL hacerlo a través de eventos o callbacks definidos en su Interface, nunca mediante referencias directas entre Organismos.

---

### Requirement 11: Nivel 4 — Design Templates (Layouts de Vista)

**User Story:** Como diseñador UI, quiero Design Templates que definan la estructura de las páginas sin datos reales, para que el layout sea reutilizable y los Organismos puedan posicionarse de forma consistente.

#### Acceptance Criteria

1. THE Atomic_Design_System SHALL proveer al menos un Design_Template base: `BorderLayoutTemplate` que organice el contenido en zonas north, south, east, west y center.
2. THE Design_Template SHALL componer Organismos, Moléculas y Átomos en una estructura de página sin datos reales ni lógica de negocio.
3. THE Design_Template SHALL aceptar los Organismos como slots o proyecciones de contenido (Angular `ng-content`, React `children` o props de tipo `ReactNode`).
4. THE Design_Template SHALL definir la estructura de grid, espaciado y responsividad de la página usando Design_Tokens.
5. WHEN un Design_Template es renderizado sin Organismos en sus slots, THE Design_Template SHALL mostrar un estado vacío o placeholder sin lanzar excepciones.
6. THE Design_Template SHALL residir en `src/uilayouts/` y no contener lógica de negocio ni llamadas a servicios.
7. WHERE el paradigma es Angular, THE Design_Template SHALL ser un componente Angular standalone con selector `app-[nombre]-layout`.
8. WHERE el paradigma es React hooks, THE Design_Template SHALL ser un functional component exportado desde `src/uilayouts/[NombreTemplate].tsx`.

---

### Requirement 12: Nivel 5 — Páginas (Pages)

**User Story:** Como desarrollador frontend, quiero que las Páginas sean instancias concretas de Design Templates con Organismos reales, para que cada ruta de la aplicación tenga una composición clara y predecible.

#### Acceptance Criteria

1. THE Page SHALL ser la instancia concreta de un Design_Template con Organismos reales inyectados en sus slots.
2. THE Page SHALL corresponder a exactamente una ruta registrada en el sistema de rutas de la aplicación.
3. THE Page SHALL ser implementada por el View_Orchestrator del Organismo principal de la vista, que compone el Design_Template con los Organismos necesarios.
4. THE Page SHALL no contener lógica de negocio propia; toda la lógica debe residir en los Organismos que la componen.
5. WHEN una Page es navegada, THE Page SHALL montar todos sus Organismos y Design_Templates sin errores de renderizado.
6. THE Atomic_Design_System SHALL proveer al menos las siguientes Pages de referencia: `/login` (Page de inicio de sesión), `/homesesion` (Page de sesión autenticada).
7. WHERE el paradigma es Angular, THE Page SHALL ser el View_Orchestrator registrado en `app.routes.ts` que renderiza el Design_Template con los Organismos como contenido proyectado.
8. WHERE el paradigma es React hooks, THE Page SHALL ser el View_Orchestrator registrado en `App.tsx` que renderiza el Design_Template con los Organismos como props de tipo `ReactNode`.

---

### Requirement 13: Integración Atomic Design + JONA en Angular

**User Story:** Como desarrollador Angular, quiero una implementación de referencia del sistema de diseño Atomic Design con JONA en Angular, para que pueda adoptar el patrón en el proyecto `appjona_angular`.

#### Acceptance Criteria

1. THE Archetype SHALL proveer la implementación Angular del sistema de diseño con Átomos en `src/app/atoms/`, Moléculas en `src/app/molecules/`, Organismos en `src/app/views/`, Design_Templates en `src/app/uilayouts/` y Pages como View_Orchestrators en `src/app/views/`.
2. THE Archetype SHALL demostrar la composición completa: el View_Orchestrator (`UiHomeViewComponent`) renderiza el Design_Template (`BorderLayoutComponent`) que contiene el Organismo (`UiIniciarSesionComponent`) compuesto por Moléculas y Átomos.
3. WHEN el proyecto Angular es ejecutado con `ng serve`, THE Archetype SHALL compilar y ejecutarse sin errores.
4. THE Archetype SHALL incluir el `AuthGuard` de Angular como equivalente al `ProtectedRoute` de React para proteger las rutas autenticadas.
5. THE Organism en Angular SHALL implementar la Interface mediante `implements Inter[NombreOrganismo]` en el componente Template, y la Implementation SHALL extender el Template con `extends [NombreOrganismo]Component`.

---

### Requirement 14: Integración Atomic Design + JONA en React Hooks

**User Story:** Como desarrollador React, quiero una implementación de referencia del sistema de diseño Atomic Design con JONA en React hooks, para que pueda adoptar el patrón en el proyecto `appjona_react_hooks`.

#### Acceptance Criteria

1. THE Archetype SHALL proveer la implementación React del sistema de diseño con Átomos en `src/atoms/`, Moléculas en `src/molecules/`, Organismos en `src/views/`, Design_Templates en `src/uilayouts/` y Pages como View_Orchestrators en `src/views/`.
2. THE Archetype SHALL demostrar la composición completa: el View_Orchestrator (`UiHomeView`) renderiza el Design_Template (`BorderLayout`) que contiene el Organismo (`UiIniciarSesion`) compuesto por Moléculas y Átomos.
3. WHEN el proyecto React es ejecutado con `npm run dev`, THE Archetype SHALL compilar y ejecutarse sin errores.
4. THE Archetype SHALL incluir el `ProtectedRoute` de React Router v6 para proteger las rutas autenticadas.
5. THE Organism en React SHALL implementar la Interface mediante el hook `use[NombreOrganismo]` que retorna el Contract, y la Implementation SHALL componer el hook del Template con `const base = use[NombreOrganismo]()` y sobreescribir los métodos del Contract.

---

### Requirement 15: Arquetipo de Proyecto (Project Archetype)

**User Story:** Como desarrollador que adopta JONA con Atomic Design, quiero un arquetipo de proyecto listo para usar con los cinco niveles del sistema de diseño, para que pueda iniciar un nuevo proyecto con la estructura correcta sin configuración manual.

#### Acceptance Criteria

1. THE Archetype SHALL proveer una estructura de carpetas base con los cinco niveles de Atomic Design: `atoms/`, `molecules/`, `views/` (Organismos), `uilayouts/` (Design_Templates), y Pages como View_Orchestrators.
2. THE Archetype SHALL incluir al menos un ejemplo completo de cada nivel: un Atom, una Molecule, un Organism completo con arquetipo JONA, un Design_Template y una Page.
3. THE Archetype SHALL incluir un servicio de ejemplo (`AuthService`) que demuestre el patrón de integración desde la capa Implementation del Organismo.
4. THE Archetype SHALL incluir un sistema de rutas protegidas que demuestre la integración del View_Orchestrator con el router del framework.
5. THE Archetype SHALL incluir documentación inline en cada archivo generado que identifique explícitamente el nivel de Atomic Design, la capa JONA (si aplica) y las responsabilidades del componente.
6. WHEN un desarrollador clona el Archetype, THE Archetype SHALL ejecutarse sin errores con el comando de inicio del framework correspondiente.

---

### Requirement 16: Documentación del Sistema de Diseño

**User Story:** Como nuevo miembro del equipo, quiero documentación clara del sistema de diseño Atomic Design integrado con JONA, para que pueda entender los cinco niveles, las reglas de composición y aplicarlos correctamente.

#### Acceptance Criteria

1. THE Atomic_Design_System SHALL proveer un documento README que explique los cinco niveles de Atomic Design y cómo se integran con el patrón JONA.
2. THE Atomic_Design_System SHALL proveer un diagrama de arquitectura que muestre la relación entre Átomos → Moléculas → Organismos (JONA) → Design_Templates → Pages.
3. THE Atomic_Design_System SHALL proveer ejemplos de código para cada nivel en los dos paradigmas soportados (Angular y React hooks).
4. THE Atomic_Design_System SHALL proveer una tabla de comparación que muestre qué nivel de Atomic Design corresponde a qué capa del patrón JONA.
5. THE Atomic_Design_System SHALL proveer una lista de verificación (checklist) de composición que permita verificar que un componente pertenece al nivel correcto de Atomic Design.
6. WHEN se agrega un nuevo Organismo al sistema, THE Atomic_Design_System SHALL requerir que el Organismo implemente el arquetipo JONA completo y que la documentación sea actualizada.
