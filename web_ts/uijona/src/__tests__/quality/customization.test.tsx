/**
 * Design-quality contract: CUSTOMIZATION
 * Verifica que los componentes sean personalizables de forma predecible:
 *  - aceptan y renderizan `className` en su nodo raíz
 *  - aceptan `style` inline
 *  - `cn()` (twMerge) permite que la clase del consumidor GANE sobre el default
 */
import { render } from '@testing-library/react';
import { JButton } from '../../atoms/JButton';
import { JBadge } from '../../atoms/JBadge';
import { JTextBox } from '../../atoms/JTextBox';
import { JSwitch } from '../../atoms/JSwitch';
import { JCheckBox } from '../../atoms/JCheckBox';
import { JAlert } from '../../molecules/JAlert';

const SENTINEL = 'sentinel-custom-xyz';

describe('Customization — className passthrough', () => {
  const cases: Array<[string, React.ReactElement]> = [
    ['JButton',   <JButton className={SENTINEL}>x</JButton>],
    ['JBadge',    <JBadge className={SENTINEL}>x</JBadge>],
    ['JTextBox',  <JTextBox className={SENTINEL} />],
    ['JSwitch',   <JSwitch className={SENTINEL} aria-label="s" />],
    ['JCheckBox', <JCheckBox className={SENTINEL} />],
    ['JAlert',    <JAlert className={SENTINEL}>x</JAlert>],
  ];

  it.each(cases)('%s renders consumer className on a node', (_name, el) => {
    const { container } = render(el);
    expect(container.querySelector(`.${SENTINEL}`)).not.toBeNull();
  });
});

describe('Customization — style inline', () => {
  it('JButton applies inline style', () => {
    const { getByRole } = render(<JButton style={{ marginTop: '13px' }}>x</JButton>);
    expect(getByRole('button')).toHaveStyle({ marginTop: '13px' });
  });

  it('JSwitch applies inline style', () => {
    const { getByRole } = render(<JSwitch style={{ opacity: 0.3 }} aria-label="s" />);
    expect(getByRole('switch')).toHaveStyle({ opacity: '0.3' });
  });
});

describe('Customization — twMerge: consumer class wins over default', () => {
  it('JButton: bg override replaces default bg-primary-600', () => {
    const { getByRole } = render(<JButton className="bg-red-500">x</JButton>);
    const btn = getByRole('button');
    expect(btn.className).toContain('bg-red-500');
    expect(btn.className).not.toContain('bg-primary-600');
  });

  it('JSwitch: bg override replaces default bg-neutral-300 (off state)', () => {
    const { getByRole } = render(<JSwitch className="bg-red-500" aria-label="s" />);
    const sw = getByRole('switch');
    expect(sw.className).toContain('bg-red-500');
    expect(sw.className).not.toContain('bg-neutral-300');
  });
});
