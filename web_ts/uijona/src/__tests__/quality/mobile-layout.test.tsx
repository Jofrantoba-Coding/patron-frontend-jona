/**
 * Design-quality contract: MOBILE-FIRST LAYOUT
 * jsdom does not evaluate media queries, so this suite pins the mobile-first
 * CONTRACT: 44px touch targets and 16px input text below `sm:` (iOS zooms the
 * page when a focused field is smaller), desktop density restored at `sm:`,
 * and floating panels that stay inside the viewport.
 * Parity reference: uijona-4ngular scripts/mobile-layout.test.mjs.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { JButton } from '../../atoms/JButton';
import { JBUTTON_SIZES } from '../../atoms/JButton/InterJButton';
import { JTextBox } from '../../atoms/JTextBox';
import { JComboBox } from '../../atoms/JComboBox';
import { JTextArea } from '../../atoms/JTextArea';
import { JTabs, JTabsList, JTabsTrigger } from '../../molecules/JTabs';
import { JToast } from '../../molecules/JToast';
import { JSidebarLayout } from '../../layouts/JSidebarLayout';
import { JCombobox } from '../../molecules/JCombobox';
import { JMultiSelect } from '../../molecules/JMultiSelect';
import { JDatePicker } from '../../molecules/JDatePicker';
import { computeFloatingPosition } from '../../lib/floating';
import { JDialog } from '../../molecules/JDialog';
import { JOptionPane } from '../../molecules/JOptionPane';
import { JDrawer } from '../../molecules/JDrawer';
import { JPagination } from '../../molecules/JPagination';
import { JTable, JTableBody, JTableCell, JTableHead, JTableHeader, JTableRow } from '../../molecules/JTable';
import { JDataTable } from '../../molecules/JDataTable';

const classesOf = (el: Element) => el.className.split(/\s+/).filter(Boolean);

const expectClasses = (el: Element, expected: string[]) =>
  expect(classesOf(el)).toEqual(expect.arrayContaining(expected));

const rect = (r: { top: number; left: number; width: number; height: number }): DOMRect =>
  ({
    ...r,
    x: r.left,
    y: r.top,
    right: r.left + r.width,
    bottom: r.top + r.height,
    toJSON: () => r,
  }) as DOMRect;

const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
};

afterEach(() => {
  vi.restoreAllMocks();
  setViewport(1024, 768);
});

// ── UNIT A — atoms, inputs, small controls ────────────────────────────────────

describe('Mobile — JButton touch targets', () => {
  it('md/default reach 44px on mobile and return to 36px at sm:', () => {
    render(<><JButton>md</JButton><JButton size="default">def</JButton></>);
    for (const name of ['md', 'def']) {
      const btn = screen.getByRole('button', { name });
      expectClasses(btn, ['min-h-11', 'sm:min-h-9']);
      expect(classesOf(btn)).not.toContain('min-h-9');
    }
  });

  it('icon size keeps a 44px square on mobile even when the caller resizes it', () => {
    render(<JButton size="icon" aria-label="close" icon={<svg />} className="h-7 w-7" />);
    const btn = screen.getByRole('button', { name: 'close' });
    expectClasses(btn, ['min-h-11', 'min-w-11', 'sm:min-h-9', 'sm:min-w-9', 'h-7', 'w-7']);
  });

  it('documents the mobile height in the size catalogue', () => {
    expect(JBUTTON_SIZES.md).toMatch(/44px/);
    expect(JBUTTON_SIZES.icon).toMatch(/44/);
  });
});

describe('Mobile — input atoms avoid iOS zoom and grow to 44px', () => {
  it('JTextBox md uses 16px text and a 44px floor below sm:', () => {
    render(<JTextBox aria-label="name" />);
    const input = screen.getByRole('textbox', { name: 'name' });
    expectClasses(input, ['text-base', 'sm:text-sm', 'min-h-11', 'sm:min-h-0', 'h-9']);
  });

  it('JTextBox sm keeps its compact desktop size but not on mobile', () => {
    render(<JTextBox aria-label="small" size="sm" />);
    const input = screen.getByRole('textbox', { name: 'small' });
    expectClasses(input, ['text-base', 'sm:text-xs', 'min-h-11', 'sm:min-h-0', 'h-7']);
  });

  it('JComboBox (native select) md uses 16px text and a 44px floor', () => {
    render(<JComboBox aria-label="pick" options={[{ value: 'a', label: 'A' }]} />);
    const select = screen.getByRole('combobox', { name: 'pick' });
    expectClasses(select, ['text-base', 'sm:text-sm', 'min-h-11', 'sm:min-h-0']);
  });

  it('JTextArea md uses 16px text on mobile', () => {
    render(<JTextArea aria-label="notes" />);
    const area = screen.getByRole('textbox', { name: 'notes' });
    expectClasses(area, ['text-base', 'sm:text-sm']);
  });

  it('stylesheet forces 16px on input atoms below sm: even when callers pass text-sm', () => {
    const css = readFileSync(resolve(__dirname, '../../styles/index.css'), 'utf8');
    const rule = /@media \(max-width:\s*639\.98px\)\s*\{\s*\.jtextbox,\s*\.jcombobox,\s*\.jtextarea\s*\{\s*font-size:\s*1rem;?\s*\}\s*\}/;
    const match = rule.exec(css);
    expect(match).not.toBeNull();
    // Unlayered and after the utilities so it wins over a caller's `text-sm`.
    expect(match!.index).toBeGreaterThan(css.lastIndexOf('@tailwind utilities'));
    const lastLayerClose = css.lastIndexOf('}', match!.index);
    const lastLayerOpen = css.lastIndexOf('@layer', match!.index);
    expect(lastLayerOpen).toBeLessThan(lastLayerClose);
  });
});

describe('Mobile — small controls', () => {
  it('JTabs trigger is 44px tall on mobile', () => {
    render(
      <JTabs value="a">
        <JTabsList><JTabsTrigger value="a">Tab A</JTabsTrigger></JTabsList>
      </JTabs>,
    );
    expectClasses(screen.getByRole('tab', { name: 'Tab A' }), ['min-h-11', 'sm:min-h-9']);
  });

  it('JToast dismiss has a 44px hit area on mobile without growing the toast at sm:', () => {
    render(<JToast id="t1" message="Saved" />);
    const dismiss = screen.getByRole('button', { name: 'Dismiss notification' });
    expectClasses(dismiss, ['h-11', 'w-11', 'sm:h-auto', 'sm:w-auto']);
  });
});

describe('Mobile — JSidebarLayout drawer', () => {
  const nav = [{ items: [{ key: 'a', label: 'Inicio' }] }];

  it('hamburger is a 44px target', () => {
    render(<JSidebarLayout nav={nav}>content</JSidebarLayout>);
    expectClasses(screen.getByRole('button', { name: 'Abrir menú' }), ['min-h-11', 'min-w-11']);
  });

  it('is a modal dialog only while the mobile drawer is open', () => {
    render(<JSidebarLayout nav={nav}>content</JSidebarLayout>);
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    const drawer = screen.getByRole('dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(drawer.tagName).toBe('ASIDE');
  });

  it('close button closes the drawer and is hidden at lg:', () => {
    render(<JSidebarLayout nav={nav}>content</JSidebarLayout>);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    const close = screen.getByRole('button', { name: 'Cerrar menú' });
    expectClasses(close, ['lg:hidden', 'h-11', 'w-11']);

    fireEvent.click(close);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Cerrar menú' })).toBeNull();
  });

  it('Escape closes the open drawer', () => {
    render(<JSidebarLayout nav={nav}>content</JSidebarLayout>);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Floating placement — computeFloatingPosition', () => {
  const viewport = { width: 375, height: 667 };

  it('opens below the anchor when there is room', () => {
    const pos = computeFloatingPosition(
      { top: 100, bottom: 136, left: 16, width: 200 },
      { width: 200, height: 256 },
      viewport,
    );
    expect(pos).toEqual({ placement: 'bottom', top: 140, left: 16 });
  });

  it('flips above the anchor when the space below is too small and above is larger', () => {
    const pos = computeFloatingPosition(
      { top: 560, bottom: 596, left: 16, width: 200 },
      { width: 200, height: 256 },
      viewport,
    );
    // CSS `bottom` keeps the panel glued to the trigger even if it shrinks.
    expect(pos).toEqual({ placement: 'top', bottom: 667 - 560 + 4, left: 16 });
  });

  it('stays below when neither side fits but below is larger', () => {
    const pos = computeFloatingPosition(
      { top: 200, bottom: 236, left: 16, width: 200 },
      { width: 200, height: 600 },
      viewport,
    );
    expect(pos.placement).toBe('bottom');
  });

  it('clamps the left edge so the panel never leaves the viewport', () => {
    const pos = computeFloatingPosition(
      { top: 100, bottom: 136, left: 250, width: 100 },
      { width: 300, height: 100 },
      viewport,
    );
    expect(pos.left).toBe(375 - 300 - 8);
  });

  it('never goes past the left margin', () => {
    const pos = computeFloatingPosition(
      { top: 100, bottom: 136, left: -20, width: 100 },
      { width: 100, height: 100 },
      viewport,
    );
    expect(pos.left).toBe(8);
  });
});

/** Mocks layout: the trigger at `triggerTop`, any other element as the floating panel. */
const mockLayout = (isTrigger: (el: Element) => boolean, triggerTop: number, panel = { width: 240, height: 256 }) => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return isTrigger(this)
      ? rect({ top: triggerTop, left: 16, width: 240, height: 44 })
      : rect({ top: 0, left: 0, ...panel });
  });
};

