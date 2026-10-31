import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JButton, JBUTTON_DEFAULTS } from './JButton';

const button = () => screen.getByRole('button') as HTMLButtonElement;

describe('JButton (forma mínima, variante b)', () => {
  it('aplica JBUTTON_DEFAULTS cuando nadie indica valores', () => {
    render(<JButton>Guardar</JButton>);

    expect(button().type).toBe(JBUTTON_DEFAULTS.type);
    expect(button().dataset.variant).toBe('default');
    expect(button().dataset.size).toBe('md');
    expect(button().disabled).toBe(false);
  });

  it('un undefined explícito resuelve al valor por defecto', () => {
    render(<JButton variant={undefined} size={undefined} type={undefined}>Guardar</JButton>);

    expect(button().dataset.variant).toBe('default');
    expect(button().dataset.size).toBe('md');
    expect(button().type).toBe('button');
  });

  it('respeta los valores indicados', () => {
    render(<JButton variant="ghost" size="lg" type="submit" fullWidth>Guardar</JButton>);

    expect(button().dataset.variant).toBe('ghost');
    expect(button().dataset.size).toBe('lg');
    expect(button().type).toBe('submit');
    expect(button().style.width).toBe('100%');
  });

  it('en carga queda deshabilitado y lo anuncia', () => {
    const onClick = vi.fn();
    render(<JButton loading onClick={onClick}>Guardar</JButton>);

    fireEvent.click(button());

    expect(button().disabled).toBe(true);
    expect(button().getAttribute('aria-busy')).toBe('true');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('entrega el evento del navegador en onClick (excepción de bajo nivel)', () => {
    const onClick = vi.fn();
    render(<JButton onClick={onClick}>Guardar</JButton>);

    fireEvent.click(button());

    expect(onClick.mock.calls[0][0].target).toBe(button());
  });

  it('ubica el icono según iconPosition', () => {
    render(<JButton icon={<span data-testid="icono" />} iconPosition="right">Guardar</JButton>);

    expect(button().lastElementChild).toBe(screen.getByTestId('icono'));
  });
});
