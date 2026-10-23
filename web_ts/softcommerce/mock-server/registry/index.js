import { aduanas } from './catalogs/aduanas.js';
import { almacenes } from './catalogs/almacenes.js';
import { clasifClientes } from './catalogs/clasif-clientes.js';
import { clasifInventarios } from './catalogs/clasif-inventarios.js';
import { colores } from './catalogs/colores.js';
import { condicionesPago } from './catalogs/condiciones-pago.js';
import { empresa } from './catalogs/empresa.js';
import { estadosDocumento } from './catalogs/estados-documento.js';
import { familias } from './catalogs/familias.js';
import { familiasSunat } from './catalogs/familias-sunat.js';
import { laboratorios } from './catalogs/laboratorios.js';
import { localidades } from './catalogs/localidades.js';
import { marcas } from './catalogs/marcas.js';
import { marcasVehiculo } from './catalogs/marcas-vehiculo.js';
import { modelosVehiculo } from './catalogs/modelos-vehiculo.js';
import { monedas } from './catalogs/monedas.js';
import { motivosDescuento } from './catalogs/motivos-descuento.js';
import { motivosNc } from './catalogs/motivos-nc.js';
import { motivosTraslado } from './catalogs/motivos-traslado.js';
import { nacionalidades } from './catalogs/nacionalidades.js';
import { promociones } from './catalogs/promociones.js';
import { puntoVenta } from './catalogs/punto-venta.js';
import { correlativos } from './catalogs/correlativos.js';
import { subfamilias } from './catalogs/subfamilias.js';
import { subfamiliasSunat } from './catalogs/subfamilias-sunat.js';
import { tamanos } from './catalogs/tamanos.js';
import { tiposAnexo } from './catalogs/tipos-anexo.js';
import { tiposCambio } from './catalogs/tipos-cambio.js';
import { tiposDescuento } from './catalogs/tipos-descuento.js';
import { tiposDocVenta } from './catalogs/tipos-doc-venta.js';
import { ubicaciones } from './catalogs/ubicaciones.js';
import { tiposTrabajador } from './catalogs/tipos-trabajador.js';
import { tiposTrabajadorPerfil } from './catalogs/tipos-trabajador-perfil.js';
import { turnos } from './catalogs/turnos.js';
import { zonas } from './catalogs/zonas.js';
import { validateRegistry } from './schema.js';

/**
 * The catalog registry: every entry is listed here and validated at import, so a
 * broken entry fails before any request. Wave 2 adds one line per catalog.
 */
export const REGISTRY = validateRegistry([
  localidades, aduanas, colores, estadosDocumento, laboratorios, marcas, nacionalidades, motivosTraslado, clasifClientes,
  clasifInventarios, tamanos, tiposAnexo, tiposDescuento, condicionesPago, tiposTrabajador, marcasVehiculo, turnos, familiasSunat, motivosDescuento, motivosNc, tiposTrabajadorPerfil, familias, modelosVehiculo, subfamiliasSunat, subfamilias, monedas, tiposCambio, promociones, empresa, puntoVenta, almacenes, zonas, tiposDocVenta, correlativos, ubicaciones,
]);
