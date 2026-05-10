# /jona — Generador de componentes JONA

Genera todos los archivos de un componente nuevo siguiendo el patrón JONA exactamente como está implementado en `uijona/src/`.

## Argumentos

`$ARGUMENTS` tiene el formato: `<tipo> <Nombre> [descripción]`

- **tipo**: `atom` | `molecule` | `organism` | `page`
- **Nombre**: PascalCase incluyendo sufijo del tipo
  - atom → `PriceTagAtom`, `StatusBadgeAtom`
  - molecule → `PriceCardMolecule`, `UserProfileMolecule`
  - organism → `CheckoutOrganism`, `ProfileSettingsOrganism`
  - page → `UiHomeCheckout`, `UiHomeDashboard`
- **descripción**: qué hace el componente (opcional, pero úsala para inferir props)

Si los argumentos están incompletos o ausentes, pregunta al usuario por: tipo, nombre y descripción antes de continuar.

---

## Reglas del patrón JONA

### Directorio destino

| Tipo | Directorio |
|------|-----------|
| atom | `uijona/src/atoms/<Nombre>/` |
| molecule | `uijona/src/molecules/<Nombre>/` |
| organism | `uijona/src/organisms/<Nombre>/` |
| page | `uijona/src/pages/<Nombre>/` |

### Los 5 archivos obligatorios

Siempre se generan exactamente estos 5 archivos, sin más ni menos:

```
<Nombre>/
├── Inter<Nombre>.ts      ← contrato público: interfaz + tipos + defaults
├── <Nombre>View.tsx      ← render puro, sin estado, sin lógica
├── <Nombre>Impl.tsx      ← aplica defaults, gestiona estado y handlers
├── <Nombre>.tsx          ← re-export público (punto de entrada)
└── index.ts              ← barrel local (una línea)
```

---

## Plantillas por tipo

### ATOM

Los atoms son unidades visuales simples. El Impl usa `React.forwardRef` para exponer el elemento DOM.

**`Inter<Nombre>.ts`**
```ts
// Inter<Nombre>.ts — JONA Interface
import React from 'react';

export interface Inter<Nombre> {
  // props relevantes del componente
  className?: string;
  // Observer events: valor primero, evento DOM después
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const <NOMBRE_SCREAMING>_DEFAULTS: Required<Pick<Inter<Nombre>, 'propOpcional'>> = {
  propOpcional: valorDefault,
};
```

**`<Nombre>View.tsx`**
```tsx
// <Nombre>View.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';

interface <Nombre>ViewProps extends Inter<Nombre> {
  forwardedRef?: React.Ref<HTMLElementType>;
}

export const <Nombre>View: React.FC<<Nombre>ViewProps> = ({
  className, forwardedRef, ...props
}) => (
  <element
    ref={forwardedRef}
    className={cn('clases-tailwind-responsive', className)}
    {...props}
  />
);
```

**`<Nombre>Impl.tsx`**
```tsx
// <Nombre>Impl.tsx — JONA Implementation
import React from 'react';
import { Inter<Nombre>, <NOMBRE>_DEFAULTS } from './Inter<Nombre>';
import { <Nombre>View } from './<Nombre>View';

type <Nombre>ImplProps = Inter<Nombre> & Omit<React.ElementHTMLAttributes<HTMLElement>, keyof Inter<Nombre>>;

export const <Nombre>Impl = React.forwardRef<<HTMLElementType>, <Nombre>ImplProps>(
  (props, ref) => (
    <<Nombre>View {...<NOMBRE>_DEFAULTS} {...props} forwardedRef={ref} />
  )
);

<Nombre>Impl.displayName = '<Nombre>';
```

**`<Nombre>.tsx`**
```tsx
// <Nombre>.tsx — JONA Template (punto de entrada público)
export { <Nombre>Impl as <Nombre> } from './<Nombre>Impl';
export type { Inter<Nombre> } from './Inter<Nombre>';
// re-exporta también los tipos auxiliares si los hay
```

**`index.ts`**
```ts
export * from './<Nombre>';
```

---

### MOLECULE

Las molecules componen atoms. Si tienen portals, refs o lógica no trivial, el Impl usa `React.forwardRef` o hooks.

**`Inter<Nombre>.ts`** — igual que atom pero con más props de composición. No incluye refs de implementación interna.

**`<Nombre>View.tsx`** — usa atoms importados con path relativo `../../atoms/<AtomName>`. Completamente sin estado.

**`<Nombre>Impl.tsx`** — puede usar hooks (`useState`, `useEffect`, `useRef`) para portals, posicionamiento, o lógica de interacción. Aplica defaults y pasa todo al View.

Ejemplo de Impl con hooks:
```tsx
export const <Nombre>Impl: React.FC<Inter<Nombre>> = ({ defaultValue, onChange, ...props }) => {
  const [value, setValue] = useState(defaultValue ?? '');
  
  const handleChange = (v: string) => {
    setValue(v);
    onChange?.(v);
  };
  
  return <<Nombre>View {...props} value={value} onChange={handleChange} />;
};
```

---

### ORGANISM

Los organisms tienen estado significativo, validación y handlers de flujo. Son bloques funcionales completos.

**`Inter<Nombre>.ts`** — agrupa: estado (campos de dato), setters, handlers de navegación/acción. Exporta defaults para props opcionales.

```ts
// InterCheckoutOrganism.ts — JONA Interface + defaults
export interface InterCheckoutOrganism {
  // state
  items: CartItem[];
  total: number;
  isLoading?: boolean;
  errorMessage?: string;
  // setters — reciben el nuevo valor
  onQuantityChange: (itemId: string, qty: number) => void;
  // handlers — acciones del usuario
  onSubmit: (e: React.FormEvent) => void;
  onGoBack?: () => void;
}

export const CHECKOUT_ORGANISM_DEFAULTS: Required<Pick<InterCheckoutOrganism,
  'isLoading' | 'errorMessage'
>> = {
  isLoading: false,
  errorMessage: '',
};
```

