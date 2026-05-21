import type { Meta, StoryObj } from '@storybook/react';
import { JLabel } from './JLabel';
import { JLABEL_DEFAULTS, JLABEL_VARIANTS, JLABEL_SIZES, JLABEL_COLORS } from './InterJLabel';

const meta: Meta<typeof JLabel> = {
  title: 'Atoms/JLabel',
  component: JLabel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'JLabel es el atom de texto unificado de JONA. Reemplaza TextAtom, LabelAtom, LinkAtom, ErrorMessageAtom y DescriptionAtom en una sola interfaz. El elemento HTML se infiere del `variant` salvo que se pase `as` explícitamente. Los variantes `error` y `description` no renderizan nada si no tienen contenido.',
      },
    },
  },
  argTypes: {
    variant: {
      description: 'Semántica visual. Determina el elemento HTML por defecto y los estilos aplicados. `body`→p, `heading`→inferido del `as`, `label`→label, `link`→a, `error`→span con role="alert", `description`→span.',
      control: 'select',
      options: Object.keys(JLABEL_VARIANTS),
      table: {
        type: { summary: 'JLabelVariant' },
        defaultValue: { summary: JLABEL_DEFAULTS.variant },
      },
    },
    size: {
      description: 'Tamaño de la fuente. Independiente del variant. `base` es el tamaño por defecto del cuerpo.',
      control: 'select',
      options: Object.keys(JLABEL_SIZES),
      table: {
        type: { summary: 'JLabelSize' },
        defaultValue: { summary: 'base (hereda del variant)' },
      },
    },
    color: {
      description: 'Color del texto. Independiente del variant. `default` hereda el color del variant activo.',
      control: 'select',
      options: Object.keys(JLABEL_COLORS),
      table: {
        type: { summary: 'JLabelColor' },
        defaultValue: { summary: JLABEL_DEFAULTS.color },
      },
    },
    as: {
      description: 'Elemento HTML a renderizar. Sobreescribe la inferencia del `variant`. Usar `as="h1"` con `variant="heading"` para títulos semánticos.',
      control: 'select',
      options: ['p', 'span', 'div', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label', 'a'],
      table: { type: { summary: 'JLabelAs' } },
    },
    truncate: {
      description: 'Trunca el texto con puntos suspensivos en una línea. El contenedor padre debe tener ancho definido.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JLABEL_DEFAULTS.truncate) },
      },
    },
    required: {
      description: 'Agrega `*` al texto para indicar campo obligatorio. Solo aplica en `variant="label"` o `as="label"`.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JLABEL_DEFAULTS.required) },
      },
    },
    disabled: {
      description: 'Aplica estilos de texto deshabilitado (opacidad reducida). Útil para sincronizar con el estado del control asociado.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JLABEL_DEFAULTS.disabled) },
      },
    },
    htmlFor: {
      description: 'Asocia el label a un control de formulario por id. Solo aplica en `variant="label"` o `as="label"`.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    href: {
      description: 'URL del enlace. Solo aplica en variantes `link-*` o `as="a"`.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    target: {
      description: 'Target del enlace. Usar `_blank` para abrir en nueva pestaña (incluir `rel="noopener noreferrer"`).',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    message: {
      description: 'Alternativa a `children` para variantes `error` y `description`. Si se pasa junto con children, los children tienen precedencia.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    children: {
      description: 'Contenido del label.',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof JLabel>;

export const Body: Story = {
  args: { variant: 'body', children: 'Texto de cuerpo normal.' },
  parameters: {
    docs: {
      description: { story: 'Variante por defecto. Renderiza un `<p>`. Usar para párrafos y texto descriptivo general.' },
    },
  },
};

export const BodySizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 6 tamaños disponibles de `xs` (12px) a `2xl` (24px). Aplicables a cualquier variant.' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      {(['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const).map(s => (
        <JLabel key={s} variant="body" size={s}>{s} — El rápido zorro marrón</JLabel>
      ))}
    </div>
  ),
};

export const BodyColors: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 6 colores semánticos. `default` hereda del variant, `muted` para texto secundario, `danger` para estados críticos.' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      {(['default', 'muted', 'primary', 'danger', 'success', 'warning'] as const).map(c => (
        <JLabel key={c} variant="body" color={c}>{c} — Texto de ejemplo</JLabel>
      ))}
    </div>
  ),
};

export const Headings: Story = {
  parameters: {
    docs: {
      description: { story: 'Títulos semánticos h1–h6. Usar `variant="heading"` con `as="h1"` a `as="h6"`. El tamaño de fuente debe ajustarse manualmente con `size`.' },
    },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((tag, i) => {
        const sizes = ['2xl', 'xl', 'lg', 'base', 'sm', 'xs'] as const;
        return (
          <JLabel key={tag} variant="heading" as={tag} size={sizes[i]}>
            {tag.toUpperCase()} — Título de ejemplo
          </JLabel>
        );
      })}
    </div>
  ),
};

export const LabelBasic: Story = {
  args: { variant: 'label', htmlFor: 'email', children: 'Correo electrónico' },
  parameters: {
    docs: {
      description: { story: 'Etiqueta de formulario. Renderiza `<label>`. Siempre incluir `htmlFor` apuntando al `id` del control.' },
    },
  },
};

