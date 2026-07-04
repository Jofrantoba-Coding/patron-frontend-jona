# uijona-4ngular

JONA Design System para **Angular 21**. Port del sistema de diseño `jona-ui` (React) a
componentes **standalone** con **signals**, siguiendo Atomic Design y el **patrón JONA**:
contrato público + componente con estado + template puro.

- Basado en Tailwind CSS y tokens CSS (variables `--jona-*`).
- Componentes standalone (sin NgModules), `ChangeDetectionStrategy.OnPush`.
- Inputs/outputs con signals (`input()`, `output()`, `model()`).
- Los controles de formulario implementan `ControlValueAccessor` (`[(ngModel)]`, `formControl`).

## Instalación

```bash
npm install uijona-4ngular
```

Peer dependencies: `@angular/core`, `@angular/common`, `@angular/forms` (^21).

### Estilos

Importa la hoja compilada **una sola vez** (en `angular.json` → `styles`, o en tu `styles.css` global):

```css
@import 'uijona-4ngular/styles/uijona.css';
```

Incluye los tokens de tema, el reset de Tailwind, las utilidades usadas y el CSS de
componentes (motor de layout de `JPanel`, slots de `JButton`, animaciones, etc.).

Si solo quieres los tokens (para sobreescribir la paleta):

```css
@import 'uijona-4ngular/styles/tokens.css';
```

## Uso

Los componentes son standalone: se importan directamente en el `imports` del componente
o del bootstrap.

```ts
import { Component } from '@angular/core';
import { JButton, JTextBox } from 'uijona-4ngular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [JButton, JTextBox],
  template: `
    <j-text-box placeholder="usuario@dominio.com" [(value)]="email" />
    <j-button type="submit" (clicked)="submit()">Ingresar</j-button>
  `,
})
export class LoginComponent {
  email = '';
  submit() {}
}
```

### Iconos y slots

Varios componentes proyectan contenido:

```html
<!-- Icono dentro de un botón -->
<j-button>
  <svg jIcon viewBox="0 0 24 24">…</svg>
  Guardar
</j-button>

<!-- Iconos en un input -->
<j-text-box placeholder="Buscar">
  <svg jIconLeft>…</svg>
</j-text-box>
```

### Formularios

Los controles funcionan con Angular Forms:

```html
<j-check-box label="Acepto" [(ngModel)]="accepted" />
<j-combo-box [options]="opts" formControlName="pais" />
```

### Tema en runtime

```ts
import { JonaThemeService } from 'uijona-4ngular';

constructor(private theme: JonaThemeService) {}
ngOnInit() {
  this.theme.apply({ primary600: '124 58 237', radius: '0.5rem' });
}
```

## Patrón JONA (adaptado a Angular)

Cada componente se organiza por responsabilidades:

```txt
inter-j-feature.ts   -> contrato público: tipos, DEFAULTS y mapas de clases
j-feature.ts         -> @Component: estado (signals), defaults y clases computadas + template puro
index.ts             -> export local (barrel)
```

El `inter-*` no acopla a Angular (TS puro), lo que permite compartir contrato y evolucionar
la implementación sin romper el API. El template del componente es la "vista pura".

Equivalencias respecto al `jona-ui` de React:

| React | Angular |
| --- | --- |
| `InterFeature.ts` | `inter-j-feature.ts` |
| `FeatureImpl.tsx` (defaults, forwardRef) | clase `@Component` con `input()` |
| `FeatureView.tsx` (render puro) | template inline del componente |
| `cn()` (clsx + tailwind-merge) | `cn()` idéntico |
| `onChange(value, event)` | `output()` value-first + `ControlValueAccessor` |
| `asChild` (cloneElement) | no portado (usar `routerLink` / anchor `href`) |

## Catálogo (completo)

### Atoms (20)

`JButton` · `JSpinner` · `JBadge` · `JLabel` · `JSeparator` · `JDot` · `JChip` · `JGlyph` ·
`JIcon` · `JProgress` · `JSkeleton` · `JAvatar` · `JImagen` · `JTextBox` · `JTextArea` ·
`JCheckBox` · `JRadioButton` · `JSwitch` · `JComboBox` · `JPanel`

### Molecules (41)

`JCard`* · `JAlert` · `JFormField` · `JSectionHeading` · `JEmptyState` · `JMetricCard` ·
`JServiceCard` · `JContactMethodCard` · `JNumberedStep` · `JRelatedItem` · `JStatCard` ·
`JProgressItem` · `JCheckBoxField` · `JSwitchField` · `JSelectField` · `JFaqItem` ·
`JUserAvatar` · `JRating` · `JStepper` · `JRadioGroup` · `JBreadcrumb`* · `JSkeletonPresets`* ·
`JTimer` · `JTabs`* · `JAccordion` · `JPagination` · `JSearchInput` · `JNumberInput` ·
`JLanguageSwitcher` · `JTable`* · `JDialog` · `JOptionPane` · `JDrawer` · `JTooltip` ·
`JPopover` · `JDropdown` · `JToast` · `JFileUpload` · `JCombobox` · `JMultiSelect` ·
`JDataTable` · `JDatePicker`  · (`*` = familia de varios componentes)

### Layouts (9)

`JBoxLayout` · `JFlowLayout` · `JGridLayout` · `JCardLayout` · `JGridBagLayout` ·
`JGroupLayout` · `JSpringLayout` · `JBorderLayout` · `JSidebarLayout`

### Organisms (19)

`JSiteFooter` · `JMetricsBand` · `JLogoMarquee` · `JDetailCTA` · `JContactSteps` ·
`JContactMethods` · `JMarketingCTA` · `JMarketingHero` · `JDetailHero` · `JCaseStudies` ·
`JNavbar` · `JHeaderPage` · `JFooterPage` · `JHeroDynamic` · `JDashboardPreview` ·
`JErrorPage` · `JLogin` · `JRecoverPassword` · `JCreateAccount`

### Pages (4)

`JHomeLogin` · `JHomeRecoverPassword` · `JHomeCreateAccount` · `JHomeError`

### Notas de port

- Slots que en React eran `ReactNode` se proyectan por contenido con atributos marcadores
  (`[jIcon]`, `[jVisual]`, `[jTrigger]`, `[jNorth]`, `[jHeader]`, …).
- Overlays (JDialog/JDrawer/JTooltip/JPopover/JDropdown/JCombobox…) usan posicionamiento
  `fixed` en línea (sin `@angular/cdk`) con cierre por Escape y click-outside.
- `JDatePicker` usa formato ISO + hora opcional (la máquina de máscaras/timezones del
  original React se simplifica). `JTable` porta los primitivos componibles + orden por
  cabecera (sin resize por arrastre).

## Desarrollo

```bash
npm run build      # compila la lib (ng-packagr) + la hoja de estilos (Tailwind)
npm run build:lib  # solo ng-packagr
npm run build:css  # solo la hoja compilada
```

> Requiere Node ≥ 22.12 (Angular CLI 21).

## Licencia

MIT
