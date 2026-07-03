/**
 * Design-quality contract: MARKETING ORGANISMS (self-contained Tailwind)
 * JMarketingHero / JMarketingCTA reescritos sin depender de CSS externo.
 * Verifica render, interacción de CTAs y contrato responsive.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { JMarketingHero } from '../../organisms/JMarketingHero';
import { JMarketingCTA } from '../../organisms/JMarketingCTA';

describe('JMarketingHero', () => {
  it('renders eyebrow, title and subtitle', () => {
    render(<JMarketingHero eyebrow="Nuevo" title="Vende más" subtitle="Con JONA" />);
    expect(screen.getByRole('heading', { name: 'Vende más' })).toBeInTheDocument();
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
    expect(screen.getByText('Con JONA')).toBeInTheDocument();
  });

  it('CTA with onClick fires as button', () => {
    const onClick = vi.fn();
    render(<JMarketingHero title="t" ctas={[{ label: 'Empezar', onClick }]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Empezar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('CTA with href renders an anchor', () => {
    render(<JMarketingHero title="t" ctas={[{ label: 'Docs', href: '/docs' }]} />);
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
  });

  it('is responsive: actions stack on mobile → row at sm:, two columns at lg with a visual', () => {
    const { container } = render(
      <JMarketingHero title="t" visual={<img alt="v" />} ctas={[{ label: 'A' }]} />,
    );
    expect(container.innerHTML).toContain('flex-col');
    expect(container.innerHTML).toContain('sm:flex-row');
    expect(container.innerHTML).toContain('lg:grid-cols-2');
  });

  it('does NOT force two columns when there is no visual', () => {
    const { container } = render(<JMarketingHero title="t" />);
    expect(container.innerHTML).not.toContain('lg:grid-cols-2');
  });

  it('merges consumer className on the section root', () => {
    const { container } = render(<JMarketingHero title="t" className="sentinel-hero" />);
    expect(container.querySelector('section.sentinel-hero')).not.toBeNull();
  });
});

describe('JMarketingCTA', () => {
  it('renders heading and both actions', () => {
    render(
      <JMarketingCTA
        heading="¿Listo?"
        primaryLabel="Crear cuenta"
        secondaryLabel="Hablar con ventas"
        secondaryHref="/sales"
      />,
    );
    expect(screen.getByRole('heading', { name: '¿Listo?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Hablar con ventas' })).toHaveAttribute('href', '/sales');
  });

  it('primary onClick fires', () => {
    const onPrimaryClick = vi.fn();
    render(<JMarketingCTA heading="h" primaryLabel="Ir" onPrimaryClick={onPrimaryClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ir' }));
    expect(onPrimaryClick).toHaveBeenCalledTimes(1);
  });

  it('is responsive: actions stack on mobile, row at sm:', () => {
    const { container } = render(<JMarketingCTA heading="h" primaryLabel="Ir" />);
    expect(container.innerHTML).toContain('flex-col');
    expect(container.innerHTML).toContain('sm:flex-row');
  });
});
