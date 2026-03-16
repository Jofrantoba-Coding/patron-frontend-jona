// use-ui-home-impl.ts
// Capa: Implementation — composable orquestador de la vista Home
// Responsabilidad: instanciar el Impl de login y exponer sus datos
import { onMounted } from 'vue'
import { useUiIniciarSesionImpl } from '../uiiniciarsesion/use-ui-iniciar-sesion-impl'

export function useUiHomeImpl() {
  const loginImpl = useUiIniciarSesionImpl()

  onMounted(() => {
    console.log('useUiHomeImpl mounted (implementation)')
  })

  return { ...loginImpl }
}
