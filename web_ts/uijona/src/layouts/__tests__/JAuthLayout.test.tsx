import { fireEvent, render, screen, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postcss, { type Root } from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import { vi } from 'vitest';
import tailwindConfig from '../../../tailwind.config.js';
import { InterJAuthLayout, JAuthLayout } from '../JAuthLayout';
import { TEXT_PAGE } from '../../theme/tokenClasses';
import { utilityStyle } from '../../__tests__/css/utilityStyle';
import { seriousViolations } from '../../__tests__/quality/axe';

async function compileLibStylesheet(): Promise<Root> {
  const from = resolve(process.cwd(), 'src/styles/index.css');
  const result = await postcss([postcssImport(), tailwindcss(tailwindConfig)]).process(readFileSync(from, 'utf8'), { from });
  return result.root;
}

const STEPS = [
  { id: 'login', label: 'Iniciar sesión' },
  { id: 'contexto', label: 'Contexto de trabajo' },
];

const layout = (props: Partial<InterJAuthLayout> = {}) => (
  <JAuthLayout
    brand={{ name: 'SoftCommerce', tagline: 'Gestión comercial' }}
    title="Contexto de trabajo"
    {...props}
  >
    <p>Formulario</p>
  </JAuthLayout>
);

describe('JAuthLayout (R-CHR-9)', () => {
  it('S-CHR-25: a main landmark, the product name and the current step', () => {
    render(layout({ steps: STEPS, currentStep: 'contexto' }));

    const main = screen.getByRole('main');
    expect(within(main).getAllByText('SoftCommerce').length).toBeGreaterThan(0);
    const steps = within(main).getAllByRole('listitem');
    expect(steps.map((step) => step.getAttribute('aria-current'))).toEqual([null, 'step']);
    expect(steps[1]).toHaveTextContent('Contexto de trabajo');
  });

  it('the first step is current when currentStep names it; no stepper without steps', () => {
    const { rerender } = render(layout({ steps: STEPS, currentStep: 'login' }));
    expect(screen.getAllByRole('listitem').map((step) => step.getAttribute('aria-current'))).toEqual(['step', null]);

    rerender(layout());
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('S-FND-15: the page heading uses the page-title style', () => {
    render(layout({ description: 'Elija la empresa y el periodo.' }));

    const heading = screen.getByRole('heading', { level: 1, name: 'Contexto de trabajo' });
    TEXT_PAGE.split(' ').forEach((token) => expect(heading).toHaveClass(token));
    expect(screen.getByText('Elija la empresa y el periodo.')).toBeInTheDocument();
  });

  it('S-CHR-26: the brand panel is hidden below lg and the card always shows the product name', async () => {
    const css = await compileLibStylesheet();
    render(layout());
    const tagline = screen.getByText('Gestión comercial');
    const panel = tagline.closest('[data-jauthlayout-brand]') as HTMLElement;
    const card = screen.getByRole('heading', { level: 1 }).closest('[data-jauthlayout-card]') as HTMLElement;

    expect(utilityStyle(css, panel, 375, 'display')).toBe('none');
    expect(utilityStyle(css, panel, 1023, 'display')).toBe('none');
    expect(utilityStyle(css, panel, 1024, 'display')).toBe('flex');
    expect(within(card).getByText('SoftCommerce')).toBeInTheDocument();
    expect(utilityStyle(css, card.parentElement as HTMLElement, 375, 'padding-left')).toBe('1rem');
  }, 60_000);

  it('S-CHR-27: the children render inside the card unchanged and the layout adds no submit handler', () => {
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <JAuthLayout brand={{ name: 'SoftCommerce' }} title="Iniciar sesión" footer={<p>v1.6.0</p>}>
        <form aria-label="Ingreso" onSubmit={onSubmit}>
          <button type="submit">Ingresar</button>
        </form>
      </JAuthLayout>,
    );
    const form = screen.getByRole('form', { name: 'Ingreso' });
    const card = screen.getByRole('heading', { level: 1 }).closest('[data-jauthlayout-card]') as HTMLElement;

    expect(card.contains(form)).toBe(true);
    expect(card.querySelectorAll('form')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(within(card).getByText('v1.6.0')).toBeInTheDocument();
  });

  it('shows the logo next to the product name when given', () => {
    render(layout({ brand: { name: 'SoftCommerce', logo: <svg role="img" aria-label="Logo" /> } }));

    expect(screen.getAllByRole('img', { name: 'Logo' }).length).toBeGreaterThan(0);
  });

  it('has no serious axe violations', async () => {
    const { container } = render(layout({ steps: STEPS, currentStep: 'contexto', footer: <p>Ayuda</p> }));

    expect(await seriousViolations(container)).toEqual([]);
  });
});
