import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AlertMolecule } from './AlertMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

const meta: Meta<typeof AlertMolecule> = {
  title: 'Molecules/AlertMolecule',
  component: AlertMolecule,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['default', 'destructive'] },
    title:   { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof AlertMolecule>;

export const Default: Story = {
  args: {
    title: 'Información',
    children: 'Tu sesión expirará en 10 minutos.',
    style: { width: '400px' },
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    title: 'Error',
    children: 'No se pudo procesar tu solicitud. Intenta de nuevo.',
    style: { width: '400px' },
  },
};

export const WithoutTitle: Story = {
  args: {
    children: 'Mensaje informativo sin título.',
    style: { width: '400px' },
  },
};

export const Interactive: Story = {
  render: () => {
    const initialAlerts = [
      { id: 1, variant: 'default' as const, title: 'Información', message: 'Tu sesión expirará en 10 minutos.' },
      { id: 2, variant: 'destructive' as const, title: 'Error', message: 'No se pudo guardar la configuración.' },
    ];
    const [alerts, setAlerts] = useState(initialAlerts);
    const dismiss = (id: number) => setAlerts((a) => a.filter((x) => x.id !== id));
    return (
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-3 w-96">
        {alerts.map((a) => (
          <PanelAtom variant="ghost" padding="none" key={a.id} className="relative">
            <AlertMolecule variant={a.variant} title={a.title}>{a.message}</AlertMolecule>
            <button
              onClick={() => dismiss(a.id)}
              className="absolute top-2 right-2 text-xs text-neutral-400 hover:text-neutral-700"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </PanelAtom>
        ))}
        {alerts.length === 0 && (
          <p className="text-sm text-neutral-400">Sin alertas activas.</p>
        )}
        <button
          onClick={() => setAlerts(initialAlerts)}
          className="rounded-md border px-3 py-1.5 text-sm w-fit"
        >
          Restaurar alertas
        </button>
      </PanelAtom>
    );
  },
};
