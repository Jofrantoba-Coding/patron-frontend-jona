/**
 * Design-quality contract: MOBILE-FIRST, PHASE 2
 * Gaps reported by a consumer app (table sort button, custom sidebar content)
 * and the second touch-target pass: 44px hit areas below `sm:`, desktop
 * density restored at `sm:`, and floating panels that stay in the viewport.
 * jsdom does not evaluate media queries, so the contract is pinned by classes.
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { JTable, JTableBody, JTableHead, JTableHeader, JTableRow } from '../../molecules/JTable';
import { JSidebarLayout } from '../../layouts/JSidebarLayout';
import { JCheckBox } from '../../atoms/JCheckBox';
import { JRadioButton } from '../../atoms/JRadioButton';
import { JSwitch } from '../../atoms/JSwitch';
import { JNavbar } from '../../organisms/JNavbar';
import { JSearchInput } from '../../molecules/JSearchInput';
import { JNumberInput } from '../../molecules/JNumberInput';
import { ToastProvider, useToast } from '../../hooks/useToast';
import { JDropdown } from '../../molecules/JDropdown';
import { JPopover } from '../../molecules/JPopover';
import { computeFloatingPosition } from '../../lib/floating';
import { JTooltip } from '../../molecules/JTooltip';

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

/** Mocks layout: the trigger wrapper at (triggerLeft, triggerTop), anything else as the panel. */
const mockLayout = (
  isTrigger: (el: Element) => boolean,
  { triggerTop, triggerLeft = 16 }: { triggerTop: number; triggerLeft?: number },
  panel = { width: 240, height: 256 },
) => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return isTrigger(this)
      ? rect({ top: triggerTop, left: triggerLeft, width: 120, height: 44 })
      : rect({ top: 0, left: 0, ...panel });
  });
};

afterEach(() => {
  vi.restoreAllMocks();
  setViewport(1024, 768);
});

// ── 1a. JTableHead sort button ────────────────────────────────────────────────

describe('Mobile — JTableHead sort button', () => {
  const renderHead = (props: Partial<React.ComponentProps<typeof JTableHead>> = {}) =>
    render(
      <JTable>
        <JTableHeader>
          <JTableRow>
            <JTableHead sortable sortLabel="Sort by name" {...props}>Name</JTableHead>
          </JTableRow>
        </JTableHeader>
        <JTableBody />
      </JTable>,
    );

  it('reaches 44px on mobile and returns to 36px at sm:', () => {
    renderHead();
    expectClasses(screen.getByRole('button', { name: 'Sort by name' }), ['min-h-11', 'sm:min-h-9']);
  });

  it('accepts sortButtonClassName without leaking it onto the header cell', () => {
    renderHead({ sortButtonClassName: 'h-7 uppercase' });
    const button = screen.getByRole('button', { name: 'Sort by name' });
    // The caller's height cannot remove the mobile floor (min-h survives twMerge).
    expectClasses(button, ['h-7', 'uppercase', 'min-h-11', 'sm:min-h-9']);
    const th = screen.getByRole('columnheader');
    expect(th.getAttribute('sortbuttonclassname')).toBeNull();
    expect(classesOf(th)).not.toContain('uppercase');
  });
});

// ── 1b. JSidebarLayout custom sidebar content ─────────────────────────────────