describe('Mobile — JCombobox', () => {
  const options = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }];
  const isTrigger = (el: Element) => el.getAttribute('role') === 'combobox';

  it('trigger, search and options are touch sized with 16px text on mobile', () => {
    render(<JCombobox options={options} />);
    const trigger = screen.getByRole('combobox');
    expectClasses(trigger, ['min-h-11', 'sm:min-h-9', 'text-base', 'sm:text-sm']);

    fireEvent.click(trigger);
    expectClasses(screen.getByRole('textbox', { name: 'Buscar...' }), ['text-base', 'sm:text-sm', 'min-h-11']);
    expectClasses(screen.getByRole('option', { name: 'Alpha' }), ['min-h-11', 'py-2.5', 'sm:min-h-0', 'sm:py-1.5']);
    const panel = screen.getByRole('listbox').parentElement!;
    expectClasses(panel, ['max-h-[min(16rem,calc(100dvh-2rem))]']);
  });

  it('opens below the trigger when there is room', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, 100);
    render(<JCombobox options={options} />);
    fireEvent.click(screen.getByRole('combobox'));
    const panel = screen.getByRole('listbox').parentElement!;
    expect(panel.style.top).toBe('148px');
    expect(panel.style.bottom).toBe('');
  });

  it('flips above the trigger near the bottom of the viewport', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, 580);
    render(<JCombobox options={options} />);
    fireEvent.click(screen.getByRole('combobox'));
    const panel = screen.getByRole('listbox').parentElement!;
    expect(panel.style.bottom).toBe(`${667 - 580 + 4}px`);
    expect(panel.style.top).toBe('');
  });
});

