import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { JPageHeader } from '../JPageHeader';
import { TEXT_PAGE } from '../../theme/tokenClasses';
import { seriousViolations } from '../../__tests__/quality/axe';

const CRUMBS = [
  { id: 'maestros', label: 'Maestros' },
  { id: 'cliente', label: 'Cliente' },
];

describe('JPageHeader (R-CHR-6)', () => {
  it('S-CHR-20: a level-1 heading that takes programmatic focus, the count outside its name, and the Ruta crumbs', () => {
    render(<JPageHeader title="Cliente" count={134} breadcrumbs={CRUMBS} />);

    const heading = screen.getByRole('heading', { level: 1, name: 'Cliente' });
    expect(heading).toHaveAttribute('tabindex', '-1');
    expect(screen.getByText('(134)')).toBeVisible();
    expect(heading).not.toHaveTextContent('134');

    const nav = screen.getByRole('navigation', { name: 'Ruta' });
    const current = within(nav).getByText('Cliente');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByText('Maestros')).not.toHaveAttribute('aria-current');
  });

  it('S-CHR-20: ancestors are buttons only with onBreadcrumbSelect, and report their id', () => {
    const onBreadcrumbSelect = vi.fn();
    const { rerender } = render(<JPageHeader title="Cliente" breadcrumbs={CRUMBS} />);
    expect(screen.queryByRole('button', { name: 'Maestros' })).toBeNull();

    rerender(<JPageHeader title="Cliente" breadcrumbs={CRUMBS} onBreadcrumbSelect={onBreadcrumbSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Maestros' }));

    expect(onBreadcrumbSelect).toHaveBeenCalledWith('maestros');
    expect(within(screen.getByRole('navigation')).queryByRole('button', { name: 'Cliente' })).toBeNull();
  });

  it('S-FND-15: the heading carries the page-title style', () => {
    render(<JPageHeader title="Cliente" />);

    const heading = screen.getByRole('heading', { level: 1, name: 'Cliente' });
    TEXT_PAGE.split(' ').forEach((token) => expect(heading).toHaveClass(token));
  });

  it('forwards its ref to the heading, so a host can focus it', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(<JPageHeader ref={ref} title="Cliente" />);

    ref.current?.focus();

    expect(screen.getByRole('heading', { name: 'Cliente' })).toHaveFocus();
  });

  it('takes a heading level, a breadcrumb label and the actions and search slots; omits what is not given', () => {
    const { rerender } = render(
      <JPageHeader
        title="Direcciones"
        headingLevel={2}
        breadcrumbs={CRUMBS}
        breadcrumbLabel="Ubicación"
        actions={<button type="button">Nuevo</button>}
        search={<input aria-label="Filtro" />}
      />,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Direcciones' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Ubicación' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nuevo' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Filtro' })).toBeInTheDocument();

    rerender(<JPageHeader title="Direcciones" />);

    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByText(/\(\d+\)/)).toBeNull();
  });

  it('has no serious axe violations', async () => {
    const { container } = render(
      <main>
        <JPageHeader title="Cliente" count={134} breadcrumbs={CRUMBS} onBreadcrumbSelect={() => undefined} />
      </main>,
    );

    expect(await seriousViolations(container)).toEqual([]);
  });
});
