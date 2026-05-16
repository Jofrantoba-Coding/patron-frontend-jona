import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import {
  JPanel,
  JPANEL_BREAKPOINTS,
  JPANEL_LAYOUT_DEFAULTS,
  type JPanelArea,
  type JPanelLayout,
  type JPanelLayoutDefaultDoc,
} from './JPanel';
import { TextAtom } from '../TextAtom/TextAtom';
import { ButtonAtom } from '../ButtonAtom/ButtonAtom';

const meta: Meta<typeof JPanel> = {
  title: 'Atoms/JPanel',
  component: JPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'JPanel es el atom contenedor de JONA. Todo layout tiene defaults mobile-first; cuando un layout necesita metadata obligatoria en sus hijos, JPanel emite un console.log con la correccion esperada.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'flat', 'ghost'],
      table: { defaultValue: { summary: 'ghost' } },
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      table: { defaultValue: { summary: 'none' } },
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      table: { defaultValue: { summary: 'none' } },
    },
    layout: {
      control: 'select',
      options: ['none', 'flow', 'box', 'grid', 'border', 'card', 'gridbag', 'group', 'spring'],
      table: { defaultValue: { summary: 'box' } },
    },
    direction: {
      control: 'radio',
      options: ['row', 'column'],
      table: { defaultValue: { summary: 'column' } },
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      table: { defaultValue: { summary: 'none' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof JPanel>;

const layoutDocs = Object.entries(JPANEL_LAYOUT_DEFAULTS) as [JPanelLayout, JPanelLayoutDefaultDoc][];
const breakpointDocs = Object.entries(JPANEL_BREAKPOINTS);

const DemoItem = ({ children }: { children: ReactNode }) => (
  <JPanel variant="flat" padding="sm" radius="sm" className="min-h-12 text-center text-sm font-medium text-neutral-700">
    {children}
  </JPanel>
);

const DemoZone = ({
  children,
  area,
  className,
}: {
  children: ReactNode;
  area?: JPanelArea;
  className?: string;
}) => (
  <JPanel area={area} variant="outlined" padding="sm" radius="sm" className={className}>
    {children}
  </JPanel>
);

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<JPanel>
  <TextAtom>Contenido</TextAtom>
</JPanel>`,
      },
    },
  },
  render: () => (
    <JPanel className="max-w-sm">
      <TextAtom as="h3" size="sm" className="font-semibold">JPanel base</TextAtom>
      <TextAtom size="sm" color="muted">Sin props, JPanel se comporta como stack vertical neutro.</TextAtom>
    </JPanel>
  ),
};

export const CardPanel: Story = {
  parameters: {
    docs: {
      source: {
        code: `<JPanel variant="default" padding="md" radius="md" gap="sm">
  <TextAtom as="h3">Titulo</TextAtom>
  <TextAtom>Contenido</TextAtom>
</JPanel>`,
      },
    },
  },
  render: () => (
    <JPanel variant="default" padding="md" radius="md" gap="sm" className="max-w-sm">
      <TextAtom as="h3" size="sm" className="font-semibold">Panel con superficie</TextAtom>
      <TextAtom size="sm" color="muted">El contenedor visual sale de props, no de una etiqueta HTML directa.</TextAtom>
    </JPanel>
  ),
};

export const LayoutDefaults: Story = {
  parameters: {
    docs: {
      source: {
        code: `JPANEL_LAYOUT_DEFAULTS

none     -> sin distribucion interna
flow     -> flex row wrap
box      -> flex column nowrap
grid     -> grid auto-fit, autoFitMin 12rem
border   -> requiere area en hijos
card     -> muestra primera tarjeta; activeCard requiere card/key
gridbag  -> grid responsive con constraints opcionales
group    -> grid responsive con spans opcionales
spring   -> mobile grid; tablet/desktop requiere constraints spring`,
      },
    },
  },
  render: () => (
    <JPanel gap="md" className="max-w-5xl">
      <JPanel layout="flow" gap="sm">
        {breakpointDocs.map(([name, value]) => (
          <JPanel key={name} variant="flat" padding="sm" radius="sm">
            <TextAtom size="xs" className="font-semibold">{name}</TextAtom>
            <TextAtom size="xs" color="muted">{value}</TextAtom>
          </JPanel>
        ))}
      </JPanel>

      <JPanel layout="grid" gap="sm" mobileLarge={{ columns: 2 }} tablet={{ columns: 2 }} desktop={{ columns: 3 }} tv={{ columns: 4, gap: 'lg' }}>
      {layoutDocs.map(([layoutName, doc]) => (
        <JPanel key={layoutName} variant="outlined" padding="md" radius="md" gap="sm">
          <TextAtom as="h3" size="sm" className="font-semibold">{layoutName}</TextAtom>
          <TextAtom size="sm" color="muted">{doc.behavior}</TextAtom>
          <JPanel gap="xs">
            {Object.entries(doc.defaults).map(([name, value]) => (
              <TextAtom key={name} size="xs" color="muted">
                {name}: {value}
              </TextAtom>
            ))}
          </JPanel>
          <TextAtom size="xs" className="font-medium">
            {doc.required.length > 0 ? doc.required.join(' ') : 'No requiere valores obligatorios.'}
          </TextAtom>
        </JPanel>
      ))}
      </JPanel>
    </JPanel>
  ),
};

export const BoxResponsive: Story = {
  parameters: {
    docs: {
      source: {
        code: `<JPanel layout="box" gap="sm" tablet={{ direction: 'row', gap: 'md' }}>
  <JPanel>Uno</JPanel>
  <JPanel>Dos</JPanel>
  <JPanel>Tres</JPanel>
</JPanel>`,
      },
    },
  },
  render: () => (
    <JPanel layout="box" gap="sm" tablet={{ direction: 'row', gap: 'md' }} variant="outlined" padding="md" radius="md" className="max-w-2xl">
      <DemoItem>Uno</DemoItem>
      <DemoItem>Dos</DemoItem>
      <DemoItem>Tres</DemoItem>
    </JPanel>
  ),
};

export const GridResponsive: Story = {
  parameters: {
    docs: {
      source: {
        code: `<JPanel
  layout="grid"
  gap="sm"
  mobileLarge={{ columns: 2 }}
  tablet={{ columns: 2, gap: 'md' }}
  desktop={{ columns: 3, gap: 'lg' }}
  tv={{ columns: 6, gap: 'xl' }}
>
  {items}
</JPanel>`,
      },
    },
  },
  render: () => (
    <JPanel
      layout="grid"
      gap="sm"
      mobileLarge={{ columns: 2 }}
      tablet={{ columns: 2, gap: 'md' }}
      desktop={{ columns: 3, gap: 'lg' }}
      tv={{ columns: 6, gap: 'xl' }}
      variant="outlined"
      padding="md"
      radius="md"
      className="max-w-3xl"
    >
      {['Clientes', 'Ventas', 'Inventario', 'Riesgos', 'Reportes', 'Alertas'].map((item) => (
        <DemoItem key={item}>{item}</DemoItem>
      ))}
    </JPanel>
  ),
};

export const BorderLayout: Story = {
  parameters: {
    docs: {
      source: {
        code: `<JPanel layout="border" gap="sm">
  <JPanel area="top">Header</JPanel>
  <JPanel area="left">Menu</JPanel>
  <JPanel area="center">Contenido</JPanel>
  <JPanel area="right">Aside</JPanel>
  <JPanel area="bottom">Footer</JPanel>
</JPanel>`,
      },
    },
  },
  render: () => (
    <JPanel layout="border" gap="sm" variant="outlined" padding="md" radius="md" className="min-h-72 max-w-3xl">
      <DemoZone area="top">Header</DemoZone>
      <DemoZone area="left" className="w-full md:w-32">Menu</DemoZone>
      <DemoZone area="center">Contenido</DemoZone>
      <DemoZone area="right" className="w-full md:w-32">Aside</DemoZone>
      <DemoZone area="bottom">Footer</DemoZone>
    </JPanel>
  ),
};

export const CardLayout: Story = {
  render: () => {
    const cards = ['perfil', 'seguridad', 'facturacion'];
    const [activeCard, setActiveCard] = useState(cards[0]);

    return (
      <JPanel gap="sm" className="max-w-md">
        <JPanel layout="flow" gap="sm">
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
        </JPanel>

        <JPanel layout="card" activeCard={activeCard} variant="outlined" padding="md" radius="md">
          <JPanel card="perfil"><TextAtom size="sm">Configuracion del perfil.</TextAtom></JPanel>
          <JPanel card="seguridad"><TextAtom size="sm">Sesiones, permisos y accesos.</TextAtom></JPanel>
          <JPanel card="facturacion"><TextAtom size="sm">Pagos, comprobantes y suscripciones.</TextAtom></JPanel>
        </JPanel>
      </JPanel>
    );
  },
};

export const AdvancedLayouts: Story = {
  render: () => (
    <JPanel gap="lg" className="max-w-3xl">
      <JPanel layout="gridbag" gap="sm" tablet={{ columns: 4 }} variant="outlined" padding="md" radius="md">
        <JPanel gridBagColumn={1} gridBagRow={1} gridBagColumnSpan={2} variant="flat" padding="sm">Span 2</JPanel>
        <JPanel variant="flat" padding="sm">Metric A</JPanel>
        <JPanel variant="flat" padding="sm">Metric B</JPanel>
        <JPanel gridBagColumn={1} gridBagRow={2} gridBagRowSpan={2} variant="flat" padding="sm">Side</JPanel>
        <JPanel gridBagColumn={2} gridBagRow={2} gridBagColumnSpan={3} variant="flat" padding="sm">Content</JPanel>
      </JPanel>

      <JPanel layout="group" gap="sm" tablet={{ columns: 3 }} variant="outlined" padding="md" radius="md">
        <DemoItem>Name</DemoItem>
        <DemoItem>Email</DemoItem>
        <DemoItem>Phone</DemoItem>
        <JPanel groupSpan={2} variant="flat" padding="sm">Address spans two columns</JPanel>
        <DemoItem>Status</DemoItem>
      </JPanel>
    </JPanel>
  ),
};