describe('Mobile — JMultiSelect', () => {
  const options = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }];
  const isTrigger = (el: Element) => el.getAttribute('role') === 'combobox';

  it('trigger, search and options are touch sized with 16px text on mobile', () => {
    render(<JMultiSelect options={options} />);
    const trigger = screen.getByRole('combobox');
    expectClasses(trigger, ['min-h-11', 'sm:min-h-9', 'text-base', 'sm:text-sm']);

    fireEvent.click(trigger);
    expectClasses(screen.getByRole('textbox'), ['text-base', 'sm:text-sm', 'min-h-11']);
    expectClasses(screen.getByRole('option', { name: 'Alpha' }), ['min-h-11', 'py-2.5', 'sm:min-h-0', 'sm:py-1.5']);
    const panel = screen.getByRole('listbox').parentElement!;
    expectClasses(panel, ['max-h-[min(16rem,calc(100dvh-2rem))]']);
  });

  it('flips above the trigger near the bottom of the viewport', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, 580);
    render(<JMultiSelect options={options} />);
    fireEvent.click(screen.getByRole('combobox'));
    const panel = screen.getByRole('listbox').parentElement!;
    expect(panel.style.bottom).toBe(`${667 - 580 + 4}px`);
    expect(panel.style.top).toBe('');
  });

  it('opens below when there is room', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, 100);
    render(<JMultiSelect options={options} />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox').parentElement!.style.top).toBe('148px');
  });
});

