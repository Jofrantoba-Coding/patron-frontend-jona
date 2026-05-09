# jona-ui

JONA Design System para React. Combina Atomic Design, patron JONA y eventos estilo Observer para construir interfaces reutilizables, testeables y listas para aplicaciones.

## Estado

- Componentes visuales exportados: atoms, molecules, layouts, organisms y pages.
- Storybook: configurado con Vite, autodocs y addon a11y.
- Build: genera ESM, CJS, tipos TypeScript y CSS compilado.
- Imports directos: soportados por subpath exports para mejorar tree-shaking.

## Instalacion

```bash
npm install jona-ui
```

Peer dependencies:

```bash
npm install react react-dom
```

Importa los estilos globales una sola vez en tu aplicacion:

```tsx
import 'jona-ui/index.css';
```

## Uso

Import directo recomendado:

```tsx
import { ButtonAtom } from 'jona-ui/atoms/ButtonAtom';
import { FormFieldMolecule } from 'jona-ui/molecules/FormFieldMolecule';
```

Import desde el barrel:

```tsx
import { ButtonAtom, FormFieldMolecule, useToast } from 'jona-ui';
```

Ejemplo basico:

```tsx
import 'jona-ui/index.css';
import { ButtonAtom } from 'jona-ui/atoms/ButtonAtom';
import { InputAtom } from 'jona-ui/atoms/InputAtom';

export function LoginForm() {
  return (
    <form>
      <InputAtom
        placeholder="Email"
        onChange={(value) => console.log(value)}
      />
      <ButtonAtom type="submit">Ingresar</ButtonAtom>
    </form>
  );
}
```

## Storybook

```bash
npm run storybook
npm run build-storybook
```

Storybook cubre los componentes visuales exportados:

- `Atoms/*`
- `Molecules/*`
- `Layouts/*`
- `Organisms/*`
- `Pages/*`
- `Hooks/useToast`

La configuracion esta en `.storybook/` y carga `src/styles/index.css` desde `preview.ts`.

## Scripts

```bash
npm run lint
npm test
npm run build
npm run storybook
npm run build-storybook
```

## Arquitectura

JONA organiza cada componente por responsabilidad:

```txt
InterFeature.ts       -> contrato publico y eventos
FeatureImpl.tsx       -> estado, defaults y adaptacion de eventos
FeatureView.tsx       -> render puro
Feature.tsx           -> entrada publica
index.ts              -> export local
Feature.stories.tsx   -> documentacion visual
```

En atoms y molecules, los eventos siguen una variante Observer: el componente entrega el valor ya normalizado y, cuando aplica, el evento original.

```tsx
<InputAtom
  onChange={(value, event) => setEmail(value)}
  onEnterPress={(value) => submit(value)}
/>
```

## Componentes

### Atoms

| Componente | Uso |
| --- | --- |
| `AvatarAtom` | Avatar con imagen e iniciales |
| `BadgeAtom` | Etiquetas de estado |
| `ButtonAtom` | Botones con variantes y loading |
| `CheckboxAtom` | Checkbox accesible |
| `ChipAtom` | Chips seleccionables o removibles |
| `ErrorMessageAtom` | Mensajes de error o ayuda |
| `IconButtonAtom` | Boton icon-only con label accesible |
| `InputAtom` | Input con eventos Observer |
| `LabelAtom` | Label de formulario |
| `LinkAtom` | Enlaces con variantes visuales |
| `ProgressAtom` | Barra de progreso |
| `RadioAtom` | Radio input base |
| `SelectAtom` | Select nativo |
| `SeparatorAtom` | Separador horizontal o vertical |
| `SkeletonAtom` | Placeholder de carga |
| `SpinnerAtom` | Indicador de carga |
| `SwitchAtom` | Toggle booleano |
| `TextareaAtom` | Campo de texto multilinea |
| `TextAtom` | Texto polimorfico |
| `ToastAtom` | Unidad visual de toast |

### Molecules

| Componente | Uso |
| --- | --- |
| `AccordionMolecule` | Secciones expandibles |
| `AlertMolecule` | Mensajes contextuales |
| `BreadcrumbMolecule` | Navegacion jerarquica |
| `CardMolecule` | Contenedor con header/content/footer |
| `CheckboxFieldMolecule` | Checkbox con label y ayuda |
| `DialogMolecule` | Modal con portal |
| `DropdownMolecule` | Menu desplegable |
| `EmptyStateMolecule` | Estado vacio con acciones |
| `FormFieldMolecule` | Input con label/error |
| `PaginationMolecule` | Paginacion |
| `RadioGroupMolecule` | Grupo de opciones radio |
| `SelectFieldMolecule` | Select con label/error |
| `SkeletonPresets` | Presets de skeleton |
| `SwitchFieldMolecule` | Switch con label/descripcion |
| `TableMolecule` | Tabla componible |
| `TabsMolecule` | Tabs |
| `TooltipMolecule` | Tooltip con portal |
| `UserAvatarMolecule` | Avatar con datos de usuario |

### Layouts, organisms y pages

| Tipo | Export |
| --- | --- |
| Layout | `BorderLayout` |
| Organisms | `LoginOrganism`, `RecoverPasswordOrganism`, `CreateAccountOrganism`, `ErrorPageOrganism`, `HeaderPageOrganism`, `FooterPageOrganism` |
| Pages | `UiHomeLogin`, `UiHomeRecoverPassword`, `UiHomeCreateAccount`, `UiHomeError` |

### Hooks y tema

| Export | Uso |
| --- | --- |
| `ToastProvider` | Provider para notificaciones |
| `useToast` | API base de toasts |
| `useToastHelpers` | Helpers `success`, `error`, `warning`, `info` |
| `theme`, `tokens.css` | Base de tematizacion |

## Desarrollo

Antes de publicar o consumir una nueva tanda de componentes:

1. Agrega el componente con estructura JONA.
2. Exportalo desde `src/index.ts`.
3. Agrega subpath export en `package.json`.
4. Crea tests enfocados en comportamiento.
5. Crea story con estados principales.
6. Ejecuta `npm run lint`, `npm test`, `npm run build` y `npm run build-storybook`.
