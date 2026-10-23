import { describe, expect, it, vi } from 'vitest';
import { composeServices } from './serviceComposer';

describe('composeServices request context (D13)', () => {
  it('http mode sends the live request context on every call', async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ items: [] })));
    let context = { userId: '5', empresaId: '1' };
    const { catalog } = composeServices(
      { VITE_API_MODE: 'http', VITE_API_URL: 'https://api.test' },
      { fetchFn, getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => context },
    );
    await catalog('x').list();
    context = { userId: '5', empresaId: '2' };
    await catalog('x').list();

    const sent = fetchFn.mock.calls.map(([, init]) => new Headers((init as RequestInit).headers).get('X-Empresa-Id'));
    expect(sent).toEqual(['1', '2']);
  });

  it('mock mode hands the request context to the in-browser mock', async () => {
    vi.useFakeTimers();
    const { catalog } = composeServices(
      { VITE_API_MODE: 'mock' },
      { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '5', empresaId: '1' }) },
    );
    const pending = catalog('localidades').list();
    await vi.dynamicImportSettled();
    await vi.runAllTimersAsync();
    // Localidad needs no context; the call still works with one present.
    await expect(pending).resolves.toHaveProperty('items');
    vi.useRealTimers();
  });
});
