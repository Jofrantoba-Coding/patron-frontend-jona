# JONA Frontend Design Pattern

**Joint Orchestrated N-layer Architecture**

*Jonathan Franchesco Torres Baca — @jofrantoba*

---

## Abstract

JONA is a design pattern for UI development that promotes modularity, maintainability, and clear separation of responsibilities across three well-defined layers: **Interface**, **Template**, and **Implementation**. Its principles are conceptual, not syntactic — making it applicable to any language, framework, platform, or paradigm that supports contracts and abstraction.

---

## Core Principles

JONA is built on three principles that hold regardless of technology:

1. **Define the contract first.** The Interface declares what the UI can do. It is the only shared agreement between all roles on the team.
2. **Separate base UI from integration logic.** The Template owns the visual structure and common behavior. The Implementation owns the backend connection.
3. **Roles do not cross boundaries.** The UI designer never writes backend calls. The integrator never touches markup or styling.

These principles apply equally in TypeScript, Java, Swift, Kotlin, Dart, C#, or any language that supports interfaces and abstraction.

---

## The Three Layers

### Interface

Defines the contract — a set of methods that represent the UI's capabilities. No logic, no rendering, no state. Just the shape of the agreement.

```ts
// TypeScript
export interface InterUiLogin {
  login: (email: string, password: string) => void;
  goToCreateAccount: () => void;
  goToRecoverPassword: () => void;
  isValidData: (email: string, password: string) => boolean;
}
```

```kotlin
// Kotlin (Android)
interface InterUiLogin {
    fun login(email: String, password: String)
    fun goToCreateAccount()
    fun goToRecoverPassword()
    fun isValidData(email: String, password: String): Boolean
}
```

```swift
// Swift (iOS)
protocol InterUiLogin {
    func login(email: String, password: String)
    func goToCreateAccount()
    func goToRecoverPassword()
    func isValidData(email: String, password: String) -> Bool
}
```

---

### Template Class

Implements the interface and provides the base UI — visual structure, state management, event wiring, and default behavior. This is the **UI designer's layer**. It should never contain backend calls or navigation logic.

```ts
// TypeScript + React (hooks)
export function useUiLogin(): InterUiLogin & { ... } {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function login(email: string, password: string): void {
    console.log('Template — login:', email);
  }

  function isValidData(email: string, password: string): boolean {
    return email !== '' && password !== '';
  }

  return { email, password, setEmail, setPassword, login, isValidData, ... };
}
```

---

### Implementation Class

Extends or composes the template and overrides the methods with real logic — API calls, navigation, storage, error handling. This is the **integrator's layer**. No UI code lives here.

```ts
// TypeScript + React (hooks)
export function useUiLoginImpl() {
  const base = useUiLogin();
  const navigate = useNavigate();

  function login(email: string, password: string): void {
    AuthService.login(email, password)
      .then(response => {
        localStorage.setItem('token', response.token);
        navigate('/home');
      })
      .catch(error => window.alert(error.message));
  }

  return { ...base, login };
}
```

