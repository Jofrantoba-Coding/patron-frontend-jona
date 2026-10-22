import { seed } from '../seed';
import type { ScenarioFixture } from './types';

/** Per-tenant section emptied, keeping each tenant id as a key. */
const emptied = (section: Record<string, unknown>): Record<string, unknown[]> =>
  Object.fromEntries(Object.keys(section).map((tenantId) => [tenantId, []]));

/** Tenants and users stay (login works); every catalog and lookup is empty. */
export const vacioFixture: ScenarioFixture = {
  kind: 'data',
  seed: {
    ...seed,
    empresas: emptied(seed.empresas),
    puntosVenta: emptied(seed.puntosVenta),
    localidades: emptied(seed.localidades),
  },
};
