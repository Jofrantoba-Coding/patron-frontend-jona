/**
 * Átomos: el comportamiento mínimo de cada uno, usado como lo usaría un consumidor
 * (por la superficie pública), y sin violaciones graves de accesibilidad.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { JButton, JInput, JText } from '../src/index';
import { violacionesGraves } from './axe';

describe('JButton', () => {
  it('aplica los DEFAULTS: primario y de tipo button', () => {
    render(<JButton>Guardar</JButton>);

    const boton = screen.getByRole('button', { name: 'Guardar' });
    expect(boton).toHaveProperty('type', 'button');
    expect(boton.dataset.variant).toBe('primary');
  });

  it('aria-label precisa el nombre accesible sin cambiar el texto visible', async () => {
    const onClick = vi.fn();
    const { container } = render(<JButton aria-label="Editar Teclado" onClick={onClick}>Editar</JButton>);

    await userEvent.click(screen.getByRole('button', { name: 'Editar Teclado' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(container.textContent).toBe('Editar');
    expect(await violacionesGraves(container)).toEqual([]);
  });
});

describe('JInput', () => {
  it('entrega el valor, no el evento', async () => {
    const onChange = vi.fn();
    render(<JInput aria-label="Nombre" value="" onChange={onChange} />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Nombre' }), 'a');

    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('marca el campo inválido solo cuando se le pide', () => {
    render(<><JInput aria-label="Válido" value="" /><JInput aria-label="Inválido" value="" invalid /></>);

    expect(screen.getByRole('textbox', { name: 'Válido' }).getAttribute('aria-invalid')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Inválido' }).getAttribute('aria-invalid')).toBe('true');
  });

  it('sin nombre accesible, axe lo detecta: el átomo no se usa solo, lo nombra la molécula', async () => {
    const { container } = render(<JInput value="" />);

    expect(await violacionesGraves(container)).toEqual(['label']);
  });
});

describe('JText', () => {
  it('el nivel de título lo decide quien compone', () => {
    render(<JText as="h2">Productos</JText>);

    expect(screen.getByRole('heading', { level: 2, name: 'Productos' })).toBeDefined();
  });

  it('el tono es un rol: peligro se pinta con la clase de token, no con un color', () => {
    render(<JText tone="danger" role="alert">El precio debe ser mayor que cero</JText>);

    expect(screen.getByRole('alert').className).toBe('ds-danger');
  });
});
