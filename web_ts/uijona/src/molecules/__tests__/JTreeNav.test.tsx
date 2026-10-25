import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { JTreeNav, JTreeNavNode, InterJTreeNav } from '../JTreeNav';
import { seriousViolations } from '../../__tests__/quality/axe';

const NODES: JTreeNavNode[] = [
  {
    id: 'maestros',
    label: 'Maestros',
    children: [
      {
        id: 'generales',
        label: 'Generales',
        children: [
          { id: 'color', label: 'Color' },
          { id: 'cliente', label: 'Cliente' },
          { id: 'marca', label: 'Marca' },
        ],
      },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    children: [
      { id: 'registro', label: 'Registro de Ventas', disabled: true, badge: 'Próximamente' },
    ],
  },
];

type HostProps = Partial<InterJTreeNav> & { initialExpanded?: string[] };

/** A host that owns the expansion, as the contract asks. */
function Host({ initialExpanded = [], onToggle, onSelect, ...props }: HostProps) {
  const [expandedIds, setExpandedIds] = useState(initialExpanded);
  return (
    <JTreeNav
      ariaLabel="Menú principal"
      nodes={NODES}
      expandedIds={expandedIds}
      onToggle={(id, expanded) => {
        onToggle?.(id, expanded);
        setExpandedIds((ids) => (expanded ? [...ids, id] : ids.filter((other) => other !== id)));
      }}
      onSelect={onSelect ?? (() => undefined)}
      {...props}
    />
  );
}

const item = (name: string) => screen.getByRole('treeitem', { name });
const keyDown = (key: string) => fireEvent.keyDown(document.activeElement as Element, { key });

describe('JTreeNav (R-CHR-2)', () => {
  it('S-CHR-5: a named tree of treeitems with aria-level, branches carry aria-expanded', () => {
    render(<Host initialExpanded={['maestros', 'generales']} />);

    const tree = screen.getByRole('tree', { name: 'Menú principal' });
    expect(within(tree).getAllByRole('treeitem').map((node) => node.textContent)).toEqual([
      'Maestros', 'Generales', 'Color', 'Cliente', 'Marca', 'Ventas',
    ]);
    expect(item('Maestros')).toHaveAttribute('aria-level', '1');
    expect(item('Generales')).toHaveAttribute('aria-level', '2');
    expect(item('Cliente')).toHaveAttribute('aria-level', '3');
    expect(item('Maestros')).toHaveAttribute('aria-expanded', 'true');
    expect(item('Generales')).toHaveAttribute('aria-expanded', 'true');
    expect(item('Ventas')).toHaveAttribute('aria-expanded', 'false');
    expect(item('Cliente')).not.toHaveAttribute('aria-expanded');
  });

  it('is one tab stop with a roving focus; ↓ ↑ Home End move over the visible nodes', () => {
    render(<Host initialExpanded={['maestros', 'generales']} />);
    const stops = screen.getAllByRole('treeitem').filter((node) => node.tabIndex === 0);
    expect(stops).toEqual([item('Maestros')]);

    item('Maestros').focus();
    keyDown('ArrowDown');
    expect(item('Generales')).toHaveFocus();
    expect(item('Generales')).toHaveAttribute('tabindex', '0');
    expect(item('Maestros')).toHaveAttribute('tabindex', '-1');

    keyDown('ArrowUp');
    expect(item('Maestros')).toHaveFocus();
    keyDown('End');
    expect(item('Ventas')).toHaveFocus();
    keyDown('Home');
    expect(item('Maestros')).toHaveFocus();
  });

  it('S-CHR-6: → expands a closed branch, then enters it; ← goes back to the parent, then collapses', () => {
    const onToggle = vi.fn();
    render(<Host onToggle={onToggle} />);

    item('Maestros').focus();
    keyDown('ArrowRight');
    expect(onToggle).toHaveBeenCalledWith('maestros', true);
    expect(item('Maestros')).toHaveAttribute('aria-expanded', 'true');

    keyDown('ArrowRight');
    expect(item('Generales')).toHaveFocus();

    keyDown('ArrowLeft');
    expect(item('Maestros')).toHaveFocus();

    keyDown('ArrowLeft');
    expect(onToggle).toHaveBeenLastCalledWith('maestros', false);
    expect(item('Maestros')).toHaveAttribute('aria-expanded', 'false');
  });

  it('S-CHR-7: Enter and Space select a leaf once each; on a branch they toggle', () => {
    const onSelect = vi.fn();
    const onToggle = vi.fn();
    render(<Host initialExpanded={['maestros', 'generales']} onSelect={onSelect} onToggle={onToggle} />);

    item('Cliente').focus();
    keyDown('Enter');
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenLastCalledWith('cliente');
    keyDown(' ');
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenLastCalledWith('cliente');

    item('Generales').focus();
    keyDown('Enter');
    expect(onToggle).toHaveBeenCalledWith('generales', false);
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('a click toggles a branch and selects a leaf', () => {
    const onSelect = vi.fn();
    const onToggle = vi.fn();
    render(<Host onSelect={onSelect} onToggle={onToggle} />);

    fireEvent.click(item('Ventas'));
    expect(onToggle).toHaveBeenCalledWith('ventas', true);
    fireEvent.click(item('Registro de Ventas'));
    expect(onSelect).toHaveBeenCalledWith('registro');
  });

  describe('type-ahead', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(0);
    });
    afterEach(() => vi.useRealTimers());

    it('S-CHR-8: a printable character moves to the next visible node that starts with it', () => {
      render(<Host initialExpanded={['maestros', 'generales']} />);

      item('Color').focus();
      keyDown('m');
      expect(item('Marca')).toHaveFocus();

      vi.setSystemTime(1000);
      keyDown('c');
      expect(item('Color')).toHaveFocus();
      keyDown('c');
      expect(item('Cliente')).toHaveFocus();
    });

    it('characters typed in a quick run match the start of a label', () => {
      render(<Host initialExpanded={['maestros', 'generales']} />);

      item('Maestros').focus();
      keyDown('c');
      expect(item('Color')).toHaveFocus();
      keyDown('l');
      expect(item('Cliente')).toHaveFocus();
    });
  });

  it('S-CHR-9: the active node carries aria-current="page", the others do not', () => {
    render(<Host initialExpanded={['maestros', 'generales']} activeId="cliente" />);

    expect(item('Cliente')).toHaveAttribute('aria-current', 'page');
    expect(item('Color')).not.toHaveAttribute('aria-current');
    expect(screen.getAllByRole('treeitem').filter((node) => node.tabIndex === 0)).toEqual([item('Cliente')]);
  });

  it('S-CHR-10: a disabled leaf keeps its exact name, is described by its badge and still reports onSelect', () => {
    const onSelect = vi.fn();
    render(<Host initialExpanded={['ventas']} onSelect={onSelect} />);

    const registro = screen.getByRole('treeitem', { name: 'Registro de Ventas' });
    expect(registro).toHaveAccessibleName('Registro de Ventas');
    expect(registro).toHaveAttribute('aria-disabled', 'true');
    expect(registro).toHaveAccessibleDescription('Próximamente');
    expect(screen.getByText('Próximamente')).toBeVisible();

    registro.focus();
    expect(registro).toHaveFocus();
    keyDown('Enter');
    expect(onSelect).toHaveBeenCalledWith('registro');
  });

  it('has no serious axe violations', async () => {
    const { container } = render(<Host initialExpanded={['maestros', 'generales', 'ventas']} activeId="cliente" />);

    expect(await seriousViolations(container)).toEqual([]);
  });
});

