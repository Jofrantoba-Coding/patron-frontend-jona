import { describe, expect, it } from 'vitest';
import { createSessionStore, type Session } from './sessionStore';

const session: Session = {
  tenantId: 'demo',
  token: 'tok-1',
  user: { id_usuario: 5, usuario: 'admin', nombre: 'Administrador' },
  empresa: { id: '2', name: 'Empresa Dos' },
  puntoVenta: { id: 'P1', name: 'Principal', id_empresa: '2' },
  periodo: { fechaInicio: '2026-01-01', fechaFin: '2026-12-31' },
  params: { INICIO_ACTIVIDADES: '2020-01-01', IS_FACTURADOR_SUNAT: false, ISBOTICA: false, DESPACHO_AUTOMATICO: false },
};

/** Node has no sessionStorage: the store only needs get/set/remove. */
const memoryStorage = (): Storage => {
  const data = new Map<string, string>();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v), removeItem: (k) => void data.delete(k) } as Storage;
};

describe('sessionStore.getRequestContext (D13)', () => {
  it('is empty before login', () => {
    expect(createSessionStore(memoryStorage()).getRequestContext()).toEqual({});
  });

  it('knows only the user after step 1', () => {
    const store = createSessionStore(memoryStorage());
    store.setPending({ tenantId: 'demo', result: { token: 'p', user: session.user } });
    expect(store.getRequestContext()).toEqual({ userId: '5' });
  });

  it('holds the user and the empresa of the session as strings', () => {
    const store = createSessionStore(memoryStorage());
    store.setSession(session);
    expect(store.getRequestContext()).toEqual({ userId: '5', empresaId: '2' });
  });

  it('leaves getContext as it was: tenant and token only', () => {
    const store = createSessionStore(memoryStorage());
    store.setSession(session);
    expect(store.getContext()).toEqual({ tenantId: 'demo', token: 'tok-1' });
  });
});
