# jona-ui

JONA Design System para React. Es una libreria de componentes basada en Atomic Design y el patron JONA: contratos publicos, implementaciones con estado y vistas puras. Esta pensada para construir aplicaciones reutilizables, testeables y faciles de mantener.

- Package: https://www.npmjs.com/package/jona-ui
- Docs: https://jofrantoba-coding.github.io/patron-frontend-jona/uijona
- Storybook: https://jofrantoba-coding.github.io/patron-frontend-jona/storybook/
- Version: consulta la version publicada directamente en npm.

## Instalacion

```bash
npm install jona-ui
```

`jona-ui` declara React como peer dependency. La aplicacion consumidora debe tener React instalado:

```bash
npm install react react-dom
```

Importa los estilos globales una sola vez, normalmente en `main.tsx`, `App.tsx` o el entrypoint equivalente:

```tsx
import 'jona-ui/index.css';
```

Si necesitas tokens CSS de tema, tambien puedes importar:

```tsx
import 'jona-ui/theme/tokens.css';
```

## Uso Rapido

Import directo recomendado para favorecer tree-shaking:

```tsx
import { JButton } from 'jona-ui/atoms/JButton';
import { JTextBox } from 'jona-ui/atoms/JTextBox';
import { JFormField } from 'jona-ui/molecules/JFormField';
```

Tambien puedes importar desde el barrel principal:

```tsx
import { JButton, JTextBox, JFormField, useToast } from 'jona-ui';
```

Ejemplo minimo:

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

      <JButton type="submit">
        Ingresar
      </JButton>
    </form>
  );
}
```

Ejemplo con toast:

```tsx
import { ToastProvider, useToastHelpers } from 'jona-ui/hooks/useToast';
import { JButton } from 'jona-ui/atoms/JButton';

function SaveButton() {
  const toast = useToastHelpers();

  return (
    <JButton onClick={() => toast.success('Cambios guardados')}>
      Guardar
    </JButton>
  );
}

export function App() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}
```

## Que Incluye

El paquete publica ESM, CJS, tipos TypeScript y CSS compilado.

```txt
dist/
  index.js
  index.cjs
  index.d.ts
  index.css
  atoms/
  molecules/
  layouts/
  organisms/
  pages/
  hooks/
  theme/
