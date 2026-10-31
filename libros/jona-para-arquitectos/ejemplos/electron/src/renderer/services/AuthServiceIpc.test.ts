import { describe, expect, it, vi } from 'vitest';
import type { AuthIpcBridge } from '../../shared/ipcContract';
import { ApiError } from '../../shared/services/ApiError';
import { createAuthServiceIpc } from './AuthServiceIpc';

const ANA = { token: 't-1', user: { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' } };

describe('createAuthServiceIpc (adaptador del contrato de servicio sobre IPC)', () => {
  it('devuelve el LoginResult de un { ok: true }', async () => {
    const bridge: AuthIpcBridge = { login: vi.fn().mockResolvedValue({ ok: true, value: ANA }) };

    await expect(createAuthServiceIpc(bridge).login('ana@ejemplo.com', 'secreta123')).resolves.toEqual(ANA);
    expect(bridge.login).toHaveBeenCalledWith('ana@ejemplo.com', 'secreta123');
  });

  it('reconstruye el ApiError con status, code, message, details y traceId', async () => {
    const error = {
      code: 'VALIDATION_ERROR',
      message: 'La petición no es válida.',
      details: [{ field: 'clave', message: 'Es obligatorio.' }],
      traceId: 'corr-1',
    };
    const bridge: AuthIpcBridge = { login: vi.fn().mockResolvedValue({ ok: false, status: 422, error }) };

    const rejected = await createAuthServiceIpc(bridge).login('ana@ejemplo.com', '').catch((e: unknown) => e);

    expect(rejected).toBeInstanceOf(ApiError);
    expect(rejected).toMatchObject({ status: 422, ...error });
  });

  it('traduce una falla del propio IPC a ApiError con estado 0', async () => {
    const bridge: AuthIpcBridge = { login: vi.fn().mockRejectedValue(new Error('Error invoking remote method')) };

    const rejected = await createAuthServiceIpc(bridge).login('ana@ejemplo.com', 'secreta123').catch((e: unknown) => e);

    expect(rejected).toBeInstanceOf(ApiError);
    expect(rejected).toMatchObject({ status: 0, code: 'IPC_ERROR' });
  });

  it.each([
    ['ninguna respuesta', undefined],
    ['un { ok: true } sin valor', { ok: true }],
    ['un { ok: true } con un token vacío', { ok: true, value: { ...ANA, token: '' } }],
    ['un { ok: false } sin cuerpo de error', { ok: false, status: 500 }],
  ])('rechaza %s con ApiError INVALID_RESPONSE', async (_name, reply) => {
    const bridge = { login: vi.fn().mockResolvedValue(reply) } as unknown as AuthIpcBridge;

    const rejected = await createAuthServiceIpc(bridge).login('ana@ejemplo.com', 'secreta123').catch((e: unknown) => e);

    expect(rejected).toBeInstanceOf(ApiError);
    expect(rejected).toMatchObject({ status: 0, code: 'INVALID_RESPONSE', details: [] });
    expect((rejected as ApiError).traceId).not.toBe('');
  });
});
