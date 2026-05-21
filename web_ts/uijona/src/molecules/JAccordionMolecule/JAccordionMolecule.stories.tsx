import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JAccordionMolecule, JACCORDION_DEFAULTS } from './JAccordionMolecule';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

// ── Sample data ───────────────────────────────────────────────────────────────

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const items = [
  {
    value: 'architecture',
    title: 'Arquitectura JONA',
    content: 'Separa contrato, implementación, vista y template para mantener responsabilidades claras en cada capa del componente.',
  },
  {
    value: 'events',
    title: 'Eventos Observer',
    content: 'Los componentes interactivos exponen callbacks con datos normalizados. El padre recibe siempre el valor procesado, nunca el evento raw.',
  },
  {
    value: 'delivery',
    title: 'Entrega app-ready',
    content: 'Incluye exports públicos, stories documentadas, tests y build verificable. Listo para producción sin configuración adicional.',
  },
];

const itemsWithIcons = items.map((item, i) => ({
  ...item,
  icon: [<StarIcon />, <ShieldIcon />, <ZapIcon />][i],
}));

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof JAccordionMolecule> = {
  title: 'Molecules/JAccordionMolecule',
  component: JAccordionMolecule,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'JAccordionMolecule es la molécula de acordeón de JONA. Soporta modo controlado y no controlado, apertura múltiple simultánea, 3 variantes visuales, 3 tamaños e íconos por ítem. La animación de apertura usa `grid-template-rows` para transición suave sin dependencias externas. Reemplaza a `AccordionMolecule` con mayor flexibilidad visual y mejor API.',
      },
    },
  },
  args: { items, onValueChange: fn() },
  argTypes: {
    items: {
      description: 'Array de ítems del acordeón. Cada ítem tiene `value` (id único), `title`, `content`, y opcionalmente `disabled` e `icon`.',
      table: { type: { summary: 'JAccordionItem[]' } },
    },
    value: {
      description: 'Valor controlado. String para modo `single`, array para modo `multiple`. Combinar con `onValueChange` para modo controlado.',
      control: 'text',
      table: { type: { summary: 'string | string[]' } },
    },
    defaultValue: {
      description: 'Valor inicial en modo no controlado. El componente gestiona su propio estado internamente.',
      control: 'text',
      table: { type: { summary: 'string | string[]' } },
    },
    multiple: {
      description: 'Permite abrir varios ítems simultáneamente. `false` (default) colapsa el ítem abierto al abrir otro.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JACCORDION_DEFAULTS.multiple) },
      },
    },
    variant: {
      description: '`default` contenedor con borde y divisores internos. `bordered` cada ítem es su propia card con borde. `ghost` sin bordes, solo divisores sutiles.',
      control: 'select',
      options: ['default', 'bordered', 'ghost'],
      table: {
        type: { summary: 'JAccordionVariant' },
        defaultValue: { summary: JACCORDION_DEFAULTS.variant },
      },
    },
    size: {
      description: 'Tamaño del padding y tipografía de los triggers. `sm` compacto, `md` estándar (default), `lg` espacioso.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: 'JAccordionSize' },
        defaultValue: { summary: JACCORDION_DEFAULTS.size },
      },
    },
    onValueChange: {
      description: 'Callback al cambiar el ítem abierto. Recibe `string` en modo `single` (value del ítem o vacío al cerrar) o `string[]` en modo `multiple`.',
      table: { type: { summary: '(value: string | string[]) => void' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JAccordionMolecule>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { defaultValue: 'architecture' },
  parameters: {
    docs: {
      description: { story: 'Variante `default` (default): contenedor único con borde y divisores entre ítems. Un solo ítem abierto a la vez.' },
    },
  },
};

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ['architecture', 'events'] },
  parameters: {
    docs: {
      description: { story: '`multiple=true` permite abrir varios ítems simultáneamente. `defaultValue` acepta array de keys.' },
    },
  },
};

