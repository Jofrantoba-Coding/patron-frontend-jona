import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
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
