import { render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postcss, { type Root } from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import tailwindConfig from '../../../tailwind.config.js';
import { JInputGroup } from '../JInputGroup';
import { JTextBox } from '../../atoms/JTextBox';
import { JButton } from '../../atoms/JButton';
import { utilityStyle } from '../../__tests__/css/utilityStyle';
import { seriousViolations } from '../../__tests__/quality/axe';

async function compileLibStylesheet(): Promise<Root> {
  const from = resolve(process.cwd(), 'src/styles/index.css');
  const result = await postcss([postcssImport(), tailwindcss(tailwindConfig)]).process(readFileSync(from, 'utf8'), { from });
  return result.root;
}

const COLUMNS_VAR = '--jona-input-group-columns';

const lookup = (columns?: string) => (
  <JInputGroup
    ariaLabel="Transportista"
    preset="lookup"
    columns={columns}
    addonEnd={
      <>
        <JButton aria-label="Buscar Transportista">B</JButton>
        <JButton aria-label="Limpiar Transportista">X</JButton>
      </>
    }
  >
    <JTextBox aria-label="Código" />
    <JTextBox aria-label="Descripción" readOnly />
  </JInputGroup>
);

describe('JInputGroup (R-FRM-5)', () => {
  let css: Root;

  beforeAll(async () => {
    css = await compileLibStylesheet();
  }, 60_000);

  it('S-FRM-10: a named group holds the code, the description and the two buttons, in that order', () => {
    render(lookup());

    const group = screen.getByRole('group', { name: 'Transportista' });
    expect(within(group).getAllByRole('textbox')).toHaveLength(2);
    expect(within(group).getAllByRole('button')).toHaveLength(2);
    const controls = Array.from(group.querySelectorAll('input, button')).map((element) => element.getAttribute('aria-label'));
    expect(controls).toEqual(['Código', 'Descripción', 'Buscar Transportista', 'Limpiar Transportista']);
  });

  it('S-FRM-11: the lookup preset is 10rem 1fr auto from sm, bottom-aligned, and stacks below sm', () => {
    render(lookup());
    const group = screen.getByRole('group', { name: 'Transportista' });

    expect(group.style.getPropertyValue(COLUMNS_VAR)).toBe('10rem 1fr auto');
    expect(group.children).toHaveLength(3);
    expect(utilityStyle(css, group, 640, 'display')).toBe('grid');
    expect(utilityStyle(css, group, 640, 'grid-template-columns')).toBe(`var(${COLUMNS_VAR})`);
    expect(utilityStyle(css, group, 640, 'align-items')).toBe('flex-end');
    expect(utilityStyle(css, group, 639, 'grid-template-columns')).toBe('repeat(1, minmax(0, 1fr))');
  });

  it('S-FRM-11: columns override the template through the CSS variable', () => {
    render(lookup('8rem 1fr auto'));

    expect(screen.getByRole('group', { name: 'Transportista' }).style.getPropertyValue(COLUMNS_VAR)).toBe('8rem 1fr auto');
  });

  it('the default preset is one row with its addons and no template variable', () => {
    render(
      <JInputGroup ariaLabel="Precio" addonStart={<span>S/</span>}>
        <JTextBox aria-label="Monto" />
      </JInputGroup>,
    );
    const group = screen.getByRole('group', { name: 'Precio' });

    expect(group.style.getPropertyValue(COLUMNS_VAR)).toBe('');
    expect(group.firstElementChild).toHaveTextContent('S/');
    expect(utilityStyle(css, group, 375, 'display')).toBe('flex');
    expect(utilityStyle(css, group, 375, 'flex-direction')).toBe('row');
  });

  it('marks an invalid group', () => {
    const { rerender } = render(lookup());
    expect(screen.getByRole('group')).not.toHaveAttribute('data-invalid');

    rerender(
      <JInputGroup ariaLabel="Transportista" preset="lookup" invalid>
        <JTextBox aria-label="Código" />
      </JInputGroup>,
    );

    expect(screen.getByRole('group')).toHaveAttribute('data-invalid', 'true');
  });

  it('has no serious axe violations', async () => {
    const { container } = render(lookup());

    expect(await seriousViolations(container)).toEqual([]);
  });
});
