import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { CONFIRM_DEFAULTS, ConfirmProvider, useConfirm } from '../useConfirm';
import type { ConfirmOptions, ConfirmProviderProps } from '../useConfirm';
import { JButton } from '../../atoms/JButton';
import { JDialog } from '../../molecules/JDialog';
import { JOptionPane } from '../../molecules/JOptionPane';
import { seriousViolations } from '../../__tests__/quality/axe';

const DELETE: ConfirmOptions = {
  title: 'Eliminar',
  description: 'Se eliminará el registro.',
  confirmLabel: 'Eliminar',
  cancelLabel: 'No',
  variant: 'danger',
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

/** Renders a provider with an `Abrir` button that asks `options`; answers are collected in order. */
function setup(options: ConfirmOptions, providerProps: Partial<ConfirmProviderProps> = {}, wrap = (n: React.ReactNode) => n) {
  const results: boolean[] = [];
  const ref: { confirm?: ConfirmFn } = {};
  const Probe = () => {
    ref.confirm = useConfirm();
    return (
      <button type="button" onClick={() => { void ref.confirm!(options).then((answer) => results.push(answer)); }}>
        Abrir
      </button>
    );
  };
  const utils = render(<ConfirmProvider {...providerProps}>{wrap(<Probe />)}</ConfirmProvider>);
  const opener = screen.getByRole('button', { name: 'Abrir' });
  return {
    ...utils,
    results,
    opener,
    open: () => {
      opener.focus();
      fireEvent.click(opener);
    },
    ask: (asked: ConfirmOptions) => ref.confirm!(asked),
  };
}

const escape = () => fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
const flush = () => act(async () => { await Promise.resolve(); });

describe('useConfirm and ConfirmProvider (R-FBK-1..3)', () => {
  it('S-FBK-1: the confirm button resolves true and closes the pane', async () => {
    const { results, open } = setup(DELETE);
    open();

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => expect(results).toEqual([true]));
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it.each([
    ['the cancel button', () => fireEvent.click(screen.getByRole('button', { name: 'No' }))],
    ['Esc', escape],
    ['the backdrop (close control)', () => fireEvent.click(screen.getByRole('alertdialog').previousElementSibling!)],
  ])('S-FBK-2: %s resolves false, exactly once', async (_, decline) => {
    const { results, open } = setup(DELETE);
    open();

    decline();
    await waitFor(() => expect(results).toEqual([false]));
    escape();
    await flush();

    expect(results).toEqual([false]);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('S-FBK-3: an alertdialog named by the title and described by the description', () => {
    const { open } = setup({ ...DELETE, details: '000123 · ACME SAC' });
    open();

    expect(screen.getByRole('alertdialog', { name: 'Eliminar' }))
      .toHaveAccessibleDescription('Se eliminará el registro. 000123 · ACME SAC');
  });

  it('S-FBK-4: danger uses the destructive button, info the default one', () => {
    const { container: reference } = render(
      <>
        <JButton variant="destructive">Ref</JButton>
        <JButton variant="default">Ref</JButton>
      </>,
    );
    const [destructive, plain] = Array.from(reference.querySelectorAll('button')).map((button) => button.className);
    const { open, unmount } = setup(DELETE);
    open();

    expect(screen.getByRole('button', { name: 'Eliminar' }).className).toBe(destructive);
    unmount();

    setup({ title: 'Guardar', confirmLabel: 'Guardar', variant: 'info' }).open();

    expect(screen.getByRole('button', { name: 'Guardar' }).className).toBe(plain);
  });

  it('S-FBK-5: useConfirm outside a provider throws naming ConfirmProvider', () => {
    const silence = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const Orphan = () => {
      useConfirm();
      return null;
    };

    expect(() => render(<Orphan />)).toThrow(/ConfirmProvider/);
    silence.mockRestore();
  });

  it('CONFIRM_DEFAULTS: info variant and Spanish labels when omitted', () => {
    expect(CONFIRM_DEFAULTS).toEqual({ variant: 'info', confirmLabel: 'Confirmar', cancelLabel: 'Cancelar' });
    setup({ title: 'Guardar cambios' }).open();

    expect(screen.getByRole('button', { name: 'Confirmar' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('S-FBK-6: danger focuses cancel, info focuses confirm, and initialFocus wins', () => {
    const first = setup(DELETE);
    first.open();
    expect(screen.getByRole('button', { name: 'No' })).toHaveFocus();
    first.unmount();

    const second = setup({ title: 'Guardar', confirmLabel: 'Guardar', variant: 'info' });
    second.open();
    expect(screen.getByRole('button', { name: 'Guardar' })).toHaveFocus();
    second.unmount();

    setup({ title: 'Guardar', confirmLabel: 'Guardar', cancelLabel: 'No', variant: 'info', initialFocus: 'cancel' }).open();
    expect(screen.getByRole('button', { name: 'No' })).toHaveFocus();
  });

  it('S-FBK-7: Tab stays inside the pane and focus returns to the opener', async () => {
    const { open, opener, results } = setup(DELETE);
    open();
    const dialog = screen.getByRole('alertdialog');
    const cancel = screen.getByRole('button', { name: 'No' });
    const confirm = screen.getByRole('button', { name: 'Eliminar' });

    fireEvent.keyDown(cancel, { key: 'Tab' });
    expect(confirm).toHaveFocus();
    fireEvent.keyDown(confirm, { key: 'Tab', shiftKey: true });
    expect(cancel).toHaveFocus();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);

    fireEvent.click(cancel);
    await waitFor(() => expect(results).toEqual([false]));

    expect(opener).toHaveFocus();
  });

  it('S-FBK-8: Esc resolves only the confirm; a JDialog beneath stays open until a second Esc', async () => {
    const onClose = vi.fn();
    const { open, results } = setup(DELETE, {}, (probe) => (
      <JDialog open title="Cliente" onClose={onClose}>{probe}</JDialog>
    ));
    open();

    escape();
    await waitFor(() => expect(results).toEqual([false]));
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Cliente' })).toBeInTheDocument();

    escape();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('S-FBK-8: with renderPane the host renders the pane and owns Esc (no interceptor)', async () => {
    const renderPane = vi.fn((pane: React.ComponentProps<typeof JOptionPane>) => <JOptionPane {...pane} />);
    const seen = vi.fn();
    document.addEventListener('keydown', seen);
    const { open, results } = setup(DELETE, { renderPane });
    open();

    expect(renderPane).toHaveBeenLastCalledWith(expect.objectContaining({
      open: true, title: 'Eliminar', variant: 'danger', confirmLabel: 'Eliminar', cancelLabel: 'No', initialFocus: 'cancel',
    }));

    escape();
    await waitFor(() => expect(results).toEqual([false]));
    expect(seen).toHaveBeenCalledTimes(1);
    document.removeEventListener('keydown', seen);
  });

  it('S-FBK-9: back-to-back calls show one pane at a time, first in first out', async () => {
    const answers: string[] = [];
    const { ask } = setup(DELETE);

    act(() => {
      void ask({ title: 'Primero', confirmLabel: 'Sí', cancelLabel: 'No' }).then((answer) => answers.push(`primero:${answer}`));
      void ask({ title: 'Segundo', confirmLabel: 'Sí', cancelLabel: 'No' }).then((answer) => answers.push(`segundo:${answer}`));
    });

    expect(screen.getAllByRole('alertdialog')).toHaveLength(1);
    expect(screen.getByRole('alertdialog', { name: 'Primero' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sí' }));
    await waitFor(() => expect(screen.getByRole('alertdialog', { name: 'Segundo' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'No' }));

    await waitFor(() => expect(answers).toEqual(['primero:true', 'segundo:false']));
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('S-FBK-10: unmounting the provider resolves every pending call with false', async () => {
    const answers: boolean[] = [];
    const { ask, unmount } = setup(DELETE);
    act(() => {
      void ask(DELETE).then((answer) => answers.push(answer));
      void ask({ title: 'Otro' }).then((answer) => answers.push(answer));
    });

    unmount();

    await waitFor(() => expect(answers).toEqual([false, false]));
  });

  it('has no serious axe violations while open', async () => {
    const { open } = setup({ ...DELETE, details: '000123 · ACME SAC' });
    open();

    expect(await seriousViolations(document.body)).toEqual([]);
  });
});
