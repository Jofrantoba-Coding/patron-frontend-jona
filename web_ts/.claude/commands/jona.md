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

## Framework: detectalo antes de generar

El patron JONA es agnostico de framework. Hoy el monorepo tiene dos implementaciones
de la misma libreria:

| Framework | Paquete | Ubicacion |
|---|---|---|
| **React** | `jona-ui` | `web_ts/uijona` |
| **Angular 21** | `uijona-4ngular` | `web_ts/uijona-4ngular` (lib en `projects/uijona`) |

**Antes de crear nada, detecta el framework del destino** leyendo su `package.json`
(`react`/`react-dom` vs `@angular/core`) o su `angular.json`. Aplica las plantillas y
convenciones de la seccion correspondiente:

- React -> [Plantillas JONA (React)](#plantillas-jona-react).
- Angular -> [Patron JONA en Angular 21](#patron-jona-en-angular-21).

El **contrato conceptual es el mismo** (Inter / View / Impl / entry); solo cambia como se
materializa cada capa. Ver la tabla de equivalencias en la seccion de Angular.

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

> Los nombres de archivo de arriba son la materializacion en **React**. En **Angular 21** las
> mismas responsabilidades se reparten distinto (View = template del `@Component`,
> Impl = clase con signals): ver [Patron JONA en Angular 21](#patron-jona-en-angular-21).

---

## Modo design-system

### Directorio destino

| Tipo | React (`uijona/src`) | Angular (`uijona-4ngular/projects/uijona/src`) |
|------|------------|------------|
| atom | `atoms/<Nombre>/` | `lib/atoms/j-<nombre>/` |
| molecule | `molecules/<Nombre>/` | `lib/molecules/j-<nombre>/` |
| organism | `organisms/<Nombre>/` | `lib/organisms/j-<nombre>/` |
| page | `pages/<Nombre>/` | `lib/pages/j-<nombre>/` |

### Archivos base

React — siempre crea la unidad JONA base:

```txt
<Nombre>/
  Inter<Nombre>.ts
  <Nombre>View.tsx
  <Nombre>Impl.tsx
  <Nombre>.tsx
  index.ts
```

Angular — unidad JONA base (ver [Patron JONA en Angular 21](#patron-jona-en-angular-21)):

```txt
j-<nombre>/
  inter-j-<nombre>.ts
  j-<nombre>.ts
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

## Plantillas JONA (React)

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

## Patron JONA en Angular 21

`uijona-4ngular` es el port de `jona-ui` a Angular 21 (standalone + signals). El contrato
JONA es identico; cambia la materializacion de cada capa.

### Equivalencia de capas React -> Angular

| Capa JONA (React) | En Angular 21 |
|---|---|
| `Inter<Nombre>.ts` (tipos, DEFAULTS, mapas de clases) | `inter-j-<nombre>.ts` — **TS puro, sin `@angular/*`**: tipos, `DEFAULTS`, `*_CLASSES` (mapas variant/size/etc.) |
| `<Nombre>View.tsx` (render puro) | **El template del `@Component`** (inline o `.html`) — la "vista pura" |
| `<Nombre>Impl.tsx` (defaults, estado, forwardRef) | **La clase `@Component`** con `input()/output()/model()` + `computed()` |
| `<Nombre>.tsx` (entry) + `index.ts` | `index.ts` (barrel) |
| `cn()` (clsx + tailwind-merge) | `cn()` idéntico en `lib/core/cn.ts` |
| Evento Observer `onChange(value, event)` | `output<T>()` value-first **+** `ControlValueAccessor` |
| `asChild` (`cloneElement`) | **No se porta** — usa anchor `href` o `routerLink` |

### Estructura y nombres (Angular)

- Carpetas y archivos en **kebab-case**; clases en **PascalCase con prefijo `J`**.
- Selector de elemento `j-<nombre>` (prefijo `j`).

```txt
lib/atoms/j-button/
  inter-j-button.ts      contrato: tipos + JBUTTON_DEFAULTS + JBUTTON_*_CLASSES
  j-button.ts            @Component standalone (clase = Impl, template = View)
  index.ts               barrel
```

Capas: `lib/atoms`, `lib/molecules`, `lib/layouts`, `lib/organisms`, `lib/pages`,
`lib/core` (cn, types, slots), `lib/theme`. Export global en `projects/uijona/src/public-api.ts`.

### Convenciones Angular obligatorias

- **Standalone** siempre; `changeDetection: ChangeDetectionStrategy.OnPush`.
- `host: { class: 'contents' }` para que el wrapper `<j-x>` **no afecte el layout**
  (excepcion: contenedores que SON el layout, p.ej. JPanel, que renderiza su `.jpanel`).
- Entradas con `input<T>()` / `input.required<T>()`; salidas `output<T>()`; two-way `model<T>()`.
- **NO uses `implements Inter<Nombre>`**: los signal inputs son `InputSignal<T>`, no el valor
  crudo, y el compilador falla. El `Inter*` es **solo contrato de documentacion**.
- Los mapas de clases del View se calculan con `computed()` que llama a `cn(...)`.
- `className` como `input<string>('')` (paridad con React) que se fusiona en `[class]`.
- `style` como `input<JStyle>(null)` (`JStyle = string | Record<string, ...> | null`).

### Slots (contenido proyectado)

Las props `ReactNode` se convierten en **proyeccion de contenido**:

- Slot por defecto: `<ng-content />`.
- Slots nombrados con atributo marcador: `<ng-content select="[jIcon]" />`.
- **Detectar presencia** de un slot (para padding/layout condicional): directiva marcador
  standalone + `contentChild()`:

```ts
@Directive({ selector: '[jIcon]', standalone: true })
export class JIconSlot {}
// en el componente:
private readonly iconRef = contentChild(JIconSlot);
protected readonly hasIcon = computed(() => !!this.iconRef());
```

  El consumidor debe **importar la directiva** para que `contentChild` la detecte.
- Colapsar slots vacios: `styles: ['.mi-slot:empty { display: none; }']`.
- Marcadores usados en la lib: `[jIcon]`, `[jIconLeft]`/`[jIconRight]`, `[jTitleIcon]`,
  `[jFooter]`, `[jTrigger]`, `[jVisual]`, `[jMetrics]`, `[jNorth]`/`[jSouth]`/`[jEast]`/`[jWest]`,
  `[jHeader]`, `[jBrand]`, `[jActions]`, `[jDrawer]`.

### Formularios: `model()` + ControlValueAccessor

Todo control de formulario expone `value = model<T>()` (soporta `[(value)]`) **y** implementa
`ControlValueAccessor` (funciona con `[(ngModel)]` y `formControl`):

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => JTextBox), multi: true }],
// ...
readonly value = model<string>('');
readonly disabledInput = input<boolean>(false, { alias: 'disabled' });
private cvaDisabled = signal(false);
protected readonly disabled = computed(() => this.disabledInput() || this.cvaDisabled());
writeValue(v: string | null) { this.value.set(v ?? ''); }
registerOnChange(fn: (v: string) => void) { this.onChange = fn; }
registerOnTouched(fn: () => void) { this.onTouched = fn; }
setDisabledState(d: boolean) { this.cvaDisabled.set(d); }  // cvaDisabled DEBE ser signal para reaccionar
```

Al escribir en el input, llamar `this.value.set(v)` **y** `this.onChange(v)`. Al blur, `onTouched()`.
Para componer sub-controles, bind `[value]="value()" (valueChange)="onValueChange($event)"`
(evita el feedback de un `[(value)]` con el CVA).

### Overlays sin `@angular/cdk`

Dialog/Drawer/Tooltip/Popover/Dropdown/Combobox se hacen con `position: fixed` inline y
listeners de host — sin dependencia de CDK:

```ts
host: {
  '(document:keydown.escape)': 'close()',
  '(document:mousedown)': 'onDocMouseDown($event)',   // click-outside via ElementRef.contains
  '(window:resize)': 'reposition()',
  '(window:scroll)': 'reposition()',
},
```

- Posicion anclada: `computed`/`signal<Record<string,string>>` a partir de
  `trigger.getBoundingClientRect()`; bind `[style]="panelStyle()"`.
- Bloqueo de scroll del body: `effect(() => document.body.style.overflow = open() ? 'hidden' : '')`
  con `DOCUMENT` inyectado.
- Modales: `@if (open())`, `role="dialog"`/`aria-modal="true"`, z-index con los tokens `--jona-z-*`.

### Otros patrones aprendidos

- **Polimorfismo de elemento** (JLabel `as`): `@switch (resolvedAs())` con un `<ng-template>`
  compartido para el cuerpo, proyectado via `[ngTemplateOutlet]` en cada rama (solo una se
  instancia, asi que reutilizar `<ng-content>`/template es seguro).
- **Timers/intervals**: `signal()` + `setInterval`, limpieza con `inject(DestroyRef).onDestroy(...)`.
- **Fallback de imagen**: guardar el `src` fallido en un `signal` y comparar en un `computed`
  (no hace falta `effect`; se resetea solo al cambiar `src`).
- **SVG inline** en templates: prefijo `svg:` para hijos (`<svg:path>`, `<svg:circle>`).
- **Componentes-familia** (JCard, JTabs, JTable, JBreadcrumb): varios `@Component` en un archivo;
  el estado compartido se pasa por **DI** (`inject(JTabs)` desde los hijos), no por Context.

### Plantillas JONA (Angular)

#### inter-j-<nombre>.ts

```ts
// inter-j-<nombre>.ts — contrato JONA (TS puro)
export type J<Nombre>Variant = 'default' | 'primary';

/** Contrato publico de J<Nombre>. */
export interface InterJ<Nombre> {
  variant?: J<Nombre>Variant;
  disabled?: boolean;
}

export const J<NOMBRE>_DEFAULTS = {
  variant: 'default',
  disabled: false,
} as const satisfies Required<Pick<InterJ<Nombre>, 'variant' | 'disabled'>>;

export const J<NOMBRE>_VARIANT_CLASSES: Record<J<Nombre>Variant, string> = {
  default: 'bg-neutral-200 text-neutral-800',
  primary: 'bg-primary-600 text-white',
};
```

#### j-<nombre>.ts

```ts
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { cn } from '../../core/cn';
import type { JStyle } from '../../core/types';
import { J<NOMBRE>_DEFAULTS, J<NOMBRE>_VARIANT_CLASSES, type J<Nombre>Variant } from './inter-j-<nombre>';

/** J<Nombre> — <descripcion>. Contenido por proyeccion. */
@Component({
  selector: 'j-<nombre>',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <button
      [disabled]="disabled()"
      [class]="classes()"
      [style]="style()"
      (click)="clicked.emit($event)"
    >
      <ng-content />
    </button>
  `,
})
export class J<Nombre> {
  readonly variant = input<J<Nombre>Variant>(J<NOMBRE>_DEFAULTS.variant);
  readonly disabled = input<boolean>(J<NOMBRE>_DEFAULTS.disabled);
  readonly className = input<string>('');
  readonly style = input<JStyle>(null);

  readonly clicked = output<MouseEvent>();

  protected readonly classes = computed(() =>
    cn('inline-flex items-center rounded-md px-3 py-2 text-sm',
       J<NOMBRE>_VARIANT_CLASSES[this.variant()], this.className())
  );
}
```

#### index.ts

```ts
export { J<Nombre> } from './j-<nombre>';
export { J<NOMBRE>_DEFAULTS, J<NOMBRE>_VARIANT_CLASSES } from './inter-j-<nombre>';
export type { InterJ<Nombre>, J<Nombre>Variant } from './inter-j-<nombre>';
```

### Export publico (Angular)

Agregar la barra en `projects/uijona/src/public-api.ts` en la seccion de la capa:

```ts
export * from './lib/atoms/j-<nombre>';
```

Para subpaths de estilos/preset, `exports` se declara **a mano** en el `package.json` de la lib
(ng-packagr lo mergea con el `.` y `./package.json` que genera).

### Tooling y build (Angular) — gotchas

- **Node**: Angular CLI 21 exige **Node >= 22.12**. Si el global es menor, usar `fnm`
  (`fnm use` lee el `.node-version` = `22.12.0`) y prefijar el PATH antes de `npx ng ...`.
- **Workspace**: `ng new <nombre> --create-application=false` + `ng generate library uijona`.
- **ng-packagr** (`projects/uijona/ng-package.json`): `allowedNonPeerDependencies`
  (`clsx`, `tailwind-merge`) y `assets` para `tokens.css` + `tailwind-preset.js`.
- **Tailwind**: las clases viven como strings en templates. Se compila una hoja distribuible
  con la CLI de Tailwind escaneando `projects/uijona/src/**/*.{html,ts}`
  (`npm run build` = `ng build uijona && npm run build:css`). El CSS de componentes
  (motor de JPanel, slots de JButton, keyframes) se porta **verbatim** desde
  `uijona/src/styles/index.css` a `projects/uijona/src/styles/uijona.css`.
- **Storybook**: `@storybook/angular`; para que Tailwind cargue en el preview, agregar
  `styles: ['projects/uijona/src/styles/uijona.css']` a los targets `storybook` y
  `build-storybook` en `angular.json`.
- **Validaciones**: `ng build uijona`, `ng test uijona --no-watch` (Vitest + TestBed;
  ojo: `ngModel` aplica su valor inicial de forma **asincrona** — usa
  `await fixture.whenStable()` antes de assertions).

---

## Convenciones obligatorias

Estas convenciones aplican a **ambos** frameworks salvo donde se indique.

### Eventos Observer

Los eventos reciben primero el valor de negocio y despues el evento DOM.

React:

```ts
onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
onBlur?: (value: string, event: React.FocusEvent<HTMLInputElement>) => void;
onEnterPress?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
```

Angular (value-first via `output()`; el `{ value, event }` empaqueta ambos):

```ts
readonly valueChange = output<string>();                       // o model() para two-way
readonly blurred = output<{ value: string; event: FocusEvent }>();
readonly enterPress = output<{ value: string; event: KeyboardEvent }>();
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

En Angular (`uijona-4ngular`), imports relativos por capa dentro de la lib:

```ts
import { cn } from '../../core/cn';
import { JButton } from '../j-button';
```

Y en la app consumidora, componentes standalone + hoja compilada:

```ts
import { JButton, JFormField } from 'uijona-4ngular';   // en imports del @Component
// styles.css / angular.json:  @import 'uijona-4ngular/styles/uijona.css';
```

---

## Pasos de ejecucion

1. Detecta el modo (`design-system` o `feature`) **y el framework** (React o Angular) leyendo
   el `package.json`/`angular.json` del destino.
2. Lee el codigo existente del destino para copiar convenciones reales (nombres, imports,
   como se resuelven slots/estado en ese framework).
3. Si el componente ya existe, avisa antes de sobreescribir.
4. Crea los archivos JONA base del framework correcto.
5. En design-system, agrega stories, tests y exports (`src/index.ts` en React;
   `public-api.ts` en Angular) cuando corresponda.
6. En feature, no agregues exports globales salvo que la app ya use ese patron.
7. Ejecuta validaciones razonables:
   - **React**: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook`
     si cambia Storybook o el design system.
   - **Angular**: con Node >= 22.12 en PATH (`fnm use`) — `npx ng build uijona`,
     `npx ng test uijona --no-watch`, y `npm run build` (lib + CSS) antes de publicar.
8. Informa rutas creadas, API publica y validaciones ejecutadas.

---

## Criterios de salida

El trabajo se considera terminado cuando:

- La separacion JONA esta clara y usa la materializacion del framework correcto
  (React: Inter/View/Impl/entry; Angular: inter + `@Component` con signals + barrel).
- El modo arquitectonico es correcto:
  - Design system -> Atomic Design + JONA.
  - Aplicacion -> Feature-Based + JONA.
- El componente o feature compila (React `npm run build`; Angular `ng build uijona` con Node >= 22.12).
- La API publica esta exportada donde corresponde (`src/index.ts` en React; `public-api.ts` en Angular).
- Hay stories/tests cuando el alcance lo justifica.
- En Angular: sin `implements Inter*`; controles de formulario con `model()` + `ControlValueAccessor`;
  slots `ReactNode` resueltos por proyeccion; `host: { class: 'contents' }` salvo contenedores de layout.
