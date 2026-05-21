import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JCardLayout, CARD_LAYOUT_DEFAULTS } from './CardLayout';
import { JFlowLayout } from '../JFlowLayout/FlowLayout';
import { JBoxLayout } from '../JBoxLayout/BoxLayout';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { JButton } from '../../atoms/JButton/JButton';

const meta: Meta<typeof JCardLayout> = {
  title: 'Layouts/JCardLayout',
  component: JCardLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JCardLayout es el layout de paneles intercambiables de JONA. Muestra solo el hijo cuyo atributo `data-panel-card` coincide con `activeCard`. Si `activeCard` no se define, muestra el primer hijo. Ideal para tabs, wizards y configuraciones con secciones alternativas. El cambio de panel es responsabilidad del padre — combinar con botones o tabs que actualizan `activeCard`.',
      },
    },
  },
  argTypes: {
    activeCard: {
      description: 'Clave del panel visible. Debe coincidir con el atributo `data-panel-card` del hijo. Si no se define, se muestra el primer hijo.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: CARD_LAYOUT_DEFAULTS.gap },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof JCardLayout>;

export const FirstCardByDefault: Story = {
  name: 'Primer panel por defecto',
  parameters: {
    docs: {
      description: { story: 'Sin `activeCard` definido, se muestra el primer hijo. El panel de "perfil" es visible al no haber selección explícita.' },
    },
  },
  render: (args) => (
    <JCardLayout {...args} className="w-full max-w-md">
      <JPanel data-panel-card="profile" variant="outlined" padding="lg">
        <JLabel size="sm">Perfil visible por defecto.</JLabel>
      </JPanel>
      <JPanel data-panel-card="security" variant="outlined" padding="lg">
        <JLabel size="sm">Seguridad.</JLabel>
      </JPanel>
    </JCardLayout>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Tabs de configuración con JCardLayout. Los botones del padre controlan `activeCard`; JCardLayout muestra/oculta el panel correspondiente.' },
    },
  },
  render: () => {
    const cards = ['perfil', 'seguridad', 'facturacion'];
    const [activeCard, setActiveCard] = useState(cards[0]);

    return (
      <JBoxLayout direction="column" gap="sm" className="w-full max-w-lg">
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

        <JCardLayout activeCard={activeCard}>
          <JPanel data-panel-card="perfil" variant="outlined" padding="lg">
            <JLabel size="sm">Datos generales del perfil.</JLabel>
          </JPanel>
          <JPanel data-panel-card="seguridad" variant="outlined" padding="lg">
            <JLabel size="sm">Opciones de acceso y permisos.</JLabel>
          </JPanel>
          <JPanel data-panel-card="facturacion" variant="outlined" padding="lg">
            <JLabel size="sm">Información de pagos y suscripciones.</JLabel>
          </JPanel>
        </JCardLayout>
      </JBoxLayout>
    );
  },
};