describe('Mobile — JSidebarLayout custom sidebar content', () => {
  const openDrawer = () => fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));

  it('renders renderSidebar content in place of the nav list', () => {
    render(
      <JSidebarLayout renderSidebar={() => <ul aria-label="Tree menu"><li>Branch</li></ul>}>
        content
      </JSidebarLayout>,
    );
    const tree = screen.getByRole('list', { name: 'Tree menu' });
    expect(tree.closest('aside')).not.toBeNull();
  });

  it('gives custom content a close callback that closes the mobile drawer', () => {
    render(
      <JSidebarLayout
        renderSidebar={({ close }) => (
          <button type="button" onClick={() => close()}>Go to sales</button>
        )}
      >
        content
      </JSidebarLayout>,
    );
    openDrawer();
    expect(screen.getByRole('dialog', { name: 'Menú de navegación' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Go to sales' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('reports the collapsed state to custom content', () => {
    const renderSidebar = vi.fn(() => <span>custom</span>);
    render(<JSidebarLayout renderSidebar={renderSidebar}>content</JSidebarLayout>);
    expect(renderSidebar).toHaveBeenLastCalledWith(expect.objectContaining({ collapsed: false, mobileOpen: false }));

    fireEvent.click(screen.getByRole('button', { name: 'Colapsar sidebar' }));
    expect(renderSidebar).toHaveBeenLastCalledWith(expect.objectContaining({ collapsed: true }));
  });

  it('keeps the flat nav API working unchanged', () => {
    const onNavItemClick = vi.fn();
    render(
      <JSidebarLayout nav={[{ items: [{ key: 'home', label: 'Home' }] }]} onNavItemClick={onNavItemClick}>
        content
      </JSidebarLayout>,
    );
    openDrawer();
    fireEvent.click(screen.getByRole('button', { name: 'Home' }));
    expect(onNavItemClick).toHaveBeenCalledWith(expect.objectContaining({ key: 'home' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('navigation')).toBeTruthy();
  });
});

// ── 2. Selection controls: 44px hit area ──────────────────────────────────────

describe('Mobile — selection controls hit area', () => {
  it('JCheckBox label is a 44px hit box on mobile, compact at sm:', () => {
    render(<JCheckBox label="Accept" />);
    const label = screen.getByText('Accept').closest('label')!;
    expectClasses(label, ['min-h-11', 'sm:min-h-0']);
  });

  it('JRadioButton label is a 44px hit box on mobile, compact at sm:', () => {
    render(<JRadioButton name="r" value="a" label="Option A" />);
    const label = screen.getByText('Option A').closest('label')!;
    expectClasses(label, ['min-h-11', 'sm:min-h-0']);
  });

  it('JSwitch keeps its visual track but extends its hit area to 44px on mobile', () => {
    render(<><JSwitch aria-label="sm switch" size="sm" /><JSwitch aria-label="md switch" /></>);
    for (const name of ['sm switch', 'md switch']) {
      const sw = screen.getByRole('switch', { name });
      expectClasses(sw, ['before:absolute', 'before:h-11', 'before:min-w-11', 'sm:before:content-none']);
    }
    expectClasses(screen.getByRole('switch', { name: 'md switch' }), ['w-11', 'h-6']);
  });
});

// ── 2. JNavbar mobile buttons ─────────────────────────────────────────────────

describe('Mobile — JNavbar buttons', () => {
  it('menu and close buttons are 44px', () => {
    render(<JNavbar brand="Brand" mobileOpen onMobileToggle={() => {}} onMobileClose={() => {}} drawer={<p>links</p>} />);
    for (const name of ['Abrir menú', 'Cerrar menú']) {
      const btn = screen.getByRole('button', { name });
      expectClasses(btn, ['h-11', 'w-11']);
      expect(classesOf(btn)).not.toContain('h-10');
    }
  });
});

// ── 2. Search and number inputs ───────────────────────────────────────────────

describe('Mobile — JSearchInput', () => {
  it('field keeps the 16px/44px input contract and buttons reach 44px', () => {
    render(<JSearchInput defaultValue="shoes" clearable />);
    expectClasses(screen.getByRole('searchbox'), ['jtextbox', 'min-h-11', 'pr-12', 'sm:pr-9']);
    expectClasses(screen.getByRole('button', { name: 'Clear search' }), ['h-11', 'w-11', 'sm:h-6', 'sm:w-6']);
    expectClasses(screen.getByRole('button', { name: 'Search' }), ['min-h-11', 'sm:min-h-9']);
  });
});

describe('Mobile — JNumberInput', () => {
  it('field keeps the 16px/44px input contract and steppers reach 44px', () => {
    render(<JNumberInput defaultValue={2} />);
    expectClasses(screen.getByRole('spinbutton'), ['jtextbox', 'min-h-11']);
    for (const name of ['Decrement', 'Increment']) {
      expectClasses(screen.getByRole('button', { name }), ['min-h-11', 'w-11', 'sm:min-h-9', 'sm:w-9']);
    }
  });
});

// ── 2. Toaster width ──────────────────────────────────────────────────────────

describe('Mobile — Toaster fits the viewport', () => {
  it('stack spans the phone width minus gutters and is 20rem from sm:', () => {
    render(<ToastProvider><span>app</span></ToastProvider>);
    const stack = screen.getByLabelText('Notifications');
    expectClasses(stack, ['w-[calc(100vw-2rem)]', 'sm:w-80']);
    expect(classesOf(stack)).not.toContain('w-80');
  });

  it('toasts still render inside the stack', () => {
    const Trigger = () => {
      const { toast } = useToast();
      return <button type="button" onClick={() => toast({ title: 'Saved' })}>notify</button>;
    };
    render(<ToastProvider><Trigger /></ToastProvider>);
    act(() => { fireEvent.click(screen.getByRole('button', { name: 'notify' })); });
    expect(screen.getByLabelText('Notifications').textContent).toContain('Saved');
  });
});

// ── 2. Floating panels ────────────────────────────────────────────────────────

describe('Mobile — JDropdown menu stays in the viewport', () => {
  const groups = [{ items: [{ label: 'Edit' }, { label: 'Delete' }] }];
  const isTrigger = (el: Element) => el.getAttribute('data-testid') === 'dd-trigger-wrap'
    || (el.firstElementChild?.getAttribute('data-testid') === 'dd-trigger');

  it('opens below the trigger when there is room', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, { triggerTop: 100 });
    render(<JDropdown trigger={<button type="button" data-testid="dd-trigger">menu</button>} groups={groups} />);
    fireEvent.click(screen.getByRole('button', { name: 'menu' }));
    const menu = screen.getByRole('menu');
    expect(menu.style.top).toBe('148px');
    expect(menu.style.bottom).toBe('');
  });

  it('flips above the trigger near the bottom of the viewport', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, { triggerTop: 580 });
    render(<JDropdown trigger={<button type="button" data-testid="dd-trigger">menu</button>} groups={groups} />);
    fireEvent.click(screen.getByRole('button', { name: 'menu' }));
    const menu = screen.getByRole('menu');
    expect(menu.style.bottom).toBe(`${667 - 580 + 4}px`);
    expect(menu.style.top).toBe('');
  });
});

