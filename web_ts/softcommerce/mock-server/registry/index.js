import { localidades } from './catalogs/localidades.js';
import { validateRegistry } from './schema.js';

/**
 * The catalog registry: every entry is listed here and validated at import, so a
 * broken entry fails before any request. Wave 2 adds one line per catalog.
 */
export const REGISTRY = validateRegistry([localidades]);