describe('Mobile — JDatePicker', () => {
  const isTrigger = (el: Element) => !!el.querySelector('input') && !el.closest('[role="dialog"]');

  it('trigger and calendar toggle are 44px on mobile', () => {
    render(<JDatePicker />);
    const toggle = screen.getByRole('button', { name: 'Abrir calendario' });
    expectClasses(toggle, ['w-11', 'sm:w-9']);
    expectClasses(toggle.parentElement!, ['h-11', 'sm:h-9']);
    expectClasses(screen.getByRole('textbox'), ['text-base', 'sm:text-sm']);
  });

  it('panel fits the phone width and scrolls instead of overflowing', () => {
    render(<JDatePicker showTime />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir calendario' }));
    const panel = screen.getByRole('dialog', { name: 'Calendario' });
    expectClasses(panel, [
      'w-[calc(100vw-1rem)]', 'max-w-[22rem]', 'sm:w-80', 'max-h-[calc(100dvh-1rem)]', 'overflow-y-auto',
    ]);
    expectClasses(screen.getByRole('button', { name: 'Mes anterior' }), ['h-11', 'w-11', 'sm:h-7', 'sm:w-7']);
    expectClasses(screen.getByRole('button', { name: 'Mes siguiente' }), ['h-11', 'w-11', 'sm:h-7', 'sm:w-7']);
    const days = panel.querySelectorAll('button[aria-pressed]');
    expect(days.length).toBeGreaterThan(27);
    expectClasses(days[0], ['h-11', 'sm:h-8', 'sm:w-8']);
    const hour = panel.querySelector('input[type="number"]')!;
    expectClasses(hour, ['h-11', 'sm:h-8', 'text-base', 'sm:text-sm']);
  });

  it('positions from the measured panel width (no hard-coded 320px)', () => {
    setViewport(360, 640);
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return isTrigger(this)
        ? rect({ top: 100, left: 200, width: 150, height: 44 })
        : rect({ top: 0, left: 0, width: 300, height: 380 });
    });
    render(<JDatePicker />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir calendario' }));
    const panel = screen.getByRole('dialog', { name: 'Calendario' });
    expect(panel.style.left).toBe(`${360 - 300 - 8}px`);
    expect(panel.style.top).toBe('148px');
  });

  it('flips above the trigger when there is no room below', () => {
    setViewport(360, 640);
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return isTrigger(this)
        ? rect({ top: 560, left: 16, width: 200, height: 44 })
        : rect({ top: 0, left: 0, width: 300, height: 380 });
    });
    render(<JDatePicker />);
    act(() => { fireEvent.click(screen.getByRole('button', { name: 'Abrir calendario' })); });
    const panel = screen.getByRole('dialog', { name: 'Calendario' });
    expect(panel.style.bottom).toBe(`${640 - 560 + 4}px`);
    expect(panel.style.top).toBe('');
  });
});

// ── UNIT B — overlays ─────────────────────────────────────────────────────────

