---
layout: default
title: Design System jona-ui
nav_order: 4
has_children: false
permalink: /uijona
---

# Design System: jona-ui
{: .no_toc }

Librería React de componentes reutilizables que combina **Atomic Design** con una variante pragmática del patrón JONA.
{: .fs-5 .fw-300 }

[Ver Storybook →](https://jofrantoba-coding.github.io/patron-frontend-jona/storybook/){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }

## Tabla de contenidos
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Estado del paquete

| Campo | Valor |
|-------|-------|
| Nombre NPM | `jona-ui` |
| Versión | `1.2.7` |
| Carpeta fuente | `uijona/` |
| Showcase consumidor | `showcase_uijona/` |
| Formatos | ESM + CJS |
| Tipos | `.d.ts` generados en `dist/` |
| CSS público | `jona-ui/index.css` |
| Tokens CSS | `jona-ui/theme/tokens.css` |

---

## Instalación

```bash
npm install jona-ui
```

Importa el CSS una vez en el entry point de tu aplicación:

```tsx
import 'jona-ui/index.css';
```

Configura Tailwind para escanear la librería instalada:

```js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/jona-ui/dist/**/*.js',
  ],
};
```

También puedes importar tokens por separado si el consumidor maneja su propio CSS:

```tsx
import 'jona-ui/theme/tokens.css';
```

---

## Arquitectura

`jona-ui` organiza los componentes con Atomic Design:

```
uijona/src/
├── atoms/        # Unidades visuales básicas
├── molecules/    # Composiciones pequeñas de atoms
├── organisms/    # Bloques funcionales completos
├── pages/        # Pantallas listas para uso
├── layouts/      # Estructuras de página
├── hooks/        # Hooks reutilizables
├── theme/        # Tokens y ThemeProvider
└── lib/          # Utilidades internas/exportables
```

Cada componente sigue una estructura JONA liviana:

```
ButtonAtom/
├── InterButtonAtom.ts      # Contrato público: props, tipos, eventos
├── ButtonAtomView.tsx      # Render puro
├── ButtonAtomImpl.tsx      # Defaults, adaptación de eventos, forwardRef
├── ButtonAtom.tsx          # Export público del componente
└── index.ts                # Barrel local
```

En `organisms` y `pages`, JONA se usa con más separación porque hay estado, validación y handlers de flujo.

---

## Componentes disponibles

### Atoms

| Componente | Uso |
|------------|-----|
| `ButtonAtom` | Botón con variantes, tamaños, loading y eventos |
| `InputAtom` | Input controlado/no controlado con eventos Observer |
| `TextareaAtom` | Área de texto con auto-resize opcional |
| `BadgeAtom` | Etiquetas de estado |
| `CheckboxAtom` | Checkbox accesible |
| `RadioAtom` | Radio input con eventos por valor |
| `AvatarAtom` | Avatar con imagen, iniciales y fallback |
| `SelectAtom` | Select nativo con eventos por valor |
| `SwitchAtom` | Toggle accesible |
| `TextAtom` | Texto polimórfico |
| `LabelAtom` | Label de formulario |
| `LinkAtom` | Enlace estilizado con variantes |
| `IconButtonAtom` | Botón cuadrado para acciones con icono |
| `ChipAtom` | Etiqueta compacta seleccionable/removible |
| `ErrorMessageAtom` | Mensaje de error o ayuda |
| `SpinnerAtom` | Indicador de carga |
| `SeparatorAtom` | Separador horizontal/vertical |
| `ProgressAtom` | Barra de progreso |
| `SkeletonAtom` | Placeholder de carga |
| `ToastAtom` | Unidad visual de toast |

### Molecules

| Componente | Uso |
|------------|-----|
| `CardMolecule` | Card composable con `CardHeader`, `CardContent`, etc. |
| `AlertMolecule` | Banner de alerta |
| `FormFieldMolecule` | Label + input + descripción/error |
| `CheckboxFieldMolecule` | Checkbox + label + descripción/error |
| `RadioGroupMolecule` | Grupo de radios controlado/no controlado |
| `SelectFieldMolecule` | Select + label + descripción/error |
| `SwitchFieldMolecule` | Switch + label + descripción |
| `UserAvatarMolecule` | Avatar + nombre/email |
| `AccordionMolecule` | Secciones colapsables |
| `EmptyStateMolecule` | Estado vacío con acciones |
| `DialogMolecule` | Modal con portal |
| `TabsMolecule` | Tabs composables |
| `DropdownMolecule` | Menú con portal |
| `PaginationMolecule` | Paginación |
| `TooltipMolecule` | Tooltip con portal |
| `TableMolecule` | Tabla composable |
| `BreadcrumbMolecule` | Navegación por ruta |
| `SkeletonPresets` | Skeletons para filas, cards, forms y tablas |
| `SearchInputMolecule` | Búsqueda con clear, loading y submit por Enter |
| `NumberInputMolecule` | Entrada numérica con stepper, min y max |
| `FileUploadMolecule` | Dropzone/input de archivos con lista seleccionada |
| `StatCardMolecule` | Métrica compacta para dashboards |
| `StepperMolecule` | Indicador de progreso por pasos |

### Organisms, pages y layouts

| Tipo | Exports |
|------|---------|
| Layouts | `BorderLayout` |
| Organisms | `LoginOrganism`, `RecoverPasswordOrganism`, `CreateAccountOrganism`, `ErrorPageOrganism`, `HeaderPageOrganism`, `FooterPageOrganism` |
| Pages | `UiHomeLogin`, `UiHomeRecoverPassword`, `UiHomeCreateAccount`, `UiHomeError` |
| Hooks | `useToast`, `useToastHelpers`, `ToastProvider` |
| Theme | `JonaThemeProvider`, `JonaThemeTokens` |

---

## Uso básico

```tsx
import {
  ButtonAtom,
  FormFieldMolecule,
  CardMolecule,
  CardContent,
} from 'jona-ui';

export function LoginBox() {
  return (
    <CardMolecule className="w-full max-w-sm">
      <CardContent>
        <FormFieldMolecule
          id="email"
          label="Email"
          type="email"
          placeholder="tu@email.com"
          onChange={(value) => console.log(value)}
        />
        <ButtonAtom type="submit" fullWidth>
          Iniciar sesión
        </ButtonAtom>
      </CardContent>
    </CardMolecule>
  );
}
```

---

## APIs clave

### ButtonAtom

```ts
export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'secondary'
  | 'link';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';
```

```tsx
<ButtonAtom variant="default" size="lg" loading={isLoading}>
  Guardar
</ButtonAtom>

<ButtonAtom variant="ghost" size="icon" aria-label="Cerrar">
  ×
</ButtonAtom>
```

### InputAtom

`InputAtom` adapta los eventos DOM al patrón Observer: el consumidor recibe primero el valor y luego el evento original.

```tsx
<InputAtom
  value={email}
  hasError={!!emailError}
  onChange={(value, event) => setEmail(value)}
  onBlur={(value) => validateEmail(value)}
  onEnterPress={(value) => submit(value)}
/>
```

### FormFieldMolecule

`FormFieldMolecule` requiere `id` y `label`. Usa `errorMessage` y `description`, no `error` ni `helpText`.

```tsx
<FormFieldMolecule
  id="txtEmail"
  label="Correo electrónico"
  type="email"
  value={email}
  description="Usaremos este correo para notificaciones."
  errorMessage={emailError}
  required
  onChange={(value) => setEmail(value)}
  onInvalid={(value, message) => console.log(value, message)}
/>
```

### CardMolecule

`CardMolecule` es composable. No recibe props `title` ni `body`.

```tsx
<CardMolecule>
  <CardHeader>
    <CardTitle>Cuenta</CardTitle>
    <CardDescription>Configura tus datos.</CardDescription>
  </CardHeader>
  <CardContent>Contenido</CardContent>
  <CardFooter>Acciones</CardFooter>
</CardMolecule>
```

### RadioGroupMolecule

```tsx
<RadioGroupMolecule
  name="billing"
  label="Frecuencia de pago"
  value={billing}
  options={[
    { value: 'monthly', label: 'Mensual' },
    { value: 'yearly', label: 'Anual', description: 'Incluye descuento' },
  ]}
  onValueChange={(value) => setBilling(value)}
/>
```

### AccordionMolecule

```tsx
<AccordionMolecule
  defaultValue="security"
  items={[
    { value: 'profile', title: 'Perfil', content: <ProfileSettings /> },
    { value: 'security', title: 'Seguridad', content: <SecuritySettings /> },
  ]}
/>
```

### EmptyStateMolecule

```tsx
<EmptyStateMolecule
  title="No hay proyectos"
  description="Crea tu primer proyecto para empezar."
  actions={[{ label: 'Crear proyecto', onClick: openCreateProject }]}
/>
```

### LoginOrganism

```tsx
<LoginOrganism
  email={email}
  password={password}
  emailError={emailError}
  passwordError={passwordError}
  alertMessage={loginError}
  isLoading={isLoading}
  setEmail={setEmail}
  setPassword={setPassword}
  onSubmit={handleSubmit}
  onGoToCreateAccount={goToCreateAccount}
  onGoToRecoverPassword={goToRecoverPassword}
/>
```

### ToastProvider

```tsx
import { ToastProvider, useToastHelpers } from 'jona-ui';

function App() {
  return (
    <ToastProvider>
      <Routes />
    </ToastProvider>
  );
}

function SaveButton() {
  const toast = useToastHelpers();
  return <ButtonAtom onClick={() => toast.success('Guardado')}>Guardar</ButtonAtom>;
}
```

---

## Theming

El sistema expone tokens CSS y un provider para sobreescribirlos:

```tsx
import { JonaThemeProvider } from 'jona-ui/theme';
import 'jona-ui/theme/tokens.css';

<JonaThemeProvider
  theme={{
    primary600: '124 58 237',
    radius: '0.5rem',
    fontSans: 'Inter, sans-serif',
  }}
>
  <App />
</JonaThemeProvider>
```

Los colores se expresan como tripletas RGB (`"R G B"`) para integrarse con Tailwind y variables CSS.

---

## Imports directos

El paquete permite importar desde el barrel principal:

```tsx
import { ButtonAtom, FormFieldMolecule } from 'jona-ui';
```

Y también desde subpaths tree-shakeables:

```tsx
import { ButtonAtom } from 'jona-ui/atoms/ButtonAtom';
import { TextareaAtom } from 'jona-ui/atoms/TextareaAtom';
import { IconButtonAtom } from 'jona-ui/atoms/IconButtonAtom';
import { FormFieldMolecule } from 'jona-ui/molecules/FormFieldMolecule';
import { AccordionMolecule } from 'jona-ui/molecules/AccordionMolecule';
import { EmptyStateMolecule } from 'jona-ui/molecules/EmptyStateMolecule';
import { LoginOrganism } from 'jona-ui/organisms/LoginOrganism';
import { UiHomeLogin } from 'jona-ui/pages/UiHomeLogin';
import { useToast } from 'jona-ui/hooks/useToast';
import { cn } from 'jona-ui/lib/cn';
```

Los subpaths públicos están declarados en `uijona/package.json`.

---

## Desarrollo

Desde `uijona/`:

```bash
npm install
npm run lint
npm test
npm run build
```

Scripts principales:

| Script | Qué valida |
|--------|------------|
| `npm run lint` | TypeScript con `tsc --noEmit` |
| `npm test` | Vitest + Testing Library |
| `npm run build` | Vite library build + declarations + CSS |

La suite actual cubre atoms interactivos, `DialogMolecule`, `DropdownMolecule`, `TabsMolecule` y consistencia de exports.

---

## Checklist para nuevos componentes

Para agregar un componente nuevo:

1. Crear carpeta en `atoms`, `molecules`, `organisms` o `pages`.
2. Crear `InterNombre.ts` con contrato público y defaults si aplica.
3. Crear `NombreView.tsx` con render puro.
4. Crear `NombreImpl.tsx` para defaults, estado local o adaptación de eventos.
5. Crear `Nombre.tsx` como export público.
6. Crear `index.ts`.
7. Exportar desde `src/index.ts`.
8. Agregar subpath export en `package.json` si debe consumirse directo.
9. Agregar tests de eventos, accesibilidad y estados principales.
10. Ejecutar `npm run lint`, `npm test` y `npm run build`.

---

## Cuándo usar JONA completo

| Nivel | Recomendación |
|-------|---------------|
| Atoms simples | JONA liviano: contrato, view, impl mínimo |
| Molecules visuales | JONA liviano con tests de eventos |
| Molecules con portal/estado | JONA con impl real y cobertura de interacción |
| Organisms | JONA completo: estado, handlers, validación y vista pura |
| Pages | JONA completo: composición de layout, organisms y navegación externa por callbacks |