const MANY: JTreeNavNode[] = [
  {
    id: 'maestros',
    label: 'Maestros',
    children: [
      {
        id: 'generales',
        label: 'Generales',
        children: [
          { id: 'cliente', label: 'Cliente' },
          { id: 'clinica', label: 'Clínica' },
          { id: 'tipo-cliente', label: 'Tipo de Cliente' },
          ...Array.from({ length: 46 }, (_, index) => ({ id: `op-${index}`, label: `Opción ${index + 1}` })),
        ],
      },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    children: [{ id: 'registro', label: 'Registro de Ventas' }],
  },
];

describe('JTreeNav filter (R-CHR-3)', () => {
  it('S-CHR-11: shows only the leaves that contain the text, accents ignored, with their ancestors expanded', () => {
    render(<Host nodes={MANY} filter="cli" />);

    expect(screen.getAllByRole('treeitem').map((node) => node.textContent)).toEqual([
      'Maestros', 'Generales', 'Cliente', 'Clínica', 'Tipo de Cliente',
    ]);
    expect(item('Maestros')).toHaveAttribute('aria-expanded', 'true');
    expect(item('Generales')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.queryByText('Sin resultados')).not.toBeInTheDocument();
  });

  it('S-CHR-11: a text with no match shows the no-results message (default and custom)', () => {
    const { rerender } = render(<Host nodes={MANY} filter="zzz" />);

    expect(screen.queryAllByRole('treeitem')).toEqual([]);
    expect(screen.getByText('Sin resultados')).toBeVisible();

    rerender(<Host nodes={MANY} filter="zzz" noResultsLabel="No hay opciones" />);
    expect(screen.getByText('No hay opciones')).toBeVisible();
  });

  it('the filter box is a named search box that reports its text and filters the tree', () => {
    const onFilterChange = vi.fn();
    render(<Host nodes={MANY} showFilter onFilterChange={onFilterChange} />);

    const box = screen.getByRole('searchbox', { name: 'Buscar en el menú' });
    fireEvent.change(box, { target: { value: 'regis' } });

    expect(onFilterChange).toHaveBeenLastCalledWith('regis');
    expect(screen.getAllByRole('treeitem').map((node) => node.textContent)).toEqual(['Ventas', 'Registro de Ventas']);
  });

  it('a controlled filter box shows the host text under a custom label', () => {
    render(<Host nodes={MANY} showFilter filter="cli" filterLabel="Buscar opción" />);

    expect(screen.getByRole('searchbox', { name: 'Buscar opción' })).toHaveValue('cli');
    expect(screen.queryByRole('searchbox', { name: 'Buscar en el menú' })).not.toBeInTheDocument();
  });

  it('S-CHR-12: clearing the filter restores the expansion the tree had before filtering', () => {
    const onToggle = vi.fn();
    render(<Host nodes={MANY} showFilter initialExpanded={['maestros']} onToggle={onToggle} />);
    const box = screen.getByRole('searchbox', { name: 'Buscar en el menú' });
    expect(item('Ventas')).toHaveAttribute('aria-expanded', 'false');

    fireEvent.change(box, { target: { value: 'ventas' } });
    expect(item('Ventas')).toHaveAttribute('aria-expanded', 'true');

    item('Ventas').focus();
    keyDown('ArrowLeft');
    expect(item('Ventas')).toHaveAttribute('aria-expanded', 'false');
    expect(onToggle).not.toHaveBeenCalled();

    fireEvent.change(box, { target: { value: '' } });
    expect(item('Ventas')).toHaveAttribute('aria-expanded', 'false');
    expect(item('Maestros')).toHaveAttribute('aria-expanded', 'true');
    expect(item('Generales')).toHaveAttribute('aria-expanded', 'false');
  });

  it('has no serious axe violations with the filter box', async () => {
    const { container } = render(<Host nodes={MANY} showFilter filter="cli" />);

    expect(await seriousViolations(container)).toEqual([]);
  });
});

const CHECK_NODES: JTreeNavNode[] = [
  {
    id: 'p',
    label: 'Padre',
    children: [
      { id: 'c1', label: 'Hijo uno' },
      { id: 'c2', label: 'Hijo dos' },
    ],
  },
];

describe('JTreeNav checkbox variant (R-CHR-4)', () => {
  const setup = () => {
    const calls = { onCheckedChange: vi.fn(), onSelect: vi.fn(), onToggle: vi.fn() };
    const utils = render(
      <Host
        nodes={CHECK_NODES}
        variant="checkbox"
        checkedIds={['p', 'c1']}
        initialExpanded={['p']}
        onCheckedChange={calls.onCheckedChange}
        onSelect={calls.onSelect}
        onToggle={calls.onToggle}
      />,
    );
    return { ...calls, ...utils };
  };

  it('every node carries aria-checked', () => {
    setup();

    expect(item('Padre')).toHaveAttribute('aria-checked', 'true');
    expect(item('Hijo uno')).toHaveAttribute('aria-checked', 'true');
    expect(item('Hijo dos')).toHaveAttribute('aria-checked', 'false');
  });

  it('S-CHR-13: Space on a checked parent unchecks it alone, with no other callback', () => {
    const { onCheckedChange, onSelect, onToggle } = setup();

    item('Padre').focus();
    keyDown(' ');

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith('p', false);
    expect(onSelect).not.toHaveBeenCalled();
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('S-CHR-13: a click on the node text only selects it; a click on its box only checks it', () => {
    const { onCheckedChange, onSelect, onToggle } = setup();

    fireEvent.click(screen.getByText('Padre'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('p');
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(onToggle).not.toHaveBeenCalled();

    fireEvent.click(item('Hijo dos').querySelector('[data-jtreenav-check]') as Element);
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith('c2', true);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('the chevron and Enter toggle a branch; the arrow keys select the node they move to', () => {
    const { onCheckedChange, onSelect, onToggle } = setup();

    fireEvent.click(item('Padre').querySelector('[data-jtreenav-toggle]') as Element);
    expect(onToggle).toHaveBeenCalledWith('p', false);
    expect(onSelect).not.toHaveBeenCalled();

    item('Padre').focus();
    keyDown('Enter');
    expect(onToggle).toHaveBeenLastCalledWith('p', true);

    keyDown('ArrowDown');
    expect(item('Hijo uno')).toHaveFocus();
    expect(onSelect).toHaveBeenCalledWith('c1');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('a disabled node is not checked by Space', () => {
    const onCheckedChange = vi.fn();
    render(
      <Host
        nodes={[{ id: 'x', label: 'Bloqueado', disabled: true }]}
        variant="checkbox"
        checkedIds={[]}
        onCheckedChange={onCheckedChange}
      />,
    );

    item('Bloqueado').focus();
    keyDown(' ');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('has no serious axe violations', async () => {
    const { container } = setup();

    expect(await seriousViolations(container)).toEqual([]);
  });
});

describe('JTreeNav maxHeight (R-CHR-4)', () => {
  it('caps the scroll area through a CSS variable, and sets nothing without it', () => {
    const { rerender } = render(<Host maxHeight="20rem" />);
    const area = screen.getByRole('tree').parentElement as HTMLElement;

    expect(area.style.getPropertyValue('--jona-tree-max-h')).toBe('20rem');
    expect(area.className).toContain('max-h-[var(--jona-tree-max-h)]');

    rerender(<Host />);
    expect((screen.getByRole('tree').parentElement as HTMLElement).style.getPropertyValue('--jona-tree-max-h')).toBe('');
  });
});
