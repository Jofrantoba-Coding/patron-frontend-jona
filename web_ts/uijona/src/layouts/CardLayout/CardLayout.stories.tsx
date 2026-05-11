import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CardLayout } from './CardLayout';
import { FlowLayout } from '../FlowLayout/FlowLayout';
import { BoxLayout } from '../BoxLayout/BoxLayout';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

const meta: Meta<typeof CardLayout> = {
  title: 'Layouts/CardLayout',
  component: CardLayout,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
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
    <CardLayout {...args} className="w-80">
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
      <BoxLayout direction="column" gap="sm" className="w-96">
        <FlowLayout gap="sm">
          {cards.map((card) => (
            <button
              key={card}
              type="button"
              className={`rounded border px-3 py-1 text-sm ${activeCard === card ? 'border-blue-600 text-blue-700' : 'border-neutral-300 text-neutral-700'}`}
              onClick={() => setActiveCard(card)}
            >
              {card}
            </button>
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
