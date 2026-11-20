// Entrada del navegador: lee los datos que dejó el servidor e hidrata el mismo árbol, ahora con
// el servicio que da vida a la cara de eventos. No importa nada de servidor/ (regla 1).
import '@jona-libro/ds-atomico/tokens.css';
import { hydrateRoot } from 'react-dom/client';
import { leerDatosIncrustados } from '../compartido/datosIncrustados';
import { UiCatalogo, type DatosUiCatalogo } from '../ui/catalogo';
import { crearServicioCatalogoFetch } from './crearServicioCatalogoFetch';

const datos = leerDatosIncrustados<DatosUiCatalogo>(document);

hydrateRoot(document.getElementById('raiz')!, <UiCatalogo datos={datos} servicio={crearServicioCatalogoFetch()} />, {
  onRecoverableError: (error) => console.error('Hidratación con diferencias:', error),
});
