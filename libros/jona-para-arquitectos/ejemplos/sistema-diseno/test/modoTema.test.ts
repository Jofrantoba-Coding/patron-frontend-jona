import { afterEach, describe, expect, it } from 'vitest';
import { MODO_TEMA_DEFAULTS, ModoTemaImpl } from '../src/index';

const raiz = () => document.documentElement;

describe('ModoTema (unidad JONA del modo de tema)', () => {
  afterEach(() => raiz().removeAttribute('data-theme-mode'));

  it('sin opciones aplica MODO_TEMA_DEFAULTS: sigue al sistema', () => {
    const tema = new ModoTemaImpl();

    expect(MODO_TEMA_DEFAULTS.modoInicial).toBe('system');
    expect(tema.modo).toBe('system');
    expect(raiz().getAttribute('data-theme-mode')).toBe('system');
  });

  it('respeta el modo inicial indicado', () => {
    const tema = new ModoTemaImpl({ modoInicial: 'dark' });

    expect(tema.modo).toBe('dark');
    expect(raiz().getAttribute('data-theme-mode')).toBe('dark');
  });

  it('cambiarModo actualiza el atributo de <html>', () => {
    const tema = new ModoTemaImpl({ modoInicial: 'light' });

    tema.cambiarModo('dark');

    expect(tema.modo).toBe('dark');
    expect(raiz().getAttribute('data-theme-mode')).toBe('dark');
  });

  it('acepta otra raíz (por ejemplo, un iframe o una prueba aislada)', () => {
    const otra = document.createElement('div');

    new ModoTemaImpl({ modoInicial: 'light' }, otra);

    expect(otra.getAttribute('data-theme-mode')).toBe('light');
    expect(raiz().hasAttribute('data-theme-mode')).toBe(false);
  });
});
