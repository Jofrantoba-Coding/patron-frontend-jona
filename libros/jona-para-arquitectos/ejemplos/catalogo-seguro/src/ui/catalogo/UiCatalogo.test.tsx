import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Producto } from '../../dominio/Producto';
import type { SesionUsuario } from '../../dominio/SesionUsuario';
import { UiCatalogo, type InterServicioCatalogo, type ResultadoEliminar } from './index';

const ANA: SesionUsuario = { usuario: { nombre: 'Ana' }, permisos: { eliminar: true } };
const BETO: SesionUsuario = { usuario: { nombre: 'Beto' }, permisos: { eliminar: false } };

const TECLADO: Producto = { id: 'p-1', sku: 'TEC-001', nombre: 'Teclado mecánico', precio: 120, descripcion: 'Táctil', enlaceFabricante: 'https://fabricante.example/teclados' };
const HOSTIL: Producto = {
  id: 'p-3', sku: 'MON-003', nombre: 'Monitor <img src=x onerror="alert(1)">', precio: 699,
  descripcion: '</script><script>alert(document.cookie)</script>', enlaceFabricante: 'javascript:alert(document.cookie)',
};

function servicio(productos: Producto[], resultado: ResultadoEliminar = 'eliminado'): InterServicioCatalogo {
  return { listar: vi.fn(async () => productos), eliminar: vi.fn(async () => resultado) };
}

describe('UiCatalogo con datos hostiles', () => {
  it('un nombre con HTML y una descripción con un script se muestran como texto: no crean elementos', async () => {
    const { container } = render(<UiCatalogo sesion={ANA} servicio={servicio([HOSTIL])} onSalir={() => {}} />);

    expect(await screen.findByText(HOSTIL.nombre)).toBeTruthy();
    expect(screen.getByText(HOSTIL.descripcion)).toBeTruthy();
    expect(container.querySelectorAll('img, script')).toHaveLength(0);
  });

  it('el enlace javascript: no llega a la vista; el https, sí, como un enlace del sistema de diseño', async () => {
    render(<UiCatalogo sesion={ANA} servicio={servicio([TECLADO, HOSTIL])} onSalir={() => {}} />);

    await screen.findByText(TECLADO.nombre);

    expect(screen.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['https://fabricante.example/teclados']);
  });
});

describe('UiCatalogo y los permisos', () => {
  it('el lector no ve la acción Eliminar; el administrador, sí', async () => {
    const { unmount } = render(<UiCatalogo sesion={BETO} servicio={servicio([TECLADO])} onSalir={() => {}} />);
    await screen.findByText(TECLADO.nombre);
    expect(screen.queryByRole('button', { name: /Eliminar/ })).toBeNull();
    unmount();

    render(<UiCatalogo sesion={ANA} servicio={servicio([TECLADO])} onSalir={() => {}} />);
    expect(await screen.findByRole('button', { name: 'Eliminar Teclado mecánico' })).toBeTruthy();
  });

  it('si el servidor responde que no, la pantalla lo dice y el producto sigue: los permisos de la UI no son el control', async () => {
    // Ana perdió el rol de administradora después de entrar: la UI todavía muestra el botón.
    render(<UiCatalogo sesion={ANA} servicio={servicio([TECLADO], 'prohibido')} onSalir={() => {}} />);

    await userEvent.click(await screen.findByRole('button', { name: 'Eliminar Teclado mecánico' }));
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect((await screen.findByRole('alert')).textContent).toBe('No tiene permiso para eliminar productos.');
    expect(screen.getByText(TECLADO.nombre)).toBeTruthy();
  });
});
