# Design Document — JONA Design Pattern

## Overview

JONA (Joint Orchestrated N-layer Architecture) es un patrón de diseño frontend que formaliza la separación de responsabilidades en tres capas bien definidas más un orquestador de vista. Su objetivo es permitir que diseñadores UI, desarrolladores frontend e integradores trabajen en paralelo sobre la misma vista sin conflictos, usando un contrato explícito (Interface) como único punto de acuerdo.

El patrón es conceptual, no sintáctico: sus principios aplican a cualquier lenguaje o framework que soporte contratos y abstracción. Este documento formaliza la arquitectura, los modelos de datos, las convenciones y las reglas de capa para la implementación de referencia en React 18 + TypeScript 5.

### Principios fundamentales

1. **El contrato primero.** La Interface declara qué puede hacer la vista. Es el único artefacto compartido entre todos los roles.
2. **Separar UI de integración.** El Template posee la estructura visual y el comportamiento base. La Implementation posee la conexión con servicios externos.
3. **Los roles no cruzan fronteras.** El diseñador UI nunca escribe llamadas a servicios. El integrador nunca toca marcado ni estilos.

---

## Architecture

El patrón define cuatro artefactos por vista, organizados en capas con dependencias unidireccionales:

```
┌─────────────────────────────────────────────────────────────────┐
│                        src/views/uiXxx/                         │
│                                                                 │
│  ┌──────────────────┐                                           │
│  │  «interface»     │  ← Contrato puro. Sin lógica ni estado.   │
│  │  InterUiXxx      │    Propiedad del Desarrollador Frontend.  │
│  └────────┬─────────┘                                           │
│           │ implements                                          │
│  ┌────────▼─────────┐                                           │
│  │  «template»      │  ← Estructura visual + lógica base.       │
│  │  UiXxx /         │    Propiedad del Diseñador UI.            │
│  │  useUiXxx        │    Nunca llama servicios externos.        │
│  └────────┬─────────┘                                           │
│           │ extends / composes                                  │
│  ┌────────▼─────────┐                                           │
│  │  «implementation»│  ← Integración con servicios.             │
│  │  UiXxxImpl /     │    Propiedad del Integrador.              │
│  │  useUiXxxImpl    │    Nunca contiene JSX ni estilos.         │
│  └────────┬─────────┘                                           │
│           │ instantiates                                        │
│  ┌────────▼─────────┐                                           │
│  │  «orchestrator»  │  ← Punto de entrada de la vista.          │
│  │  UiXxxView       │    Registrado en el router.               │
│  └──────────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
                          │
          ┌───────────────▼───────────────┐
          │         src/services/         │
          │  AuthService  RestClient  ... │
          └───────────────────────────────┘
```

### Flujo de datos

```
Router → UiXxxView (Orchestrator)
           │
           ├─ instancia useUiXxxImpl()
           │     └─ compone useUiXxx() [Template]
           │           └─ implementa InterUiXxx [Interface]
           │
           └─ inyecta { ...impl } como props → UiXxx (componente visual)
                                                    │
                                              renderiza JSX
```

La dirección del flujo es siempre descendente: Interface → Template → Implementation → Orchestrator → Visual Component. Ninguna capa inferior referencia a una capa superior.

---

## Components and Interfaces

### Capa 1: Interface

Archivo: `Inter[NombreVista].tsx`

Declara el contrato de la vista. Contiene únicamente firmas de métodos. No importa dependencias externas.

```typescript
// Inter[NombreVista].tsx
export interface Inter[NombreVista] {
  methodA: (param: TypeA) => void;
  methodB: () => boolean;
}
```

**Reglas:**
- Solo firmas de métodos (no propiedades de estado, no implementaciones)
- Sin imports de librerías externas
- Nombre: `Inter` + PascalCase del nombre de la vista

### Capa 2: Template

Archivo: `[NombreVista].tsx`

Implementa la Interface. Gestiona estado local, estructura visual y handlers de eventos. Los métodos del contrato tienen implementaciones por defecto (stubs) que no dependen de servicios externos.

**Paradigma hooks (React functional):**

```typescript
// [NombreVista].tsx
export function use[NombreVista](): Inter[NombreVista] & TemplateState {
  const [fieldA, setFieldA] = useState('');

  function methodA(param: TypeA): void {
    console.log('Template stub — methodA', param); // default behavior
  }

  function methodB(): boolean {
    return fieldA !== '';
  }

  return { fieldA, setFieldA, methodA, methodB };
}

export const [NombreVista]: React.FC<[NombreVista]Props> = (props) => {
  return ( /* JSX — solo renderizado */ );
};
```

