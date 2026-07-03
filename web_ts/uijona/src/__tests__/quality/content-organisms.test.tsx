/**
 * Design-quality contract: CONTENT ORGANISMS/MOLECULES (Tailwind autocontenido)
 * JDetailCTA, JContactSteps(+JNumberedStep), JFaqItem, JRelatedItem,
 * JSiteFooter, JMetricCard, JSectionHeading — sin CSS de marca externo.
 */
import { render, screen } from '@testing-library/react';
import { JDetailCTA } from '../../organisms/JDetailCTA';
import { JContactSteps } from '../../organisms/JContactSteps';
import { JSiteFooter } from '../../organisms/JSiteFooter';
import { JFaqItem } from '../../molecules/JFaqItem';
import { JRelatedItem } from '../../molecules/JRelatedItem';
import { JMetricCard } from '../../molecules/JMetricCard';
import { JSectionHeading } from '../../molecules/JSectionHeading';

describe('JDetailCTA', () => {
  const base = { title: 'Empieza hoy', body: 'Sin tarjeta', primaryHref: '/go', primaryLabel: 'Crear' };

  it('renders title, body and primary CTA', () => {
    render(<JDetailCTA {...base} />);
    expect(screen.getByRole('heading', { name: 'Empieza hoy' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Crear' })).toHaveAttribute('href', '/go');
  });

  it('secondary CTA only with href + label; actions stack then row', () => {
    const { container, rerender } = render(<JDetailCTA {...base} secondaryLabel="Demo" />);
    expect(screen.queryByRole('link', { name: 'Demo' })).toBeNull();
    expect(container.innerHTML).toContain('flex-col');
    expect(container.innerHTML).toContain('sm:flex-row');
    rerender(<JDetailCTA {...base} secondaryLabel="Demo" secondaryHref="/demo" />);
    expect(screen.getByRole('link', { name: 'Demo' })).toHaveAttribute('href', '/demo');
  });
});

describe('JContactSteps + JNumberedStep', () => {
  const steps = [
    { num: '1', title: 'Regístrate', body: 'Crea tu cuenta' },
    { num: '2', title: 'Configura', body: 'Ajusta todo' },
  ];

  it('renders heading and every step', () => {
    render(<JContactSteps heading="Cómo empezar" steps={steps} />);
    expect(screen.getByRole('heading', { name: 'Cómo empezar' })).toBeInTheDocument();
    expect(screen.getByText('Regístrate')).toBeInTheDocument();
    expect(screen.getByText('Ajusta todo')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

describe('JFaqItem', () => {
  it('renders question and answer', () => {
    render(<JFaqItem question="¿Es gratis?" answer="Sí, el plan base." />);
    expect(screen.getByText('¿Es gratis?')).toBeInTheDocument();
    expect(screen.getByText('Sí, el plan base.')).toBeInTheDocument();
  });
});

describe('JRelatedItem', () => {
  it('renders as a link card with default link label', () => {
    render(<JRelatedItem name="Caso X" outcome="+30% ventas" href="/caso-x" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/caso-x');
    expect(link).toHaveTextContent('Caso X');
    expect(link).toHaveTextContent('Ver más →');
  });
});

describe('JSiteFooter', () => {
  it('renders copyright and link list; wraps on small screens', () => {
    const { container } = render(
      <JSiteFooter copyright="© 2026 JONA" links={[{ label: 'Términos', href: '/terms' }]} />,
    );
    expect(screen.getByText('© 2026 JONA')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Términos' })).toHaveAttribute('href', '/terms');
    expect(container.querySelector('footer')?.className).toContain('flex-wrap');
  });
});

describe('JMetricCard & JSectionHeading', () => {
  it('JMetricCard renders value and label', () => {
    render(<JMetricCard value="99%" label="Uptime" />);
    expect(screen.getByText('99%')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();
  });

  it('JSectionHeading renders eyebrow, heading and description', () => {
    render(<JSectionHeading eyebrow="Sobre" heading="Nuestro método" description="Cómo trabajamos" />);
    expect(screen.getByText('Sobre')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Nuestro método' })).toBeInTheDocument();
    expect(screen.getByText('Cómo trabajamos')).toBeInTheDocument();
  });
});
