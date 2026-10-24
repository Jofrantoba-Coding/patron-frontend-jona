import { describe, expect, it } from 'vitest';
import { PARAM_KEYS } from '../registry/paramKeys.js';
import { useTestServer } from './test-server';

const server = useTestServer();
const params = async (tenant: string) => (await server.call('GET', '/v1/params', { tenant })).body;

describe('S-MOCK-52 company params keys (R-MOCK-24)', () => {
  it('demo carries the Wave 3 keys with their seeded values and the Wave 1 keys unchanged', async () => {
    expect(await params('demo')).toEqual({
      INICIO_ACTIVIDADES: '2020-01-01', IS_FACTURADOR_SUNAT: true, ISBOTICA: false, DESPACHO_AUTOMATICO: false,
      IS_CLIENTE_SUSTITUTO: true, IS_CLIENTE_CREDITO: true, IS_CLIENTE_CONDICION_PAGO: true, IS_DIRECCION_CLIENTE: true, IS_ITEM_RESUMEN_PRECIO: true, IS_BOTICA_SIN_LOTE: false, PORC_IGV: 18,
    });
  });

  it('botica carries the desktop defaults', async () => {
    expect(await params('botica')).toEqual({
      INICIO_ACTIVIDADES: '2022-03-01', IS_FACTURADOR_SUNAT: true, ISBOTICA: true, DESPACHO_AUTOMATICO: true,
      IS_CLIENTE_SUSTITUTO: false, IS_CLIENTE_CREDITO: false, IS_CLIENTE_CONDICION_PAGO: false, IS_DIRECCION_CLIENTE: true, IS_ITEM_RESUMEN_PRECIO: false, IS_BOTICA_SIN_LOTE: false, PORC_IGV: 18,
    });
  });

  it('the registry knows exactly the keys the seed serves (a gate.param cannot drift from the payload)', async () => {
    for (const tenant of ['demo', 'botica']) expect(Object.keys(await params(tenant)).sort()).toEqual(Object.keys(PARAM_KEYS).sort());
  });
});
