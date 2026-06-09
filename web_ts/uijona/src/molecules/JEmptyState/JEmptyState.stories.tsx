import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JEmptyState } from './JEmptyState';
import { JButton } from '../../atoms/JButton/JButton';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const EmptyIcon = () => (
  <span aria-hidden="true" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>
    0
  </span>
);

const meta: Meta<typeof JEmptyState> = {
  title: 'Molecules/JEmptyState',
  component: JEmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof JEmptyState>;

export const Default: Story = {
  args: {
    title: 'Sin resultados',
    description: 'Ajusta los filtros o crea un nuevo registro para empezar.',
  },
};

export const WithIcon: Story = {
  args: {
    icon: <EmptyIcon />,
    title: 'No hay datos',
    description: 'La vista esta lista, pero aun no contiene elementos.',
  },
};

export const WithActions: Story = {
  args: {
    icon: <EmptyIcon />,
    title: 'No hay proyectos',
    description: 'Crea el primer proyecto o revisa los filtros aplicados.',
    actions: [
      { label: 'Crear proyecto', onClick: fn(), variant: 'primary' },
      { label: 'Limpiar filtros', onClick: fn(), variant: 'secondary' },
    ],
  },
};

export const Interactive: Story = {
  render: () => {
    const [projects, setProjects] = useState<string[]>([]);
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-4 items-center w-full">
        {projects.length === 0 ? (
          <JEmptyState
            icon={<EmptyIcon />}
            title="Sin proyectos"
            description="Crea tu primer proyecto para comenzar a trabajar."
            actions={[
              { label: 'Crear proyecto', onClick: () => setProjects(['Proyecto Alpha']), variant: 'primary' },
            ]}
          />
        ) : (
          <JPanel variant="ghost" padding="none" className="flex flex-col gap-2 w-80">
            {projects.map((p) => (
              <JPanel variant="ghost" padding="none" key={p} className="flex justify-between items-center rounded-lg border p-3">
                <JLabel size="sm" className="font-medium">{p}</JLabel>
                <JButton variant="ghost" size="sm" onClick={() => setProjects((prev) => prev.filter((x) => x !== p))} className="text-xs text-red-500 hover:text-red-700">
                  Eliminar
                </JButton>
              </JPanel>
            ))}
            <JButton variant="outline" size="sm" onClick={() => setProjects((prev) => [...prev, `Proyecto ${String.fromCharCode(65 + prev.length)}`])}>
              Agregar proyecto
            </JButton>
          </JPanel>
        )}
      </JPanel>
    );
  },
};
