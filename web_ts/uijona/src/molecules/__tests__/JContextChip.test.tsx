import { render, screen } from '@testing-library/react';
import { JContextChip } from '../JContextChip';
import { seriousViolations } from '../../__tests__/quality/axe';

const ITEMS = [
  { label: 'Empresa', value: 'Comercial Demo SAC' },
  { label: 'PV', value: 'Tienda Central' },
  { label: 'Período', value: '01/01/2026–31/12/2026' },
];

const PAIRS = 'Empresa: Comercial Demo SAC; PV: Tienda Central; Período: 01/01/2026–31/12/2026';

describe('JContextChip (R-CHR-7)', () => {
  it('S-CHR-23: joins the values with " · ", describes the label: value pairs and is no button', () => {
    render(<JContextChip items={ITEMS} />);

    const chip = screen.getByText('Comercial Demo SAC · Tienda Central · 01/01/2026–31/12/2026');
    expect(chip).toHaveAccessibleDescription(PAIRS);
    expect(chip).toHaveAttribute('title', PAIRS);
    expect(document.getElementById(chip.getAttribute('aria-describedby') ?? '')).toHaveTextContent(PAIRS);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('a single item shows its value alone', () => {
    render(<JContextChip items={[{ label: 'Empresa', value: 'Comercial Demo SAC' }]} />);

    const chip = screen.getByText('Comercial Demo SAC');
    expect(chip).toHaveAccessibleDescription('Empresa: Comercial Demo SAC');
  });

  it('renders nothing without items', () => {
    const { container } = render(<JContextChip items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('has no serious axe violations', async () => {
    const { container } = render(<JContextChip items={ITEMS} />);

    expect(await seriousViolations(container)).toEqual([]);
  });
});