```

`package.json` expone subpaths para importar piezas puntuales:

```tsx
import { JTextArea } from 'jona-ui/atoms/JTextArea';
import { JRadioGroup } from 'jona-ui/molecules/JRadioGroup';
import { JDataTable } from 'jona-ui/molecules/JDataTable';
import { JBorderLayout } from 'jona-ui/layouts/JBorderLayout';
import { JLogin } from 'jona-ui/organisms/JLogin';
import { JHomeLogin } from 'jona-ui/pages/JHomeLogin';
```

## Catalogo De Componentes

### Atoms

| Componente | Uso |
| --- | --- |
| `JAvatar` | Avatar con imagen, fallback e iniciales |
| `JBadge` | Indicadores de estado |
| `JButton` | Botones con variantes, tamanos y loading |
| `JCheckBox` | Checkbox accesible |
| `JChip` | Chip seleccionable o removible |
| `JLabel` | Mensaje de error o ayuda |
| `JIcon` | Boton solo icono con label accesible |
| `JTextBox` | Input de texto con eventos normalizados |
| `JLabel` | Label de formulario |
| `JLabel` | Enlace con variantes visuales |
| `JPanel` | Panel estructural para superficies y contenedores |
| `JProgress` | Barra de progreso |
| `JRadioButton` | Radio input base |
| `JComboBox` | Select nativo |
| `JSeparator` | Separador horizontal o vertical |
| `JSkeleton` | Placeholder de carga |
| `JSpinner` | Indicador de carga |
| `JSwitch` | Toggle booleano |
| `JTextArea` | Campo multilinea |
| `JLabel` | Texto polimorfico |

### Molecules

| Componente | Uso |
| --- | --- |
| `JAccordion` | Secciones expandibles |
| `JAlert` | Mensajes contextuales |
| `JBreadcrumb` | Navegacion jerarquica |
| `JCard` | Contenedor con header, content y footer |
| `JCheckBoxField` | Checkbox con label y descripcion |
| `JCombobox` | JCombobox con busqueda y seleccion |
| `JContactMethodCard` | Medio de contacto con icono, texto y accion |
| `JOptionPane` | Dialogo de confirmacion |
| `JDataTable` | Tabla de datos con columnas configurables |
| `JDatePicker` | Selector de fecha |
| `JDialog` | Modal con portal |
| `JDrawer` | Panel lateral con portal |
| `JDropdown` | Menu desplegable |
| `JEmptyState` | Estado vacio con acciones |
| `JFaqItem` | Pregunta frecuente expandible |
| `JFileUpload` | Dropzone/input de archivos con lista seleccionada |
| `JFormField` | Campo con label, ayuda y error |
| `JMetricCard` | Metrica destacada para landing o reportes |
| `JMultiSelect` | Selector multiple con busqueda |
| `JNumberedStep` | Paso numerado con titulo y descripcion |
| `JNumberInput` | Entrada numerica con stepper, min y max |
| `JPagination` | Navegacion paginada |
| `JPopover` | Contenido flotante anclado a un trigger |
| `JProgressItem` | Metrica con porcentaje y barra de progreso |
| `JRadioGroup` | Grupo de opciones radio |
| `JRating` | Selector o indicador de calificacion |
| `JRelatedItem` | Enlace relacionado con descripcion |
| `JSearchInput` | Busqueda con clear, loading y submit por Enter |
| `JSectionHeading` | Encabezado de seccion con eyebrow y descripcion |
| `JSelectField` | Select con label, ayuda y error |
| `JServiceCard` | Tarjeta de servicio con icono y accion |
| `JSkeletonPresets` | Presets de skeleton |
| `JStatCard` | Metrica compacta para dashboards |
| `JStepper` | Indicador de progreso por pasos |
| `JSwitchField` | Switch con label y descripcion |
| `JTable` | Tabla componible |
| `JTabs` | Navegacion por tabs |
| `JTimer` | Temporizador visual |
| `JToast` | Unidad visual de notificacion |
| `JTooltip` | Tooltip con portal |
| `JUserAvatar` | Avatar con metadata de usuario |

### Layouts, Organisms Y Pages

| Tipo | Exports |
| --- | --- |
| Layouts | `JBorderLayout`, `JFlowLayout`, `JBoxLayout`, `JGridLayout`, `JCardLayout`, `JGridBagLayout`, `JGroupLayout`, `JSpringLayout`, `JSidebarLayout` |
| Organisms | `JMarketingHero`, `JMetricsBand`, `JContactMethods`, `JContactSteps`, `JDetailHero`, `JDetailCTA`, `JSiteFooter`, `JMarketingCTA`, `JLogin`, `JRecoverPassword`, `JCreateAccount`, `JErrorPage`, `JHeaderPage`, `JFooterPage` |
| Pages | `JHomeLogin`, `JHomeRecoverPassword`, `JHomeCreateAccount`, `JHomeError` |

### Hooks Y Tema

| Export | Uso |
| --- | --- |
| `ToastProvider` | Provider de notificaciones |
| `useToast` | API base para crear y cerrar toasts |
| `useToastHelpers` | Helpers `success`, `error`, `warning`, `info` |
| `theme` | Tokens y helpers de tema |
| `tokens.css` | Variables CSS base |

## Patron JONA

Cada componente se organiza por responsabilidades:

```txt
InterFeature.ts       -> contrato publico, props y eventos
FeatureImpl.tsx       -> estado, defaults y adaptacion de eventos
FeatureView.tsx       -> render puro
Feature.tsx           -> entrada publica
index.ts              -> export local
Feature.stories.tsx   -> documentacion visual
Feature.test.tsx      -> pruebas de comportamiento
```

La idea es separar el contrato de uso, la logica de adaptacion y la vista. Esto permite evolucionar la implementacion sin romper el API publico.

Los eventos siguen una variante Observer: el componente entrega el valor ya normalizado y, cuando aplica, el evento original.

```tsx
<JTextBox
  value={email}
  onChange={(value, event) => setEmail(value)}
  onEnterPress={(value) => submit(value)}
