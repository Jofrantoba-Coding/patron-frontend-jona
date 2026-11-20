// Qué página se dibuja y con qué datos. Es lo que viaja incrustado en el HTML: el cliente lo lee
// para hidratar la misma unidad con los mismos datos.
import type { DatosUiCatalogo } from './catalogo';
import type { DatosUiNoEncontrado } from './noencontrado';
import type { DatosUiProducto } from './producto';

/** Cara de datos de la página: serializable (regla 2 de test/architecture). */
export type DatosPagina =
  | { unidad: 'catalogo'; datos: DatosUiCatalogo }
  | { unidad: 'producto'; datos: DatosUiProducto }
  | { unidad: 'no-encontrado'; datos: DatosUiNoEncontrado };
