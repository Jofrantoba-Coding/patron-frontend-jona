---
layout: default
title: React Class + State/Props
parent: Implementaciones
nav_order: 7
---

# JONA con React — Clases, State y Props
{: .no_toc }

Implementación con **componentes de clase** usando estado controlado (`this.state`) y props tipadas.
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

**Carpeta:** `appjona_react_state_props/`

---

## Diferencia con la variante Refs

| Aspecto | React Class + Refs | React Class + State/Props |
|---------|-------------------|--------------------------|
| Inputs | No controlados (`createRef`) | Controlados (`this.state`) |
| Actualización | Lee refs al submit | `setState` por cada cambio |
| Re-renders | Solo al submit | Uno por keystroke |
| Tipado de props | Genérico `<P>` | Interface `*Props.ts` explícita |
| Tipado de estado | No hay estado | Interface `*State.ts` explícita |

---

## Estructura de archivos (5 capas explícitas)

```
src/views/uiiniciarsesion/
├── InterUiIniciarSesion.tsx        # Contrato (métodos)
├── UiIniciarSesionState.tsx        # Tipo del estado interno
├── UiIniciarSesionProps.tsx        # Tipo de las props
├── UiIniciarSesion.tsx             # Clase template (estado controlado)
├── UiIniciarSesionImpl.tsx         # Clase implementación
└── UiIniciarSesionView.tsx         # View (wrapper funcional)
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

## Capa 2 — Tipo de Estado

```typescript
// UiIniciarSesionState.tsx
export interface UiIniciarSesionState {
  email: string;
  password: string;
  isLoading: boolean;
  errorMessage: string;
}
```

---

## Capa 3 — Tipo de Props

```typescript
// UiIniciarSesionProps.tsx
export interface UiIniciarSesionProps {
  navigate: (path: string) => void;
  initialEmail?: string;
}
```

---

## Capa 4 — Clase Template (estado controlado)

```typescript
// UiIniciarSesion.tsx
export class UiIniciarSesion
  extends Component<UiIniciarSesionProps, UiIniciarSesionState>
  implements InterUiIniciarSesion
{
  state: UiIniciarSesionState = {
    email: this.props.initialEmail ?? '',
    password: '',
    isLoading: false,
    errorMessage: '',
  };

  componentDidMount(): void {
    console.log('Template montado');
  }

  // Handlers de estado controlado
  handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.target.value });
  };

  // Métodos del contrato (placeholders)
  login(email: string, password: string): void {
    window.alert(`Template: login(${email})`);
  }

  goToCreateAccount(): void {
    window.alert('Template: crear cuenta');
  }

  goToRecoverPassword(): void {
    window.alert('Template: recuperar contraseña');
  }

  isValidData(email: string, password: string): boolean {
    return email.length > 0 && password.length > 0;
  }

  handlerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    this.login(this.state.email, this.state.password);
  };

  render() {
    const { email, password, isLoading, errorMessage } = this.state;
    return (
      <div className="max-w-sm mx-auto p-4">
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{errorMessage}</div>
        )}
        <form onSubmit={this.handlerLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={this.handleEmailChange}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="password"
            value={password}
            onChange={this.handlePasswordChange}
            className="w-full border rounded px-3 py-2"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
          <button type="button" onClick={() => this.goToCreateAccount()}>
            Crear cuenta
          </button>
        </form>
      </div>
    );
  }
}
```

---

## Capa 5 — Clase Implementación

```typescript
// UiIniciarSesionImpl.tsx
export class UiIniciarSesionImpl extends UiIniciarSesion {
  override componentDidMount(): void {
    console.log('Implementación montada');
  }

  override login(email: string, password: string): void {
    if (!this.isValidData(email, password)) {
      this.setState({ errorMessage: 'Email y contraseña requeridos' });
      return;
    }

    this.setState({ isLoading: true, errorMessage: '' });

    AuthService.login(email, password)
      .then(response => {
        localStorage.setItem('jona_token', response.token);
        localStorage.setItem('jona_user', JSON.stringify(response.user));
        this.props.navigate('/homesesion');
      })
      .catch(error => {
        this.setState({ isLoading: false, errorMessage: error.message });
      });
  }

  override goToCreateAccount(): void {
    this.props.navigate('/create-account');
  }

  override goToRecoverPassword(): void {
    this.props.navigate('/recover-password');
  }
}
```

---

## Capa 6 — View

```tsx
// UiIniciarSesionView.tsx
export const UiIniciarSesionView: React.FC = () => {
  const navigate = useNavigate();
  return <UiIniciarSesionImpl navigate={navigate} />;
};
```

---

## Ventaja del estado controlado

Con `this.state`, el estado es reactivo: podemos mostrar errores en tiempo real, deshabilitar el botón mientras carga, o validar mientras el usuario escribe.

```typescript
// La implementación puede usar setState para UI state
this.setState({ isLoading: true });    // muestra spinner
this.setState({ errorMessage: '...' }); // muestra error inline
```

Esto **no es posible** con la variante Refs, donde el valor solo está disponible al hacer submit.

---

## Diagrama de herencia

```
Component<Props, State>
    └── UiIniciarSesion        ← Template: estado controlado + placeholders
            └── UiIniciarSesionImpl  ← Implementación: override con lógica real
                                          + setState para estados de UI (loading, error)
```
