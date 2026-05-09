---
layout: default
title: React Class + Refs
parent: Implementaciones
nav_order: 6
---

# JONA con React — Clases y Refs
{: .no_toc }

Implementación con **componentes de clase** de React usando `createRef` para inputs no controlados.
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

**Carpeta:** `appjona_react_refs/`

---

## ¿Qué son los React Refs en este contexto?

En esta variante, el componente template usa `createRef<HTMLInputElement>()` para acceder directamente al valor del input en el momento del submit, en lugar de mantener el valor en estado (inputs **no controlados**).

Esto elimina los re-renders por cada keystroke, a costa de no tener el valor reactivo en todo momento.

---

## Inputs controlados vs. no controlados

| Aspecto | Hooks / State | Refs |
|---------|--------------|------|
| Estado | `useState` actualiza en cada tecla | `createRef` solo lee al submit |
| Re-renders | Uno por keystroke | Solo al submit |
| Valor reactivo | Siempre disponible | Solo cuando se lee el ref |
| Validación en tiempo real | Fácil | Requiere leer el ref |

---

## Estructura de archivos

```
src/views/
├── uiiniciarsesion/
│   ├── InterUiIniciarSesion.tsx      # Contrato
│   ├── UiIniciarSesion.tsx           # Clase template con refs
│   ├── UiIniciarSesionImpl.tsx       # Clase implementación (extiende template)
│   └── UiIniciarSesionView.tsx       # View funcional
└── UiHomePage/
    ├── UiHomePage.tsx                # Clase template de la página
    └── UiHomePage.implement.tsx      # Clase implementación de la página
```

---

## Capa 1 — Interfaz

```typescript
// InterUiIniciarSesion.tsx
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
  goToCreateAccount: () => void;
  goToRecoverPassword: () => void;
  isValidData: (email: string, password: string) => boolean;
}
```

---

## Capa 2 — Clase Template (con Refs)

```typescript
// UiIniciarSesion.tsx
export class UiIniciarSesion<P = object>
  extends Component<P>
  implements InterUiIniciarSesion
{
  // Refs para inputs no controlados
  protected txtEmailRef    = createRef<HTMLInputElement>();
  protected txtPasswordRef = createRef<HTMLInputElement>();

  componentDidMount(): void {
    console.log('Template montado');
  }

  login(email: string, password: string): void {
    window.alert(`Template: login(${email})`);
  }

  goToCreateAccount(): void {
    window.alert('Template: ir a crear cuenta');
  }

  goToRecoverPassword(): void {
    window.alert('Template: recuperar contraseña');
  }

  isValidData(email: string, password: string): boolean {
    return email.length > 0 && password.length > 0;
  }

  // Handler que lee los refs al momento del submit
  handlerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email    = this.txtEmailRef.current?.value    ?? '';
    const password = this.txtPasswordRef.current?.value ?? '';
    this.login(email, password);
  };

  render() {
    return (
      <form onSubmit={this.handlerLogin} className="space-y-4 max-w-sm mx-auto p-4">
        <input ref={this.txtEmailRef}    type="email"    className="w-full border rounded px-3 py-2" />
        <input ref={this.txtPasswordRef} type="password" className="w-full border rounded px-3 py-2" />
        <button type="submit">Iniciar sesión</button>
        <button type="button" onClick={() => this.goToCreateAccount()}>Crear cuenta</button>
      </form>
    );
  }
}
```

---

## Capa 3 — Clase Implementación

```typescript
// UiIniciarSesionImpl.tsx
type Props = { navigate: (path: string) => void };

export class UiIniciarSesionImpl extends UiIniciarSesion<Props> {
  override componentDidMount(): void {
    console.log('Implementación montada');
  }

  override login(email: string, password: string): void {
    if (!this.isValidData(email, password)) return;
    AuthService.login(email, password)
      .then(response => {
        localStorage.setItem('jona_token', response.token);
        this.props.navigate('/homesesion');
      })
      .catch(error => window.alert(error.message));
  }

  override goToCreateAccount(): void {
    this.props.navigate('/create-account');
  }
}
```

---

## Capa 4 — View (Wrapper funcional)

Como los componentes de clase no pueden usar hooks directamente, el View es un wrapper funcional que provee los hooks necesarios:

```tsx
// UiIniciarSesionView.tsx
export const UiIniciarSesionView: React.FC = () => {
  const navigate = useNavigate(); // hook solo disponible en funcional
  return <UiIniciarSesionImpl navigate={navigate} />;
};
```

---

## Diagrama de herencia

```
Component<P> (React)
    └── UiIniciarSesion<P>     ← Template: refs + métodos placeholder
            └── UiIniciarSesionImpl  ← Implementación: override con lógica real
```

---

## Cuándo usar esta variante

- Proyectos **legacy** con componentes de clase existentes
- Cuando los inputs tienen muchos campos y se quiere evitar re-renders por keystroke
- Migración gradual: mantener la estructura de clases mientras se aprende el patrón

{: .warning }
> En proyectos nuevos, se recomienda la variante de **React Hooks** que es más idiomática en React moderno.
