# /jona - Generador de interfaces con patron JONA

Genera componentes o interfaces siguiendo el patron JONA segun el contexto del proyecto:

- **Design system**: combina JONA + Atomic Design.
- **Aplicacion**: combina JONA + Feature-Based Architecture.

La regla principal es:

```txt
Si estas construyendo una libreria de componentes o design system:
  usa Atomic Design para organizar la UI.

Si estas construyendo una aplicacion que consume un design system:
  usa Feature-Based para organizar por dominio/funcionalidad.

En ambos casos:
  cada unidad se implementa internamente con JONA.
```

---

## Argumentos

`$ARGUMENTS` puede usar dos formatos:

```txt
design-system <tipo> <Nombre> [descripcion]
feature <rutaFeature> <Nombre> [descripcion]
```

Tambien se acepta el formato corto historico:

```txt
<tipo> <Nombre> [descripcion]
```

En el formato corto, si `tipo` es `atom`, `molecule`, `organism` o `page`, se asume `design-system`.

### Argumentos de design-system

- **tipo**: `atom` | `molecule` | `organism` | `page`
- **Nombre**: PascalCase incluyendo sufijo del tipo
  - atom -> `PriceTagAtom`, `StatusBadgeAtom`
  - molecule -> `PriceCardMolecule`, `UserProfileMolecule`
  - organism -> `CheckoutOrganism`, `ProfileSettingsOrganism`
  - page -> `UiHomeCheckout`, `UiHomeDashboard`
- **descripcion**: que hace el componente. Usala para inferir props.

### Argumentos de feature

- **rutaFeature**: ruta relativa dentro de la aplicacion, por ejemplo:
  - `auth/login`
  - `dashboard/metrics`
  - `users/user-list`
- **Nombre**: PascalCase de la unidad JONA, por ejemplo:
  - `Login`
  - `MetricsPanel`
  - `UserList`
- **descripcion**: que hace la interfaz o bloque funcional.

Si los argumentos estan incompletos o ausentes, pregunta al usuario por: modo, destino, nombre y descripcion antes de continuar.

---

## Cuando usar cada modo

### Modo design-system: JONA + Atomic Design

Usalo cuando el objetivo sea crear o ampliar `jona-ui`, `uijona` u otra libreria de componentes reutilizables.

La estructura principal se organiza por nivel de abstraccion:

```txt
uijona/src/
  atoms/
  molecules/
  organisms/
  pages/
```

Atomic Design responde a la pregunta:

```txt
Que nivel de abstraccion tiene este componente?
```

JONA responde a la pregunta:

```txt
Como se separa contrato, render, logica e integracion publica?
```

### Modo feature: JONA + Feature-Based

Usalo cuando el objetivo sea desarrollar una aplicacion que ya consume `jona-ui` u otro design system.

La estructura principal se organiza por funcionalidad o dominio:

```txt
src/
  features/
    auth/
      login/
    dashboard/
      metrics/
    users/
      user-list/
  shared/
    ui/
    hooks/
    lib/
```

Feature-Based responde a la pregunta:

```txt
A que flujo, dominio o funcionalidad pertenece esta interfaz?
```

JONA sigue separando internamente cada unidad.

---

## Reglas del patron JONA

Cada componente o interfaz JONA se divide en capas:

```txt
Inter<Nombre>.ts       contrato publico: interfaces, tipos y defaults
<Nombre>View.tsx       render puro, sin estado ni logica de negocio
<Nombre>Impl.tsx       defaults, estado, handlers, efectos e integracion
<Nombre>.tsx           punto de entrada publico
index.ts               barrel local
```

### Responsabilidad de cada capa

- **Inter**: define el contrato publico, tipos auxiliares, eventos Observer y defaults.
- **View**: renderiza la UI con props ya resueltas. No usa `useState`, `useEffect`, llamadas async ni navegacion.
- **Impl**: adapta props, gestiona estado controlado/no controlado, handlers, validacion y side effects.
- **Template/public entry**: exporta el componente final y sus tipos publicos.
- **index**: re-export local.

---

## Modo design-system

### Directorio destino

| Tipo | Directorio |
|------|------------|
| atom | `uijona/src/atoms/<Nombre>/` |
| molecule | `uijona/src/molecules/<Nombre>/` |
| organism | `uijona/src/organisms/<Nombre>/` |
| page | `uijona/src/pages/<Nombre>/` |

### Archivos base

Siempre crea la unidad JONA base:

```txt
<Nombre>/
  Inter<Nombre>.ts
  <Nombre>View.tsx
  <Nombre>Impl.tsx
  <Nombre>.tsx
  index.ts
```

Para componentes del design system, agrega tambien cuando aplique:

```txt
<Nombre>.stories.tsx
```

Y si el componente tiene comportamiento, estados o callbacks:

```txt
src/<grupo>/__tests__/<Nombre>.test.tsx
```

No publiques una API nueva solo en `src/index.ts`. Si el paquete soporta subpath imports, actualiza tambien `package.json` `exports`.

### Export publico

Agregar en `uijona/src/index.ts`:

```ts
export * from './atoms/<Nombre>';
export * from './molecules/<Nombre>';
export * from './organisms/<Nombre>';
export * from './pages/<Nombre>';
```

Usar solo la linea que corresponda al tipo.

Si existe `package.json` con exports por subpath, agregar:

