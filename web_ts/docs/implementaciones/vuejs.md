---
layout: default
title: Vue.js
parent: Implementaciones
nav_order: 5
---

# JONA con Vue 3 (Composition API)
{: .no_toc }

Implementación usando **composables** de Vue 3. Los hooks de React se convierten en funciones `use*()` de Vue.
{: .fs-5 .fw-300 }

## Tabla de contenidos
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Stack tecnológico

| Herramienta | Versión |
|-------------|---------|
| Vue | 3.4.0 |
| TypeScript | 5.4.0 |
| Vue Router | 4.3.0 |
| Vite | 5.2.0 |
| Tailwind CSS | 3.4.3 |

**Carpeta:** `appjona_vuejs/`

---

## Mapeo del patrón a Vue

| Capa JONA | React Hooks | Vue 3 Composition API |
|-----------|-------------|----------------------|
| Contrato | `Inter*.ts` | `inter-*.ts` |
| Template hook | `use*()` hook | Composable `use*()` |
| Implementación | `use*Impl()` | Composable `use*Impl()` |
| Visual | Componente `.tsx` | `*.vue` con `<script setup>` |
| View | `*View.tsx` | `*View.vue` |

La Composition API de Vue hace que la migración del patrón sea casi directa.

---

## Estructura de archivos

```
src/views/uihome/
├── inter-ui-home.ts          # Contrato (TypeScript interface)
├── use-ui-home-impl.ts       # Composable de implementación
├── UiHome.vue                # Componente visual (<script setup>)
└── UiHomeView.vue            # View orquestador

src/views/uiiniciarsesion/
├── inter-ui-iniciar-sesion.ts
├── use-ui-iniciar-sesion.ts   # Composable template
├── use-ui-iniciar-sesion-impl.ts
├── UiIniciarSesion.vue
└── UiIniciarSesionView.vue
```

---

## Capa 1 — Interfaz

```typescript
// inter-ui-iniciar-sesion.ts
export interface InterUiIniciarSesion {
  login: (email: string, password: string) => void;
  goToCreateAccount: () => void;
  goToRecoverPassword: () => void;
  isValidData: (email: string, password: string) => boolean;
}
```

---

## Capa 2 — Composable Template

```typescript
// use-ui-iniciar-sesion.ts
import { ref, type Ref } from 'vue';
import type { InterUiIniciarSesion } from './inter-ui-iniciar-sesion';

export interface UiIniciarSesionTemplateModel extends InterUiIniciarSesion {
  email: Ref<string>;
  password: Ref<string>;
}

export function useUiIniciarSesion(): UiIniciarSesionTemplateModel {
  const email    = ref('');
  const password = ref('');

  function login(emailVal: string, passwordVal: string): void {
    alert(`Template: login(${emailVal})`);
  }

  function goToCreateAccount(): void {
    alert('Template: ir a crear cuenta');
  }

  function goToRecoverPassword(): void {
    alert('Template: recuperar contraseña');
  }

  function isValidData(e: string, p: string): boolean {
    return e.length > 0 && p.length > 0;
  }

  return { email, password, login, goToCreateAccount, goToRecoverPassword, isValidData };
}
```

---

## Capa 3 — Composable Implementación

```typescript
// use-ui-iniciar-sesion-impl.ts
import { useRouter } from 'vue-router';
import { useUiIniciarSesion } from './use-ui-iniciar-sesion';
import { AuthService } from '@/services/AuthService';

export function useUiIniciarSesionImpl() {
  const base   = useUiIniciarSesion();
  const router = useRouter();

  function login(email: string, password: string): void {
    if (!base.isValidData(email, password)) return;
    AuthService.login(email, password)
      .then(response => {
        localStorage.setItem('jona_token', response.token);
        router.push('/homesesion');
      })
      .catch(error => alert(error.message));
  }

  function goToCreateAccount(): void {
    router.push('/create-account');
  }

  function handlerLogin(): void {
    login(base.email.value, base.password.value);
  }

  return {
    ...base,
    login,
    goToCreateAccount,
    handlerLogin,
  };
}
```

---

## Capa 4 — Componente Visual (`.vue`)

```vue
<!-- UiIniciarSesion.vue -->
<script setup lang="ts">
import type { Ref } from 'vue';

interface Props {
  email: Ref<string>;
  password: Ref<string>;
  handlerLogin: () => void;
  handlerGoToCreateAccount: () => void;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="max-w-sm mx-auto p-4">
    <form @submit.prevent="props.handlerLogin" class="space-y-4">
      <input
        v-model="props.email.value"
        type="email"
        class="w-full border rounded px-3 py-2"
        placeholder="Email"
      />
      <input
        v-model="props.password.value"
        type="password"
        class="w-full border rounded px-3 py-2"
        placeholder="Contraseña"
      />
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded">
        Iniciar sesión
      </button>
      <button type="button" @click="props.handlerGoToCreateAccount">
        Crear cuenta
      </button>
    </form>
  </div>
</template>
```

---

## Capa 5 — View Orquestador

```vue
<!-- UiIniciarSesionView.vue -->
<script setup lang="ts">
import { useUiIniciarSesionImpl } from './use-ui-iniciar-sesion-impl';
import UiIniciarSesion from './UiIniciarSesion.vue';

const impl = useUiIniciarSesionImpl();
</script>

<template>
  <UiIniciarSesion v-bind="impl" />
</template>
```

---

## Ciclo de vida en Vue

```typescript
// use-ui-home-impl.ts
import { onMounted, onUnmounted } from 'vue';

export function useUiHomeImpl() {
  const loginImpl = useUiIniciarSesionImpl();

  onMounted(() => {
    console.log('Home implementation montada');
  });

  onUnmounted(() => {
    console.log('Home implementation desmontada');
  });

  return { ...loginImpl };
}
```

---

## Diferencias clave respecto a React

| Aspecto | React Hooks | Vue 3 Composables |
|---------|-------------|-------------------|
| Estado | `useState<T>()` → `[val, set]` | `ref<T>()` → `.value` |
| Efectos | `useEffect(() => {}, [])` | `onMounted(() => {})` |
| Reactividad | Inmutabilidad + re-render | Reactividad automática con Proxy |
| Templates | JSX dentro del hook/component | Separado en `<template>` del `.vue` |
| Composición | Spread `{...base, override}` | Spread `{...base, override}` (igual) |
| Tipado de props | Interface TypeScript | `defineProps<Interface>()` |

---

## Ventaja de Vue para el patrón JONA

Vue 3 con Composition API es la tecnología donde el patrón JONA se mapea de forma **más natural** después de React:

- Los composables `use*()` son equivalentes directos de los hooks
- `defineProps<T>()` con genéricos hace el tipado del visual limpio y explícito
- `v-bind="impl"` es el equivalente exacto de `{...impl}` en JSX
