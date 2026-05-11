import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CardLayout } from './CardLayout';
import { FlowLayout } from '../FlowLayout/FlowLayout';
import { BoxLayout } from '../BoxLayout/BoxLayout';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';

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
      <PanelAtom data-panel-card="profile" variant="outlined" padding="lg">
        <TextAtom size="sm">Perfil visible por defecto.</TextAtom>
      </PanelAtom>
      <PanelAtom data-panel-card="security" variant="outlined" padding="lg">
        <TextAtom size="sm">Seguridad.</TextAtom>
      </PanelAtom>
    </CardLayout>
  ),
};

export const Interactive: Story = {
  render: () => {
    const cards = ['perfil', 'seguridad', 'facturacion'];
    const [activeCard, setActiveCard] = useState(cards[0]);

    return (
      <BoxLayout direction="column" gap="sm" className="w-full max-w-lg">
        <FlowLayout gap="sm" className="w-full">
          {cards.map((card) => (
            <ButtonAtom
              key={card}
              variant={activeCard === card ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCard(card)}
            >
              {card}
            </ButtonAtom>
          ))}
        </FlowLayout>

        <CardLayout activeCard={activeCard}>
          <PanelAtom data-panel-card="perfil" variant="outlined" padding="lg">
            <TextAtom size="sm">Datos generales del perfil.</TextAtom>
          </PanelAtom>
          <PanelAtom data-panel-card="seguridad" variant="outlined" padding="lg">
            <TextAtom size="sm">Opciones de acceso y permisos.</TextAtom>
          </PanelAtom>
          <PanelAtom data-panel-card="facturacion" variant="outlined" padding="lg">
            <TextAtom size="sm">Informacion de pagos y suscripciones.</TextAtom>
          </PanelAtom>
        </CardLayout>
      </BoxLayout>
    );
  },
};