```kotlin
// Kotlin (Android)
class UiLoginImpl(private val navController: NavController) : UiLogin() {
    override fun login(email: String, password: String) {
        AuthService.login(email, password)
            .onSuccess { navController.navigate("home") }
            .onFailure { showAlert(it.message) }
    }
}
```

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────┐
│                     views/                       │
│  ┌────────────────────────────────────────────┐  │
│  │              uiiniciarsesion/              │  │
│  │                                            │  │
│  │  «interface»          «class»              │  │
│  │  InterUiLogin ◄─── UiLogin (Template)      │  │
│  │                         │                  │  │
│  │                      extends               │  │
│  │                         │                  │  │
│  │                  «class»▼                  │  │
│  │               UiLoginImpl (Impl)           │  │
│  └──────────────────────┬─────────────────────┘  │
└─────────────────────────┼────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────┐
│                   controllers/                   │
│        RPC      RequestFactory      REST         │
│        GraphQL     WebSocket        ...          │
└──────────────────────────────────────────────────┘
```

The `Impl` class is the only layer that communicates with the controllers layer. The Template and Interface never reach down to it.

---

## Role Separation

| Role | Owns | Never touches |
|---|---|---|
| UI Designer | Interface + Template | Backend calls, navigation, storage |
| Frontend Dev | Interface definition | Implementation details, styling |
| Integrator | Implementation Class | UI markup, component structure |

The Interface is the handshake. Once agreed upon, each role works independently.

---

## Platform & Framework Agnostic

JONA's principles are conceptual. Any platform that supports contracts and abstraction can implement it:

| Platform | Language | Interface mechanism | Template mechanism |
|---|---|---|---|
| Web | TypeScript | `interface` | Class / Hook / Composable |
| Android | Kotlin | `interface` | `abstract class` / Fragment |
| iOS | Swift | `protocol` | `UIViewController` subclass |
| Cross-platform mobile | Dart (Flutter) | `abstract class` | `StatefulWidget` subclass |
| Desktop | C# (.NET MAUI / WPF) | `interface` | `ContentPage` / `UserControl` |
| Backend-driven UI | Java | `interface` | `abstract class` |
| Web (Angular) | TypeScript | `interface` | Base `@Component` class |
| Web (Vue 3) | TypeScript | `interface` | Base composable |

The pattern adapts to the paradigm of the platform — class inheritance where it's natural, hook composition where functional patterns are preferred.

---

## Implementations in This Repository

This repo demonstrates JONA across four paradigms in TypeScript/React:

| Project | Paradigm | Key Mechanism |
|---|---|---|
| `appjona_ts_puro` | Vanilla TypeScript | Class inheritance + DOM manipulation |
| `appjona_react_refs` | React class components | `createRef` for uncontrolled inputs |
| `appjona_react_state_props` | React class components | `state` + `props` for controlled inputs |
| `appjona_react_hooks` | React functional components | Hook composition (`useTemplate` + `useImpl`) |

Each project implements the same login flow:

```
InterUiLogin → UiLogin (template) → UiLoginImpl (impl) → AuthService → UiHomeSession
```

### Mock Users

| Email | Password |
|---|---|
| `admin@jona.com` | `123456` |
| `user@jona.com` | `abcdef` |

---

## Comparison with Established Patterns

JONA does not invent new theory — it operationalizes well-known patterns into a concrete, opinionated convention for UI teams:

| Pattern | Relationship to JONA |
|---|---|
| Template Method (GoF) | JONA applies Template Method specifically to the UI layer |
| MVP | The `Impl` class plays the Presenter role; the Template is the passive View |
| Clean Architecture (Ports & Adapters) | The Interface is the port; the Impl is the adapter |
| MVVM | The `Impl` hook resembles a ViewModel exposing state and commands |
| Feature-Sliced Design | JONA is a within-feature convention, compatible with FSD's slice structure |

What JONA adds is a **team-oriented convention**: a consistent file structure and naming contract that makes the role boundaries explicit and enforceable across any codebase.

---

## Benefits

- **Modularity** — each layer is independently replaceable
- **Maintainability** — changes to backend integration never touch the UI layer
- **Reusability** — template classes work across multiple implementations
- **Flexibility** — the impl layer adapts to any backend protocol or service
- **Team scalability** — designers, frontend devs, and integrators work in parallel without conflicts
- **Platform agnostic** — the same principles apply from web to mobile to desktop

---

## Conclusion

JONA provides a robust and flexible structure for UI development across any platform. Its strength is not in the code — it's in the clarity of the contract between roles. When the Interface is agreed upon, the team can move in parallel, the codebase stays clean, and integration never bleeds into presentation.

Source code: [github.com/Jofrantoba-Coding/patron-frontend-jona](https://github.com/Jofrantoba-Coding/patron-frontend-jona)