/>
```

## Storybook

En desarrollo local:

```bash
npm run storybook
```

Build estatico:

```bash
npm run build-storybook
```

El Storybook cubre los componentes visuales exportados por categoria:

- `Atoms/*`
- `Molecules/*`
- `Layouts/*`
- `Organisms/*`
- `Pages/*`
- `Hooks/useToast`

## Scripts

| Script | Que hace |
| --- | --- |
| `npm install` | Instala dependencias. Ya no requiere `--legacy-peer-deps` (React fijado a 18 en devDependencies). |
| `npm run build` | Compila la libreria a `dist/`: bundle ESM+CJS (Vite), tipos `.d.ts` (tsc) y CSS (Tailwind). |
| `npm run lint` | Chequeo de tipos con `tsc --noEmit`. |
| `npm test` | Ejecuta la suite con Vitest. |
| `npm run storybook` | Levanta Storybook en `http://localhost:6006`. |
| `npm run build-storybook` | Build estatico de Storybook. |

## Compilar La Libreria

`dist/` **no** esta versionado (esta en `.gitignore`); se genera al compilar y se incluye en el paquete npm via `"files": ["dist"]`. Tras clonar el repo:

```bash
cd web_ts/uijona
npm install
npm run build
```

Esto deja `dist/` listo con ESM, CJS, tipos y CSS.

## Desarrollo Local (Monorepo)

Los proyectos hermanos (por ejemplo `website-develtrex`) consumen esta libreria por ruta local:

```jsonc
// package.json del consumidor
"dependencies": {
  "jona-ui": "file:../uijona"
}
```

`npm install` en el consumidor crea un **symlink** a esta carpeta, por lo que lee `uijona/dist` directamente. Por eso, tras clonar en limpio **hay que compilar `uijona` antes** de levantar o construir el consumidor:

```bash
cd web_ts/uijona && npm install && npm run build
cd ../website-develtrex && npm install && npm run dev
```

Si cambias codigo de la libreria, recompila (`npm run build` en `uijona`) para que el consumidor vea los cambios. Para iteracion rapida puedes usar `npm run build -- --watch` de Vite o trabajar contra Storybook.

## Desarrollo De Componentes

Antes de publicar una nueva tanda de componentes:

1. Crea el componente con estructura JONA.
2. Define el contrato en `InterFeature`.
3. Mantiene el render puro en `FeatureView`.
4. Exporta desde `src/index.ts`.
5. Agrega el subpath export en `package.json`.
6. Crea tests enfocados en comportamiento.
7. Crea stories con estados principales.
8. Ejecuta `npm run lint`, `npm test`, `npm run build` y `npm run build-storybook`.

## Publicacion En npm

El paquete se publica como `jona-ui` (publico). El script `prepublishOnly` corre `npm run build` automaticamente antes de publicar, asi que el tarball siempre lleva un `dist/` fresco.

1. Autenticarse (una sola vez por maquina):

   ```bash
   npm login
   ```

2. Subir la version segun el tipo de cambio (actualiza `package.json` y crea el tag git):

   ```bash
   npm version patch   # fix        -> 1.3.0 -> 1.3.1
   npm version minor   # feature    -> 1.3.0 -> 1.4.0
   npm version major   # breaking   -> 1.3.0 -> 2.0.0
   ```

3. Verificar el contenido exacto del tarball antes de publicar:

   ```bash
   npm run lint
   npm test
   npm pack --dry-run   # lista los archivos que se subiran (solo dist/ y README.md)
   ```

4. Publicar:

   ```bash
   npm publish --access public
   ```

Notas:

- Si la cuenta npm tiene 2FA, `npm publish` pide un OTP, o usa un granular access token con permiso de publicacion (`NPM_TOKEN`).
- Tras publicar, empuja el commit y el tag de version: `git push && git push --tags`.
- Los consumidores por `file:../uijona` **no** necesitan la version publicada; usan el `dist/` local. La publicacion en npm es para consumo externo.

### Publicacion automatica por CI (recomendada)

El workflow [`.github/workflows/publish-npm.yml`](../../.github/workflows/publish-npm.yml) publica en npm automaticamente al empujar un **tag de version** (`v*`). Flujo tipico:

```bash
cd web_ts/uijona
npm version patch          # actualiza package.json y crea el tag vX.Y.Z
git push && git push --tags   # el push del tag dispara el workflow -> npm publish
```

El workflow corre `npm ci`, `npm run lint`, `npm test` y `npm publish --access public` (que via `prepublishOnly` construye el `dist/`).

**Requisito unico:** configurar el secret `NPM_TOKEN` en el repo (Settings > Secrets and variables > Actions) con un *Automation token* de npm con permiso de publicacion. Sin ese secret, el paso de publish falla.

> Nota: el Storybook se publica por otra via independiente (GitHub Pages) en cada push a `main` via `deploy.yml`; no forma parte del paquete npm.

## Licencia

MIT
