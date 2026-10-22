import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from './ApiError';
import { composeServices } from './serviceComposer';

// Tracks whether the mock module (fixtures + seed + core) was ever evaluated.
const mockModuleLoaded = vi.hoisted(() => vi.fn());
vi.mock('./mock/AppServicesMock', async (importOriginal) => {
  mockModuleLoaded();
  return importOriginal();
});

describe('composeServices', () => {
  beforeEach(() => {
    mockModuleLoaded.mockClear();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('S-AUTH-1: mock mode returns the mock implementation, loaded lazily through dynamic import', async () => {
    vi.useFakeTimers();
    const { auth } = composeServices({ VITE_API_MODE: 'mock' }, { getSession: () => ({ tenantId: 'demo' }) });
    expect(mockModuleLoaded).not.toHaveBeenCalled();

    const pending = auth.empresas();
    // The mock arrives through import(): settle the load before advancing the mock's timers.
    await vi.dynamicImportSettled();
    await vi.runAllTimersAsync();

    await expect(pending).resolves.toEqual([
      { id: '1', name: 'COMERCIAL DEMO SAC' },
      { id: '2', name: 'DISTRIBUIDORA DEMO SRL' },
    ]);
    expect(mockModuleLoaded).toHaveBeenCalledTimes(1);
  });

  it('S-AUTH-1: the scenario from the env reaches the mock', async () => {
    vi.useFakeTimers();
    const { auth } = composeServices(
      { VITE_API_MODE: 'mock', VITE_API_SCENARIO: 'errorServidor' },
      { getSession: () => ({ tenantId: 'demo' }) },
    );

    const pending = auth.empresas().catch((e: unknown) => e);
    await vi.dynamicImportSettled();
    await vi.runAllTimersAsync();

    const error = await pending;
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500 });
  });

  it('S-AUTH-2: http mode uses fetch against the base URL and never loads the mock', async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ items: [] })));
    const { auth } = composeServices(
      { VITE_API_MODE: 'http', VITE_API_URL: 'https://api.test/' },
      { fetchFn, getSession: () => ({ tenantId: 'demo' }) },
    );

    await expect(auth.sessionOptions()).resolves.toEqual([]);
    await vi.dynamicImportSettled();

    expect(fetchFn.mock.calls[0][0]).toBe('https://api.test/auth/session-options');
    expect(mockModuleLoaded).not.toHaveBeenCalled();
  });

  it('composes the shell service in both modes over the same single mock chunk', async () => {
    vi.useFakeTimers();
    const mockShell = composeServices({ VITE_API_MODE: 'mock' }, { getSession: () => ({ tenantId: 'demo' }) }).shell;
    const pending = mockShell.permissions('demo_stub');
    await vi.dynamicImportSettled();
    await vi.runAllTimersAsync();
    expect((await pending).eliminate).toBe(false);
    vi.useRealTimers();

    const fetchFn = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ items: [] })));
    const httpShell = composeServices(
      { VITE_API_MODE: 'http', VITE_API_URL: 'https://api.test' },
      { fetchFn, getSession: () => ({ tenantId: 'demo' }) },
    ).shell;
    await httpShell.menu();
    expect(fetchFn.mock.calls[0][0]).toBe('https://api.test/menu');
  });

  it('S-AUTH-3 and S-AUTH-4: invalid configuration throws at compose time', () => {
    expect(() => composeServices({ VITE_API_MODE: 'staging' })).toThrow(/VITE_API_MODE/);
    expect(() => composeServices({ VITE_API_MODE: 'http', VITE_API_URL: 'not-a-url' })).toThrow(/VITE_API_URL/);
    expect(() => composeServices({ VITE_API_MODE: 'http' })).toThrow(/VITE_API_URL/);
  });
});
