import { describe, expect, it } from 'vitest';
import { ApiError } from './ApiError';
import type { InterSocioAccionesService } from './InterSocioAccionesService';

export type SocioAccionesServiceFactory = (tenantId: string | undefined) => InterSocioAccionesService;

/** Behavior both implementations of the Socio acciones client share (R-MOCK-26, S-MOCK-54). */
export function describeSocioAccionesServiceContract(label: string, make: SocioAccionesServiceFactory): void {
  describe(`InterSocioAccionesService contract: ${label}`, () => {
    it('loads both lists with the socio joined', async () => {
      const { precios, socios } = await make('demo').load();

      expect(precios.map((r) => [r.id_accion_precio, r.estado])).toEqual([['1', 'D'], ['2', 'A']]);
      expect(socios).toEqual([expect.objectContaining({ id_socio: '1', numero_doc: '45871236', socio: 'RAMOS DIAZ LUIS', estado: 'A', precio: 12.5, cantidad: 100 })]);
    });

    it('saves the op lists atomically and answers the message and both lists as stored', async () => {
      const svc = make('demo');
      const res = await svc.save({ precios: [], socios: [{ op: 'I', id_socio: '2', cantidad: 5, fecha_inicio: '2026-12-01' }] });

      expect(res.message).toBe('Acciones guardadas correctamente');
      expect(res.socios.map((r) => r.id_socio)).toEqual(['1', '2']);
      expect((await svc.load()).socios).toHaveLength(2);
    });

    it('rejects a refused save with an ApiError carrying the sentence, and stores nothing', async () => {
      const svc = make('demo');
      const failure = await svc.save({ precios: [{ op: 'I', precio: 15, fecha_inicio: '2026-12-01' }], socios: [] }).catch((e: unknown) => e);

      expect(failure).toBeInstanceOf(ApiError);
      expect([(failure as ApiError).status, (failure as ApiError).message]).toEqual([409, 'No se Puede Agregar mas de un Precio']);
      expect((await svc.load()).precios).toHaveLength(2);
    });
  });
}