```json
"./molecules/<Nombre>": {
  "import": "./dist/molecules/<Nombre>.js",
  "require": "./dist/molecules/<Nombre>.cjs",
  "types": "./dist/molecules/<Nombre>.d.ts"
}
```

Adaptar la ruta segun `atoms`, `molecules`, `organisms` o `pages`.

---

## Modo feature

### Directorio destino

Crear dentro de:

```txt
src/features/<rutaFeature>/<nombre-kebab>/
```

Ejemplo:

```txt
src/features/auth/login/
  InterLogin.ts
  LoginView.tsx
  LoginImpl.tsx
  Login.tsx
  index.ts
```

### Reglas feature-based

- La carpeta pertenece al flujo de negocio, no al tipo visual.
- Importa UI reutilizable desde `jona-ui` o desde `src/shared/ui`.
- No copies atoms/molecules del design system dentro de la feature.
- Si una pieza empieza a repetirse entre features, muevela a `shared/ui` o al design system.
- El View puede componer componentes de `jona-ui`, pero no debe conocer reglas de negocio.
- El Impl puede coordinar estado, llamadas async, navegacion, validacion y adaptadores de datos.

### Export feature

El `index.ts` local debe exponer solo la API de la feature:

```ts
export * from './<Nombre>';
```

Evita exports globales innecesarios desde la raiz de la aplicacion.

---

## Plantillas JONA

### Inter

```ts
// Inter<Nombre>.ts - JONA Interface + defaults
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

### View

```tsx
// <Nombre>View.tsx - JONA View
import React from 'react';
import { cn } from '../../lib/cn';
import { Inter<Nombre> } from './Inter<Nombre>';

interface <Nombre>ViewProps extends Inter<Nombre> {
  forwardedRef?: React.Ref<HTMLInputElement>;
}

export const <Nombre>View: React.FC<<Nombre>ViewProps> = ({
  className,
  forwardedRef,
  ...props
}) => (
  <input
    ref={forwardedRef}
    className={cn('w-full min-w-0 rounded-md border px-3 py-2 text-sm', className)}
    {...props}
  />
);
```

### Impl

```tsx
// <Nombre>Impl.tsx - JONA Implementation
import React from 'react';
import { Inter<Nombre>, <NOMBRE_SCREAMING>_DEFAULTS } from './Inter<Nombre>';
import { <Nombre>View } from './<Nombre>View';

export const <Nombre>Impl = React.forwardRef<HTMLInputElement, Inter<Nombre>>(
  (props, ref) => {
    const resolved = { ...<NOMBRE_SCREAMING>_DEFAULTS, ...props };
    return <<Nombre>View {...resolved} forwardedRef={ref} />;
  }
);

<Nombre>Impl.displayName = '<Nombre>';
```

### Public entry

```tsx
// <Nombre>.tsx - JONA public entry
export { <Nombre>Impl as <Nombre> } from './<Nombre>Impl';
export type { Inter<Nombre> } from './Inter<Nombre>';
```

### Barrel

```ts
export * from './<Nombre>';
```

---

## Convenciones obligatorias

### Eventos Observer

Los eventos reciben primero el valor de negocio y despues el evento DOM:

```ts
onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
onBlur?: (value: string, event: React.FocusEvent<HTMLInputElement>) => void;
onEnterPress?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
```

### Tailwind responsive

- Mobile-first.
- Usar `w-full`, `min-w-0` y `max-w-full` para evitar overflow.
- Texto base `text-sm`; escalar con `sm:text-base` solo si aporta.
- Layout base `flex flex-col`; usar `sm:flex-row` cuando haya espacio.
- Tablas y grillas anchas deben ir dentro de `max-w-full overflow-auto`.
- Texto largo debe usar `break-words` o truncamiento explicito.

### Accesibilidad minima

- `aria-label` en botones sin texto visible.
- `aria-describedby` para error o descripcion asociada a inputs.
- `aria-invalid` en campos con error.
- `role="dialog"` y `aria-modal="true"` en overlays.
- Teclado operativo en controles interactivos.

### Imports

En `uijona/src`, usar imports relativos segun la capa actual:

```ts
import { cn } from '../../lib/cn';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { FormFieldMolecule } from '../../molecules/FormFieldMolecule';
```

En aplicaciones, preferir imports desde el paquete:

```ts
import { ButtonAtom, FormFieldMolecule } from 'jona-ui';
import 'jona-ui/index.css';
```

---

## Pasos de ejecucion

1. Detecta el modo: `design-system` o `feature`.
2. Lee el codigo existente del destino para copiar convenciones reales.
3. Si el componente ya existe, avisa antes de sobreescribir.
4. Crea los archivos JONA base.
5. En design-system, agrega stories, tests y exports cuando corresponda.
6. En feature, no agregues exports globales salvo que la app ya use ese patron.
7. Ejecuta validaciones razonables:
   - `npm run lint`
   - `npm test`
   - `npm run build`
   - `npm run build-storybook` si cambia Storybook o design system
8. Informa rutas creadas, API publica y validaciones ejecutadas.

---

## Criterios de salida

El trabajo se considera terminado cuando:

- La separacion JONA esta clara.
- El modo arquitectonico es correcto:
  - Design system -> Atomic Design + JONA.
  - Aplicacion -> Feature-Based + JONA.
- El componente o feature compila.
- La API publica esta exportada donde corresponde.
- Hay stories/tests cuando el alcance lo justifica.
