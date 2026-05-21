import type { Meta, StoryObj } from '@storybook/react';
import { JPanel } from '../../atoms/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { JSpringLayout, SPRING_LAYOUT_DEFAULTS } from './SpringLayout';

const meta: Meta<typeof JSpringLayout> = {
  title: 'Layouts/JSpringLayout',
  component: JSpringLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JSpringLayout es el layout de posicionamiento por resorte de JONA. En modo `fixed` (desktop) posiciona elementos de forma absoluta mediante atributos de datos en los hijos: `data-spring-left`, `data-spring-top`, `data-spring-right`, `data-spring-bottom`, `data-spring-width`. En modo `responsive` (móvil) cae a un grid auto-fit como JGridLayout. Útil para dashboards con widgets arrastrables o layouts tipo canvas.',
      },
    },
  },
  argTypes: {
    gap: {
      description: 'Espacio entre elementos en modo `responsive`. En modo `fixed` los elementos se posicionan absolutamente y no tienen gap entre ellos. `md` (default).',
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'JPanelGap' },
        defaultValue: { summary: SPRING_LAYOUT_DEFAULTS.gap },
      },
    },
    placement: {
      description: '`responsive` (default) usa grid auto-fit en pantallas pequeñas. `fixed` activa el posicionamiento absoluto con `data-spring-*` en todos los tamaños.',
      control: 'select',
      options: ['responsive', 'fixed'],
      table: {
        type: { summary: '"responsive" | "fixed"' },
        defaultValue: { summary: SPRING_LAYOUT_DEFAULTS.placement },
      },
    },
    autoFitMin: {
      description: 'Ancho mínimo de columna en modo `responsive`. Default `12rem`.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: SPRING_LAYOUT_DEFAULTS.autoFitMin },
      },
    },
    minHeight: {
      description: 'Altura mínima del contenedor. Necesario en modo `fixed` porque los elementos absolutos no expanden el contenedor. Default `16rem`.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: SPRING_LAYOUT_DEFAULTS.minHeight },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof JSpringLayout>;

const SpringNode = ({ label }: { label: string }) => (
  <JPanel variant="outlined" padding="md" radius="sm">
    <JLabel as="span" size="sm" className="font-medium text-neutral-700">{label}</JLabel>
  </JPanel>
);

export const ResponsiveConstraints: Story = {
  name: 'Posicionamiento absoluto',
  parameters: {
    docs: {
      description: { story: 'Los elementos se posicionan con `data-spring-*`. `data-spring-left`/`top` desde la esquina, `data-spring-right`/`bottom` desde el borde opuesto. `minHeight` es necesario para que el contenedor tenga altura visible.' },
    },
  },
  args: {
    placement: 'responsive',
    minHeight: '18rem',
    gap: 'sm',
  },
  render: (args) => (
    <JSpringLayout {...args} className="w-full max-w-3xl">
      <JPanel data-spring-left="0" data-spring-top="0" data-spring-width="12rem" variant="outlined" padding="md" radius="sm">
        <JLabel as="span" size="sm" className="font-medium text-neutral-700">Left anchored</JLabel>
      </JPanel>
      <JPanel data-spring-left="14rem" data-spring-top="4rem" data-spring-width="14rem" variant="outlined" padding="md" radius="sm">
        <JLabel as="span" size="sm" className="font-medium text-neutral-700">Offset from first</JLabel>
      </JPanel>
      <JPanel data-spring-right="0" data-spring-bottom="0" data-spring-width="12rem" variant="outlined" padding="md" radius="sm">
        <JLabel as="span" size="sm" className="font-medium text-neutral-700">Bottom end</JLabel>
      </JPanel>
    </JSpringLayout>
  ),
};

export const MobileAutoFit: Story = {
  name: 'Fallback responsivo (auto-fit)',
  parameters: {
    docs: {
      description: { story: 'En pantallas pequeñas, `placement="responsive"` activa el modo grid con `autoFitMin`. Los datos `data-spring-*` se ignoran en este modo para respetar el flujo documental.' },
    },
  },
  args: {
    autoFitMin: '10rem',
    gap: 'md',
  },
  render: (args) => (
    <JSpringLayout {...args} className="w-full max-w-3xl">
      {['Inicio', 'Proceso', 'Revisión', 'Cierre'].map((item) => (
        <SpringNode key={item} label={item} />
      ))}
    </JSpringLayout>
  ),
};
