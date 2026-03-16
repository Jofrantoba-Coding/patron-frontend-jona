// use-ui-iniciar-sesion.ts
// Capa: Template — composable base con estado y stubs
// Responsabilidad: estado local, handlers que delegan al contrato
// Restricciones: nunca importar servicios externos, navegación ni storage
import { ref, onMounted } from 'vue'
import type { InterUiIniciarSesion } from './inter-ui-iniciar-sesion'

export function useUiIniciarSesion(): InterUiIniciarSesion & {
  email: ReturnType<typeof ref<string>>
  password: ReturnType<typeof ref<string>>
  handlerLogin: () => void
  handlerGoToCreateAccount: () => void
  handlerGoToRecoverPassword: () => void
} {
  const email = ref('')
  const password = ref('')

  onMounted(() => {
    console.log('useUiIniciarSesion mounted (template)')
  })

  // --- Métodos del contrato (stubs) ---

  function login(email: string, password: string): void {
    window.alert('Template — login clicked')
    console.log(`Template — email: ${email}, password: ${password}`)
  }

  function goToCreateAccount(): void {
    console.log('Template — navigating to create account')
  }

  function goToRecoverPassword(): void {
    console.log('Template — navigating to recover password')
  }

  function isValidData(email: string, password: string): boolean {
    return email !== '' && password !== ''
  }

  // --- Handlers de eventos ---

  function handlerLogin(): void {
    if (isValidData(email.value, password.value)) {
      login(email.value, password.value)
    } else {
      window.alert('Please fill in both fields. (template)')
    }
  }

  function handlerGoToCreateAccount(): void {
    goToCreateAccount()
  }

  function handlerGoToRecoverPassword(): void {
    goToRecoverPassword()
  }

  return {
    email,
    password,
    login,
    goToCreateAccount,
    goToRecoverPassword,
    isValidData,
    handlerLogin,
    handlerGoToCreateAccount,
    handlerGoToRecoverPassword,
  }
}
