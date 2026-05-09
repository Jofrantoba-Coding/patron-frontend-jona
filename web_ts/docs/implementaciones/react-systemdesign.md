---
layout: default
title: React System Design
parent: Implementaciones
nav_order: 3
---

# JONA con React — Variante System Design
{: .no_toc }

Implementación con **integración de design system** y múltiples vistas showcase.
{: .fs-5 .fw-300 }

## Tabla de contenidos
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Stack tecnológico

| Herramienta | Versión |
|-------------|---------|
| React | 18.3.1 |
| TypeScript | 5.2.2 |
| Vite | 5.1.0 |
| React Router | 6.23.0 |
| Tailwind CSS | 3.4.3 |
| lucide-react | 0.577 |
| clsx | 2.1.1 |
| tailwind-merge | 3.5.0 |

**Carpeta:** `app_jona_systemdesign_react_hooks/`

---

## ¿Qué diferencia a esta variante?

Esta variante está orientada a demostrar el patrón JONA en el contexto de un **design system real**, con:

- Componentes visuales que usan iconos de `lucide-react`
- Utilidad `cn()` (clsx + tailwind-merge) para composición de clases
- Vistas adicionales: **Showcase** y **MenuShowcase** para explorar componentes
- Mayor énfasis en la capa visual como consumidora de un design system

---

## Estructura de vistas

```
src/views/
├── uihome/
│   ├── InterUiHome.ts
│   └── UiHomeImpl.ts
├── uiiniciarsesion/
│   ├── InterUiIniciarSesion.ts
│   └── UiIniciarSesionImpl.ts
├── uishowcase/
│   ├── InterUiShowcase.ts
│   └── UiShowcaseImpl.ts
└── uimenushowcase/
    ├── InterUiMenuShowcase.ts
    └── UiMenuShowcaseImpl.ts
```

---

## Utility: función `cn()`

```typescript
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

Permite componer clases Tailwind sin conflictos:

```tsx
<button className={cn(
  "px-4 py-2 rounded",
  variant === 'primary' && "bg-blue-600 text-white",
  variant === 'outline' && "border border-blue-600 text-blue-600",
  disabled && "opacity-50 cursor-not-allowed"
)}>
```

---

## Vista Showcase

La variante incluye una vista especial para demostrar componentes del design system:

```typescript
// InterUiShowcase.ts
export interface InterUiShowcase {
  onMount: () => void;
  selectedComponent: string;
  selectComponent: (name: string) => void;
}

// UiShowcaseImpl.ts
export function useUiShowcaseImpl() {
  const [selectedComponent, setSelectedComponent] = useState('button');

  function selectComponent(name: string): void {
    setSelectedComponent(name);
  }

  useEffect(() => {
    console.log('Showcase montado');
  }, []);

  return { selectedComponent, selectComponent, onMount: () => {} };
}
```

---

## Componentes visuales con design system

```tsx
// UiIniciarSesion.tsx — usa lucide-react y cn()
import { Mail, Lock, LogIn } from 'lucide-react';

export const UiIniciarSesion: React.FC<Props> = (props) => (
  <div className={cn("max-w-sm mx-auto p-6 bg-white rounded-xl shadow-md")}>
    <h1 className="text-2xl font-bold mb-6 text-gray-800">Iniciar sesión</h1>

    <div className="relative">
      <Mail className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
      <input
        type="email"
        value={props.email}
        onChange={e => props.setEmail(e.target.value)}
        className={cn(
          "w-full pl-10 pr-4 py-2 border rounded-lg",
          "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        )}
        placeholder="Email"
      />
    </div>

    <button
      onClick={props.handlerLogin}
      className={cn(
        "w-full flex items-center justify-center gap-2",
        "bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
      )}
    >
      <LogIn className="w-4 h-4" />
      Iniciar sesión
    </button>
  </div>
);
```

---

## Routing extendido

```tsx
// App.tsx
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login"     element={<UiHomeView />} />
      <Route path="/showcase"  element={<UiShowcaseView />} />
      <Route path="/menu"      element={<UiMenuShowcaseView />} />
      <Route path="/"          element={<ProtectedRoute />}>
        <Route path="/home"    element={<UiHomeSessionView />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
```

---

## Principio clave de esta variante

> El **design system** es una dependencia del **componente visual**, no de la implementación. Los hooks de implementación nunca importan componentes del design system.

```
useUiIniciarSesionImpl()   ← No conoce Button, Input, Icon
        ↓ props
UiIniciarSesion.tsx        ← Usa Button, Input, Icon del DS
```
