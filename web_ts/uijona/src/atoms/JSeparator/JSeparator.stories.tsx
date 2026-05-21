import type { Meta, StoryObj } from '@storybook/react';
import { JSeparator, JSEPARATOR_DEFAULTS } from './JSeparator';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JSeparator> = {
  title: 'Atoms/JSeparator',
  component: JSeparator,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'JSeparator es el atom de separador visual de JONA. Renderiza una línea divisoria `<hr>` (horizontal) o un divisor vertical `<div role="separator">` para separar secciones de contenido o elementos en línea. Orientación `horizontal` para separar secciones apiladas; `vertical` para separar elementos en una fila (navbars, breadcrumbs, toolbars).',
      },
    },
  },
  argTypes: {
    orientation: {
      description: 'Dirección del separador. `horizontal` (default) traza una línea de izquierda a derecha, ocupa todo el ancho disponible. `vertical` traza una línea de arriba a abajo, se usa dentro de contenedores flex en fila.',
      control: 'radio',
      options: ['horizontal', 'vertical'],
      table: {
        type: { summary: 'JSeparatorOrientation' },
        defaultValue: { summary: JSEPARATOR_DEFAULTS.orientation },
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JSeparator>;

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  parameters: {
    docs: {
      description: { story: 'Separador horizontal (default). Ocupa el ancho del contenedor. Usar entre secciones de formulario, grupos de opciones o bloques de contenido.' },
    },
  },
  decorators: [(S) => <JPanel style={{ width: 300 }}><S /></JPanel>],
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  parameters: {
    docs: {
      description: { story: 'Separador vertical. Usar dentro de un flex row para dividir elementos en línea: navbars, breadcrumbs, toolbars.' },
    },
  },
  decorators: [(S) => (
    <JPanel layout="flow" gap="sm" alignItems="center" style={{ height: 40 }}>
      <JLabel as="span">Izquierda</JLabel>
      <S />
      <JLabel as="span">Derecha</JLabel>
    </JPanel>
  )],
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Separador entre secciones de configuración. El último ítem no lleva separador — el padre controla cuándo renderizarlo.' },
    },
  },
  render: () => {
    const sections = ['Información general', 'Facturación', 'Notificaciones', 'Seguridad'];
    return (
      <JPanel layout="box" style={{ width: 320 }}>
        {sections.map((section, i) => (
          <JPanel layout="box" key={section}>
            <JPanel layout="box" style={{ padding: '12px 0', fontSize: 14, fontWeight: 500, color: '#404040' }}>
              {section}
            </JPanel>
            {i < sections.length - 1 && <JSeparator />}
          </JPanel>
        ))}
      </JPanel>
    );
  },
};

export const InNav: Story = {
  parameters: {
    docs: {
      description: { story: 'Separadores verticales en una barra de navegación horizontal. El alto del separador hereda el del contenedor flex.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="sm" alignItems="center" style={{ height: 32 }}>
      <JLabel as="span" size="sm">Inicio</JLabel>
      <JSeparator orientation="vertical" />
      <JLabel as="span" size="sm">Productos</JLabel>
      <JSeparator orientation="vertical" />
      <JLabel as="span" size="sm">Contacto</JLabel>
    </JPanel>
  ),
};