**Paradigma class components (React refs / state+props):**

```typescript
// [NombreVista].tsx
export class [NombreVista]<P = object> extends Component<P>
  implements Inter[NombreVista] {

  methodA(param: TypeA): void {
    console.log('Template stub — methodA', param);
  }

  methodB(): boolean { return true; }

  render() { return ( /* JSX */ ); }
}
```

**Paradigma TypeScript puro:**

```typescript
// [NombreVista].ts
export class [NombreVista] implements Inter[NombreVista] {
  constructor() {
    this.initializeUI();
    this.setupEventListeners();
  }
  methodA(param: TypeA): void { console.log('Template stub'); }
  methodB(): boolean { return true; }
  private initializeUI(): void { /* DOM manipulation */ }
  private setupEventListeners(): void { /* event wiring */ }
}
```

**Reglas:**
- Implementa todos los métodos de la Interface
- Gestiona estado local (inputs, flags de UI)
- Contiene JSX/HTML y estilos
- Nunca importa servicios externos, módulos de navegación ni storage APIs
- Los métodos del contrato son stubs que no lanzan errores

### Capa 3: Implementation

Archivo: `[NombreVista]Impl.tsx`

Extiende o compone el Template. Sobreescribe los métodos del contrato con lógica real. No contiene JSX ni estilos.

**Paradigma hooks:**

```typescript
// [NombreVista]Impl.tsx
export function use[NombreVista]Impl() {
  const base = use[NombreVista](); // compone el template
  const navigate = useNavigate();

  function methodA(param: TypeA): void {
    ExternalService.call(param)
      .then(() => navigate('/next'))
      .catch(err => window.alert(err.message));
  }

  return { ...base, methodA }; // spread base + overrides
}
```

**Paradigma class components:**

```typescript
// [NombreVista]Impl.tsx
export class [NombreVista]Impl extends [NombreVista]<ImplProps> {
  override methodA(param: TypeA): void {
    ExternalService.call(param)
      .then(() => this.props.navigate('/next'))
      .catch(err => window.alert(err.message));
  }
}
```

**Reglas:**
- Extiende (class) o compone (hooks) el Template
- Sobreescribe métodos del contrato con lógica real
- Única capa autorizada a importar servicios, navegación y storage
- Nunca importa componentes visuales, archivos CSS ni JSX
- Mantiene la misma firma de método que la Interface

### Capa 4: View Orchestrator

Archivo: `[NombreVista]View.tsx`

Instancia la Implementation e inyecta el resultado en el componente visual. Es el único archivo registrado en el router.

```typescript
// [NombreVista]View.tsx
export const [NombreVista]View: React.FC = () => {
  const impl = use[NombreVista]Impl();
  return <[NombreVista] {...impl} />;
};
```

**Reglas:**
- Sin lógica de negocio ni estado propio
- Sin JSX más allá de la composición de capas
- Único punto de entrada en el router
- Instancia la Implementation antes de renderizar el componente visual

---

## Data Models

### Modelo de Interface (contrato)

```typescript
// Estructura canónica de una Interface JONA
interface JonaInterface {
  // Solo firmas de métodos
  // Convención: verbos de acción para operaciones, is/has/can para predicados
  [actionMethod]: (...args: unknown[]) => void;
  [predicateMethod]: (...args: unknown[]) => boolean;
}
```

### Modelo de Template State (hooks)

```typescript
// Estado que el hook de template expone
type TemplateHookReturn<I extends JonaInterface> = I & {
  // Estado local de la vista
  [stateField: string]: unknown;
  // Setters de estado
  [setter: `set${string}`]: (value: unknown) => void;
  // Handlers de eventos (delegan a métodos del contrato)
  [handler: `handler${string}`]: (event?: React.SyntheticEvent) => void;
};
```

### Modelo de Implementation Return (hooks)

```typescript
// La Implementation retorna el spread del template + overrides
type ImplHookReturn<T extends TemplateHookReturn<I>, I extends JonaInterface> =
  Omit<T, keyof I> & I;
// En la práctica: { ...base, ...overriddenMethods }
```

