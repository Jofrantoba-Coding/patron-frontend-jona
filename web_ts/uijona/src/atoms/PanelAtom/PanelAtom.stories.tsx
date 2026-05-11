import type { Meta, StoryObj } from '@storybook/react';
import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { PanelAtom, type PanelArea } from './PanelAtom';
import { TextAtom } from '../TextAtom/TextAtom';

const meta: Meta<typeof PanelAtom> = {
  title: 'Atoms/PanelAtom',
  component: PanelAtom,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'flat', 'ghost'],
      description: 'Estilo visual del panel.',
      table: { defaultValue: { summary: 'default' } },
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Espaciado interno del panel.',
      table: { defaultValue: { summary: 'md' } },
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de borde del panel.',
      table: { defaultValue: { summary: 'md' } },
    },
    as: {
      control: 'text',
      description: 'Elemento HTML a renderizar (div, section, article, aside, main…).',
      table: { defaultValue: { summary: 'div' } },
    },
    layout: {
      control: 'select',
      options: ['none', 'flow', 'box', 'grid', 'border', 'card'],
      description: 'Layout manager interno inspirado en Swing.',
      table: { defaultValue: { summary: 'none' } },
    },
    direction: {
      control: 'radio',
      options: ['row', 'column'],
      description: 'Direccion usada por layout="box".',
      table: { defaultValue: { summary: 'row' } },
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Separacion entre hijos para layouts administrados.',
      table: { defaultValue: { summary: 'md' } },
    },
    alignItems: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      description: 'Alineacion transversal de los hijos.',
      table: { defaultValue: { summary: 'stretch' } },
    },
    justifyContent: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Distribucion principal de los hijos.',
      table: { defaultValue: { summary: 'start' } },
    },
    wrap: {
      control: 'select',
      options: ['nowrap', 'wrap', 'reverse'],
      description: 'Comportamiento de salto de linea para flow y box.',
      table: { defaultValue: { summary: 'flow: wrap; box row: wrap; box column: nowrap' } },
    },
    columns: {
      control: 'text',
      description: 'Columnas de CSS Grid como numero o grid-template-columns.',
    },
    rows: {
      control: 'text',
      description: 'Filas de CSS Grid como numero o grid-template-rows.',
    },
    autoFitMin: {
      control: 'text',
      description: 'Minimo responsive para columnas auto-fit en layout="grid".',
    },
    activeCard: {
      control: 'text',
      description: 'Tarjeta activa para layout="card".',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PanelAtom>;

const SampleContent = () => (
  <>
    <TextAtom as="h3" size="sm" className="mb-1 font-semibold">Titulo del panel</TextAtom>
    <TextAtom size="sm" color="muted">Contenido de ejemplo dentro del panel. Puede ser cualquier elemento React.</TextAtom>
  </>
);

const DemoItem = ({ children }: { children: ReactNode }) => (
  <PanelAtom variant="flat" padding="sm" className="min-w-20 text-center text-sm font-medium text-neutral-700">
    {children}
  </PanelAtom>
);

type DemoZoneProps = HTMLAttributes<HTMLDivElement> & {
  'data-panel-area'?: PanelArea;
};

const DemoZone = ({ children, className, ...props }: DemoZoneProps) => (
  <PanelAtom
    variant="outlined"
    padding="sm"
    className={`min-h-12 text-sm text-neutral-700 ${className ?? ''}`}
    {...props}
  >
    {children}
  </PanelAtom>
);

export const Default: Story = {
  args: { variant: 'default', padding: 'md', radius: 'md' },
  render: (args) => (
    <PanelAtom {...args} className="w-72">
      <SampleContent />
    </PanelAtom>
  ),
};

export const Outlined: Story = {
  args: { variant: 'outlined', padding: 'md', radius: 'md' },
  render: (args) => (
    <PanelAtom {...args} className="w-72">
      <SampleContent />
    </PanelAtom>
  ),
};

export const Elevated: Story = {
  args: { variant: 'elevated', padding: 'md', radius: 'md' },
  render: (args) => (
    <PanelAtom {...args} className="w-72">
      <SampleContent />
    </PanelAtom>
  ),
};

export const Flat: Story = {
  args: { variant: 'flat', padding: 'md', radius: 'md' },
  render: (args) => (
    <PanelAtom {...args} className="w-72">
      <SampleContent />
    </PanelAtom>
  ),
};

export const Ghost: Story = {
  args: { variant: 'ghost', padding: 'md', radius: 'md' },
  render: (args) => (
    <PanelAtom {...args} className="w-72">
      <SampleContent />
    </PanelAtom>
  ),
};

export const PaddingSizes: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-4">
      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((padding) => (
        <PanelAtom key={padding} variant="outlined" padding={padding} className="w-72">
          <TextAtom size="xs" color="muted" className="font-mono">padding="{padding}"</TextAtom>
        </PanelAtom>
      ))}
    </PanelAtom>
  ),
};

export const RadiusSizes: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-4">
      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((radius) => (
        <PanelAtom key={radius} variant="default" radius={radius} className="w-72">
          <TextAtom size="xs" color="muted" className="font-mono">radius="{radius}"</TextAtom>
        </PanelAtom>
      ))}
    </PanelAtom>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-4">
      {(['default', 'outlined', 'elevated', 'flat', 'ghost'] as const).map((variant) => (
        <PanelAtom key={variant} variant={variant} className="w-72">
          <TextAtom size="xs" color="muted" className="font-mono">variant="{variant}"</TextAtom>
        </PanelAtom>
      ))}
    </PanelAtom>
  ),
};

