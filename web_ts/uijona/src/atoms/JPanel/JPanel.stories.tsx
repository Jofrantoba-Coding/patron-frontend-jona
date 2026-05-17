import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  JPanel,
  JPANEL_BREAKPOINTS,
  JPANEL_LAYOUT_DEFAULTS,
  type JPanelLayout,
  type JPanelLayoutDefaultDoc,
} from './JPanel';
import { JLabel } from '../JLabel';
import { JButton } from '../JButton/JButton';

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


export const Default: Story = {
  args: {
    variant: 'ghost',
    padding: 'none',
    radius: 'none',
    layout: 'box',
    direction: 'column',
    gap: 'none',
  },
  parameters: {
    docs: {
      description: {
        story: 'Playground interactivo. Modificá cualquier prop del panel de controles para ver los cambios en tiempo real.',
      },
      source: {
        code: `<JPanel variant="ghost" layout="box" direction="column" gap="none">
  {items}
</JPanel>`,
      },
    },
  },
  render: (args) => (
    <JPanel className="max-w-sm" {...args}>
      <JButton variant="outline" size="sm">Item 1</JButton>
      <JButton variant="outline" size="sm">Item 2</JButton>
      <JButton variant="outline" size="sm">Item 3</JButton>
    </JPanel>
  ),
};

export const CardPanel: Story = {
  args: {
    variant: 'default',
    padding: 'md',
    radius: 'md',
    gap: 'sm',
    layout: 'box',
    direction: 'column',
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel con superficie visual. Cambiá variant, padding y radius desde los controles.',
      },
      source: {
        code: `<JPanel variant="link" padding="md" radius="md" gap="sm">
  <JLabel as="h3">Titulo</JLabel>
  <JLabel>Contenido</JLabel>
</JPanel>`,
      },
    },
  },
  render: (args) => (
    <JPanel className="max-w-sm" {...args}>
      <JLabel as="h3" size="sm" className="font-semibold">Panel con superficie</JLabel>
      <JLabel size="sm" color="muted">El contenedor visual sale de props, no de una etiqueta HTML directa.</JLabel>
    </JPanel>
  ),
};

export const LayoutDefaults: Story = {
  argTypes: {
    variant: { control: false },
    padding: { control: false },
    radius: { control: false },
    layout: { control: false },
    direction: { control: false },
    gap: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Referencia de todos los layouts y breakpoints disponibles en JPanel. Demo estático.',
      },
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
            <JLabel size="xs" className="font-semibold">{name}</JLabel>
            <JLabel size="xs" color="muted">{value}</JLabel>
          </JPanel>
        ))}
      </JPanel>

      <JPanel layout="grid" gap="sm" mobileLarge={{ columns: 2 }} tablet={{ columns: 2 }} desktop={{ columns: 3 }} tv={{ columns: 4, gap: 'lg' }}>
      {layoutDocs.map(([layoutName, doc]) => (
        <JPanel key={layoutName} variant="outlined" padding="md" radius="md" gap="sm">
          <JLabel as="h3" size="sm" className="font-semibold">{layoutName}</JLabel>
          <JLabel size="sm" color="muted">{doc.behavior}</JLabel>
          <JPanel gap="xs">
            {Object.entries(doc.defaults).map(([name, value]) => (
              <JLabel key={name} size="xs" color="muted">
                {name}: {value}
              </JLabel>
            ))}
          </JPanel>
          <JLabel size="xs" className="font-medium">
            {doc.required.length > 0 ? doc.required.join(' ') : 'No requiere valores obligatorios.'}
          </JLabel>
        </JPanel>
      ))}
      </JPanel>
    </JPanel>
  ),
};

export const BoxResponsive: Story = {
  args: {
    variant: 'outlined',
    padding: 'md',
    radius: 'md',
  },
  argTypes: {
    layout: { control: false },
    direction: { control: false },
    gap: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Layout box que cambia de columna a fila en tablet. Controlá variant, padding y radius.',
      },
      source: {
        code: `<JPanel layout="box" gap="sm" tablet={{ direction: 'row', gap: 'md' }}>
  <JPanel>Uno</JPanel>
  <JPanel>Dos</JPanel>
  <JPanel>Tres</JPanel>
</JPanel>`,
      },
    },
  },
  render: ({ variant, padding, radius }) => (
    <JPanel layout="box" gap="sm" tablet={{ direction: 'row', gap: 'md' }} variant={variant} padding={padding} radius={radius} className="max-w-2xl">
      <JButton variant="outline" size="sm">Uno</JButton>
      <JButton variant="outline" size="sm">Dos</JButton>
      <JButton variant="outline" size="sm">Tres</JButton>
    </JPanel>
  ),
};

export const GridResponsive: Story = {
  args: {
    variant: 'outlined',
    padding: 'md',
    radius: 'md',
  },
  argTypes: {
    layout: { control: false },
    direction: { control: false },
    gap: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Grid responsive con columnas que crecen por breakpoint. Controlá variant, padding y radius.',
      },
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
  render: ({ variant, padding, radius }) => (
    <JPanel
      layout="grid"
      gap="sm"
      mobileLarge={{ columns: 2 }}
      tablet={{ columns: 2, gap: 'md' }}
      desktop={{ columns: 3, gap: 'lg' }}
      tv={{ columns: 6, gap: 'xl' }}
      variant={variant}
      padding={padding}
      radius={radius}
      className="max-w-3xl"
    >
      {['Clientes', 'Ventas', 'Inventario', 'Riesgos', 'Reportes', 'Alertas'].map((item) => (
        <JButton key={item} variant="outline" size="sm">{item}</JButton>
      ))}
    </JPanel>
  ),
};

