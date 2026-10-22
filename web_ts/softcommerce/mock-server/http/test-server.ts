import type { AddressInfo } from 'node:net';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { createApp, type AppOptions } from './app.js';
import { readSeed } from '../core/test-helpers.js';

export interface TestServer {
  /** Base URL, e.g. `http://127.0.0.1:54321`. */
  url(): string;
  /** GET/POST/... with optional tenant and extra headers; JSON body is parsed when present. */
  call(
    method: string,
    path: string,
    options?: { tenant?: string; headers?: Record<string, string>; body?: unknown },
  ): Promise<{ status: number; headers: Headers; body: any }>;
}

/**
 * Starts the mock app on port 0 for a describe block and resets the in-memory
 * state after each test (S-MOCK-14), so tests stay deterministic.
 */
export function useTestServer(options: AppOptions = { seed: readSeed() }): TestServer {
  let app: ReturnType<typeof createApp>;
  let base = '';

  beforeAll(async () => {
    app = createApp(options);
    await new Promise<void>((resolve) => app.server.listen(0, '127.0.0.1', resolve));
    base = `http://127.0.0.1:${(app.server.address() as AddressInfo).port}`;
  });
  afterEach(() => app.store.reset());
  afterAll(() => new Promise<void>((resolve) => app.server.close(() => resolve())));

  return {
    url: () => base,
    async call(method, path, { tenant, headers = {}, body } = {}) {
      const res = await fetch(base + path, {
        method,
        headers: {
          ...(tenant ? { 'X-Tenant-Id': tenant } : {}),
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const text = await res.text();
      return { status: res.status, headers: res.headers, body: text ? JSON.parse(text) : undefined };
    },
  };
}
