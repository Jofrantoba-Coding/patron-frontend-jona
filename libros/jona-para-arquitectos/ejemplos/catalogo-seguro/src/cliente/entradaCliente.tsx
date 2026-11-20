// Entrada del navegador y raíz de composición del cliente: elige el servicio y monta la
// aplicación. En producción, siempre el adaptador contra el BFF. El servicio falso solo existe
// en desarrollo: Vite reemplaza import.meta.env.DEV por false al compilar, la rama desaparece y
// con ella el import() (regla 4 de test/architecture; test/artefacto.test.ts lo comprueba).
import '@jona-libro/ds-atomico/tokens.css';
import { createRoot } from 'react-dom/client';
import { UiAplicacion, type InterServicioAplicacion } from '../ui/aplicacion';
import { crearServicioFetch } from './crearServicioFetch';

function elegirServicio(): Promise<InterServicioAplicacion> {
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('falso')) {
    return import('./servicioFalso').then((modulo) => modulo.crearServicioFalso());
  }
  return Promise.resolve(crearServicioFetch());
}

void elegirServicio().then((servicio) => {
  createRoot(document.getElementById('raiz')!).render(<UiAplicacion servicio={servicio} />);
});