### Modelo de View Orchestrator Props

```typescript
// El Orchestrator no recibe props externas (es el punto de entrada del router)
// El componente visual recibe el return del impl hook como props
type VisualComponentProps = ReturnType<typeof use[NombreVista]Impl>;
```

### Modelo de Layer Boundary (verificación)

```typescript
// Reglas de importación por capa — verificables con ESLint o revisión manual
type LayerBoundaryRules = {
  Interface: {
    canImport: never; // sin imports externos
    cannotImport: 'services' | 'navigation' | 'storage' | 'components' | 'styles';
  };
  Template: {
    canImport: 'Interface' | 'react' | 'styles' | 'ui-components';
    cannotImport: 'services' | 'navigation' | 'storage';
  };
  Implementation: {
    canImport: 'Template' | 'Interface' | 'services' | 'navigation' | 'storage' | 'react';
    cannotImport: 'styles' | 'jsx-components';
  };
  ViewOrchestrator: {
    canImport: 'Implementation' | 'Template' | 'react';
    cannotImport: 'services' | 'navigation' | 'storage';
  };
};
```

### Estructura de archivos del Archetype

```
src/
├── views/
│   └── ui[NombreVista]/
│       ├── Inter[NombreVista].tsx      ← Interface (contrato)
│       ├── [NombreVista].tsx           ← Template (visual + lógica base)
│       ├── [NombreVista]Impl.tsx       ← Implementation (integración)
│       └── [NombreVista]View.tsx       ← View Orchestrator (punto de entrada)
├── services/
│   └── [NombreServicio].ts             ← Servicios externos (solo accesibles desde Impl)
├── uilayouts/
│   └── BorderLayout.tsx                ← Layouts reutilizables (accesibles desde Template)
├── uiutils/
│   ├── Header.tsx                      ← Componentes utilitarios de UI
│   └── Footer.tsx
├── resources/
│   └── css/
│       └── *.css
├── App.tsx                             ← Router principal
├── main.tsx
└── protectedRoute.tsx                  ← Guard de rutas protegidas
```

### Convenciones de nomenclatura formalizadas

| Artefacto | Convención | Ejemplo |
|---|---|---|
| Carpeta de vista | `ui[nombreVista]` (camelCase, prefijo `ui`) | `uiiniciarsesion` |
| Interface | `Inter[NombreVista]` | `InterUiIniciarSesion` |
| Template (componente) | `[NombreVista]` | `UiIniciarSesion` |
| Template (hook) | `use[NombreVista]` | `useUiIniciarSesion` |
| Implementation (clase) | `[NombreVista]Impl` | `UiIniciarSesionImpl` |
| Implementation (hook) | `use[NombreVista]Impl` | `useUiIniciarSesionImpl` |
| View Orchestrator | `[NombreVista]View` | `UiIniciarSesionView` |
| Archivo Interface | `Inter[NombreVista].tsx` | `InterUiIniciarSesion.tsx` |
| Archivo Template | `[NombreVista].tsx` | `UiIniciarSesion.tsx` |
| Archivo Implementation | `[NombreVista]Impl.tsx` | `UiIniciarSesionImpl.tsx` |
| Archivo Orchestrator | `[NombreVista]View.tsx` | `UiIniciarSesionView.tsx` |

### Mecanismos de extensión por paradigma

| Paradigma | Proyecto de referencia | Mecanismo Template→Impl | Mecanismo de estado |
|---|---|---|---|
| TypeScript puro | `appjona_ts_puro` | Herencia de clases (`extends`) | Propiedades de instancia + DOM refs |
| React class + refs | `appjona_react_refs` | Herencia de clases (`extends Component`) | `createRef` (inputs no controlados) |
| React class + state/props | `appjona_react_state_props` | Herencia de clases (`extends Component`) | `this.state` + `this.setState` (inputs controlados) |
| React hooks | `appjona_react_hooks` | Composición de hooks (`const base = useTemplate()`) | `useState` + spread de retorno |

**Decisión de diseño:** Para React functional components se usa composición en lugar de herencia porque los hooks no pueden ser extendidos. El patrón `{ ...base, overriddenMethod }` en el return del impl hook es el equivalente funcional del `override` de clases.

---

## Correctness Properties


