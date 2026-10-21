import { ProgressivePagination } from './progressive-pagination';

interface Item {
  id: string;
}

const result = (page: number, items: Item[], total: number) => ({
  items,
  pagination: { page, pageSize: 2, total },
});

describe('ProgressivePagination', () => {
  it('acumula paginas sin duplicar y termina al alcanzar el total', () => {
    const state = new ProgressivePagination<Item>((item) => item.id);
    state.seed(result(1, [{ id: 'a' }, { id: 'b' }], 3));

    const token = state.beginNext();
    expect(token?.page).toBe(2);
    expect(state.resolve(token!, result(2, [{ id: 'b' }, { id: 'c' }], 3))).toBe(true);

    expect(state.items().map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(state.hasMore()).toBe(false);
    expect(state.beginNext()).toBeNull();
  });

  it('conserva registros y reintenta la misma pagina despues de un error', () => {
    const state = new ProgressivePagination<Item>((item) => item.id);
    state.seed(result(1, [{ id: 'a' }], 3));

    const failed = state.beginNext()!;
    expect(state.reject(failed, 'Sin conexion')).toBe(true);
    expect(state.items().map((item) => item.id)).toEqual(['a']);
    expect(state.error()).toBe('Sin conexion');

    const retry = state.beginNext()!;
    expect(retry.page).toBe(failed.page);
    state.resolve(retry, result(2, [{ id: 'b' }], 3));
    expect(state.items().map((item) => item.id)).toEqual(['a', 'b']);
  });

  it('rechaza respuestas obsoletas despues de resetear la consulta', () => {
    const state = new ProgressivePagination<Item>((item) => item.id);
    state.seed(result(1, [{ id: 'old' }], 4));
    const stale = state.beginNext()!;

    state.reset();
    state.seed(result(1, [{ id: 'fresh' }], 1));

    expect(state.resolve(stale, result(2, [{ id: 'stale' }], 4))).toBe(false);
    expect(state.items().map((item) => item.id)).toEqual(['fresh']);
    expect(state.loading()).toBe(false);
  });

  it('termina ante una pagina vacia aunque el total del servidor quede desactualizado', () => {
    const state = new ProgressivePagination<Item>((item) => item.id);
    state.seed(result(1, [{ id: 'a' }, { id: 'b' }], 5));

    const token = state.beginNext()!;
    state.resolve(token, result(2, [], 5));

    expect(state.hasMore()).toBe(false);
    expect(state.beginNext()).toBeNull();
  });

  it('usa el avance de pagina y no solo la cantidad unica cuando hay solapamiento', () => {
    const state = new ProgressivePagination<Item>((item) => item.id);
    state.seed(result(1, [{ id: 'a' }, { id: 'b' }], 4));

    const token = state.beginNext()!;
    state.resolve(token, result(2, [{ id: 'b' }, { id: 'c' }], 4));

    expect(state.items().map((item) => item.id)).toEqual(['a', 'b', 'c']);
    expect(state.hasMore()).toBe(false);
  });

  it('bloquea solicitudes concurrentes hasta que la activa termina', () => {
    const state = new ProgressivePagination<Item>((item) => item.id);
    state.seed(result(1, [{ id: 'a' }], 4));

    expect(state.beginNext()?.page).toBe(2);
    expect(state.beginNext()).toBeNull();
  });
});