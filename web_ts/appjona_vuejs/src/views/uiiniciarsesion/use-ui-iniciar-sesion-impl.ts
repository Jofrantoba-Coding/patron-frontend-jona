// use-ui-iniciar-sesion-impl.ts
// Capa: Implementation — composable que extiende el Template con lógica real
// Responsabilidad: override de login, goToCreateAccount, goToRecoverPassword
// Restricciones: solo métodos, sin template/HTML
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUiIniciarSesion } from './use-ui-iniciar-sesion'
import { AuthService } from '../../services/AuthService'

export function useUiIniciarSesionImpl() {
  const base = useUiIniciarSesion()
  const router = useRouter()

  onMounted(() => {
    console.log('useUiIniciarSesionImpl mounted (implementation)')
  })

  // Override login — llama al AuthService real
  function login(email: string, password: string): void {
    AuthService.login(email, password)
      .then(response => {
        localStorage.setItem('jona_authenticated', 'true')
        localStorage.setItem('jona_token', response.token)
        localStorage.setItem('jona_user', JSON.stringify(response.user))
        router.push('/homesesion')
      })
      .catch(error => {
        console.error('Login failed:', error)
        window.alert(error.message)
      })
  }

  function goToCreateAccount(): void {
    window.alert('Implementation — go to create account')
  }

  function goToRecoverPassword(): void {
    window.alert('Implementation — go to recover password')
  }

  function handlerLogin(): void {
    if (base.isValidData(base.email.value, base.password.value)) {
      login(base.email.value, base.password.value)
    } else {
      window.alert('Please fill in both fields.')
    }
  }

  return {
    ...base,
    login,
    goToCreateAccount,
    goToRecoverPassword,
    handlerLogin,
    handlerGoToCreateAccount: goToCreateAccount,
    handlerGoToRecoverPassword: goToRecoverPassword,
  }
}
