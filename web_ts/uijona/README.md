# jona-ui

JONA Design System para React. Es una libreria de componentes basada en Atomic Design y el patron JONA: contratos publicos, implementaciones con estado y vistas puras. Esta pensada para construir aplicaciones reutilizables, testeables y faciles de mantener.

- Package: https://www.npmjs.com/package/jona-ui
- Docs: https://jofrantoba-coding.github.io/patron-frontend-jona/uijona
- Storybook: https://jofrantoba-coding.github.io/patron-frontend-jona/storybook/
- Version publicada: `1.2.7`

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
import { ButtonAtom } from 'jona-ui/atoms/ButtonAtom';
import { InputAtom } from 'jona-ui/atoms/InputAtom';
import { FormFieldMolecule } from 'jona-ui/molecules/FormFieldMolecule';
```

Tambien puedes importar desde el barrel principal:

```tsx
import { ButtonAtom, InputAtom, FormFieldMolecule, useToast } from 'jona-ui';
```

Ejemplo minimo:

```tsx
import 'jona-ui/index.css';
import { ButtonAtom } from 'jona-ui/atoms/ButtonAtom';
import { InputAtom } from 'jona-ui/atoms/InputAtom';

export function LoginForm() {
  return (
    <form>
      <InputAtom
        placeholder="usuario@dominio.com"
        onChange={(value) => console.log(value)}
      />

      <ButtonAtom type="submit">
        Ingresar
      </ButtonAtom>
    </form>
  );
}
```

Ejemplo con toast:

```tsx
import { ToastProvider, useToastHelpers } from 'jona-ui/hooks/useToast';
import { ButtonAtom } from 'jona-ui/atoms/ButtonAtom';

function SaveButton() {
  const toast = useToastHelpers();

  return (
    <ButtonAtom onClick={() => toast.success('Cambios guardados')}>
      Guardar
    </ButtonAtom>
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
import { TextareaAtom } from 'jona-ui/atoms/TextareaAtom';
import { RadioGroupMolecule } from 'jona-ui/molecules/RadioGroupMolecule';
import { BorderLayout } from 'jona-ui/layouts/BorderLayout';
import { LoginOrganism } from 'jona-ui/organisms/LoginOrganism';
import { UiHomeLogin } from 'jona-ui/pages/UiHomeLogin';
```

## Catalogo De Componentes

### Atoms

| Componente | Uso |
| --- | --- |
| `AvatarAtom` | Avatar con imagen, fallback e iniciales |
| `BadgeAtom` | Indicadores de estado |
| `ButtonAtom` | Botones con variantes, tamanos y loading |
| `CheckboxAtom` | Checkbox accesible |
| `ChipAtom` | Chip seleccionable o removible |
| `ErrorMessageAtom` | Mensaje de error o ayuda |
| `IconButtonAtom` | Boton solo icono con label accesible |
| `InputAtom` | Input de texto con eventos normalizados |
| `LabelAtom` | Label de formulario |
| `LinkAtom` | Enlace con variantes visuales |
| `ProgressAtom` | Barra de progreso |
| `RadioAtom` | Radio input base |
| `SelectAtom` | Select nativo |
| `SeparatorAtom` | Separador horizontal o vertical |
| `SkeletonAtom` | Placeholder de carga |
| `SpinnerAtom` | Indicador de carga |
| `SwitchAtom` | Toggle booleano |
| `TextareaAtom` | Campo multilinea |
| `TextAtom` | Texto polimorfico |
| `ToastAtom` | Unidad visual de notificacion |

### Molecules

| Componente | Uso |
| --- | --- |
| `AccordionMolecule` | Secciones expandibles |
| `AlertMolecule` | Mensajes contextuales |
| `BreadcrumbMolecule` | Navegacion jerarquica |
| `CardMolecule` | Contenedor con header, content y footer |
| `CheckboxFieldMolecule` | Checkbox con label y descripcion |
| `DialogMolecule` | Modal con portal |
| `DropdownMolecule` | Menu desplegable |
| `EmptyStateMolecule` | Estado vacio con acciones |
| `FormFieldMolecule` | Campo con label, ayuda y error |
| `PaginationMolecule` | Navegacion paginada |
| `RadioGroupMolecule` | Grupo de opciones radio |
| `SelectFieldMolecule` | Select con label, ayuda y error |
| `SkeletonPresets` | Presets de skeleton |
| `SwitchFieldMolecule` | Switch con label y descripcion |
| `TableMolecule` | Tabla componible |
| `TabsMolecule` | Navegacion por tabs |
| `TooltipMolecule` | Tooltip con portal |
| `UserAvatarMolecule` | Avatar con metadata de usuario |

### Layouts, Organisms Y Pages

| Tipo | Exports |
| --- | --- |
| Layouts | `BorderLayout` |
| Organisms | `LoginOrganism`, `RecoverPasswordOrganism`, `CreateAccountOrganism`, `ErrorPageOrganism`, `HeaderPageOrganism`, `FooterPageOrganism` |
| Pages | `UiHomeLogin`, `UiHomeRecoverPassword`, `UiHomeCreateAccount`, `UiHomeError` |

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
<InputAtom
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

```bash
npm run lint
npm test
npm run build
npm run storybook
npm run build-storybook
```

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

## Publicacion

Checklist usado para publicar:

```bash
npm run lint
npm test
npm run build
npm pack --dry-run
npm publish --access public
```

Si la cuenta npm tiene 2FA, `npm publish` requiere OTP o un granular access token con permisos de publicacion.

## Licencia

MIT
