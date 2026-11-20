// Violación de la regla 1: la entrada del navegador importa la API del servidor de la unidad
// para "reutilizar" la carga. Con ella viajan el puerto, el error del repositorio y lo que siga.
import { hydrateRoot } from 'react-dom/client';
import { UiCatalogo } from '../ui/catalogo';
import { cargarUiCatalogo } from '../ui/catalogo/indexServidor';

export async function hidratar(repositorio: Parameters<typeof cargarUiCatalogo>[0]) {
  const datos = await cargarUiCatalogo(repositorio, {});
  hydrateRoot(document.getElementById('raiz')!, <UiCatalogo datos={datos} />);
}