export const LabelRequired: Story = {
  args: { variant: 'label', htmlFor: 'name', required: true, children: 'Nombre completo' },
  parameters: {
    docs: {
      description: { story: '`required=true` agrega `*` al texto. La validación real del formulario debe manejarse a nivel del input.' },
    },
  },
};

export const LabelDisabled: Story = {
  args: { variant: 'label', htmlFor: 'pwd', disabled: true, children: 'Contraseña' },
  parameters: {
    docs: {
      description: { story: '`disabled=true` reduce la opacidad. Usar cuando el control asociado también está deshabilitado.' },
    },
  },
};

export const LinkDefault: Story = {
  args: { variant: 'link', href: '#', children: 'Enlace primario' },
  parameters: {
    docs: {
      description: { story: 'Enlace primario con subrayado al hover. Renderiza `<a>`.' },
    },
  },
};

export const LinkMuted: Story = {
  args: { variant: 'link-muted', href: '#', children: 'Enlace neutro' },
  parameters: {
    docs: {
      description: { story: 'Enlace de menor jerarquía en color neutro. Para links secundarios o de navegación de apoyo.' },
    },
  },
};

export const LinkButton: Story = {
  args: { variant: 'link-button', href: '#', children: 'Enlace botón' },
  parameters: {
    docs: {
      description: { story: 'Enlace con apariencia de botón primario. Útil cuando el destino debe parecer una acción pero navega a otra URL.' },
    },
  },
};

export const LinkDanger: Story = {
  args: { variant: 'link-danger', href: '#', children: 'Eliminar cuenta' },
  parameters: {
    docs: {
      description: { story: 'Enlace destructivo en rojo. Para acciones irreversibles como eliminar cuenta o cerrar sesión permanentemente.' },
    },
  },
};

export const LinkDisabled: Story = {
  args: { variant: 'link', href: '#', disabled: true, children: 'Enlace deshabilitado' },
  parameters: {
    docs: {
      description: { story: 'Estado deshabilitado: opacidad reducida y cursor `not-allowed`. El evento click no se dispara.' },
    },
  },
};

export const LinkExternal: Story = {
  args: { variant: 'link', href: 'https://example.com', target: '_blank', children: 'Abre en nueva pestaña' },
  parameters: {
    docs: {
      description: { story: 'Para links externos con `target="_blank"`. Incluir `rel="noopener noreferrer"` en producción por seguridad.' },
    },
  },
};

export const ErrorWithChildren: Story = {
  args: { variant: 'error', children: 'Este campo es obligatorio.' },
  parameters: {
    docs: {
      description: { story: 'Mensaje de error con `role="alert"`. Se renderiza en rojo. Siempre asociar al control via `aria-describedby`.' },
    },
  },
};

export const ErrorWithMessage: Story = {
  args: { variant: 'error', message: 'Formato de correo inválido.' },
  parameters: {
    docs: {
      description: { story: 'Alternativa usando la prop `message` en lugar de `children`. Útil cuando el mensaje viene de una variable.' },
    },
  },
};

export const ErrorEmpty: Story = {
  name: 'Error — vacío (render null)',
  parameters: {
    docs: {
      description: { story: 'Sin `children` ni `message`, `variant="error"` no renderiza nada. Ideal para mostrar/ocultar errores condicionalmente sin cambiar el layout.' },
    },
  },
  render: () => (
    <div>
      <p className="text-sm text-neutral-500 mb-2">El JLabel error vacío no renderiza nada:</p>
      <div className="border border-dashed border-neutral-300 p-2 min-h-8">
        <JLabel variant="error" />
      </div>
    </div>
  ),
};

export const DescriptionBasic: Story = {
  args: { variant: 'description', children: 'Texto auxiliar descriptivo en gris.' },
  parameters: {
    docs: {
      description: { story: 'Texto auxiliar de apoyo, por ejemplo debajo de un campo de formulario para aclarar el formato esperado.' },
    },
  },
};

export const DescriptionEmpty: Story = {
  name: 'Description — vacía (render null)',
  parameters: {
    docs: {
      description: { story: 'Sin contenido, `variant="description"` no renderiza nada. Mismo patrón que `error`: permite pasar undefined sin efectos visuales.' },
    },
  },
  render: () => (
    <div>
      <p className="text-sm text-neutral-500 mb-2">El JLabel description vacío no renderiza nada:</p>
      <div className="border border-dashed border-neutral-300 p-2 min-h-8">
        <JLabel variant="description" />
      </div>
    </div>
  ),
};

export const Truncate: Story = {
  parameters: {
    docs: {
      description: { story: '`truncate=true` aplica `text-overflow: ellipsis`. El contenedor padre debe tener un ancho máximo definido para que el truncamiento tenga efecto.' },
    },
  },
  render: () => (
    <div className="w-64">
      <JLabel variant="body" truncate>
        Este texto muy largo debería truncarse con puntos suspensivos al final de la línea.
      </JLabel>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    variant:  'body',
    size:     'base',
    color:    'default',
    children: 'Texto configurable',
    truncate: false,
    required: false,
    disabled: false,
  },
  parameters: {
    docs: {
      description: { story: 'Playground interactivo. Modificá cualquier prop desde los controles para explorar combinaciones.' },
    },
  },
};
