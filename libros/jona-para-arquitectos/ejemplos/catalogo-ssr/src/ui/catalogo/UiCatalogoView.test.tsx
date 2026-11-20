// Punto de sustitución 1: la vista se dibuja con los DEFAULTS y datos literales, sin
// Implementación, sin servicio y sin servidor.
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UICATALOGO_DEFAULTS } from './InterUiCatalogo';
import { UiCatalogoView } from './UiCatalogoView';

const nada = () => undefined;
const EVENTOS = { onCambiarBorrador: nada, onBuscar: nada, onPedirEliminar: nada, onConfirmarEliminar: nada, onCancelarEliminar: nada };

describe('UiCatalogoView', () => {
  it('con los DEFAULTS y una lista vacía, dibuja el título, el buscador y el texto vacío', () => {
    render(<UiCatalogoView {...UICATALOGO_DEFAULTS} {...EVENTOS} termino="" productos={[]} borrador="" pendiente={false} />);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Productos');
    expect(screen.getByRole('searchbox', { name: 'Buscar productos' })).toBeDefined();
    expect(screen.getByRole('status').textContent).toBe('No hay productos que coincidan');
  });

  it('muestra el aviso del servidor como alerta', () => {
    render(<UiCatalogoView {...UICATALOGO_DEFAULTS} {...EVENTOS} termino="" productos={[]} borrador="" pendiente={false} aviso="No se pudo cargar el catálogo" />);

    expect(screen.getByRole('alert').textContent).toBe('No se pudo cargar el catálogo');
  });
});