describe('Mobile — JDialog uses the small viewport and keeps close reachable', () => {
  const renderDialog = () =>
    render(
      <JDialog open title="Edit" onClose={() => {}} footer={<button type="button">Save</button>}>
        body
      </JDialog>,
    );

  it('overlay gutter shrinks on phones', () => {
    renderDialog();
    expectClasses(screen.getByRole('presentation'), ['p-2', 'sm:p-4']);
  });

  it('panel is a flex column capped to the dynamic viewport height', () => {
    renderDialog();
    const panel = screen.getByRole('dialog');
    expectClasses(panel, ['flex', 'flex-col', 'max-h-[calc(100dvh-1rem)]', 'sm:max-h-[calc(100dvh-2rem)]']);
    // A grid capped only by max-height may not shrink its 1fr row; flex does.
    expect(panel).not.toHaveAttribute('data-jpanel-layout', 'border');
  });

  it('only the content scrolls; title bar and footer never shrink', () => {
    renderDialog();
    const panel = screen.getByRole('dialog');
    const [titleBar, content, footer] = Array.from(panel.children);
    expectClasses(titleBar, ['shrink-0']);
    expectClasses(content, ['min-h-0', 'min-w-0', 'flex-1', 'overflow-auto', 'p-3', 'sm:p-4']);
    expect(content).toHaveTextContent('body');
    expectClasses(footer, ['shrink-0', 'flex-wrap']);
    expect(footer).toContainElement(screen.getByRole('button', { name: 'Save' }));
  });

  it('close button is 44px on mobile and 32px from sm:', () => {
    renderDialog();
    expectClasses(screen.getByRole('button', { name: 'Close dialog' }), [
      'h-11', 'w-11', 'sm:h-8', 'sm:w-8', 'sm:min-h-8', 'sm:min-w-8',
    ]);
  });
});

describe('Mobile — JOptionPane fits short screens', () => {
  it('overlay gutter shrinks and the panel scrolls within the viewport', () => {
    render(<JOptionPane open title="Delete?" onConfirm={() => {}} onCancel={() => {}} />);
    const pane = screen.getByRole('alertdialog');
    expectClasses(pane.parentElement!, ['p-2', 'sm:p-4']);
    expectClasses(pane, ['max-h-[calc(100dvh-1rem)]', 'overflow-y-auto']);
  });
});

describe('Mobile — JDrawer', () => {
  it('vertical drawers cap at 85dvh (mobile browser chrome aware)', () => {
    render(<JDrawer open side="bottom" onClose={() => {}}>body</JDrawer>);
    expectClasses(screen.getByRole('dialog'), ['max-h-[85dvh]']);
  });

  it('close button is a 44px target on mobile', () => {
    render(<JDrawer open title="Filters" onClose={() => {}}>body</JDrawer>);
    expectClasses(screen.getByRole('button', { name: 'Cerrar panel' }), ['min-h-11', 'min-w-11']);
  });
});

// ── UNIT C — tables and pagination ────────────────────────────────────────────

const SCROLL_HINT = /Deslice horizontalmente/;

describe('Mobile — JPagination', () => {
  it('page buttons are 44px on mobile and 36px from sm:', () => {
    render(<JPagination currentPage={2} totalPages={5} />);
    const page = screen.getByRole('button', { name: 'Page 3' });
    expectClasses(page, ['h-11', 'min-w-[2.75rem]', 'sm:h-9', 'sm:min-w-[2.25rem]']);
    expectClasses(screen.getByRole('button', { name: 'Go to next page' }), ['h-11', 'sm:h-9']);
    expectClasses(screen.getByRole('navigation'), ['w-full']);
  });
});

function ComposableTable({ responsiveMode }: { responsiveMode?: 'scroll' | 'cards' | 'none' }) {
  return (
    <JTable
      responsiveMode={responsiveMode}
      pagination={{ currentPage: 1, pageSize: 10, totalRows: 30, onPageChange: () => {}, onPageSizeChange: () => {} }}
    >
      <JTableHeader>
        <JTableRow>
          <JTableHead filterable columnIndex={0}>Name</JTableHead>
        </JTableRow>
      </JTableHeader>
      <JTableBody>
        <JTableRow><JTableCell>Ana</JTableCell></JTableRow>
      </JTableBody>
    </JTable>
  );
}

