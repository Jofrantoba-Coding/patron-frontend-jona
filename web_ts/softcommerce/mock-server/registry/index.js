import { aduanas } from './catalogs/aduanas.js';
import { colores } from './catalogs/colores.js';
import { estadosDocumento } from './catalogs/estados-documento.js';
import { laboratorios } from './catalogs/laboratorios.js';
import { localidades } from './catalogs/localidades.js';
import { marcas } from './catalogs/marcas.js';
import { nacionalidades } from './catalogs/nacionalidades.js';
import { validateRegistry } from './schema.js';

/**
 * The catalog registry: every entry is listed here and validated at import, so a
 * broken entry fails before any request. Wave 2 adds one line per catalog.
 */
export const REGISTRY = validateRegistry([localidades, aduanas, colores, estadosDocumento, laboratorios, marcas, nacionalidades]);