*Una propiedad es una característica o comportamiento que debe mantenerse verdadero en todas las ejecuciones válidas del sistema — esencialmente, una declaración formal sobre lo que el sistema debe hacer. Las propiedades sirven como puente entre las especificaciones legibles por humanos y las garantías de corrección verificables por máquinas.*

### Property 1: Template implementa el contrato completo

*Para cualquier* Template JONA y su Interface correspondiente, todos los métodos declarados en la Interface deben estar presentes en el Template, ser invocables, y ejecutarse sin lanzar excepciones cuando se llaman sin servicios externos disponibles.

**Validates: Requirements 2.1, 2.6**

### Property 2: Handlers del Template delegan al contrato

*Para cualquier* Template JONA, cada handler de evento (`handler[X]`) debe invocar el método del contrato correspondiente (`[x]`) con los argumentos correctos. El handler es un delegador, no una reimplementación.

**Validates: Requirements 2.5**

### Property 3: Implementation sobreescribe el contrato con lógica real

*Para cualquier* Implementation JONA, los métodos sobreescritos deben comportarse de forma diferente a los stubs del Template: deben invocar al menos un servicio externo (o su mock) en lugar de ejecutar el comportamiento por defecto del Template.

**Validates: Requirements 3.1**

### Property 4: Implementation maneja errores de servicios sin propagar excepciones

*Para cualquier* Implementation JONA y cualquier servicio externo que rechace su promesa con un error arbitrario, el método de la Implementation que invoca ese servicio no debe lanzar una excepción no controlada — debe capturar el error y comunicarlo al usuario de forma controlada.

**Validates: Requirements 3.6**

### Property 5: El patrón se mantiene en todos los paradigmas

*Para cualquier* paradigma soportado por JONA (TypeScript puro, React class refs, React class state/props, React hooks), la implementación debe exponer las mismas tres capas (Interface, Template, Implementation) y un View Orchestrator, y los métodos del contrato deben ser invocables desde el Orchestrator con el mismo comportamiento observable.

**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

### Property 6: Orchestrator provee todas las props requeridas al componente visual

*Para cualquier* View Orchestrator JONA, al renderizarlo debe proveer al componente visual del Template todas las props que este requiere (estado + handlers), sin que ninguna prop requerida sea `undefined` en el momento del primer render.

**Validates: Requirements 4.1, 4.5**

### Property 7: Archetype contiene todos los artefactos JONA esperados

*Para cualquier* vista de ejemplo en el Archetype, deben existir exactamente cuatro archivos con los nombres canónicos (`Inter[Vista].tsx`, `[Vista].tsx`, `[Vista]Impl.tsx`, `[Vista]View.tsx`), y el proyecto debe incluir las dependencias de stack requeridas (React 18, TypeScript 5, Vite, Tailwind CSS, React Router v6) y los artefactos de soporte (`AuthService`, `ProtectedRoute`).

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

---

## Error Handling

### Errores en la capa Implementation

La Implementation es la única capa que puede encontrar errores de servicios externos. La estrategia es:

1. **Promesas rechazadas**: capturar en `.catch()` o `try/catch` con `async/await`. Nunca dejar una promesa sin handler de error.
2. **Comunicación al usuario**: usar `window.alert`, un estado de error local, o un sistema de notificaciones — nunca propagar la excepción a la capa Template.
3. **Logging**: registrar el error en consola para debugging antes de comunicarlo al usuario.

```typescript
// Patrón correcto en Implementation
function methodA(param: TypeA): void {
  ExternalService.call(param)
    .then(response => {
      // happy path
    })
    .catch(error => {
      console.error('methodA failed:', error);
      window.alert(error.message ?? 'An error occurred');
      // NO re-throw
    });
}
```

### Errores en la capa Template (stubs)

Los métodos stub del Template no deben lanzar excepciones. Deben ejecutar un comportamiento por defecto inofensivo (`console.log`, `window.alert` con mensaje de template).

### Errores de validación

La validación de datos de entrada es responsabilidad del Template (método `isValidData` o equivalente). El Template valida antes de delegar al método del contrato. La Implementation puede agregar validación adicional específica del servicio.

### Errores de navegación

La navegación programática es responsabilidad exclusiva de la Implementation. Si el router no está disponible (test unitario), la Implementation debe manejar el error sin romper el Template.

---

## Testing Strategy

### Enfoque dual: unit tests + property-based tests

Ambos tipos de tests son complementarios y necesarios:

