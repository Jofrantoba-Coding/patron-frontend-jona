import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../services/ApiError';
import { createDraftCatalogService } from './DraftCatalogService';

type Row = Record<string, string>;
const UNIQUE = [{ fields: ['tipo', 'numero'], errorField: 'numero', message: 'Contacto ya se Encuentra Agregado' }];
const draft = (siblings: Row[] = []) => {
  const onRow = vi.fn();
  return { onRow, service: createDraftCatalogService<Row>({ unique: UNIQUE, siblings: () => siblings, onRow }) };
};

describe('DraftCatalogService (S-MD-4, S-MD-5)', () => {
  it('hands the validated row to the parent and returns it, with nothing else to call', async () => {
    const { service, onRow } = draft();
    const row = await service.create({ tipo: 'T', numero: '1' });
    expect(row).toEqual({ tipo: 'T', numero: '1' });
    expect(onRow).toHaveBeenCalledTimes(1);
    expect(onRow).toHaveBeenCalledWith({ tipo: 'T', numero: '1' });
  });

  it('refuses a duplicate among the active siblings with the literal message on the key field (R-MD-6)', async () => {
    const { service, onRow } = draft([{ tipo: 'T', numero: '1', estado: 'A' }]);
    const error = await service.create({ tipo: 'T', numero: ' 1 ' }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 409, code: 'DUPLICATE', details: [{ field: 'numero', message: 'Contacto ya se Encuentra Agregado' }] });
    expect(onRow).not.toHaveBeenCalled();
  });

  it('does not count a deactivated sibling', async () => {
    const { service, onRow } = draft([{ tipo: 'T', numero: '1', estado: 'D' }]);
    await service.create({ tipo: 'T', numero: '1' });
    expect(onRow).toHaveBeenCalledTimes(1);
  });

  it('never reads, edits, removes or lists: a draft only collects rows', async () => {
    const { service } = draft();
    await expect(service.get('1')).rejects.toThrow(/draft/);
    await expect(service.update('1', {})).rejects.toThrow(/draft/);
    await expect(service.remove('1')).rejects.toThrow(/draft/);
    await expect(service.list()).rejects.toThrow(/draft/);
  });
});
