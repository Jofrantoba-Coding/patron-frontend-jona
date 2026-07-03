---
layout: default
title: Design System jona-ui
nav_order: 4
has_children: false
permalink: /uijona
---

# Design System: jona-ui
{: .no_toc }

Librería React de componentes reutilizables que combina **Atomic Design** con el patrón **JONA** (contrato · implementación · vista pura). Tree-shakeable, tipada, con ESM/CJS, CSS compilado y tokens de tema.
{: .fs-5 .fw-300 }

[Ver Storybook →](https://jofrantoba-coding.github.io/patron-frontend-jona/storybook/){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[npm →](https://www.npmjs.com/package/jona-ui){: .btn .fs-5 .mb-4 .mb-md-0 }

## Tabla de contenidos
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Estado del paquete

| Campo | Valor |
|-------|-------|
| Nombre npm | `jona-ui` |
| Versión | `1.3.1` (consulta la publicada con `npm view jona-ui version`) |
| Licencia | MIT |
| Carpeta fuente | `web_ts/uijona/` |
| Showcase / playground | `web_ts/showcase_uijona/` |
| Formatos | ESM + CJS |
| Tipos | `.d.ts` generados en `dist/` |
| CSS público | `jona-ui/index.css` |
| Tokens CSS | `jona-ui/theme/tokens.css` |
| Peer deps | `react >=18`, `react-dom >=18` |
| Deps | `clsx`, `tailwind-merge` |
| `sideEffects` | `false` (tree-shaking total) |

### Inventario

| Categoría | Cantidad |
|-----------|----------|
| Atoms | 20 |
| Molecules | 42 |
| Layouts | 9 |
| Organisms | 19 |
| Pages | 4 |
| Hooks | 1 (`useToast`) |
| Theme | `JonaThemeProvider` + tokens |

---

## Instalación

```bash
npm install jona-ui
# peer dependencies (si aún no las tienes)
npm install react react-dom
```

Importa el CSS **una sola vez** en el entry point de tu app (`main.tsx` / `App.tsx`):

```tsx
import 'jona-ui/index.css';
```

Si tu app usa Tailwind, escanea también la librería instalada para no purgar sus clases:

```js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/jona-ui/dist/**/*.js',
  ],
};
```

Opcional — solo los tokens CSS, si manejas tu propio pipeline de estilos:

```tsx
import 'jona-ui/theme/tokens.css';
```

---

## Uso rápido

Desde el barrel principal:

```tsx
import { JButton, JTextBox, JFormField, useToastHelpers } from 'jona-ui';
```

O por **subpath** (recomendado para maximizar tree-shaking):

```tsx
import { JButton } from 'jona-ui/atoms/JButton';
import { JFormField } from 'jona-ui/molecules/JFormField';
import { JLogin } from 'jona-ui/organisms/JLogin';
```

Ejemplo mínimo:

```tsx
import 'jona-ui/index.css';
import { JButton } from 'jona-ui/atoms/JButton';
import { JTextBox } from 'jona-ui/atoms/JTextBox';

export function LoginForm() {
  return (
    <form>
      <JTextBox
        placeholder="usuario@dominio.com"
        onChange={(value) => console.log(value)}
      />
      <JButton type="submit">Ingresar</JButton>
    </form>
  );
}
```

---

## Arquitectura

`jona-ui` organiza los componentes con **Atomic Design**:

```
web_ts/uijona/src/
├── atoms/        # Unidades visuales básicas
├── molecules/    # Composiciones de atoms
├── organisms/    # Bloques funcionales completos
├── pages/        # Pantallas listas para uso
├── layouts/      # Gestores de layout (inspirados en AWT/Swing)
├── hooks/        # Hooks reutilizables
├── theme/        # Tokens CSS y ThemeProvider
└── lib/          # Utilidades exportables (cn)
```

Cada componente sigue la estructura **JONA**:

```
JButton/
├── InterJButton.ts    # Contrato público: props, tipos, eventos, defaults
├── JButtonView.tsx    # Render puro (solo props → JSX)
├── JButtonImpl.tsx    # Defaults, adaptación de eventos, forwardRef
├── JButton.tsx        # Export público del componente
└── index.ts           # Barrel local
```

Los **eventos** siguen una variante Observer *value-first*: el componente entrega el valor ya normalizado y, cuando aplica, el evento original.

```tsx
<JTextBox
  value={email}
  onChange={(value, event) => setEmail(value)}
  onEnterPress={(value) => submit(value)}
/>
```

---

## Catálogo de componentes

### Atoms (20)

| Componente | Uso |
|------------|-----|
| `JAvatar` | Avatar con imagen, iniciales y fallback |
| `JBadge` | Indicador de estado / etiqueta |
| `JButton` | Botón con variantes, tamaños, icono, loading y modo `asChild`/`href` |
| `JCheckBox` | Checkbox accesible |
| `JChip` | Chip seleccionable o removible |
| `JComboBox` | Select nativo con eventos por valor |
| `JDot` | Punto indicador de estado |
| `JGlyph` | Glifo/icono decorativo |
| `JIcon` | Botón de solo icono con label accesible |
| `JImagen` | Imagen con manejo de carga y fallback |
| `JLabel` | Etiqueta de formulario |
| `JPanel` | Panel/superficie contenedora |
| `JProgress` | Barra de progreso |
| `JRadioButton` | Radio input base |
| `JSeparator` | Separador horizontal o vertical |
| `JSkeleton` | Placeholder de carga |
| `JSpinner` | Indicador de carga (spinner) |
| `JSwitch` | Toggle booleano |
| `JTextArea` | Campo de texto multilínea |
| `JTextBox` | Input de texto con eventos Observer normalizados |

### Molecules (42)

| Componente | Uso |
|------------|-----|
| `JAccordion` | Secciones expandibles |
| `JAlert` | Mensaje contextual / banner |
| `JBreadcrumb` | Navegación jerárquica |
| `JCard` | Contenedor con header, content y footer |
| `JCheckBoxField` | Checkbox con label y descripción |
| `JCombobox` | Combobox con búsqueda y selección |
| `JContactMethodCard` | Medio de contacto con icono, texto y acción |
| `JDataTable` | Tabla de datos con columnas configurables |
| `JDatePicker` | Selector de fecha |
| `JDialog` | Modal con portal |
| `JDrawer` | Panel lateral con portal |
| `JDropdown` | Menú desplegable |
| `JEmptyState` | Estado vacío con acciones |
| `JFaqItem` | Pregunta frecuente expandible |
| `JFileUpload` | Dropzone/input de archivos con lista |
| `JFormField` | Campo con label, ayuda y error |
| `JLanguageSwitcher` | Selector de idioma |
| `JMetricCard` | Métrica destacada para landing/reportes |
| `JMultiSelect` | Selector múltiple con búsqueda |
| `JNumberInput` | Entrada numérica con stepper, min y max |
| `JNumberedStep` | Paso numerado con título y descripción |
| `JOptionPane` | Diálogo de confirmación |
| `JPagination` | Navegación paginada |
| `JPopover` | Contenido flotante anclado a un trigger |
| `JProgressItem` | Métrica con porcentaje y barra |
| `JRadioGroup` | Grupo de opciones radio |
| `JRating` | Selector o indicador de calificación |
| `JRelatedItem` | Enlace relacionado con descripción |
| `JSearchInput` | Búsqueda con clear, loading y submit por Enter |
| `JSectionHeading` | Encabezado de sección con eyebrow y descripción |
| `JSelectField` | Select con label, ayuda y error |
| `JServiceCard` | Tarjeta de servicio con icono y acción |
| `JSkeletonPresets` | Presets de skeleton (filas, cards, forms, tablas) |
| `JStatCard` | Métrica compacta para dashboards |
| `JStepper` | Indicador de progreso por pasos |
| `JSwitchField` | Switch con label y descripción |
| `JTable` | Tabla componible |
| `JTabs` | Navegación por tabs |
| `JTimer` | Temporizador visual |
| `JToast` | Unidad visual de notificación |
| `JTooltip` | Tooltip con portal |
| `JUserAvatar` | Avatar con metadata de usuario |

### Layouts (9)

Gestores de layout inspirados en AWT/Swing, adaptados a React.

| Componente | Uso |
|------------|-----|
| `JBorderLayout` | Regiones norte, sur, este, oeste y centro |
| `JBoxLayout` | Caja en eje horizontal o vertical |
| `JCardLayout` | Una "tarjeta" visible a la vez (stack) |
| `JFlowLayout` | Flujo con salto de línea (wrap) |
| `JGridBagLayout` | Grid flexible con constraints por celda |
| `JGridLayout` | Grid uniforme de filas y columnas |
| `JGroupLayout` | Agrupación secuencial y paralela |
| `JSidebarLayout` | Barra lateral + contenido |
| `JSpringLayout` | Posicionamiento por restricciones |

### Organisms (19)

| Componente | Uso |
|------------|-----|
| `JHeroDynamic` | Hero dinámico configurable |
| `JMarketingHero` | Hero de marketing |
| `JMetricsBand` | Banda de métricas |
| `JLogoMarquee` | Marquesina de logos |
| `JCaseStudies` | Sección de casos de estudio |
| `JContactMethods` | Bloque de métodos de contacto |
| `JContactSteps` | Pasos de contacto |
| `JDetailHero` | Hero de página de detalle |
| `JDetailCTA` | CTA de página de detalle |
| `JMarketingCTA` | CTA de marketing |
| `JDashboardPreview` | Vista previa de dashboard |
| `JNavbar` | Barra de navegación |
| `JSiteFooter` | Footer de sitio (marketing) |
| `JHeaderPage` | Header de página (aplicación) |
| `JFooterPage` | Footer de página (aplicación) |
| `JLogin` | Formulario de inicio de sesión |
| `JRecoverPassword` | Formulario de recuperar contraseña |
| `JCreateAccount` | Formulario de registro |
| `JErrorPage` | Página de error |

### Pages (4)

Pantallas completas listas para consumir por el router (componen layout + organisms).

| Componente | Uso |
|------------|-----|
| `JHomeLogin` | Pantalla completa de inicio de sesión |
| `JHomeRecoverPassword` | Pantalla completa de recuperar contraseña |
| `JHomeCreateAccount` | Pantalla completa de registro |
| `JHomeError` | Pantalla completa de error |

### Hooks y tema

| Export | Uso |
|--------|-----|
| `ToastProvider` | Provider de notificaciones (envuelve la app) |
| `useToast` | API base para crear y cerrar toasts |
| `useToastHelpers` | Helpers `success`, `error`, `warning`, `info` |
| `JonaThemeProvider` | Provider para sobreescribir tokens de tema |
| `JonaThemeTokens` | Tipo de los tokens de tema |
| `cn` | Utilidad `clsx` + `tailwind-merge` (`jona-ui/lib/cn`) |

---

## APIs clave

### JButton

```ts
type JButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link' | 'accent';
type JButtonSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'default';
```

```tsx
<JButton variant="default" size="lg" loading={isLoading}>Guardar</JButton>
<JButton variant="ghost" size="icon" aria-label="Cerrar"><XIcon /></JButton>

{/* Envuelve un <Link> de router conservando navegación SPA y tipado */}
<JButton asChild variant="outline">
  <Link to="/pricing">Ver planes</Link>
</JButton>

{/* Se renderiza como <a> cuando se pasa href */}
<JButton href="https://ejemplo.com" target="_blank">Documentación</JButton>
```

Otras props: `icon`, `iconPosition` (`left|right|top|bottom`), `fullWidth`, `disabled`, `type`.

### JTextBox

Adapta los eventos DOM al patrón Observer (*value-first*): el consumidor recibe primero el valor y luego el evento original.

```ts
type JTextBoxVariant = 'default' | 'filled' | 'ghost';
type JTextBoxSize    = 'sm' | 'md' | 'lg';
```

```tsx
<JTextBox
  value={email}
  variant="default"
  hasError={!!emailError}
  iconLeft={<MailIcon />}
  onChange={(value, event) => setEmail(value)}
  onBlur={(event) => validateEmail(email)}
  onEnterPress={(value) => submit(value)}
/>
```

### JFormField

Compone label + input + ayuda/error. Requiere `id` y `label`. Usa `errorMessage` y `description` (no `error`/`helpText`).

```tsx
<JFormField
  id="txtEmail"
  label="Correo electrónico"
  type="email"
  value={email}
  description="Usaremos este correo para notificaciones."
  errorMessage={emailError}
  required
  onChange={(value) => setEmail(value)}
  onValid={(value) => console.log('ok', value)}
  onInvalid={(value, message) => console.log(value, message)}
/>
```

### JCard

Composable: no recibe props `title` ni `body`, se arma con sus subcomponentes.

```tsx
<JCard>
  <JCardHeader>
    <JCardTitle>Cuenta</JCardTitle>
    <JCardDescription>Configura tus datos.</JCardDescription>
  </JCardHeader>
  <JCardContent>Contenido</JCardContent>
  <JCardFooter>Acciones</JCardFooter>
</JCard>
```

### JRadioGroup

```tsx
<JRadioGroup
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

### JAccordion

```tsx
<JAccordion
  defaultValue="security"
  items={[
    { value: 'profile', title: 'Perfil', content: <ProfileSettings /> },
    { value: 'security', title: 'Seguridad', content: <SecuritySettings /> },
  ]}
/>
```

### JEmptyState

```tsx
<JEmptyState
  title="No hay proyectos"
  description="Crea tu primer proyecto para empezar."
  actions={[{ label: 'Crear proyecto', onClick: openCreateProject }]}
/>
```

### JLogin (organism)

```tsx
<JLogin
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

### Toasts

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
  return <JButton onClick={() => toast.success('Guardado')}>Guardar</JButton>;
}
```

---

## Theming

El sistema expone tokens CSS y un provider para sobreescribirlos en runtime:

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

Los colores se expresan como **tripletas RGB** (`"R G B"`) para integrarse con variables CSS y con la sintaxis de opacidad de Tailwind (`rgb(var(--token) / <alpha>)`).

---

## Imports directos y tree-shaking

Desde el barrel:

```tsx
import { JButton, JFormField } from 'jona-ui';
```

O por subpath (declarados en `package.json` → `exports`):

```tsx
import { JButton } from 'jona-ui/atoms/JButton';
import { JTextArea } from 'jona-ui/atoms/JTextArea';
import { JDataTable } from 'jona-ui/molecules/JDataTable';
import { JBorderLayout } from 'jona-ui/layouts/JBorderLayout';
import { JLogin } from 'jona-ui/organisms/JLogin';
import { JHomeLogin } from 'jona-ui/pages/JHomeLogin';
import { useToast } from 'jona-ui/hooks/useToast';
import { cn } from 'jona-ui/lib/cn';
```

Con `sideEffects: false`, un bundler moderno solo incluye lo que importes.

---

## Desarrollo

Desde `web_ts/uijona/`:

```bash
npm install
npm run lint     # tsc --noEmit
npm test         # Vitest + Testing Library
npm run build    # Vite (ESM+CJS) + .d.ts + CSS Tailwind
npm run storybook
```

`dist/` es salida de build (está en `.gitignore`); se genera con `npm run build` y se incluye en el tarball npm vía `"files": ["dist"]`.

### Checklist para un componente nuevo

1. Crear carpeta en `atoms` / `molecules` / `organisms` / `pages` / `layouts`.
2. `InterNombre.ts` con el contrato público (props, tipos, eventos, defaults).
3. `NombreView.tsx` con render puro.
4. `NombreImpl.tsx` con defaults, estado local y adaptación de eventos.
5. `Nombre.tsx` como export público + `index.ts`.
6. Exportar desde `src/index.ts` y agregar el subpath en `package.json`.
7. Tests de eventos, accesibilidad y estados principales; story con estados clave.
8. `npm run lint`, `npm test`, `npm run build`.

---

## Publicación

`jona-ui` se publica en npm **siempre mediante un GitHub Release** (workflow `publish-npm.yml`, evento `release: published`); el Storybook se publica aparte a GitHub Pages en cada push a `main`. El detalle paso a paso (crear `NPM_TOKEN`, bump de versión y crear el Release) está en el `README.md` de la librería.

---

## Enlaces

- **Storybook:** <https://jofrantoba-coding.github.io/patron-frontend-jona/storybook/>
- **npm:** <https://www.npmjs.com/package/jona-ui>
- **Repositorio:** <https://github.com/Jofrantoba-Coding/patron-frontend-jona>