- **Unit tests**: verifican ejemplos específicos, casos borde y condiciones de error
- **Property tests**: verifican propiedades universales sobre rangos de inputs generados

Los unit tests capturan bugs concretos; los property tests verifican corrección general.

### Librería de property-based testing

Para TypeScript/React se usa **fast-check** (`npm install --save-dev fast-check`).

Cada property test debe ejecutar mínimo **100 iteraciones** (configuración por defecto de fast-check).

### Unit Tests

Enfocados en:
- Verificar que el Orchestrator renderiza el componente visual con todas las props (Property 6, Property 7)
- Verificar que el AuthService mock retorna la estructura esperada
- Verificar que ProtectedRoute redirige correctamente cuando no hay token
- Casos borde: inputs vacíos, tokens expirados, servicios que retornan null

```typescript
// Ejemplo: test del Orchestrator
it('UiXxxView renders UiXxx with all required props', () => {
  const { getByTestId } = render(<UiXxxView />);
  expect(getByTestId('ui-xxx-form')).toBeInTheDocument();
});
```

### Property-Based Tests

Cada propiedad del diseño se implementa como un único test de propiedad.

**Tag format:** `// Feature: jona-design-pattern, Property {N}: {property_text}`

```typescript
import fc from 'fast-check';

// Feature: jona-design-pattern, Property 1: Template implementa el contrato completo
test('Property 1: all contract methods are callable on Template without throwing', () => {
  fc.assert(
    fc.property(
      fc.record({ email: fc.string(), password: fc.string() }),
      ({ email, password }) => {
        const template = use[NombreVista]_standalone(); // sin router/servicios
        expect(() => template.methodA(email, password)).not.toThrow();
        expect(() => template.isValidData(email, password)).not.toThrow();
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: jona-design-pattern, Property 2: Handlers del Template delegan al contrato
test('Property 2: handler delegates to contract method', () => {
  fc.assert(
    fc.property(
      fc.record({ email: fc.emailAddress(), password: fc.string({ minLength: 1 }) }),
      ({ email, password }) => {
        const loginSpy = vi.fn();
        const template = use[NombreVista]_withMock({ login: loginSpy });
        template.handlerLogin(mockFormEvent());
        expect(loginSpy).toHaveBeenCalledWith(email, password);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: jona-design-pattern, Property 3: Implementation sobreescribe con lógica real
test('Property 3: impl method calls external service, not template stub', () => {
  fc.assert(
    fc.property(
      fc.record({ email: fc.emailAddress(), password: fc.string({ minLength: 1 }) }),
      ({ email, password }) => {
        const serviceSpy = vi.fn().mockResolvedValue({ token: 'tok', user: {} });
        const impl = use[NombreVista]Impl_withMock({ service: serviceSpy });
        impl.login(email, password);
        expect(serviceSpy).toHaveBeenCalledWith(email, password);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: jona-design-pattern, Property 4: Implementation maneja errores sin propagar excepciones
test('Property 4: impl does not throw when service rejects', () => {
  fc.assert(
    fc.property(
      fc.record({ email: fc.emailAddress(), password: fc.string() }),
      fc.string(), // arbitrary error message
      ({ email, password }, errorMsg) => {
        const serviceSpy = vi.fn().mockRejectedValue(new Error(errorMsg));
        const impl = use[NombreVista]Impl_withMock({ service: serviceSpy });
        expect(() => impl.login(email, password)).not.toThrow();
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: jona-design-pattern, Property 5: El patrón se mantiene en todos los paradigmas
test('Property 5: all paradigms expose the same contract methods', () => {
  const contractMethods = ['login', 'goToCreateAccount', 'goToRecoverPassword', 'isValidData'];
  const paradigms = [
    getHooksImpl(),
    getClassRefsImpl(),
    getClassStatePropsImpl(),
    getTsPuroImpl(),
  ];
  fc.assert(
    fc.property(fc.constantFrom(...paradigms), (impl) => {
      contractMethods.forEach(method => {
        expect(typeof impl[method]).toBe('function');
      });
    }),
    { numRuns: 100 }
  );
});
```

### Configuración de tests

```json
// vitest.config.ts (archetype)
{
  "test": {
    "environment": "jsdom",
    "setupFiles": ["./src/test/setup.ts"],
    "coverage": { "provider": "v8" }
  }
}
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';
// Mock de window.alert para tests
vi.stubGlobal('alert', vi.fn());
```
