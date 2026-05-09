import type { Meta, StoryObj } from '@storybook/react';
import { HeaderPageOrganism } from './HeaderPageOrganism';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
import { UserAvatarMolecule } from '../../molecules/UserAvatarMolecule/UserAvatarMolecule';

const meta: Meta<typeof HeaderPageOrganism> = {
  title: 'Organisms/HeaderPageOrganism',
  component: HeaderPageOrganism,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof HeaderPageOrganism>;

export const Default: Story = {
  args: { title: 'JONA UI' },
};

export const WithNav: Story = {
  args: {
    title: 'JONA UI',
    nav: (
      <nav style={{ display: 'flex', gap: '16px' }}>
        <a href="#">Inicio</a>
        <a href="#">Componentes</a>
        <a href="#">Documentación</a>
      </nav>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: 'JONA UI',
    nav: (
      <nav style={{ display: 'flex', gap: '16px' }}>
        <a href="#">Dashboard</a>
        <a href="#">Reportes</a>
      </nav>
    ),
    actions: (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <ButtonAtom variant="ghost" size="sm">Ayuda</ButtonAtom>
        <UserAvatarMolecule name="Jonathan Franck" size="sm" />
      </div>
    ),
  },
};
