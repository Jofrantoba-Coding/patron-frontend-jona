import { aduanas } from './catalogs/aduanas.js';
import { clasifClientes } from './catalogs/clasif-clientes.js';
import { clasifInventarios } from './catalogs/clasif-inventarios.js';
import { colores } from './catalogs/colores.js';
import { condicionesPago } from './catalogs/condiciones-pago.js';
import { estadosDocumento } from './catalogs/estados-documento.js';
import { laboratorios } from './catalogs/laboratorios.js';
import { localidades } from './catalogs/localidades.js';
import { marcas } from './catalogs/marcas.js';
import { marcasVehiculo } from './catalogs/marcas-vehiculo.js';
import { motivosTraslado } from './catalogs/motivos-traslado.js';
import { nacionalidades } from './catalogs/nacionalidades.js';
import { tamanos } from './catalogs/tamanos.js';
import { tiposAnexo } from './catalogs/tipos-anexo.js';
import { tiposDescuento } from './catalogs/tipos-descuento.js';
import { tiposTrabajador } from './catalogs/tipos-trabajador.js';
import { validateRegistry } from './schema.js';

/**
 * The catalog registry: every entry is listed here and validated at import, so a
 * broken entry fails before any request. Wave 2 adds one line per catalog.
 */
export const REGISTRY = validateRegistry([
  localidades, aduanas, colores, estadosDocumento, laboratorios, marcas, nacionalidades, motivosTraslado, clasifClientes,
  clasifInventarios, tamanos, tiposAnexo, tiposDescuento, condicionesPago, tiposTrabajador, marcasVehiculo,
]);
