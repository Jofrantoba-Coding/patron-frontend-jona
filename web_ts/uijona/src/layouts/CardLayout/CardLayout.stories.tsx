import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CardLayout } from './CardLayout';
import { JFlowLayout } from '../FlowLayout/FlowLayout';
import { BoxLayout } from '../BoxLayout/BoxLayout';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { JButton } from '../../atoms/JButton/JButton';

const meta: Meta<typeof CardLayout> = {
  title: 'Layouts/CardLayout',
  component: CardLayout,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    activeCard: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardLayout>;

export const FirstCardByDefault: Story = {
  render: (args) => (
    <CardLayout {...args} className="w-full max-w-md">
      <JPanel data-panel-card="profile" variant="outlined" padding="lg">
        <JLabel size="sm">Perfil visible por defecto.</JLabel>
      </JPanel>
      <JPanel data-panel-card="security" variant="outlined" padding="lg">
        <JLabel size="sm">Seguridad.</JLabel>
      </JPanel>
    </CardLayout>
  ),
};

export const Interactive: Story = {
  render: () => {
    const cards = ['perfil', 'seguridad', 'facturacion'];
    const [activeCard, setActiveCard] = useState(cards[0]);

    return (
      <BoxLayout direction="column" gap="sm" className="w-full max-w-lg">
        <JFlowLayout gap="sm" className="w-full">
          {cards.map((card) => (
            <JButton
              key={card}
              variant={activeCard === card ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCard(card)}
            >
              {card}
            </JButton>
          ))}
        </JFlowLayout>

        <CardLayout activeCard={activeCard}>
          <JPanel data-panel-card="perfil" variant="outlined" padding="lg">
            <JLabel size="sm">Datos generales del perfil.</JLabel>
          </JPanel>
          <JPanel data-panel-card="seguridad" variant="outlined" padding="lg">
            <JLabel size="sm">Opciones de acceso y permisos.</JLabel>
          </JPanel>
          <JPanel data-panel-card="facturacion" variant="outlined" padding="lg">
            <JLabel size="sm">Informacion de pagos y suscripciones.</JLabel>
          </JPanel>
        </CardLayout>
      </BoxLayout>
    );
  },
};
