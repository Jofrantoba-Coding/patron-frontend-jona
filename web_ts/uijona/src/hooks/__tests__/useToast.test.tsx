import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { act, fireEvent, render, screen } from '@testing-library/react';
import postcss, { type Root } from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import { vi } from 'vitest';
import tailwindConfig from '../../../tailwind.config.js';
import { ToastProvider, useToast, useToastHelpers } from '../useToast';
import type { ToastData, ToastProviderProps } from '../useToast';
import { utilityStyle } from '../../__tests__/css/utilityStyle';
import { seriousViolations } from '../../__tests__/quality/axe';

async function compileLibStylesheet(): Promise<Root> {
  const from = resolve(process.cwd(), 'src/styles/index.css');
  const result = await postcss([postcssImport(), tailwindcss(tailwindConfig)]).process(readFileSync(from, 'utf8'), { from });
  return result.root;
}

type ToastInput = Omit<ToastData, 'id'>;

/** A provider with a `Notificar` button that shows `input`, and a `Fallo` button for the error helper. */
function setup(input: ToastInput, providerProps: Partial<ToastProviderProps> = {}) {
  const Trigger = () => {
    const { toast } = useToast();
    const { error } = useToastHelpers();
    return (
      <>
        <input aria-label="Filtro" />
        <button type="button" onClick={() => toast(input)}>Notificar</button>
        <button type="button" onClick={() => error('No se pudo guardar', 'Error')}>Fallo</button>
      </>
    );
  };
  render(<ToastProvider {...providerProps}><Trigger /></ToastProvider>);
  return { show: () => fireEvent.click(screen.getByRole('button', { name: 'Notificar' })) };
}

const advance = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });

describe('toast conventions (R-FBK-5, R-FBK-6)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('S-FBK-12: a success toast is a polite status and leaves after 4000 ms', () => {
    setup({ variant: 'success', title: 'Registro creado' }).show();

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent('Registro creado');

    advance(3999);
    expect(screen.getByText('Registro creado')).toBeInTheDocument();
    advance(1);
    expect(screen.queryByText('Registro creado')).toBeNull();
  });

  it('S-FBK-12: default and warning toasts are statuses too', () => {
    setup({ title: 'Guardado', message: 'Listo' }).show();

    expect(screen.getByRole('status')).toHaveTextContent('Guardado');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('S-FBK-13: a danger toast is an alert; with duration 0 it stays until dismissed', () => {
    setup({ variant: 'danger', title: 'Error', message: 'No se pudo guardar', duration: 0 }).show();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('No se pudo guardar');
    expect(screen.queryByRole('status')).toBeNull();

    advance(10_000);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('S-FBK-13: useToastHelpers().error announces an alert', () => {
    setup({ title: 'x' });
    fireEvent.click(screen.getByRole('button', { name: 'Fallo' }));

    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo guardar');
  });

  it('S-FBK-14: the timer pauses while hovered and resumes on leave', () => {
    setup({ variant: 'success', title: 'Registro creado' }).show();
    const toast = screen.getByRole('status');

    advance(3000);
    fireEvent.mouseEnter(toast);
    advance(5000);
    expect(screen.getByText('Registro creado')).toBeInTheDocument();

    fireEvent.mouseLeave(toast);
    advance(4000);
    expect(screen.queryByText('Registro creado')).toBeNull();
  });

  it('S-FBK-14: the timer pauses while the toast holds focus', () => {
    setup({ variant: 'success', title: 'Registro creado' }).show();
    const dismiss = screen.getByRole('button', { name: 'Dismiss notification' });

    advance(2000);
    act(() => dismiss.focus());
    advance(6000);
    expect(screen.getByText('Registro creado')).toBeInTheDocument();

    act(() => dismiss.blur());
    advance(2000);
    expect(screen.queryByText('Registro creado')).toBeNull();
  });

  it('S-FBK-15: showing a toast does not move focus', () => {
    const { show } = setup({ variant: 'success', title: 'Registro creado' });
    const box = screen.getByRole('textbox', { name: 'Filtro' });
    box.focus();

    show();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(box).toHaveFocus();
  });

  it('R-FBK-5: label, dismissLabel and offset are configurable', () => {
    setup({ variant: 'success', title: 'Registro creado' }, {
      label: 'Notificaciones', dismissLabel: 'Cerrar notificación', offset: '2rem', position: 'top-right',
    }).show();

    const stack = screen.getByLabelText('Notificaciones');
    expect(stack.style.top).toBe('2rem');
    expect(stack.style.right).toBe('2rem');
    expect(screen.getByRole('button', { name: 'Cerrar notificación' })).toBeInTheDocument();
  });

  it('R-FBK-5: the 1.5.1 defaults stay (English labels, no inline offset)', () => {
    setup({ variant: 'success', title: 'Registro creado' }).show();

    expect(screen.getByLabelText('Notifications').getAttribute('style')).toBeNull();
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument();
  });

  it('every toast has a named dismiss button and no serious axe violations', async () => {
    vi.useRealTimers();
    setup({ variant: 'danger', title: 'Error', message: 'No se pudo guardar', duration: 0 }).show();

    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument();
    expect(await seriousViolations(document.body)).toEqual([]);
  });
});

describe('toast position (S-FBK-16)', () => {
  let css: Root;

  beforeAll(async () => {
    css = await compileLibStylesheet();
  }, 60_000);

  it('without a position the stack keeps the 1.5.1 bottom-right placement', () => {
    render(<ToastProvider><span>app</span></ToastProvider>);
    const stack = screen.getByLabelText('Notifications');

    expect(['bottom', 'right', 'top', 'left'].map((prop) => utilityStyle(css, stack, 1024, prop)))
      .toEqual(['1rem', '1rem', undefined, undefined]);
  });

  it('position="top-right" uses the top-right placement of the built CSS', () => {
    render(<ToastProvider position="top-right"><span>app</span></ToastProvider>);
    const stack = screen.getByLabelText('Notifications');

    expect(['top', 'right', 'bottom', 'left'].map((prop) => utilityStyle(css, stack, 1024, prop)))
      .toEqual(['1rem', '1rem', undefined, undefined]);
  });
});
