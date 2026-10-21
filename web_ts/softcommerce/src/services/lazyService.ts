/**
 * Proxy that defers loading a service module until one of its methods is first
 * called. Used by the composer so mock code stays in a separate chunk. The load
 * is shared by concurrent calls and retried if it failed.
 */
export function lazyService<T extends object>(load: () => Promise<T>): T {
  let loading: Promise<T> | undefined;

  const loaded = (): Promise<T> => {
    loading ??= load().catch((error: unknown) => {
      loading = undefined;
      throw error;
    });
    return loading;
  };

  return new Proxy({} as T, {
    get(_target, property) {
      // Never look thenable, so `await service` returns the proxy itself.
      if (property === 'then' || typeof property === 'symbol') return undefined;
      return (...args: unknown[]) =>
        loaded().then((service) => (service as Record<string, (...a: unknown[]) => unknown>)[property](...args));
    },
  });
}
