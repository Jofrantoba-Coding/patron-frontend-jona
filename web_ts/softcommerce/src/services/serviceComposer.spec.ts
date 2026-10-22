import { describe, expect, it, vi } from 'vitest';
import { composeService, parseApiEnv } from './serviceComposer';

describe('parseApiEnv (S-AUTH-3, S-AUTH-4)', () => {
  it('defaults to mock mode with the exitoso scenario when nothing is declared', () => {
    expect(parseApiEnv({})).toEqual({ mode: 'mock', scenario: 'exitoso' });
  });

  it('treats empty values as undeclared', () => {
    expect(parseApiEnv({ VITE_API_MODE: '', VITE_API_SCENARIO: '' })).toEqual({
      mode: 'mock',
      scenario: 'exitoso',
    });
  });

  it('accepts every known scenario in mock mode', () => {
    for (const scenario of ['exitoso', 'vacio', 'errorServidor'] as const) {
      expect(parseApiEnv({ VITE_API_MODE: 'mock', VITE_API_SCENARIO: scenario })).toEqual({
        mode: 'mock',
        scenario,
      });
    }
  });

  it('parses http mode with a valid base URL, without a trailing slash', () => {
    expect(parseApiEnv({ VITE_API_MODE: 'http', VITE_API_URL: 'http://localhost:4020/' })).toEqual({
      mode: 'http',
      scenario: 'exitoso',
      baseUrl: 'http://localhost:4020',
    });
  });

  it('S-AUTH-3: an unknown mode throws naming VITE_API_MODE and the bad value', () => {
    expect(() => parseApiEnv({ VITE_API_MODE: 'staging' })).toThrow(/VITE_API_MODE.*staging/);
  });

  it('rejects an unknown scenario naming VITE_API_SCENARIO, even in http mode', () => {
    expect(() => parseApiEnv({ VITE_API_SCENARIO: 'timeout' })).toThrow(/VITE_API_SCENARIO.*timeout/);
    expect(() =>
      parseApiEnv({ VITE_API_MODE: 'http', VITE_API_URL: 'http://x.test', VITE_API_SCENARIO: 'timeout' }),
    ).toThrow(/VITE_API_SCENARIO/);
  });

  it('S-AUTH-4: http mode with an empty or missing URL throws naming VITE_API_URL', () => {
    expect(() => parseApiEnv({ VITE_API_MODE: 'http', VITE_API_URL: '' })).toThrow(/VITE_API_URL/);
    expect(() => parseApiEnv({ VITE_API_MODE: 'http' })).toThrow(/VITE_API_URL/);
  });

  it('S-AUTH-4: http mode with "not-a-url" throws naming VITE_API_URL and the value', () => {
    expect(() => parseApiEnv({ VITE_API_MODE: 'http', VITE_API_URL: 'not-a-url' })).toThrow(
      /VITE_API_URL.*not-a-url/,
    );
  });

  it('does not require a URL in mock mode', () => {
    expect(() => parseApiEnv({ VITE_API_MODE: 'mock', VITE_API_URL: '' })).not.toThrow();
  });
});

describe('composeService', () => {
  interface Pinger {
    ping(): Promise<string>;
  }

  it('mock mode: nothing loads at compose time; the first call loads the mock with the scenario', async () => {
    const createHttp = vi.fn((): Pinger => ({ ping: async () => 'http' }));
    const loadMock = vi.fn(async (scenario: string): Promise<Pinger> => ({ ping: async () => `mock:${scenario}` }));
    const service = composeService<Pinger>({ mode: 'mock', scenario: 'vacio' }, { createHttp, loadMock });
    expect(loadMock).not.toHaveBeenCalled();

    await expect(service.ping()).resolves.toBe('mock:vacio');

    expect(loadMock).toHaveBeenCalledTimes(1);
    expect(createHttp).not.toHaveBeenCalled();
  });

  it('http mode returns the http implementation and never touches the mock loader', async () => {
    const loadMock = vi.fn(async (): Promise<Pinger> => ({ ping: async () => 'mock' }));
    const createHttp = vi.fn((baseUrl: string): Pinger => ({ ping: async () => `http:${baseUrl}` }));

    const service = composeService<Pinger>(
      { mode: 'http', scenario: 'exitoso', baseUrl: 'http://api.test' },
      { createHttp, loadMock },
    );

    await expect(service.ping()).resolves.toBe('http:http://api.test');
    expect(loadMock).not.toHaveBeenCalled();
  });
});
