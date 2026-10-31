// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createAuthService } from './createAuthService';

describe('createAuthService: el único lugar que elige el adaptador', () => {
  it('con VITE_AUTH_SERVICE=fake usa el servicio falso, sin red', async () => {
    const result = await createAuthService({ VITE_AUTH_SERVICE: 'fake' }).login('ana@ejemplo.com', 'secreta123');

    expect(result.token).toMatch(/^fake-token-/);
  });

  it('por defecto usa el adaptador HTTP contra VITE_API_URL', async () => {
    const service = createAuthService({ VITE_API_URL: 'http://127.0.0.1:1' });

    await expect(service.login('ana@ejemplo.com', 'secreta123')).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  });
});