export const AsSemanticElement: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-4 w-80">
      <PanelAtom as="section" variant="outlined" padding="lg">
        <TextAtom as="h2" size="sm" className="mb-1 font-semibold">section</TextAtom>
        <TextAtom size="sm" color="muted">PanelAtom renderizado como &lt;section&gt;</TextAtom>
      </PanelAtom>
      <PanelAtom as="article" variant="elevated" padding="lg">
        <TextAtom as="h2" size="sm" className="mb-1 font-semibold">article</TextAtom>
        <TextAtom size="sm" color="muted">PanelAtom renderizado como &lt;article&gt;</TextAtom>
      </PanelAtom>
      <PanelAtom as="aside" variant="flat" padding="md">
        <TextAtom as="h2" size="sm" className="mb-1 font-semibold">aside</TextAtom>
        <TextAtom size="sm" color="muted">PanelAtom renderizado como &lt;aside&gt;</TextAtom>
      </PanelAtom>
    </PanelAtom>
  ),
};

export const Nested: Story = {
  render: () => (
    <PanelAtom variant="elevated" padding="lg" className="w-96">
      <TextAtom as="h3" size="sm" className="mb-3 font-semibold">Panel externo (elevated)</TextAtom>
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-3">
        <PanelAtom variant="outlined" padding="sm">
          <TextAtom size="xs" color="muted">Panel anidado — outlined</TextAtom>
        </PanelAtom>
        <PanelAtom variant="flat" padding="sm">
          <TextAtom size="xs" color="muted">Panel anidado — flat</TextAtom>
        </PanelAtom>
      </PanelAtom>
    </PanelAtom>
  ),
};

export const FlowLayoutManager: Story = {
  render: () => (
    <PanelAtom layout="flow" gap="sm" alignItems="center" variant="outlined" padding="lg" className="w-full max-w-sm">
      {['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis'].map((item) => (
        <DemoItem key={item}>{item}</DemoItem>
      ))}
    </PanelAtom>
  ),
};

export const BoxLayoutManager: Story = {
  render: () => (
    <PanelAtom layout="box" direction="row" gap="sm" alignItems="center" variant="outlined" padding="lg" className="w-full max-w-sm">
      <DemoItem>Inicio</DemoItem>
      <DemoItem>Centro</DemoItem>
      <DemoItem>Fin</DemoItem>
      <DemoItem>Acciones</DemoItem>
      <DemoItem>Estado</DemoItem>
    </PanelAtom>
  ),
};

export const GridLayoutManager: Story = {
  render: () => (
    <PanelAtom layout="grid" gap="sm" variant="outlined" padding="lg" className="w-full max-w-2xl">
      {['Usuarios', 'Ventas', 'Tickets', 'Riesgos', 'Alertas', 'Tareas'].map((item) => (
        <DemoItem key={item}>{item}</DemoItem>
      ))}
    </PanelAtom>
  ),
};

export const ResponsiveGridLayoutManager: Story = {
  render: () => (
    <PanelAtom layout="grid" autoFitMin="9rem" gap="md" variant="outlined" padding="lg" className="w-full max-w-2xl">
      {['Usuarios', 'Ventas', 'Tickets', 'Riesgos', 'Alertas', 'Tareas'].map((item) => (
        <DemoItem key={item}>{item}</DemoItem>
      ))}
    </PanelAtom>
  ),
};

export const BorderLayoutManager: Story = {
  render: () => (
    <PanelAtom layout="border" gap="sm" variant="outlined" padding="lg" className="h-72 w-full max-w-xl">
      <DemoZone data-panel-area="top">Top</DemoZone>
      <DemoZone data-panel-area="left" className="w-24">Left</DemoZone>
      <DemoZone data-panel-area="center">Center</DemoZone>
      <DemoZone data-panel-area="right" className="w-24">Right</DemoZone>
      <DemoZone data-panel-area="bottom">Bottom</DemoZone>
    </PanelAtom>
  ),
};

export const CardLayoutManager: Story = {
  render: () => {
    const cards = ['perfil', 'seguridad', 'facturacion'];
    const [activeCard, setActiveCard] = useState(cards[0]);

    return (
      <PanelAtom layout="box" direction="column" gap="sm" variant="ghost" padding="none" className="w-full max-w-md">
        <PanelAtom layout="flow" gap="sm" variant="ghost" padding="none">
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
        </PanelAtom>

        <PanelAtom layout="card" activeCard={activeCard} variant="outlined" padding="lg">
          <PanelAtom data-panel-card="perfil" variant="ghost" padding="none">
            <TextAtom size="sm">Configuracion del perfil del usuario.</TextAtom>
          </PanelAtom>
          <PanelAtom data-panel-card="seguridad" variant="ghost" padding="none">
            <TextAtom size="sm">Opciones de acceso, sesiones y permisos.</TextAtom>
          </PanelAtom>
          <PanelAtom data-panel-card="facturacion" variant="ghost" padding="none">
            <TextAtom size="sm">Datos de pagos, suscripciones y comprobantes.</TextAtom>
          </PanelAtom>
        </PanelAtom>
      </PanelAtom>
    );
  },
};
