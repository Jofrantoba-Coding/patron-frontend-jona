import type { Meta, StoryObj } from '@storybook/react';
import { RelatedItemMolecule } from './RelatedItemMolecule';

const meta: Meta<typeof RelatedItemMolecule> = {
  title: 'Molecules/RelatedItemMolecule',
  component: RelatedItemMolecule,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RelatedItemMolecule>;

export const Default: Story = {
  args: {
    name: 'Arquitectura Cloud Resiliente',
    outcome: 'Diseño de sistemas tolerantes a fallos con alta disponibilidad.',
    href: '/servicios/arquitectura-cloud',
    linkLabel: 'Ver servicio →',
  },
};
