import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JButton } from '../../atoms/JButton';
import { JShortcutGroup, JShortcutSheet } from './JShortcutSheet';

const GROUPS: JShortcutGroup[] = [
  {
    title: 'Lista',
    items: [
      { keys: ['↑', '↓'], label: 'Mover la selección' },
      { keys: ['Enter'], label: 'Abrir el registro' },
      { keys: ['Alt', 'A'], label: 'Agregar' },
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
  {
    title: 'General',
    items: [
      { keys: ['Ctrl', 'K'], label: 'Buscar opción' },
      { keys: ['Shift', '?'], label: 'Atajos de teclado' },
    ],
  },
];

function Sheet({ initiallyOpen }: { initiallyOpen: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <>
      <JButton variant="outline" onClick={() => setOpen(true)}>
        Atajos de teclado
      </JButton>
      <JShortcutSheet open={open} groups={GROUPS} onClose={() => setOpen(false)} />
    </>
  );
}

const meta: Meta<typeof JShortcutSheet> = {
  title: 'Molecules/JShortcutSheet',
  component: JShortcutSheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JShortcutSheet es un diálogo (título por defecto `Atajos de teclado`) con un encabezado por grupo; cada atajo muestra sus teclas como elementos `kbd` junto a su descripción. Esc, el fondo y el botón `Cerrar` llaman a `onClose`, y el foco vuelve al invocador.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JShortcutSheet>;

export const Default: Story = {
  render: () => <Sheet initiallyOpen={false} />,
};

export const Open: Story = {
  render: () => <Sheet initiallyOpen />,
};
