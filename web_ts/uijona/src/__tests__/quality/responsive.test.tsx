/**
 * Design-quality contract: RESPONSIVE DESIGN
 * jsdom no calcula layout ni media queries, así que verificamos el
 * CONTRATO responsive: presencia/ausencia de utilidades de breakpoint
 * Tailwind (sm:/lg:) según la variante, y adaptación por prop.
 */
import { render } from '@testing-library/react';
import { JTabs } from '../../molecules/JTabs';
import { JFormField } from '../../molecules/JFormField';
import { JCard, JCardHeader } from '../../molecules/JCard';
import { JSidebarLayout } from '../../layouts/JSidebarLayout';
import { JDialog } from '../../molecules/JDialog';
import { JDrawer } from '../../molecules/JDrawer';

describe('Responsive — JTabs orientation adapts at sm:', () => {
  it('vertical stacks on mobile, rows at sm:', () => {
    const { container } = render(
      <JTabs value="a" orientation="vertical"><span>c</span></JTabs>,
    );
    expect(container.innerHTML).toContain('flex-col');
    expect(container.innerHTML).toContain('sm:flex-row');
  });

  it('horizontal does NOT switch to sm:flex-row', () => {
    const { container } = render(
      <JTabs value="a" orientation="horizontal"><span>c</span></JTabs>,
    );
    expect(container.innerHTML).not.toContain('sm:flex-row');
  });
});

describe('Responsive — JFormField horizontal collapses on mobile', () => {
  it('horizontal orientation exposes sm:flex-row', () => {
    const { container } = render(
      <JFormField id="email" label="Email" orientation="horizontal" />,
    );
    expect(container.innerHTML).toContain('sm:flex-row');
  });

  it('vertical orientation stays stacked (no sm:flex-row)', () => {
    const { container } = render(<JFormField id="email" label="Email" />);
    expect(container.innerHTML).not.toContain('sm:flex-row');
  });
});

describe('Responsive — JCard padding scales up at sm:', () => {
  it('header uses responsive padding p-4 → sm:p-6', () => {
    const { container } = render(
      <JCard><JCardHeader>title</JCardHeader></JCard>,
    );
    expect(container.innerHTML).toContain('sm:p-6');
  });
});

describe('Responsive — JSidebarLayout mobile/desktop behavior', () => {
  it('drawer is off-canvas on mobile and static at lg:', () => {
    const { container } = render(
      <JSidebarLayout nav={[{ items: [{ key: 'a', label: 'A' }] }]}>
        content
      </JSidebarLayout>,
    );
    expect(container.innerHTML).toContain('lg:static');
    expect(container.innerHTML).toContain('lg:hidden');
  });
});

describe('Responsive — JDrawer never exceeds the viewport', () => {
  it.each(['sm', 'md', 'lg'] as const)('horizontal size=%s caps width at 85vw', (size) => {
    render(
      <JDrawer open side="right" size={size} onClose={() => {}}>body</JDrawer>,
    );
    const panel = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel.className).toContain('max-w-[85vw]');
  });

  it('vertical (bottom) caps height at 85vh', () => {
    render(<JDrawer open side="bottom" size="md" onClose={() => {}}>body</JDrawer>);
    const panel = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(panel.className).toContain('max-h-[85vh]');
  });
});

describe('Responsive — JDialog width scales with size prop', () => {
  it.each([
    ['sm', 'max-w-sm'],
    ['md', 'max-w-md'],
    ['lg', 'max-w-lg'],
    ['xl', 'max-w-xl'],
  ] as const)('size=%s applies %s and stays within viewport height', (size, cls) => {
    render(<JDialog open size={size} title="t">body</JDialog>);
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.className).toContain(cls);
    // No desborda el viewport: altura acotada
    expect(dialog.className).toMatch(/max-h-\[calc\(100dvh/);
  });
});