describe('Mobile — JTable scroll affordance', () => {
  it('scroll mode exposes a focusable, labelled scroll region and a phone-only hint', () => {
    render(<ComposableTable />);
    const region = screen.getByRole('region', { name: 'Tabla desplazable horizontalmente' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toContainElement(screen.getByRole('table'));
    expectClasses(region, ['overflow-x-auto', 'focus-visible:ring-2', 'focus-visible:ring-primary-500']);
    expectClasses(screen.getByText(SCROLL_HINT), ['sm:hidden']);
  });

  it('cards mode has neither the scroll region nor the hint', () => {
    render(<ComposableTable responsiveMode="cards" />);
    expect(screen.queryByRole('region')).toBeNull();
    expect(screen.queryByText(SCROLL_HINT)).toBeNull();
  });

  it('pagination, rows-per-page and header filter are touch sized on mobile', () => {
    render(<ComposableTable />);
    expectClasses(screen.getByRole('button', { name: 'Pagina 2' }), ['h-11', 'min-w-[2.75rem]', 'sm:h-8', 'sm:min-w-[2rem]']);
    expectClasses(screen.getByRole('combobox'), ['h-11', 'text-base', 'sm:h-8', 'sm:text-sm']);
    expectClasses(screen.getByRole('textbox', { name: 'Filtrar...' }), ['h-11', 'text-base', 'sm:h-8', 'sm:text-xs']);
  });
});

describe('Mobile — JDataTable', () => {
  const columns = [
    { key: 'name', header: 'Nombre' },
    { key: 'email', header: 'Email', mobilePriority: 1 },
  ];
  const data = [
    { id: 1, name: 'Ana', email: 'ana@example.com' },
    { id: 2, name: 'Luis', email: 'luis@example.com' },
  ];
  const rowKey = (row: Record<string, unknown>) => String(row.id);

  it('defaults to scroll mode with a keyboard reachable region and hint', () => {
    render(<JDataTable columns={columns} data={data} rowKey={rowKey} />);
    const region = screen.getByRole('region', { name: 'Tabla de datos desplazable horizontalmente' });
    expect(region).toHaveAttribute('tabindex', '0');
    expectClasses(region, ['overflow-auto', 'focus-visible:ring-2']);
    expect(screen.getByText(SCROLL_HINT)).toBeInTheDocument();
    expect(screen.getByText('Ana')).not.toHaveAttribute('data-label');
    expect(screen.queryByRole('button', { name: 'Ver detalle' })).toBeNull();
  });

  it('filter input is 44px / 16px on mobile', () => {
    render(<JDataTable columns={columns} data={data} rowKey={rowKey} showFilter />);
    expectClasses(screen.getByRole('textbox', { name: 'Buscar...' }), ['h-11', 'text-base', 'sm:h-9', 'sm:text-sm']);
  });

  it('cards mode labels each cell, hides the header below md and drops the scroll region', () => {
    render(<JDataTable columns={columns} data={data} rowKey={rowKey} responsiveMode="cards" />);
    expect(screen.queryByRole('region')).toBeNull();
    expect(screen.queryByText(SCROLL_HINT)).toBeNull();
    expect(screen.getByText('Ana')).toHaveAttribute('data-label', 'Nombre');
    expect(screen.getByText('ana@example.com')).toHaveAttribute('data-label', 'Email');
    expectClasses(screen.getByRole('table').querySelector('thead')!, ['max-md:hidden']);
    expectClasses(screen.getByRole('table'), ['block', 'md:table']);
    const firstRow = screen.getByText('Ana').closest('tr')!;
    expectClasses(firstRow, ['grid', 'rounded-xl', 'md:table-row']);
  });

  it('cards mode orders cells by mobilePriority, falling back to column order', () => {
    render(<JDataTable columns={columns} data={data} rowKey={rowKey} responsiveMode="cards" />);
    expect(screen.getByText('ana@example.com').style.order).toBe('1');
    expect(screen.getByText('Ana').style.order).toBe('20');
  });

  it('cards mode adds a 44px row action that fires onRowClick once', () => {
    const onRowClick = vi.fn();
    render(
      <JDataTable
        columns={columns}
        data={data}
        rowKey={rowKey}
        responsiveMode="cards"
        mobileActionLabel="Abrir"
        onRowClick={onRowClick}
      />,
    );
    const actions = screen.getAllByRole('button', { name: 'Abrir' });
    expect(actions).toHaveLength(2);
    expectClasses(actions[1], ['min-h-11', 'w-full']);
    expectClasses(actions[1].closest('td')!, ['md:hidden']);

    fireEvent.click(actions[1]);
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(data[1], 1);
  });

  it('cards mode without onRowClick renders no dead action button', () => {
    render(<JDataTable columns={columns} data={data} rowKey={rowKey} responsiveMode="cards" />);
    expect(screen.queryByRole('button', { name: 'Ver detalle' })).toBeNull();
  });
});
