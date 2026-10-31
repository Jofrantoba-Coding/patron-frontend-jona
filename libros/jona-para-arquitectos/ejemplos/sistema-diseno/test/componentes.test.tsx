import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JBUTTON_DEFAULTS, JButton, JCHECKBOX_DEFAULTS, JCheckbox } from '../src/index';
import { FOCUS_RING, PRIMARY } from '../src/tema/clasesToken';

describe('JButton', () => {
  it('aplica JBUTTON_DEFAULTS cuando nadie indica valores', () => {
    render(<JButton>Guardar</JButton>);
    const boton = screen.getByRole('button', { name: 'Guardar' });

    expect(boton.getAttribute('type')).toBe(JBUTTON_DEFAULTS.type);
    expect(boton.dataset.variant).toBe(JBUTTON_DEFAULTS.variant);
  });

  it('pinta solo con clases de token semántico', () => {
    render(<JButton>Guardar</JButton>);
    const clases = screen.getByRole('button').className.split(' ');

    expect(clases).toEqual(expect.arrayContaining([PRIMARY, FOCUS_RING]));
  });

  it('un botón solo icono toma su nombre accesible de aria-label', () => {
    render(<JButton icon={<span aria-hidden="true">×</span>} aria-label="Cerrar" />);

    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeTruthy();
  });

  it('notifica el clic y no lo hace si está deshabilitado', () => {
    const onClick = vi.fn();
    const { rerender } = render(<JButton onClick={onClick}>Guardar</JButton>);
    fireEvent.click(screen.getByRole('button'));

    rerender(<JButton onClick={onClick} disabled>Guardar</JButton>);
    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('JCheckbox', () => {
  it('JCHECKBOX_DEFAULTS no fija el estado: sin checked, la casilla empieza vacía', () => {
    render(<JCheckbox label="Recordarme" />);

    expect('checked' in JCHECKBOX_DEFAULTS).toBe(false);
    expect((screen.getByRole('checkbox', { name: 'Recordarme' }) as HTMLInputElement).checked).toBe(false);
  });

  it('controlada: refleja checked y entrega el valor nuevo primero', () => {
    const onChange = vi.fn();
    render(<JCheckbox label="Recordarme" checked onChange={onChange} />);
    const casilla = screen.getByRole('checkbox') as HTMLInputElement;

    fireEvent.click(casilla);

    expect(casilla.checked).toBe(true);
    expect(onChange).toHaveBeenCalledWith(false);
  });
});
