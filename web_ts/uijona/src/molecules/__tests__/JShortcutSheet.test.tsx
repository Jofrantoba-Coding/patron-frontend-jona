import React, { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import { InterJShortcutSheet, JShortcutGroup, JShortcutSheet } from '../JShortcutSheet';
import { seriousViolations } from '../../__tests__/quality/axe';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import tailwindConfig from '../../../tailwind.config.js';
import { utilityStyle } from '../../__tests__/css/utilityStyle';

const GROUPS: JShortcutGroup[] = [
  {
    title: 'Lista',
    items: [
      { keys: ['Enter'], label: 'Abrir el registro' },
      { keys: ['Alt', 'B'], label: 'Buscar' },
    ],
  },
  {
    title: 'Pestañas',
    items: [
      { keys: ['Alt', '1…9'], label: 'Ir a la pestaña' },
      { keys: ['Alt', 'W'], label: 'Cerrar la pestaña' },
    ],
  },
];

const Host: React.FC<Partial<InterJShortcutSheet>> = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Atajos</button>
      <JShortcutSheet open={open} groups={GROUPS} onClose={() => setOpen(false)} {...props} />
    </>
  );
};

describe('JShortcutSheet (R-CHR-8)', () => {
  it('S-CHR-24: a dialog with a heading per group and the keys as kbd elements', () => {
    render(<JShortcutSheet open groups={GROUPS} onClose={() => undefined} />);

    const dialog = screen.getByRole('dialog', { name: 'Atajos de teclado' });
    expect(within(dialog).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'Lista',
      'Pestañas',
    ]);
    const buscar = within(dialog).getByText('Buscar').closest('li') as HTMLElement;
    expect(Array.from(buscar.querySelectorAll('kbd')).map((kbd) => kbd.textContent)).toEqual(['Alt', 'B']);
    expect(dialog.querySelectorAll('kbd')).toHaveLength(7);
    expect(within(dialog).getByRole('list', { name: 'Pestañas' })).toBeInTheDocument();
  });

  it('S-CHR-24: Esc closes it and the invoker gets focus back', () => {
    render(<Host />);
    const invoker = screen.getByRole('button', { name: 'Atajos' });
    invoker.focus();
    fireEvent.click(invoker);
    expect(screen.getByRole('dialog', { name: 'Atajos de teclado' })).toBeInTheDocument();

    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(invoker).toHaveFocus();
  });

  it('the close button closes it and the invoker gets focus back', () => {
    render(<Host />);
    const invoker = screen.getByRole('button', { name: 'Atajos' });
    invoker.focus();
    fireEvent.click(invoker);

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(invoker).toHaveFocus();
  });

  it('a custom title names the dialog; closed, nothing renders', () => {
    const onClose = vi.fn();
    const { rerender } = render(<JShortcutSheet open title="Teclado" groups={GROUPS} onClose={onClose} />);
    expect(screen.getByRole('dialog', { name: 'Teclado' })).toBeInTheDocument();

    rerender(<JShortcutSheet open={false} title="Teclado" groups={GROUPS} onClose={onClose} />);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('separates the rows with the line token in both modes (not the preflight gray)', async () => {
    const from = resolve(process.cwd(), 'src/styles/index.css');
    const css = (await postcss([postcssImport(), tailwindcss(tailwindConfig)]).process(readFileSync(from, 'utf8'), { from })).root;
    render(<JShortcutSheet open groups={GROUPS} onClose={() => undefined} />);
    const rows = within(screen.getByRole('list', { name: 'Lista' })).getAllByRole('listitem');

    expect(utilityStyle(css, rows[0], 1024, 'border-color')).toBe('rgb(var(--jona-line))');
    expect(utilityStyle(css, rows[0], 1024, 'border-bottom-width')).toBe('1px');
    expect(utilityStyle(css, rows[rows.length - 1], 1024, 'border-color')).toBe('rgb(var(--jona-line))');
  });

  it('has no serious axe violations', async () => {
    const { baseElement } = render(<JShortcutSheet open groups={GROUPS} onClose={() => undefined} />);

    expect(await seriousViolations(baseElement)).toEqual([]);
  });
});