describe('Mobile — JTooltip flips vertically to stay in the viewport', () => {
  const isTrigger = (el: Element) => el.firstElementChild?.getAttribute('data-testid') === 'tip-trigger';
  const showTooltip = (side: 'top' | 'bottom') => {
    vi.useFakeTimers();
    render(
      <JTooltip content="Help text" side={side} delayMs={0}>
        <button type="button" data-testid="tip-trigger">help</button>
      </JTooltip>,
    );
    fireEvent.focus(screen.getByRole('button', { name: 'help' }));
    act(() => { vi.runAllTimers(); });
    vi.useRealTimers();
    return screen.getByRole('tooltip');
  };

  it('a top tooltip opens below a trigger at the top of the screen', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, { triggerTop: 10 }, { width: 200, height: 60 });
    const tip = showTooltip('top');
    expect(tip.style.top).toBe(`${10 + 44 + 6}px`);
    expect(tip.style.bottom).toBe('');
  });

  it('a bottom tooltip opens above a trigger at the bottom of the screen', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, { triggerTop: 620 }, { width: 200, height: 60 });
    const tip = showTooltip('bottom');
    expect(tip.style.bottom).toBe(`${667 - 620 + 6}px`);
    expect(tip.style.top).toBe('');
  });

  it('keeps the requested side when it fits', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, { triggerTop: 300 }, { width: 200, height: 60 });
    const tip = showTooltip('top');
    expect(tip.style.bottom).toBe(`${667 - 300 + 6}px`);
  });
});

describe('Mobile — computeFloatingPosition prefer option', () => {
  const viewport = { width: 375, height: 667 };
  const size = { width: 200, height: 150 };

  it('prefer "top" opens above when it fits there', () => {
    const pos = computeFloatingPosition({ top: 300, bottom: 344, left: 16, width: 120 }, size, viewport, { prefer: 'top' });
    expect(pos).toEqual({ placement: 'top', bottom: 667 - 300 + 4, left: 16 });
  });

  it('prefer "top" falls back below when there is more room there', () => {
    const pos = computeFloatingPosition({ top: 60, bottom: 104, left: 16, width: 120 }, size, viewport, { prefer: 'top' });
    expect(pos).toEqual({ placement: 'bottom', top: 108, left: 16 });
  });
});

describe('Mobile — JPopover panel stays in the viewport', () => {
  const isTrigger = (el: Element) => el.firstElementChild?.getAttribute('data-testid') === 'pop-trigger';
  const renderPopover = (props: Partial<React.ComponentProps<typeof JPopover>> = {}) =>
    render(
      <JPopover trigger={<button type="button" data-testid="pop-trigger">info</button>} {...props}>
        <p>details</p>
      </JPopover>,
    );

  it('flips a bottom popover above the trigger when there is no room below', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, { triggerTop: 580 });
    renderPopover();
    fireEvent.click(screen.getByRole('button', { name: 'info' }));
    const panel = screen.getByRole('dialog');
    expect(panel.style.bottom).toBe(`${667 - 580 + 4}px`);
    expect(panel.style.top).toBe('');
  });

  it('flips a top popover below the trigger near the top of the viewport', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, { triggerTop: 40 });
    renderPopover({ side: 'top' });
    fireEvent.click(screen.getByRole('button', { name: 'info' }));
    const panel = screen.getByRole('dialog');
    expect(panel.style.top).toBe('88px');
    expect(panel.style.bottom).toBe('');
  });

  it('clamps the panel inside the right edge using its measured width', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, { triggerTop: 100, triggerLeft: 300 });
    renderPopover();
    fireEvent.click(screen.getByRole('button', { name: 'info' }));
    const panel = screen.getByRole('dialog');
    expect(panel.style.left).toBe(`${375 - 240 - 8}px`);
    expect(panel.style.top).toBe('148px');
  });

  it('resolves align="end" to a left offset instead of a transform', () => {
    setViewport(375, 667);
    mockLayout(isTrigger, { triggerTop: 100, triggerLeft: 200 });
    renderPopover({ align: 'end' });
    fireEvent.click(screen.getByRole('button', { name: 'info' }));
    const panel = screen.getByRole('dialog');
    // trigger right = 320, panel width 240 → left 80
    expect(panel.style.left).toBe('80px');
    expect(panel.style.transform).toBe('');
  });
});
