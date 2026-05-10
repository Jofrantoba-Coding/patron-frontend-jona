import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import {
  BreadcrumbMolecule,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './BreadcrumbMolecule';

const meta: Meta<typeof BreadcrumbMolecule> = {
  title: 'Molecules/BreadcrumbMolecule',
  component: BreadcrumbMolecule,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof BreadcrumbMolecule>;

export const Default: Story = {
  render: () => (
    <BreadcrumbMolecule>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" onNavigate={fn()}>Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#" onNavigate={fn()}>Configuración</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Perfil</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbMolecule>
  ),
};

export const Short: Story = {
  render: () => (
    <BreadcrumbMolecule>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbMolecule>
  ),
};

export const Interactive: Story = {
  render: () => {
    const allPages = ['Inicio', 'Proyectos', 'Diseño UI', 'Componentes'];
    const [trail, setTrail] = useState(['Inicio', 'Proyectos']);
    const goTo = (page: string) => {
      const idx = trail.indexOf(page);
      if (idx >= 0) setTrail(trail.slice(0, idx + 1));
    };
    const nextPage = allPages[trail.length] ?? null;
    return (
      <div className="flex flex-col gap-4">
        <BreadcrumbMolecule>
          <BreadcrumbList>
            {trail.map((page, i) => (
              <span key={page} style={{ display: 'contents' }}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {i === trail.length - 1 ? (
                    <BreadcrumbPage>{page}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href="#" onNavigate={() => goTo(page)}>{page}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            ))}
          </BreadcrumbList>
        </BreadcrumbMolecule>
        {nextPage && (
          <button
            onClick={() => setTrail((t) => [...t, nextPage])}
            className="rounded-md border px-3 py-1.5 text-sm w-fit"
          >
            Navegar a: {nextPage}
          </button>
        )}
      </div>
    );
  },
};
