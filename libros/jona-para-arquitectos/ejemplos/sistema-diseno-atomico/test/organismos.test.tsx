/**
 * Organismos: genéricos, sin dominio. JTable dibuja filas de cualquier tipo; JConfirmDialog
 * pregunta y avisa la respuesta. Ninguno sabe qué es un producto ni cómo se borra.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { JButton, JConfirmDialog, JTable, type JTableColumn } from '../src/index';
import { violacionesGraves } from './axe';

interface Fila {
  codigo: string;
  nombre: string;
  precio: number;
}

const FILAS: Fila[] = [
  { codigo: 'TEC-001', nombre: 'Teclado', precio: 120 },
  { codigo: 'MOU-002', nombre: 'Mouse', precio: 45.5 },
];

const COLUMNAS: JTableColumn<Fila>[] = [
  { id: 'codigo', header: 'Código', cell: (f) => f.codigo },
  { id: 'nombre', header: 'Nombre', cell: (f) => f.nombre },
  { id: 'precio', header: 'Precio', cell: (f) => f.precio.toFixed(2), align: 'end' },
];

describe('JTable', () => {
  it('dibuja encabezados y filas de un tipo que el organismo no conoce', () => {
    render(<JTable caption="Productos" columns={COLUMNAS} rows={FILAS} rowKey={(f) => f.codigo} />);

    const tabla = screen.getByRole('table', { name: 'Productos' });
    expect(screen.getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Código', 'Nombre', 'Precio']);
    expect([...tabla.querySelectorAll('tbody tr')].map((tr) => tr.textContent)).toEqual(['TEC-001Teclado120.00', 'MOU-002Mouse45.50']);
  });

  it('cada acción tiene un nombre accesible por fila y entrega la fila', async () => {
    const onEditar = vi.fn();
    render(
      <JTable
        caption="Productos"
        columns={COLUMNAS}
        rows={FILAS}
        rowKey={(f) => f.codigo}
        actions={[{ id: 'editar', label: 'Editar', accessibleLabel: (f) => `Editar ${f.nombre}`, onAction: onEditar }]}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Editar Mouse' }));

    expect(onEditar).toHaveBeenCalledWith(FILAS[1]);
  });

  it('vacía muestra el mensaje por defecto; cargando, se marca ocupada', () => {
    const { rerender } = render(<JTable caption="Productos" columns={COLUMNAS} rows={[]} rowKey={(f) => f.codigo} />);
    expect(screen.getByRole('status').textContent).toBe('No hay elementos');

    rerender(<JTable caption="Productos" columns={COLUMNAS} rows={FILAS} rowKey={(f) => f.codigo} busy />);
    expect(screen.getByRole('status').textContent).toBe('Cargando…');
    expect(screen.getByRole('table').getAttribute('aria-busy')).toBe('true');
  });

  it('con acciones no tiene violaciones graves', async () => {
    const { container } = render(
      <JTable
        caption="Productos"
        columns={COLUMNAS}
        rows={FILAS}
        rowKey={(f) => f.codigo}
        actions={[{ id: 'eliminar', label: 'Eliminar', accessibleLabel: (f) => `Eliminar ${f.nombre}`, onAction: () => {} }]}
      />,
    );

    expect(await violacionesGraves(container)).toEqual([]);
  });
});

describe('JConfirmDialog', () => {
  it('cerrado no dibuja nada', () => {
    const { container } = render(<JConfirmDialog open={false} title="¿Eliminar?" message="" onConfirm={() => {}} onCancel={() => {}} />);

    expect(container.innerHTML).toBe('');
  });

  it('abierto se anuncia con su título y su mensaje, y el foco va a «Cancelar»', () => {
    render(<JConfirmDialog open title="¿Eliminar Teclado?" message="No se puede deshacer." onConfirm={() => {}} onCancel={() => {}} />);

    const dialogo = screen.getByRole('alertdialog', { name: '¿Eliminar Teclado?' });
    expect(document.getElementById(dialogo.getAttribute('aria-describedby')!)?.textContent).toBe('No se puede deshacer.');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancelar' }));
  });

  it('Escape cancela, salvo mientras la aplicación procesa', async () => {
    const onCancel = vi.fn();
    const { rerender } = render(<JConfirmDialog open title="¿Eliminar?" message="" onConfirm={() => {}} onCancel={onCancel} busy />);
    await userEvent.keyboard('{Escape}');
    expect(onCancel).not.toHaveBeenCalled();

    rerender(<JConfirmDialog open title="¿Eliminar?" message="" onConfirm={() => {}} onCancel={onCancel} />);
    await userEvent.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('al cerrarse, el foco vuelve a donde estaba', async () => {
    function Pantalla() {
      const [abierto, setAbierto] = useState(false);
      return (
        <>
          <JButton onClick={() => setAbierto(true)}>Eliminar</JButton>
          <JConfirmDialog open={abierto} title="¿Eliminar?" message="" onConfirm={() => setAbierto(false)} onCancel={() => setAbierto(false)} />
        </>
      );
    }
    render(<Pantalla />);

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }));

    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Eliminar' }));
  });

  it('abierto no tiene violaciones graves', async () => {
    const { container } = render(<JConfirmDialog open title="¿Eliminar?" message="No se puede deshacer." onConfirm={() => {}} onCancel={() => {}} />);

    expect(await violacionesGraves(container)).toEqual([]);
  });
});