**`<Nombre>View.tsx`** — render puro que recibe todo via props desde el Inter. Usa molecules y atoms. Sin lógica, sin estado.

**`<Nombre>Impl.tsx`** — gestiona estado local cuando no viene controlado desde fuera. Implementa handlers. Llama al View.

```tsx
export const <Nombre>Impl: React.FC<Partial<Inter<Nombre>> & Pick<Inter<Nombre>, 'onSubmit'>> = (props) => {
  const merged = { ...<NOMBRE>_DEFAULTS, ...props };
  const [isLoading, setIsLoading] = useState(merged.isLoading);
  // ... más estado local si hace falta

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await props.onSubmit(e);
    } finally {
      setIsLoading(false);
    }
  }

  return <<Nombre>View {...merged} isLoading={isLoading} onSubmit={handleSubmit} />;
};
```

---

### PAGE

Las pages son composiciones de layout + organisms. El View usa `BorderLayoutView`. El Impl gestiona todo el estado y delega callbacks externos.

**`Inter<Nombre>.ts`** — interfaz completa de la página: todo el estado + setters + handlers + labels de layout. Props de layout (title, footerText) siempre opcionales.

**`<Nombre>View.tsx`** — compone `BorderLayoutView` con `HeaderPageOrganismView`, `FooterPageOrganismView`, y el organism principal en `center`.

```tsx
// UiHomeCheckoutView.tsx — JONA Layer: View (pure render)
import React from 'react';
import { InterUiHomeCheckout } from './InterUiHomeCheckout';
import { BorderLayoutView } from '../../layouts/BorderLayout';
import { CheckoutOrganismView } from '../../organisms/CheckoutOrganism';
import { HeaderPageOrganismView } from '../../organisms/HeaderPageOrganism';
import { FooterPageOrganismView } from '../../organisms/FooterPageOrganism';

export const UiHomeCheckoutView: React.FC<InterUiHomeCheckout> = (props) => (
  <BorderLayoutView
    north={<HeaderPageOrganismView title={props.appTitle} />}
    south={<FooterPageOrganismView text={props.footerText} />}
    center={<CheckoutOrganismView {...props} />}
  />
);
```

**`<Nombre>Impl.tsx`** — gestiona todo: useState por cada campo, validación, llamadas async, manejo de errores. Construye el objeto `InterUiHome<X>` completo y lo pasa al View.

---

## Convenciones de código obligatorias

### Comentarios de cabecera
Cada archivo lleva exactamente una línea de comentario al inicio:
```
// Inter<Nombre>.ts — JONA Interface + defaults
// <Nombre>View.tsx — JONA View (render puro)
// <Nombre>Impl.tsx — JONA Implementation
// <Nombre>.tsx — JONA Template (punto de entrada público)
```

### Tailwind responsive (mobile-first)
- Padding: `p-4 sm:p-6`
- Texto: `text-sm` base, `sm:text-base` si escala
- Layout: `flex flex-col sm:flex-row`
- Ancho de cards/forms: `w-full max-w-sm sm:max-w-md mx-auto`
- Overflow: `min-w-0` en flex containers, `break-words` en texto largo
- Tablas: envueltas en `max-w-full overflow-auto`

### Patrón Observer para eventos
Los eventos siempre reciben el **valor** primero, el evento DOM después:
```ts
onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
onBlur?: (value: string, event: React.FocusEvent<HTMLInputElement>) => void;
onEnterPress?: (value: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
```

### Import de `cn`
```ts
import { cn } from '../../lib/cn';   // desde atoms/, molecules/, organisms/, pages/
```

### Imports entre capas
```ts
// Un organism importa atoms y molecules así:
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { FormFieldMolecule } from '../../molecules/FormFieldMolecule';
import { CardMolecule, CardHeader, CardContent, CardFooter } from '../../molecules/CardMolecule';
```

### Accesibilidad mínima
- `aria-label` en botones sin texto visible
- `aria-describedby` enlazando error/descripción al input
- `role="dialog" aria-modal="true"` en overlays
- `aria-invalid` en inputs con error

---

## Pasos de ejecución

1. **Lee** `uijona/src/index.ts` para conocer el formato exacto de exports del grupo correspondiente.

2. **Crea los 5 archivos** con `Write` en el directorio correcto según el tipo.

3. **Añade el export** en `uijona/src/index.ts` con `Edit`, insertando la línea nueva al final del bloque del tipo correspondiente (Atoms / Molecules / Organisms / Pages):
   ```ts
   export * from './atoms/<Nombre>';   // para atom
   export * from './molecules/<Nombre>';   // para molecule
   export * from './organisms/<Nombre>';   // para organism
   export * from './pages/<Nombre>';   // para page
   ```

4. **Informa al usuario**:
   - Los 5 archivos creados con sus rutas relativas
   - La línea añadida en `src/index.ts`
   - El import público resultante: `import { <Nombre> } from 'jona-ui';`
   - Si hay algo que el usuario debe implementar externamente (ej. callbacks de navegación en pages)

---

## Notas importantes

- **No crear** archivos de test, stories ni documentación a menos que el usuario lo pida explícitamente.
- **No modificar** archivos existentes más allá del `src/index.ts`.
- Si el componente ya existe en el repo, avisar al usuario antes de sobreescribir.
- Si el usuario dice "sin lógica interna" o "solo visual", el Impl puede ser mínimo (solo aplica defaults, sin useState).
- Los defaults solo se definen para props opcionales que tienen un valor razonable por defecto (no para todos los opcionales).
