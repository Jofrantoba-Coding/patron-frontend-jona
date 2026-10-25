/**
 * Status tints repainted with the R-FND-3 tokens. 1.5.1 wrote danger/success/
 * warning 50/200/700 classes the stylesheet never had (removed in a1.4); 1.6.0
 * paints them through the 50/100/700 tint tokens, in both modes.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { JSwitch } from '../../atoms/JSwitch';
import { JAlert } from '../../molecules/JAlert';
import { JOptionPane } from '../../molecules/JOptionPane';
import { JStatCard } from '../../molecules/JStatCard';
import { JTimer } from '../../molecules/JTimer';
import {
  DANGER_BG,
  DANGER_BG_STRONG,
  DANGER_FG,
  HOVER_DANGER_FG,
  SUCCESS_BG,
  SUCCESS_FG,
  WARNING_BG,
  WARNING_FG,
} from '../../theme/tokenClasses';

const classesOf = (...constants: string[]): string[] => constants.flatMap((value) => value.split(' '));

describe('status tints on the 1.6.0 tokens', () => {
  it('JSwitch: an unchecked switch with an error paints the strong danger tint', () => {
    render(<JSwitch hasError aria-label="Activo" />);

    expect(screen.getByRole('switch', { name: 'Activo' })).toHaveClass(...classesOf(DANGER_BG_STRONG));
  });

  it('JAlert danger: tinted surface, danger text and a dismiss that darkens on hover', () => {
    render(<JAlert variant="danger" title="Error" dismissible onDismiss={() => undefined}>Falló</JAlert>);
    const alert = screen.getByRole('alert');

    expect(alert).toHaveClass(...classesOf(DANGER_BG, DANGER_FG));
    expect(screen.getByRole('button')).toHaveClass(...classesOf(HOVER_DANGER_FG));
  });

  it('JOptionPane danger: the icon sits on the danger tint', () => {
    render(<JOptionPane open title="Eliminar" description="¿Eliminar?" variant="danger" onConfirm={() => undefined} onCancel={() => undefined} />);
    const icon = screen.getByRole('alertdialog').querySelector('.rounded-full');

    expect(icon).toHaveClass(...classesOf(DANGER_BG));
  });

  it.each([
    ['success', SUCCESS_BG, SUCCESS_FG],
    ['warning', WARNING_BG, WARNING_FG],
    ['danger', DANGER_BG, DANGER_FG],
  ] as const)('JStatCard %s: the icon tile uses the tint and the trend uses its text color', (tone, bg, fg) => {
    render(<JStatCard label="Ventas" value="10" tone={tone} icon={<svg data-testid="icon" />} trend="down" trendLabel="-2%" />);

    expect(screen.getByTestId('icon').parentElement).toHaveClass(...classesOf(bg, fg));
    expect(screen.getByText('-2%')).toHaveClass(...classesOf(DANGER_FG));
  });

  it('JStatCard: an up trend uses the success text color', () => {
    render(<JStatCard label="Ventas" value="10" trend="up" trendLabel="+5%" />);

    expect(screen.getByText('+5%')).toHaveClass(...classesOf(SUCCESS_FG));
  });

  it('JTimer: the tone paints the time with the tint text color', () => {
    const { container } = render(<JTimer seconds={65} tone="warning" />);

    expect(container.querySelector(`.${CSS.escape(WARNING_FG)}`)).not.toBeNull();
  });
});
