import { describe, expect, it, vi } from 'vitest';
import { lazyService } from './lazyService';

interface Greeter {
  greet(name: string): Promise<string>;
  count(): Promise<number>;
}

const realGreeter = (): Greeter => ({
  greet: async (name) => `hello ${name}`,
  count: async () => 42,
});

describe('lazyService', () => {
  it('does not load the module until a method is called', () => {
    const load = vi.fn(async () => realGreeter());

    lazyService<Greeter>(load);

    expect(load).not.toHaveBeenCalled();
  });

  it('forwards calls (with arguments) to the loaded implementation', async () => {
    const service = lazyService<Greeter>(async () => realGreeter());

    await expect(service.greet('ana')).resolves.toBe('hello ana');
    await expect(service.count()).resolves.toBe(42);
  });

  it('loads the module once for many calls', async () => {
    const load = vi.fn(async () => realGreeter());
    const service = lazyService<Greeter>(load);

    await Promise.all([service.greet('a'), service.greet('b'), service.count()]);

    expect(load).toHaveBeenCalledTimes(1);
  });

  it('rejects the call when the loader fails, and retries on the next call', async () => {
    const load = vi
      .fn<() => Promise<Greeter>>()
      .mockRejectedValueOnce(new Error('chunk failed'))
      .mockResolvedValueOnce(realGreeter());
    const service = lazyService<Greeter>(load);

    await expect(service.count()).rejects.toThrow('chunk failed');
    await expect(service.count()).resolves.toBe(42);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('is not thenable, so awaiting the proxy yields the proxy itself', async () => {
    const service = lazyService<Greeter>(async () => realGreeter());

    const awaited = await Promise.resolve(service);

    expect(awaited).toBe(service);
  });
});