export const VariantBordered: Story = {
  name: 'Variant: bordered',
  args: { variant: 'bordered', defaultValue: 'events' },
  parameters: {
    docs: {
      description: { story: '`variant="bordered"` cada ítem es una card independiente con borde y gap entre ellas. Ideal para listas de secciones en dashboards.' },
    },
  },
};

export const VariantGhost: Story = {
  name: 'Variant: ghost',
  args: { variant: 'ghost', defaultValue: 'architecture' },
  parameters: {
    docs: {
      description: { story: '`variant="ghost"` sin borde exterior, solo un divisor sutil entre ítems. Para acordeones integrados en paneles con fondo propio.' },
    },
  },
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 3 tamaños: `sm` compacto para sidebars o listas densas, `md` estándar, `lg` espacioso para secciones principales.' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="lg" className="w-96">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <JPanel layout="box" gap="xs" key={size}>
          <JLabel size="xs" color="muted">{size}</JLabel>
          <JAccordionMolecule items={items.slice(0, 2)} size={size} defaultValue="architecture" />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const WithIcons: Story = {
  args: { items: itemsWithIcons, defaultValue: 'architecture' },
  parameters: {
    docs: {
      description: { story: 'El prop `icon` de cada ítem renderiza un ícono a la izquierda del título. Usar SVGs de tamaño 14-16px para consistencia.' },
    },
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      ...items,
      {
        value: 'disabled',
        title: 'Sección bloqueada',
        content: 'Este contenido no debería abrirse.',
        disabled: true,
      },
    ],
    defaultValue: 'architecture',
  },
  parameters: {
    docs: {
      description: { story: '`item.disabled=true` impide la apertura y aplica estilos de deshabilitado. El ítem no recibe foco ni clicks.' },
    },
  },
};

export const AllVariants: Story = {
  name: 'Todas las variantes',
  parameters: {
    docs: {
      description: { story: 'Comparación de las 3 variantes con los mismos ítems.' },
    },
  },
  render: () => (
    <JPanel layout="box" gap="xl" className="w-96">
      {(['default', 'bordered', 'ghost'] as const).map((variant) => (
        <JPanel layout="box" gap="xs" key={variant}>
          <JLabel size="xs" color="muted">{variant}</JLabel>
          <JAccordionMolecule
            items={items.slice(0, 2)}
            variant={variant}
            defaultValue="architecture"
          />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'FAQ con modo controlado. El padre gestiona `activeKey` y muestra la sección activa debajo. `onValueChange` recibe el `value` del ítem abierto.' },
    },
  },
  args: { onValueChange: fn() },
  render: (args) => {
    const [current, setCurrent] = useState<string>('pregunta-1');
    const faqItems = [
      { value: 'pregunta-1', title: '¿Cómo creo una cuenta?', content: 'Haz clic en "Registrarse" y completa el formulario con tu nombre, correo y contraseña.' },
      { value: 'pregunta-2', title: '¿Cómo funciona la facturación?', content: 'La facturación se realiza mensualmente. Puedes cancelar en cualquier momento desde ajustes.' },
      { value: 'pregunta-3', title: '¿Están seguros mis datos?', content: 'Todos los datos se cifran con AES-256 y cumplimos con el estándar SOC 2 Tipo II.' },
      { value: 'pregunta-4', title: '¿Puedo cambiar de plan?', content: 'Sí, puedes subir o bajar de plan en cualquier momento. Los cambios aplican al siguiente ciclo.' },
    ];
    return (
      <JPanel layout="box" gap="sm" className="w-96">
        <JAccordionMolecule
          items={faqItems}
          value={current}
          onValueChange={(v) => { args.onValueChange?.(v); setCurrent(String(v)); }}
        />
        <JLabel size="xs" color="muted">
          Sección activa: <strong>{current || '(ninguna)'}</strong>
        </JLabel>
      </JPanel>
    );
  },
};
