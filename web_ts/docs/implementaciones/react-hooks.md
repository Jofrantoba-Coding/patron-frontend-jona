---
layout: default
title: React Hooks
parent: Implementaciones
nav_order: 1
---

# JONA con React Hooks (Funcional)
{: .no_toc }

Implementación principal del patrón usando **hooks funcionales de React 18**.
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

**Carpeta:** `appjona_react_hooks/`

---

## Estructura de archivos

```
src/
├── views/
│   ├── uihome/
│   │   ├── InterUiHome.tsx          # Contrato de la vista Home
│   │   ├── UiHomeImpl.ts            # Hook de implementación
│   │   ├── UiHome.tsx               # Componente visual
│   │   └── UiHomeView.tsx           # Orquestador (ruta)
│   ├── uiiniciarsesion/
│   │   ├── InterUiIniciarSesion.tsx # Contrato
│   │   ├── UiIniciarSesion.tsx      # Template hook + visual
│   │   ├── UiIniciarSesionImpl.tsx  # Implementación con AuthService
│   │   └── UiIniciarSesionView.tsx  # Orquestador
│   └── uihomesesion/
│       ├── InterUiHomeSession.tsx
│       ├── UiHomeSession.tsx
│       ├── UiHomeSessionImpl.tsx
│       └── UiHomeSessionView.tsx
├── services/
│   └── AuthService.ts               # Servicio mock de autenticación
├── uilayouts/
│   └── BorderLayout.tsx             # Layout de 5 zonas
└── protectedRoute.tsx               # Guard de autenticación
```

---

## Capa 1 — Interfaz

```typescript
// InterUiHome.tsx
export interface InterUiHome {
  onMount: () => void;
}

// InterUiIniciarSesion.tsx
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
  goToCreateAccount: () => void;
  goToRecoverPassword: () => void;
  isValidData: (email: string, password: string) => boolean;
}
```

---

## Capa 2 — Template Hook

En esta implementación, el **template hook** y el **componente visual** pueden vivir en el mismo archivo. El hook expone el estado y los handlers listos para inyectar al visual.

```typescript
// useUiIniciarSesion() — en UiIniciarSesion.tsx
export function useUiIniciarSesion() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log('Template montado');
  }, []);

  function login(email: string, password: string): void {
    window.alert('Template — sin implementación real');
  }

  const handlerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return {
    email, setEmail,
    password, setPassword,
    handlerLogin,
    login,
    goToCreateAccount: () => {},
    goToRecoverPassword: () => {},
    isValidData: (e: string, p: string) => e.length > 0 && p.length > 0,
  };
}
```

---

## Capa 3 — Implementación

```typescript
// UiIniciarSesionImpl.tsx
export function useUiIniciarSesionImpl() {
  const base     = useUiIniciarSesion(); // hereda todo el estado
  const navigate = useNavigate();

  function login(email: string, password: string): void {
    AuthService.login(email, password)
      .then(response => {
        localStorage.setItem('jona_token', response.token);
        localStorage.setItem('jona_user', JSON.stringify(response.user));
        navigate('/homesesion');
      })
      .catch(error => window.alert(error.message));
  }

  function goToCreateAccount(): void {
    navigate('/create-account');
  }

  function goToRecoverPassword(): void {
    navigate('/recover-password');
  }

  return {
    ...base,
    login,
    goToCreateAccount,
    goToRecoverPassword,
    handlerLogin: (e: React.FormEvent) => {
      e.preventDefault();
      login(base.email, base.password);
    },
  };
}
```

---

## Capa 4 — Componente Visual

```tsx
// UiIniciarSesion.tsx (parte visual)
interface Props {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handlerLogin: (e: React.FormEvent) => void;
  handlerGoToCreateAccount: () => void;
  handlerGoToRecoverPassword: () => void;
}

export const UiIniciarSesion: React.FC<Props> = (props) => (
  <div className="max-w-sm mx-auto p-4">
    <form onSubmit={props.handlerLogin} className="space-y-4">
      <input
        type="email"
        value={props.email}
        onChange={e => props.setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="password"
        value={props.password}
        onChange={e => props.setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Iniciar sesión
      </button>
      <button type="button" onClick={props.handlerGoToCreateAccount}>
        Crear cuenta
      </button>
    </form>
  </div>
);
```

---

## Capa 5 — View (Orquestador)

```tsx
// UiHomeView.tsx
export const UiHomeView: React.FC = () => {
  const impl = useUiHomeImpl();
  return <UiHome {...impl} />;
};
```

```tsx
// UiHome.tsx — página completa con layout
export const UiHome: React.FC<Props> = (props) => (
  <BorderLayout
    north={<Header />}
    south={<Footer />}
    center={<UiIniciarSesion {...props} />}
  />
);
```

---

## Routing

```tsx
// App.tsx
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login"       element={<UiHomeView />} />
      <Route path="/"            element={<ProtectedRoute />}>
        <Route path="/homesesion" element={<UiHomeSessionView />} />
      </Route>
      <Route path="*"            element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);
```

---

## Diagrama de capas

```
InterUiIniciarSesion (contrato)
         │
         ▼
useUiIniciarSesion()   ← Template: estado + placeholders
         │
         ▼
useUiIniciarSesionImpl() ← Implementación: lógica real
         │
         ▼
UiIniciarSesionView    ← Orquestador: hook → visual
         │
         ▼
UiIniciarSesion        ← Visual: solo JSX
```

---

## Credenciales de prueba (mock)

| Email | Password | Rol |
|-------|----------|-----|
| `admin@jona.com` | `123456` | Admin |
| `user@jona.com`  | `abcdef` | Usuario |
