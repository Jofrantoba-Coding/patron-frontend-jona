import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postcss, { type Root } from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import tailwindConfig from '../../../tailwind.config.js';
import { JTextBox } from '../../atoms/JTextBox';
import { JField, type JFieldSpan } from '../../molecules/JField';
import { JFieldGrid } from '../JFieldGrid';
import { utilityStyle } from '../../__tests__/css/utilityStyle';
import { seriousViolations } from '../../__tests__/quality/axe';

async function compileLibStylesheet(): Promise<Root> {
  const from = resolve(process.cwd(), 'src/styles/index.css');
  const result = await postcss([postcssImport(), tailwindcss(tailwindConfig)]).process(readFileSync(from, 'utf8'), { from });
  return result.root;
}

const TWELVE = 'repeat(12, minmax(0, 1fr))';
const span = (n: number) => `span ${n} / span ${n}`;

const fieldOf = (name: string): Element => screen.getByRole('textbox', { name }).parentElement!.parentElement!;

describe('JFieldGrid (R-FRM-2)', () => {
  let css: Root;

  beforeAll(async () => {
    css = await compileLibStylesheet();
  }, 60_000);

  const renderGrid = (spans: (JFieldSpan | undefined)[]) =>
    render(
      <JFieldGrid>
        {spans.map((value, index) => (
          <JField key={index} id={`f${index}`} label={`Campo ${index}`} span={value}>
            {(aria) => <JTextBox {...aria} />}
          </JField>
        ))}
      </JFieldGrid>,
    );

  it('S-FRM-5: lays the fields on 12 columns and gives each its span from md (768 px)', () => {
    const { container } = renderGrid([6, 6, 12]);
    const grid = container.firstElementChild!;

    expect(utilityStyle(css, grid, 768, 'display')).toBe('grid');
    expect(utilityStyle(css, grid, 768, 'grid-template-columns')).toBe(TWELVE);
    expect(['Campo 0', 'Campo 1', 'Campo 2'].map((name) => utilityStyle(css, fieldOf(name), 1024, 'grid-column')))
      .toEqual([span(6), span(6), span(12)]);
  });

  it('S-FRM-5: spans 3, 4, 6 and 12 at md; the default span is 6 (two columns)', () => {
    renderGrid([3, 4, 6, 12, undefined]);

    expect([0, 1, 2, 3, 4].map((index) => utilityStyle(css, fieldOf(`Campo ${index}`), 768, 'grid-column')))
      .toEqual([span(3), span(4), span(6), span(12), span(6)]);
  });

  it('S-FRM-5: every field spans the 12 columns below md (one column)', () => {
    renderGrid([3, 4, 6, 12]);

    expect([0, 1, 2, 3].map((index) => utilityStyle(css, fieldOf(`Campo ${index}`), 767, 'grid-column')))
      .toEqual([span(12), span(12), span(12), span(12)]);
    expect([0, 1, 2, 3].map((index) => utilityStyle(css, fieldOf(`Campo ${index}`), 375, 'grid-column')))
      .toEqual([span(12), span(12), span(12), span(12)]);
  });

  it('separates the fields by the JPanel gap scale (md by default)', () => {
    const { container, rerender } = renderGrid([6, 6]);

    expect(utilityStyle(css, container.firstElementChild!, 375, 'gap')).toBe('1rem');

    rerender(
      <JFieldGrid gap="lg">
        <JField id="a" label="A">{(aria) => <JTextBox {...aria} />}</JField>
      </JFieldGrid>,
    );

    expect(utilityStyle(css, container.firstElementChild!, 375, 'gap')).toBe('1.5rem');
  });

  it('has no serious axe violations', async () => {
    const { container } = renderGrid([6, 6, 12]);

    expect(await seriousViolations(container)).toEqual([]);
  });
});
