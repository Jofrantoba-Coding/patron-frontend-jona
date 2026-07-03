/**
 * Design-quality contract: DETAIL / CONTACT / METRICS ORGANISMS
 * Reescritos a Tailwind autocontenido (sin CSS de marca externo).
 * Verifica render, enlaces/acciones y contrato responsive.
 */
import { render, screen } from '@testing-library/react';
import { JMetricsBand } from '../../organisms/JMetricsBand';
import { JContactMethods } from '../../organisms/JContactMethods';
import { JDetailHero } from '../../organisms/JDetailHero';

describe('JMetricsBand', () => {
  const metrics = [
    { value: '+120', label: 'Clientes' },
    { value: '99.9%', label: 'Uptime' },
  ];

  it('renders every metric value and label', () => {
    render(<JMetricsBand metrics={metrics} />);
    expect(screen.getByText('+120')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();
  });

  it('uses an auto-fit responsive grid (no fixed column count)', () => {
    const { container } = render(<JMetricsBand metrics={metrics} />);
    expect(container.innerHTML).toContain('auto-fit');
  });

  it('merges className and honors id on the root section', () => {
    const { container } = render(<JMetricsBand metrics={metrics} id="stats" className="sentinel-mb" />);
    const root = container.querySelector('section.sentinel-mb');
    expect(root).not.toBeNull();
    expect(root).toHaveAttribute('id', 'stats');
  });
});

describe('JContactMethods', () => {
  const methods = [
    { icon: '📧', label: 'Email', description: 'Escríbenos', href: 'mailto:a@b.com', actionLabel: 'Enviar', isPrimary: true },
    { icon: '📞', label: 'Teléfono', description: 'Llámanos', href: 'tel:+51999' },
  ];

  it('renders each method with its label and description', () => {
    render(<JContactMethods methods={methods} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Llámanos')).toBeInTheDocument();
  });

  it('renders action button as a link with href', () => {
    render(<JContactMethods methods={methods} />);
    expect(screen.getByRole('link', { name: 'Enviar' })).toHaveAttribute('href', 'mailto:a@b.com');
  });

  it('uses an auto-fit responsive grid', () => {
    const { container } = render(<JContactMethods methods={methods} />);
    expect(container.innerHTML).toContain('auto-fit');
  });
});

describe('JDetailHero', () => {
  const base = {
    backHref: '/back', backLabel: 'Volver',
    title: 'Proyecto X', outcome: 'Resultado medible',
    primaryHref: '/start', primaryLabel: 'Empezar',
  };

  it('renders back link, title, outcome and primary CTA', () => {
    render(<JDetailHero {...base} />);
    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute('href', '/back');
    expect(screen.getByRole('heading', { name: 'Proyecto X' })).toBeInTheDocument();
    expect(screen.getByText('Resultado medible')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Empezar' })).toHaveAttribute('href', '/start');
  });

  it('renders secondary CTA only when both href and label are provided', () => {
    const { rerender } = render(<JDetailHero {...base} secondaryLabel="Demo" />);
    expect(screen.queryByRole('link', { name: 'Demo' })).toBeNull();
    rerender(<JDetailHero {...base} secondaryLabel="Demo" secondaryHref="/demo" />);
    expect(screen.getByRole('link', { name: 'Demo' })).toHaveAttribute('href', '/demo');
  });

  it('is responsive: stacks by default, two columns at md: only with a visual', () => {
    const withVisual = render(<JDetailHero {...base} visual={<img alt="v" />} />);
    expect(withVisual.container.innerHTML).toContain('md:grid-cols-[1fr_auto]');

    const noVisual = render(<JDetailHero {...base} />);
    expect(noVisual.container.innerHTML).not.toContain('md:grid-cols-[1fr_auto]');
  });

  it('actions stack on mobile, row at sm:', () => {
    const { container } = render(<JDetailHero {...base} />);
    expect(container.innerHTML).toContain('flex-col');
    expect(container.innerHTML).toContain('sm:flex-row');
  });
});
