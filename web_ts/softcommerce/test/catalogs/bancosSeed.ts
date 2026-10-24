/**
 * The bank rows of tabla SUNAT 3 behind the Cliente `Cuentas` select (R-MST-11, D21), added to the shared `tablas-detalle-sunat` seed by the specs that need them. They are NOT in
 * `mock-server/data/catalogs/tablas-detalle-sunat.json`: the W2 case `lookups.spec` S-REF-35 pins the shared list at fourteen active rows, so the rows wait for the confirmation of that
 * count (14 to 17) before they move into the JSON. 58 is OTROS (the desktop special id, [INFERRED]); 59 is retired.
 */
export const BANCOS = [
  { id_detalle_sunat: '56', id_tabla_sunat: '3', numero: '002', descripcion: 'BANCO DE CREDITO DEL PERU', activo: true },
  { id_detalle_sunat: '57', id_tabla_sunat: '3', numero: '003', descripcion: 'INTERBANK', activo: true },
  { id_detalle_sunat: '58', id_tabla_sunat: '3', numero: '999', descripcion: 'OTROS', activo: true },
  { id_detalle_sunat: '59', id_tabla_sunat: '3', numero: '004', descripcion: 'BANCO RETIRADO', activo: false },
];

/** The seed with the banks added; any other section is untouched. */
export const withBancos = <S extends Record<string, any>>(seed: S): S => ({ ...seed, 'tablas-detalle-sunat': [...seed['tablas-detalle-sunat'], ...BANCOS] });
