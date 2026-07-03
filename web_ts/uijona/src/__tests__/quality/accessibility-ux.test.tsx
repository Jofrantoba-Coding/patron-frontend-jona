/**
 * Design-quality contract: ACCESSIBILITY & UX STATES
 * Verifica roles semánticos, atributos ARIA, foco visible y estados UX
 * (loading, disabled, error).
 */
import { render, screen } from '@testing-library/react';
import { JButton } from '../../atoms/JButton';
import { JSwitch } from '../../atoms/JSwitch';
import { JSpinner } from '../../atoms/JSpinner';
import { JAlert } from '../../molecules/JAlert';
import { JDialog } from '../../molecules/JDialog';
import { JSearchInput } from '../../molecules/JSearchInput';

describe('A11y — semantic roles', () => {
  it('JSwitch exposes role=switch with aria-checked', () => {
    render(<JSwitch checked aria-label="s" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('JAlert exposes role=alert', () => {
    render(<JAlert>msg</JAlert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('JSearchInput exposes role=searchbox with aria-label', () => {
    render(<JSearchInput aria-label="Buscar" />);
    expect(screen.getByRole('searchbox')).toHaveAttribute('aria-label', 'Buscar');
  });

  it('JSpinner exposes role=status (loading semantics)', () => {
    render(<JSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('A11y — JDialog modal semantics', () => {
  it('has role=dialog + aria-modal, labelled by title', () => {
    render(<JDialog open title="Confirm" description="Are you sure?">body</JDialog>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'jdialog-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'jdialog-desc');
  });

  it('close button has accessible name', () => {
    render(<JDialog open title="X">body</JDialog>);
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });

  it('is not rendered when open=false', () => {
    render(<JDialog open={false} title="X">body</JDialog>);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('UX — focus-visible affordance on interactive atoms', () => {
  it('JButton declares focus-visible ring', () => {
    render(<JButton>x</JButton>);
    expect(screen.getByRole('button').className).toMatch(/focus-visible:ring/);
  });

  it('JSwitch declares focus-visible ring', () => {
    render(<JSwitch aria-label="s" />);
    expect(screen.getByRole('switch').className).toMatch(/focus-visible:ring/);
  });
});

describe('UX — disabled / loading visual state', () => {
  it('JButton disabled has reduced-opacity utility', () => {
    render(<JButton disabled>x</JButton>);
    expect(screen.getByRole('button').className).toMatch(/disabled:opacity-50/);
  });

  it('JButton loading shows spinner status', () => {
    render(<JButton loading>x</JButton>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('JAlert danger variant carries error color tokens', () => {
    render(<JAlert variant="danger">boom</JAlert>);
    expect(screen.getByRole('alert').className).toMatch(/danger|red/);
  });
});
