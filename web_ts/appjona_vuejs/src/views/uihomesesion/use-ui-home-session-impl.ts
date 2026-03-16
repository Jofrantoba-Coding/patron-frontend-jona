// use-ui-home-session-impl.ts
// Capa: Implementation — lógica real de la vista de sesión
// Responsabilidad: leer usuario de localStorage, implementar logout con router
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useUiHomeSessionImpl() {
  const router = useRouter()

  const userRaw = localStorage.getItem('jona_user')
  const user = userRaw ? JSON.parse(userRaw) : { name: '', email: '' }

  const name = ref<string>((user.nombre ?? user.name) as string)
  const email = ref<string>(user.email as string)

  function logout(): void {
    localStorage.removeItem('jona_authenticated')
    localStorage.removeItem('jona_token')
    localStorage.removeItem('jona_user')
    router.push('/login')
  }

  return { name, email, logout }
}
