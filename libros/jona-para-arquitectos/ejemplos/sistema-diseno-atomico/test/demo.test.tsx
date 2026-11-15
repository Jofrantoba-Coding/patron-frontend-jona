/**
 * Composición de demostración (capítulo 2, sección 2.8): una pantalla entera armada solo
 * con el sistema de diseño y datos en memoria, sin servicios. Es lo que el diseñador
 * revisa antes de que exista la aplicación, y lo que una historia de Storybook mostraría.
 */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { JButton, JConfirmDialog, JField, JPageLayout, JSearchBox, JTable } from '../src/index';
import { violacionesGraves } from './axe';

interface Item {
  id: string;
  nombre: string;
}

function CatalogoDeDemostracion() {
  const [items, setItems] = useState<Item[]>([{ id: '1', nombre: 'Teclado' }, { id: '2', nombre: 'Mouse' }]);
  const [termino, setTermino] = useState('');
  const [aEliminar, setAEliminar] = useState<Item>();
  const [nuevo, setNuevo] = useState('');
  const visibles = items.filter((i) => i.nombre.toLowerCase().includes(termino.toLowerCase()));
  return (
    <JPageLayout title="Catálogo" actions={<JButton onClick={() => setItems([...items, { id: nuevo, nombre: nuevo }])}>Agregar</JButton>}>
      <JField label="Nombre del nuevo elemento" value={nuevo} onChange={setNuevo} />
      <JSearchBox label="Buscar en el catálogo" onSearch={setTermino} />
      <JTable
        caption="Elementos"
        columns={[{ id: 'nombre', header: 'Nombre', cell: (i: Item) => i.nombre }]}
        rows={visibles}
        rowKey={(i) => i.id}
        actions={[{ id: 'eliminar', label: 'Eliminar', accessibleLabel: (i) => `Eliminar ${i.nombre}`, onAction: setAEliminar }]}
      />
      <JConfirmDialog
        open={aEliminar !== undefined}
        title={`¿Eliminar ${aEliminar?.nombre}?`}
        message="El elemento sale del catálogo."
        confirmLabel="Eliminar"
        onConfirm={() => {
          setItems(items.filter((i) => i !== aEliminar));
          setAEliminar(undefined);
        }}
        onCancel={() => setAEliminar(undefined)}
      />
    </JPageLayout>
  );
}

const nombres = () => within(screen.getByRole('table')).queryAllByRole('row').slice(1).map((fila) => fila.firstChild?.textContent);

describe('composición de demostración: una pantalla solo con el sistema de diseño', () => {
  it('agrega, busca y elimina sin ningún servicio', async () => {
    render(<CatalogoDeDemostracion />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Nombre del nuevo elemento' }), 'Monitor');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(nombres()).toEqual(['Teclado', 'Mouse', 'Monitor']);

    await userEvent.type(screen.getByRole('searchbox'), 'o{Enter}');
    expect(nombres()).toEqual(['Teclado', 'Mouse', 'Monitor']);
    await userEvent.type(screen.getByRole('searchbox'), 'u{Enter}');
    expect(nombres()).toEqual(['Mouse']);

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar Mouse' }));
    await userEvent.click(within(screen.getByRole('alertdialog', { name: '¿Eliminar Mouse?' })).getByRole('button', { name: 'Eliminar' }));
    expect(screen.getByRole('status').textContent).toBe('No hay elementos');
  });

  it('la pantalla compuesta no tiene violaciones graves', async () => {
    const { container } = render(<CatalogoDeDemostracion />);

    expect(await violacionesGraves(container)).toEqual([]);
  });
});
