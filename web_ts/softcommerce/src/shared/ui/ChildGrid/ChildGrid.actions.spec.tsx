import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChildGrid } from './ChildGrid';
import type { ChildGridRow } from './InterChildGrid';

const ROWS: ChildGridRow[] = [{ _key: '1', motivo: 'INICIO', estado: 'A' }];
const show = (over: Partial<Parameters<typeof ChildGrid>[0]> = {}) => {
  const onAction = vi.fn();
  render(
    <ChildGrid
      title="Activacion" columns={[{ key: 'motivo', header: 'Motivo' }]} rows={ROWS} readOnly={false} onSelect={vi.fn()} onAction={onAction}
      actions={[{ id: 'activar', label: 'Activar', disabled: false }, { id: 'desactivar', label: 'Desactivar', disabled: true }]} {...over}
    />,
  );
  return { onAction, user: userEvent.setup(), toolbar: () => within(screen.getByRole('toolbar', { name: 'Activacion' })) };
};

describe('S-ACT-1 the child toolbar renders the declared actions (R-ACT-1)', () => {
  it('shows one button per action, in order, with its label, after the fixed buttons', () => {
    const { toolbar } = show({ onRemove: vi.fn() });
    expect(toolbar().getAllByRole('button').map((b) => b.textContent)).toEqual(['Quitar', 'Activar', 'Desactivar']);
  });

  it('calls onAction with the id of the clicked action, value-first', async () => {
    const { user, onAction, toolbar } = show();
    await user.click(toolbar().getByRole('button', { name: 'Activar' }));
    expect(onAction.mock.calls).toEqual([['activar']]);
  });

  it('S-ACT-2 a disabled action renders disabled and a click sends nothing', async () => {
    const { user, onAction, toolbar } = show();
    const desactivar = toolbar().getByRole('button', { name: 'Desactivar' }) as HTMLButtonElement;
    expect(desactivar.disabled).toBe(true);
    await user.click(desactivar);
    expect(onAction).not.toHaveBeenCalled();
  });

  it('has no action buttons when none are declared', () => {
    show({ actions: undefined });
    expect(screen.queryByRole('button', { name: 'Activar' })).toBeNull();
  });
});
