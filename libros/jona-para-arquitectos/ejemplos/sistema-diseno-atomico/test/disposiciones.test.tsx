/**
 * Disposiciones: la estructura de una página, con huecos en lugar de datos.
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JButton, JPageLayout } from '../src/index';
import { violacionesGraves } from './axe';

describe('JPageLayout', () => {
  it('el título es el único h1, y las acciones y el contenido ocupan sus huecos', () => {
    render(
      <JPageLayout title="Productos" actions={<JButton>Nuevo producto</JButton>}>
        <p>Contenido</p>
      </JPageLayout>,
    );

    expect(screen.getAllByRole('heading', { level: 1 }).map((h) => h.textContent)).toEqual(['Productos']);
    expect(screen.getByRole('banner').contains(screen.getByRole('button', { name: 'Nuevo producto' }))).toBe(true);
    expect(screen.getByRole('main').textContent).toBe('Contenido');
  });

  it('el h1 es un JHeading de nivel 1, dentro del encabezado y antes del contenido principal', () => {
    render(<JPageLayout title="Productos"><p>Contenido</p></JPageLayout>);

    const titulo = screen.getByRole('heading', { level: 1 });
    expect(titulo.className).toBe('ds-fg ds-heading-xl');
    expect(screen.getByRole('banner').contains(titulo)).toBe(true);
    expect(screen.getByRole('banner').compareDocumentPosition(screen.getByRole('main'))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('sin acciones, el hueco no deja un contenedor vacío', () => {
    render(<JPageLayout title="Productos"><p>Contenido</p></JPageLayout>);

    expect(screen.getByRole('banner').children).toHaveLength(1);
  });

  it('no tiene violaciones graves', async () => {
    const { container } = render(<JPageLayout title="Productos"><p>Contenido</p></JPageLayout>);

    expect(await violacionesGraves(container)).toEqual([]);
  });
});
