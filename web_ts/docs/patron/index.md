---
layout: default
title: El Patrón JONA
nav_order: 2
has_children: false
permalink: /patron
---

# El Patrón JONA
{: .no_toc }

Arquitectura de separación de responsabilidades para interfaces de usuario.
{: .fs-6 .fw-300 }

## Tabla de contenidos
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Motivación

En la mayoría de los proyectos frontend, la lógica de negocio, el estado y la presentación terminan mezclados en el mismo componente. Esto genera varios problemas:

- Un cambio de diseño puede romper la lógica
- Un cambio de API obliga a tocar componentes visuales
- Es difícil testear la lógica sin renderizar la UI
- Distintos roles no pueden trabajar en paralelo sin conflictos

El **Patrón JONA** resuelve esto dividiendo cada vista en capas con responsabilidades exclusivas.

---

## Las capas del patrón

### 1. Interfaz / Contrato

**Archivo:** `Inter<NombreVista>.ts`

Define **qué acciones** expone la vista. Es el único acoplamiento entre capas: el visual depende de ella, la implementación la cumple.

```typescript
// InterUiIniciarSesion.ts
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
  goToCreateAccount: () => void;
  goToRecoverPassword: () => void;
  isValidData: (email: string, password: string) => boolean;
}
```

**Reglas:**
- Solo métodos y tipos, sin implementación
- No importa React, Angular ni ningún framework
- Cambia solo si cambia el contrato público de la vista

---

### 2. Template / Modelo de Template

**Archivo:** `<NombreVista>TemplateModel.ts` o el mismo `<NombreVista>.tsx`

Implementa el contrato con **estado base** y **comportamiento placeholder**. Es la "implementación mínima" que funciona de forma aislada, sin servicios reales.

```typescript
// UiIniciarSesionTemplateModel.ts
export function useUiIniciarSesion(): UiIniciarSesionTemplateModel {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function login(email: string, password: string): void {
    // Placeholder — el implementador sobreescribe esto
    window.alert(`Template: login(${email})`);
  }

  function isValidData(email: string, password: string): boolean {
    return email.length > 0 && password.length > 0;
  }

  return { email, password, setEmail, setPassword, login, isValidData, ... };
}
```

**Reglas:**
- Implementa **todas** las propiedades de la interfaz
- Puede tener estado local (`useState`, `ref`, etc.)
- No llama servicios reales ni APIs externas
- Funciona como mock natural para testing

---

### 3. Implementación

**Archivo:** `<NombreVista>Impl.ts`

**Consume** el template hook y **sobreescribe** solo los métodos que necesitan lógica real. Aquí viven las llamadas a servicios, navegación, efectos de montaje, etc.

```typescript
// UiIniciarSesionImpl.ts
export function useUiIniciarSesionImpl(): UiIniciarSesionViewModel {
  const base = useUiIniciarSesion(); // hereda estado + métodos placeholder
  const navigate = useNavigate();

  function login(email: string, password: string): void {
    if (!base.isValidData(email, password)) return;
    AuthService.login(email, password)
      .then(response => {
        localStorage.setItem('token', response.token);
        navigate('/home');
      })
      .catch(error => window.alert(error.message));
  }

  function goToCreateAccount(): void {
    navigate('/create-account');
  }

  return {
    ...base,       // spread del template (estado + métodos no sobreescritos)
    login,         // sobreescribe login
    goToCreateAccount, // sobreescribe navegación
  };
}
```

**Reglas:**
- Siempre empieza con `const base = useTemplate()`
- Sobreescribe **solo** lo que necesita cambiar
- Hace el spread de `base` al retornar: `{ ...base, metodosOverride }`
- No tiene JSX ni renderizado

---

### 4. Componente Visual

**Archivo:** `<NombreVista>.tsx`

Componente **puramente visual**. Recibe todo por props: estado y handlers. No tiene `useState`, `useEffect`, ni imports de servicios.

```tsx
// UiIniciarSesion.tsx
interface UiIniciarSesionProps {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handlerLogin: (e: React.FormEvent) => void;
  handlerGoToCreateAccount: () => void;
  handlerGoToRecoverPassword: () => void;
}

export const UiIniciarSesion: React.FC<UiIniciarSesionProps> = ({
  email, password, setEmail, setPassword,
  handlerLogin, handlerGoToCreateAccount, handlerGoToRecoverPassword,
}) => (
  <div className="max-w-sm mx-auto p-4">
    <form onSubmit={handlerLogin} className="space-y-4">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Iniciar sesión</button>
      <button type="button" onClick={handlerGoToCreateAccount}>Crear cuenta</button>
    </form>
  </div>
);
```

**Reglas:**
- Solo JSX + Tailwind/CSS
- Todos los datos y eventos vienen de props
- Puede ser diseñado/modificado por un UI designer sin conocer la lógica
- Ideal para Storybook o testing visual aislado

---

### 5. View / Orquestador

**Archivo:** `<NombreVista>View.tsx`

**Conecta** la implementación con el visual. Es el único componente que instancia el implementation hook e inyecta el resultado al visual.

```tsx
// UiIniciarSesionView.tsx
export const UiIniciarSesionView: React.FC = () => {
  const impl = useUiIniciarSesionImpl();
  return <UiIniciarSesion {...impl} />;
};
```

**Reglas:**
- El router solo registra Views como rutas
- Solo tiene 2 líneas: instanciar el hook + retornar el visual con spread
- No tiene lógica propia

---

## Flujo completo

```
Router
  └── <UiIniciarSesionView />        ← Orquestador
        └── useUiIniciarSesionImpl() ← Implementación (lógica real)
              └── useUiIniciarSesion() ← Template (estado base)
                    └── InterUiIniciarSesion ← Contrato
        └── <UiIniciarSesion {...impl} /> ← Visual (solo JSX)
```

---

## Responsabilidades por rol

| Rol | Capas que toca | No toca |
|-----|---------------|---------|
| **UI Designer** | Componente Visual (`*.tsx`) | Implementación, servicios |
| **Frontend Dev** | Interfaz, Template, tipos | Lógica de negocio |
| **Integrador** | Implementación (`*Impl.ts`) | Visual, estilos |
| **Arquitecto** | Interfaces, View, routing | Detalles de implementación |

---

## Comparación con otros patrones

| Patrón | Similitud | Diferencia clave |
|--------|-----------|-----------------|
| **MVC** | Separación modelo-vista | JONA separa además template vs. implementación |
| **MVVM** | ViewModel como intermediario | JONA añade la capa de contrato explícito |
| **Custom Hooks** | Lógica en hooks | JONA define la jerarquía template → implementación |
| **Presentational/Container** | Container con lógica, Presentational puro | JONA es más explícito con contratos y templates |

---

## Árbol de archivos típico

```
src/views/uiiniciarsesion/
├── InterUiIniciarSesion.ts          # Contrato
├── UiIniciarSesionTemplateModel.ts  # Estado base + placeholders
├── UiIniciarSesionImpl.ts           # Lógica real, servicios
├── UiIniciarSesion.tsx              # Visual puro (JSX)
└── UiIniciarSesionView.tsx          # Orquestador (entry point)
```

---

## Cuándo usar cada variante

- **4-5 capas** (básica): vistas simples, prototipos, features pequeñas
- **6 capas** (codex): vistas con estado complejo, props explícitas, sub-componentes y storage persistente
- **Clases** (refs/state-props): proyectos legacy con React class components
- **Puro TS**: entornos sin framework, apps de consola con UI mínima
