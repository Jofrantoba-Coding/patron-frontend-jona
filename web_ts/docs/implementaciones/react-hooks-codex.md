---
layout: default
title: React Hooks Codex
parent: Implementaciones
nav_order: 2
---

# JONA con React Hooks — Variante Codex
{: .no_toc }

Implementación extendida con **6 capas**, storage persistente y guía interactiva del patrón.
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

**Carpeta:** `appjona_codex_react_hooks/`

---

## ¿Qué diferencia a la variante Codex?

La variante Codex introduce dos capas adicionales respecto a la implementación básica:

1. **`UiHomeProps.ts`** — Contrato explícito de props para el componente visual
2. **`UiHomeTemplateModel.ts`** — Modelo que extiende la interfaz con propiedades de estado

Esto resulta en **6 archivos por vista** en lugar de 4-5, lo que da mayor explicitad y separación de typing.

Además incorpora:
- **Storage persistente** (`appStorage.ts`) para guardar preferencias UI
- **Guía interactiva** del patrón visible dentro de la app

---

## Estructura de archivos (6 capas)

```
src/views/uihome/
├── InterUiHome.ts               # 1. Contrato público (métodos)
├── UiHomeProps.ts               # 2. Props del componente visual
├── UiHomeTemplateModel.ts       # 3. Modelo de template (estado + hook)
├── UiHome.tsx                   # 4. Componente visual
├── UiHomeImpl.ts                # 5. Implementación (lógica + storage)
└── UiHomeView.tsx               # 6. Orquestador (entry point)
```

---

## Capa 1 — Interfaz

```typescript
// InterUiHome.ts
export interface InterUiHome {
  onMount: () => void;
  closePatternGuide: () => void;
  openPatternGuide: () => void;
}
```

---

## Capa 2 — Props del visual

```typescript
// UiHomeProps.ts
import { InterUiIniciarSesionProps } from '../uiiniciarsesion/UiIniciarSesionProps';

export interface UiHomeProps extends InterUiIniciarSesionProps {
  isPatternGuideVisible: boolean;
  onClosePatternGuide: () => void;
  onOpenPatternGuide: () => void;
}
```

Esta capa separa explícitamente **lo que necesita el visual** de **lo que expone el contrato público**.

---

## Capa 3 — Template Model

```typescript
// UiHomeTemplateModel.ts
export interface UiHomeTemplateModel extends InterUiHome {
  isPatternGuideVisible: boolean;
  setPatternGuideVisible: (value: boolean) => void;
}

export function useUiHome(): UiHomeTemplateModel {
  const [isPatternGuideVisible, setPatternGuideVisible] = useState(true);

  function onMount(): void {
    console.log('UiHome template montado');
  }

  function openPatternGuide(): void {
    setPatternGuideVisible(true);
  }

  function closePatternGuide(): void {
    setPatternGuideVisible(false);
  }

  return {
    isPatternGuideVisible,
    setPatternGuideVisible,
    onMount,
    openPatternGuide,
    closePatternGuide,
  };
}
```

---

## Capa 4 — Componente Visual

```tsx
// UiHome.tsx
export const UiHome: React.FC<UiHomeProps> = (props) => (
  <BorderLayout
    north={<Header onOpenGuide={props.onOpenPatternGuide} />}
    south={<Footer />}
    center={
      <>
        {props.isPatternGuideVisible && (
          <PatternGuide onClose={props.onClosePatternGuide} />
        )}
        <UiIniciarSesion {...props} />
      </>
    }
  />
);
```

---

## Capa 5 — Implementación

```typescript
// UiHomeImpl.ts
export function useUiHomeImpl(): UiHomeViewModel {
  const base     = useUiHome();
  const loginVm  = useUiIniciarSesionImpl();

  useEffect(() => {
    base.onMount();
    // Consulta storage para no mostrar la guía si ya fue cerrada
    if (readHomeGuideDismissed()) {
      base.setPatternGuideVisible(false);
    }
  }, []);

  function closePatternGuide(): void {
    base.closePatternGuide();
    saveHomeGuideDismissed(true); // persiste en localStorage
  }

  return {
    ...base,
    loginVm,
    closePatternGuide,
    openPatternGuide: base.openPatternGuide,
  };
}
```

---

## Capa 6 — View

```tsx
// UiHomeView.tsx
export const UiHomeView: React.FC = () => {
  const impl = useUiHomeImpl();
  return (
    <UiHome
      {...impl.loginVm}
      isPatternGuideVisible={impl.isPatternGuideVisible}
      onClosePatternGuide={impl.closePatternGuide}
      onOpenPatternGuide={impl.openPatternGuide}
    />
  );
};
```

---

## Storage persistente

```typescript
// appStorage.ts
const HOME_GUIDE_KEY = 'jona_home_guide_dismissed';

export function readHomeGuideDismissed(): boolean {
  return localStorage.getItem(HOME_GUIDE_KEY) === 'true';
}

export function saveHomeGuideDismissed(value: boolean): void {
  localStorage.setItem(HOME_GUIDE_KEY, String(value));
}
```

---

## Comparación con la variante básica

| Aspecto | React Hooks (básico) | React Hooks Codex |
|---------|---------------------|-------------------|
| Archivos por vista | 4 | 6 |
| Props tipadas explícitamente | No siempre | Siempre (`*Props.ts`) |
| Template model separado | No | Sí (`*TemplateModel.ts`) |
| Storage persistente | No | Sí |
| Guía interactiva | No | Sí |
| Complejidad | Baja | Media |
| Recomendado para | Prototipos, features simples | Features complejas, equipos |
