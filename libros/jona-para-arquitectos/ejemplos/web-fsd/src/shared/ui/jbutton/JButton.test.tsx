import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JButton } from './index';
import { JBUTTON_DEFAULTS } from './InterJButton';

const button = () => screen.getByRole('button') as HTMLButtonElement;

describe('JButton (átomo; forma mínima, variante b)', () => {
  it('aplica JBUTTON_DEFAULTS cuando nadie indica valores', () => {
    render(<JButton>Guardar</JButton>);

    expect(button().type).toBe(JBUTTON_DEFAULTS.type);
    expect(button().dataset.variant).toBe(JBUTTON_DEFAULTS.variant);
    expect(button().dataset.size).toBe(JBUTTON_DEFAULTS.size);
    expect(button().disabled).toBe(false);
  });

  it('un undefined explícito resuelve al valor por defecto', () => {
    render(<JButton variant={undefined} type={undefined}>Guardar</JButton>);

    expect(button().dataset.variant).toBe('default');
    expect(button().type).toBe('button');
  });

  it('en carga queda deshabilitado, lo anuncia y no llama a onClick', () => {
    const onClick = vi.fn();
    render(<JButton loading onClick={onClick}>Guardar</JButton>);

    fireEvent.click(button());

    expect(button().disabled).toBe(true);
    expect(button().getAttribute('aria-busy')).toBe('true');
    expect(onClick).not.toHaveBeenCalled();
  });
});
