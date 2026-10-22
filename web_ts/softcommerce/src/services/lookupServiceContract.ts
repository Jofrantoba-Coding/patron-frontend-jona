import { describe, expect, it } from 'vitest';
import type { InterLookupService } from './InterLookupService';
import type { SessionContext } from './httpClient';

export type LookupServiceFactory = (getSession: () => SessionContext) => InterLookupService;

/** Behavior both implementations must share (dual-source parity) for the Localidad lookups. */
export function describeLookupServiceContract(label: string, make: LookupServiceFactory): void {
  describe(`InterLookupService contract: ${label}`, () => {
    const demo = () => make(() => ({ tenantId: 'demo' }));

    it('lists the empresas of the session tenant', async () => {
      expect(await demo().empresas()).toEqual([
        { id: '1', name: 'COMERCIAL DEMO SAC' },
        { id: '2', name: 'DISTRIBUIDORA DEMO SRL' },
      ]);
    });

    it('lists ubigeo children by level: roots, provincias, distritos', async () => {
      const service = demo();

      expect((await service.ubigeoChildren()).map((u) => u.id)).toEqual(['04', '07', '08', '15']);
      expect((await service.ubigeoChildren('15')).map((u) => u.id)).toEqual(['1501', '1505']);
      expect(await service.ubigeoChildren('1501')).toContainEqual({ id: '150103', name: 'ATE' });
    });

    it('returns an empty list for an unknown parent, not an error', async () => {
      expect(await demo().ubigeoChildren('99')).toEqual([]);
    });
  });
}
