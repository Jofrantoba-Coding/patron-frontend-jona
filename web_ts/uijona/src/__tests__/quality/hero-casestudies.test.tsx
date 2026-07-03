/**
 * Design-quality contract: JHeroDynamic + JCaseStudies
 * Prototipos para el rediseño develtrex. Verifica render, rotación del
 * titular, interacción de CTAs y contrato responsive.
 */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { JHeroDynamic } from '../../organisms/JHeroDynamic';
import { JCaseStudies } from '../../organisms/JCaseStudies';

describe('JHeroDynamic', () => {
  const words = ['software a medida', 'arquitectura cloud', 'IA aplicada'];

  it('renders prefix and the first rotating word', () => {
    render(<JHeroDynamic titlePrefix="Construimos" rotatingWords={words} />);
    expect(screen.getByRole('heading')).toHaveTextContent('Construimos');
    expect(screen.getByText('software a medida')).toBeInTheDocument();
  });

  it('rotates the word on the configured interval', () => {
    vi.useFakeTimers();
    try {
      render(<JHeroDynamic titlePrefix="Construimos" rotatingWords={words} intervalMs={1000} />);
      expect(screen.getByText('software a medida')).toBeInTheDocument();
      act(() => { vi.advanceTimersByTime(1000); });
      expect(screen.getByText('arquitectura cloud')).toBeInTheDocument();
      act(() => { vi.advanceTimersByTime(2000); });
      expect(screen.getByText('software a medida')).toBeInTheDocument(); // ciclo completo
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not rotate with a single word', () => {
    vi.useFakeTimers();
    try {
      render(<JHeroDynamic titlePrefix="Transforma tu" rotatingWords={['tecnología']} intervalMs={500} />);
      act(() => { vi.advanceTimersByTime(2000); });
      expect(screen.getByText('tecnología')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('rotating word lives in an aria-live region', () => {
    const { container } = render(<JHeroDynamic titlePrefix="Construimos" rotatingWords={words} />);
    expect(container.querySelector('[aria-live="polite"]')).not.toBeNull();
  });

  it('CTA onClick fires and href renders an anchor', () => {
    const onClick = vi.fn();
    render(
      <JHeroDynamic
        titlePrefix="Construimos"
        rotatingWords={words}
        ctas={[{ label: 'Empezar', onClick }, { label: 'Docs', href: '/docs', variant: 'outline' }]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Empezar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
  });

  it('is responsive: two columns at lg only with a visual', () => {
    const withVisual = render(<JHeroDynamic titlePrefix="X" rotatingWords={words} visual={<img alt="v" />} />);
    expect(withVisual.container.innerHTML).toContain('lg:grid-cols-2');
    const noVisual = render(<JHeroDynamic titlePrefix="X" rotatingWords={words} />);
    expect(noVisual.container.innerHTML).not.toContain('lg:grid-cols-2');
  });
});

describe('JCaseStudies', () => {
  const items = [
    {
      sector: 'Retail', title: 'ERP SUNAT', outcome: 'Todo en un sistema',
      metrics: [{ value: '−40%', label: 'cierre contable' }],
      tags: ['ERP', 'Cloud'], href: '#',
    },
    { sector: 'Fintech', title: 'API Zero Trust', outcome: 'APIs gobernadas' },
  ];

  it('renders heading and each case title', () => {
    render(<JCaseStudies heading="Casos" items={items} />);
    expect(screen.getByRole('heading', { name: 'Casos' })).toBeInTheDocument();
    expect(screen.getByText('ERP SUNAT')).toBeInTheDocument();
    expect(screen.getByText('API Zero Trust')).toBeInTheDocument();
  });

  it('renders metrics, tags and link when provided', () => {
    render(<JCaseStudies heading="Casos" items={items} />);
    expect(screen.getByText('−40%')).toBeInTheDocument();
    expect(screen.getByText('ERP')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver caso/ })).toHaveAttribute('href', '#');
  });

  it('uses an auto-fit responsive grid', () => {
    const { container } = render(<JCaseStudies heading="Casos" items={items} />);
    expect(container.innerHTML).toContain('auto-fit');
  });
});
