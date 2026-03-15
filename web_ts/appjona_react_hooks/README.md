# appjona_react_hooks

Implementation of the JONA pattern in React using functional components and hooks.

## Description

Adapts the JONA pattern to React's functional paradigm. Instead of class inheritance, extension is achieved through hook composition: the implementation hook consumes the template hook and overrides the methods it needs.

## JONA Pattern Applied

| File | Role |
|---|---|
| `InterUiIniciarSesion.tsx` | Interface — defines the method contract |
| `UiIniciarSesion.tsx` | Template hook + visual component — `useUiIniciarSesion` and `UiIniciarSesion` |
| `UiIniciarSesionImpl.tsx` | Implementation hook — `useUiIniciarSesionImpl`, methods only, no JSX |

## Responsibilities

| Role | Works on |
|---|---|
| UI Designer | `UiIniciarSesion.tsx`, `UiHomeSession.tsx` — JSX, layout, styles |
| Frontend | `InterUiIniciarSesion.tsx`, template hooks — contract and state flow |
| Integrator | `UiIniciarSesionImpl.tsx`, `AuthService.ts` — business logic, API calls |

## Implementation

### 1. Interface

```ts
// InterUiIniciarSesion.tsx
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
  goToCreateAccount: () => void;
  goToRecoverPassword: () => void;
  isValidData: (email: string, password: string) => boolean;
}
```

### 2. Template hook + visual component

The hook provides state and base methods. The visual component is a pure functional component that receives everything via props — contains no business logic.

```tsx
// UiIniciarSesion.tsx

// Template hook
export function useUiIniciarSesion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log('useUiIniciarSesion mounted (template)');
  }, []);

  function login(email: string, password: string): void {
    window.alert('Template — login clicked');
  }

  function isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }

  function handlerLogin(e: React.FormEvent): void {
    e.preventDefault();
    if (isValidData(email, password)) login(email, password);
  }

  return { email, password, setEmail, setPassword, login,
           goToCreateAccount, goToRecoverPassword,
           isValidData, handlerLogin, ... };
}

// Visual component — renders only, receives everything via props
export const UiIniciarSesion: React.FC<UiIniciarSesionProps> = ({
  email, password, setEmail, setPassword,
  handlerLogin, handlerGoToCreateAccount, handlerGoToRecoverPassword,
}) => (
  <form>
    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    <button onClick={handlerLogin}>Login</button>
    <button type="button" onClick={handlerGoToCreateAccount}>Create account</button>
    <button type="button" onClick={handlerGoToRecoverPassword}>Recover password</button>
  </form>
);
```

### 3. Implementation hook

Consumes the template hook and overrides the methods. Contains no JSX.

```ts
// UiIniciarSesionImpl.tsx
export function useUiIniciarSesionImpl() {
  const base = useUiIniciarSesion();
  const navigate = useNavigate();

  // Override login — calls AuthService (mock)
  function login(email: string, password: string): void {
    AuthService.login(email, password)
      .then((response) => {
        localStorage.setItem('jona_authenticated', 'true');
        localStorage.setItem('jona_token', response.token);
        localStorage.setItem('jona_user', JSON.stringify(response.user));
        navigate('/homesesion');
      })
      .catch((error) => window.alert(error.message));
  }

  // Returns template state + overridden methods
  return { ...base, login, goToCreateAccount, goToRecoverPassword, handlerLogin, ... };
}
```

### 4. Service layer

```ts
// AuthService.ts
export const AuthService = {
  login: (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.email === email && u.password === password);
        if (user) resolve({ success: true, token: `mock-token-${Date.now()}`, user, message: 'Login successful' });
        else reject({ success: false, message: 'Invalid credentials' });
      }, 800);
    });
  },
};
```

### 5. Orchestration in UiHomeView

`UiHomeView` instantiates the implementation hook and injects its methods into the visual component.

```tsx
// UiHomeView.tsx
export const UiHomeView: React.FC = () => {
  const impl = useUiHomeImpl();
  return <UiHome {...impl} />;
};
```

## Pattern Flow

```
useUiIniciarSesionImpl  →  AuthService (mock)
  └── useUiIniciarSesion   (state: email, password)
        └── UiIniciarSesion (UI — receives props, knows nothing about business logic)
```

## Run the project

```bash
npm install
npm run dev
```

Open: `http://localhost:5173/login`

## Mock users

| Email | Password |
|---|---|
| `admin@jona.com` | `123456` |
| `user@jona.com` | `abcdef` |