export const BorderLayout: Story = {
  argTypes: {
    variant: { control: false },
    padding: { control: false },
    radius: { control: false },
    layout: { control: false },
    direction: { control: false },
    gap: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story: `**Mobile**: columna única top → left → center → right → bottom.
**Tablet/Desktop/TV**: 3 columnas — left y right toman su ancho natural, center absorbe todo el espacio restante.
El contenedor necesita altura definida para que center se expanda (usa min-h-* o h-* en el className).`,
      },
      source: {
        code: `<JPanel layout="border" gap="sm" className="min-h-[500px]">
  <JPanel area="top">Header</JPanel>
  <JPanel area="left">Menu</JPanel>
  <JPanel area="center">Contenido principal</JPanel>
  <JPanel area="right">Aside</JPanel>
  <JPanel area="bottom">Footer</JPanel>
</JPanel>`,
      },
    },
  },
  render: () => (
    <JPanel layout="border" gap="sm" variant="outlined" padding="md" radius="md" className="min-h-[500px] max-w-3xl">
      <JPanel area="top" variant="flat" padding="sm" radius="sm" layout="flow" gap="sm">
        <JButton variant="outline" size="sm">Inicio</JButton>
        <JButton variant="outline" size="sm">Servicios</JButton>
        <JButton variant="outline" size="sm">Contacto</JButton>
      </JPanel>

      <JPanel area="left" variant="flat" padding="sm" radius="sm" layout="box" gap="sm">
        <JButton variant="outline" size="sm">Perfil</JButton>
        <JButton variant="outline" size="sm">Config</JButton>
        <JButton variant="outline" size="sm">Ayuda</JButton>
      </JPanel>

      <JPanel area="center" variant="link" padding="md" radius="sm" layout="box" gap="sm">
        <JButton size="sm">Acción principal</JButton>
        <JButton variant="outline" size="sm">Acción secundaria</JButton>
      </JPanel>

      <JPanel area="right" variant="flat" padding="sm" radius="sm" layout="box" gap="sm">
        <JButton variant="outline" size="sm">Filtrar</JButton>
        <JButton variant="outline" size="sm">Exportar</JButton>
      </JPanel>

      <JPanel area="bottom" variant="flat" padding="sm" radius="sm" layout="flow" gap="sm">
        <JButton variant="outline" size="sm">Anterior</JButton>
        <JButton variant="outline" size="sm">Siguiente</JButton>
      </JPanel>
    </JPanel>
  ),
};

export const CardLayout: Story = {
  argTypes: {
    variant: { control: false },
    padding: { control: false },
    radius: { control: false },
    layout: { control: false },
    direction: { control: false },
    gap: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Muestra una sola tarjeta a la vez según activeCard. Demo estático con estado local.',
      },
    },
  },
  render: () => {
    const cards = ['perfil', 'seguridad', 'facturacion'];
    const [activeCard, setActiveCard] = useState(cards[0]);

    return (
      <JPanel gap="sm" className="max-w-md">
        <JPanel layout="flow" gap="sm">
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
        </JPanel>

        <JPanel layout="card" activeCard={activeCard} variant="outlined" padding="md" radius="md">
          <JPanel card="perfil"><JLabel size="sm">Configuracion del perfil.</JLabel></JPanel>
          <JPanel card="seguridad"><JLabel size="sm">Sesiones, permisos y accesos.</JLabel></JPanel>
          <JPanel card="facturacion"><JLabel size="sm">Pagos, comprobantes y suscripciones.</JLabel></JPanel>
        </JPanel>
      </JPanel>
    );
  },
};

export const AdvancedLayouts: Story = {
  argTypes: {
    variant: { control: false },
    padding: { control: false },
    radius: { control: false },
    layout: { control: false },
    direction: { control: false },
    gap: { control: false },
  },
  parameters: {
    docs: {
      description: {
        story: 'Demuestra gridbag (posicion exacta por hijo) y group (spans). Demo estático.',
      },
    },
  },
  render: () => (
    <JPanel gap="lg" className="max-w-3xl">
      <JPanel layout="gridbag" gap="sm" tablet={{ columns: 4 }} variant="outlined" padding="md" radius="md">
        <JPanel gridBagColumn={1} gridBagRow={1} gridBagColumnSpan={2} variant="flat" padding="sm">
          <JButton variant="outline" size="sm" className="w-full">Span 2 columnas</JButton>
        </JPanel>
        <JPanel variant="flat" padding="sm">
          <JButton variant="outline" size="sm" className="w-full">Metric A</JButton>
        </JPanel>
        <JPanel variant="flat" padding="sm">
          <JButton variant="outline" size="sm" className="w-full">Metric B</JButton>
        </JPanel>
        <JPanel gridBagColumn={1} gridBagRow={2} gridBagRowSpan={2} variant="flat" padding="sm">
          <JButton variant="outline" size="sm" className="w-full">Side (2 filas)</JButton>
        </JPanel>
        <JPanel gridBagColumn={2} gridBagRow={2} gridBagColumnSpan={3} variant="flat" padding="sm">
          <JButton variant="outline" size="sm" className="w-full">Content (3 cols)</JButton>
        </JPanel>
      </JPanel>

      <JPanel layout="group" gap="sm" tablet={{ columns: 3 }} variant="outlined" padding="md" radius="md">
        <JButton variant="outline" size="sm">Nombre</JButton>
        <JButton variant="outline" size="sm">Email</JButton>
        <JButton variant="outline" size="sm">Teléfono</JButton>
        <JPanel groupSpan={2} variant="flat" padding="sm">
          <JButton variant="outline" size="sm" className="w-full">Dirección (span 2)</JButton>
        </JPanel>
        <JButton variant="outline" size="sm">Estado</JButton>
      </JPanel>
    </JPanel>
  ),
};
