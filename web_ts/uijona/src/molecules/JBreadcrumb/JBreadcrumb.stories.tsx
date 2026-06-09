import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import {
  JBreadcrumb,
  JBreadcrumbList,
  JBreadcrumbItem,
  JBreadcrumbLink,
  JBreadcrumbPage,
  JBreadcrumbSeparator,
} from './JBreadcrumb';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JButton } from '../../atoms/JButton/JButton';

const meta: Meta<typeof JBreadcrumb> = {
  title: 'Molecules/JBreadcrumb',
  component: JBreadcrumb,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof JBreadcrumb>;

export const Default: Story = {
  render: () => (
    <JBreadcrumb>
      <JBreadcrumbList>
        <JBreadcrumbItem>
          <JBreadcrumbLink href="#" onNavigate={fn()}>Inicio</JBreadcrumbLink>
        </JBreadcrumbItem>
        <JBreadcrumbSeparator />
        <JBreadcrumbItem>
          <JBreadcrumbLink href="#" onNavigate={fn()}>Configuración</JBreadcrumbLink>
        </JBreadcrumbItem>
        <JBreadcrumbSeparator />
        <JBreadcrumbItem>
          <JBreadcrumbPage>Perfil</JBreadcrumbPage>
        </JBreadcrumbItem>
      </JBreadcrumbList>
    </JBreadcrumb>
  ),
};

export const Short: Story = {
  render: () => (
    <JBreadcrumb>
      <JBreadcrumbList>
        <JBreadcrumbItem>
          <JBreadcrumbLink href="#">Inicio</JBreadcrumbLink>
        </JBreadcrumbItem>
        <JBreadcrumbSeparator />
        <JBreadcrumbItem>
          <JBreadcrumbPage>Dashboard</JBreadcrumbPage>
        </JBreadcrumbItem>
      </JBreadcrumbList>
    </JBreadcrumb>
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
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-4">
        <JBreadcrumb>
          <JBreadcrumbList>
            {trail.map((page, i) => (
              <span key={page} style={{ display: 'contents' }}>
                {i > 0 && <JBreadcrumbSeparator />}
                <JBreadcrumbItem>
                  {i === trail.length - 1 ? (
                    <JBreadcrumbPage>{page}</JBreadcrumbPage>
                  ) : (
                    <JBreadcrumbLink href="#" onNavigate={() => goTo(page)}>{page}</JBreadcrumbLink>
                  )}
                </JBreadcrumbItem>
              </span>
            ))}
          </JBreadcrumbList>
        </JBreadcrumb>
        {nextPage && (
          <JButton variant="outline" size="sm" onClick={() => setTrail((t) => [...t, nextPage])}>
            Navegar a: {nextPage}
          </JButton>
        )}
      </JPanel>
    );
  },
};
