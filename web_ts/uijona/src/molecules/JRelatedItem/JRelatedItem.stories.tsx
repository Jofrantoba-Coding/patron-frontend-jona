import type { Meta, StoryObj } from '@storybook/react';
import { JRelatedItem } from './JRelatedItem';

const meta: Meta<typeof JRelatedItem> = {
  title: 'Molecules/JRelatedItem',
  component: JRelatedItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof JRelatedItem>;

export const Default: Story = {
  args: {
    name: 'Arquitectura Cloud Resiliente',
    outcome: 'Diseño de sistemas tolerantes a fallos con alta disponibilidad.',
    href: '/servicios/arquitectura-cloud',
    linkLabel: 'Ver servicio →',
  },
};
