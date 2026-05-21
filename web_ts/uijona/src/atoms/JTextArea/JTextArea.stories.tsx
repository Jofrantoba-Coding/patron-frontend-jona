import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JTextArea, JTEXTAREA_DEFAULTS } from './JTextArea';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JTextArea> = {
  title: 'Atoms/JTextArea',
  component: JTextArea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'JTextArea es el atom de área de texto multilínea de JONA. Envuelve `<textarea>` con soporte para auto-resize, 4 modos de resize manual, 2 variantes visuales y 3 tamaños. Los eventos siguen el patrón JONA: `onChange(value, event)` y `onBlur(value, event)` con el valor primero.',
      },
    },
  },
  args: { onChange: fn(), onBlur: fn(), onFocus: fn(), onKeyDown: fn() },
  argTypes: {
    size: {
      description: 'Tamaño visual del campo. `sm`=pequeño (min-h 60px), `md`=mediano (min-h 80px, default), `lg`=grande (min-h 100px).',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: 'JTextAreaSize' },
        defaultValue: { summary: JTEXTAREA_DEFAULTS.size },
      },
    },
    variant: {
      description: 'Estilo visual. `default` fondo blanco con borde neutral, `filled` fondo neutro claro con borde suave.',
      control: 'select',
      options: ['default', 'filled'],
      table: {
        type: { summary: 'JTextAreaVariant' },
        defaultValue: { summary: JTEXTAREA_DEFAULTS.variant },
      },
    },
    resize: {
      description: 'Control de redimensionamiento manual por el usuario. `none` deshabilita el resize, `vertical` solo altura, `horizontal` solo ancho, `both` en ambos ejes.',
      control: 'inline-radio',
      options: ['none', 'vertical', 'horizontal', 'both'],
      table: {
        type: { summary: 'JTextAreaResize' },
        defaultValue: { summary: JTEXTAREA_DEFAULTS.resize },
      },
    },
    hasError: {
      description: 'Estado de error. Cambia el color del borde a rojo. Combinar con `JLabel variant="error"` debajo para el mensaje descriptivo.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JTEXTAREA_DEFAULTS.hasError) },
      },
    },
    autoResize: {
      description: 'Ajusta la altura automáticamente al contenido mientras se escribe. Combinar con `resize="none"` para evitar el handle manual.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JTEXTAREA_DEFAULTS.autoResize) },
      },
    },
    disabled: {
      description: 'Bloquea toda edición y aplica estilos deshabilitados.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JTEXTAREA_DEFAULTS.disabled) },
      },
    },
    placeholder: {
      description: 'Texto de marcador cuando el campo está vacío.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    rows: {
      description: 'Número de filas visibles inicial. Sobreescribe el `min-height` del `size` si `autoResize=false`.',
      control: 'number',
      table: { type: { summary: 'number' } },
    },
    maxLength: {
      description: 'Longitud máxima permitida. El navegador rechaza caracteres adicionales. Para mostrar contador, manejar desde el padre.',
      control: 'number',
      table: { type: { summary: 'number' } },
    },
    onChange: {
      description: 'Callback al cambiar el valor. Patrón JONA: primer argumento es el `value` (string), segundo es el evento nativo.',
      table: { type: { summary: '(value: string, event: ChangeEvent) => void' } },
    },
    onBlur: {
      description: 'Callback al perder el foco. Patrón JONA: primer argumento es el `value` actual.',
      table: { type: { summary: '(value: string, event: FocusEvent) => void' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JTextArea>;

export const Default: Story = {
  args: { placeholder: 'Describe el caso de uso' },
  parameters: {
    docs: {
      description: { story: 'Playground interactivo. Modificá cualquier prop desde los controles.' },
    },
  },
};

export const WithValue: Story = {
  args: { defaultValue: 'Texto inicial para revisar el alto, el foco y los estados del campo.' },
  parameters: {
    docs: {
      description: { story: 'Campo con valor inicial via `defaultValue` (modo no controlado).' },
    },
  },
};

export const WithError: Story = {
  args: { hasError: true, defaultValue: 'Contenido con error' },
  parameters: {
    docs: {
      description: { story: '`hasError=true` aplica borde rojo. Siempre acompañar con un mensaje de error visible para el usuario.' },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Campo deshabilitado' },
  parameters: {
    docs: {
      description: { story: '`disabled=true` bloquea toda interacción y aplica opacidad reducida.' },
    },
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: { story: 'Comparación visual de las 2 variantes. `default` para formularios estándar, `filled` sobre fondos blancos donde el borde sería redundante.' },
    },
  },
  render: () => (
    <JPanel gap="md" className="w-72">
      {(['default', 'filled'] as const).map((v) => (
        <JPanel key={v} gap="xs">
          <JLabel size="xs" color="muted">{v}</JLabel>
          <JTextArea variant={v} placeholder={`Variante ${v}`} />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Tres tamaños que determinan la altura mínima y el tamaño de fuente. `md` es el default.' },
    },
  },
  render: () => (
    <JPanel gap="md" className="w-72">
      {(['sm', 'md', 'lg'] as const).map((s) => (
        <JPanel key={s} gap="xs">
          <JLabel size="xs" color="muted">{s}</JLabel>
          <JTextArea size={s} placeholder={`Tamaño ${s}`} />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const AutoResize: Story = {
  args: {
    autoResize: true,
    resize: 'none',
    defaultValue: 'Este textarea ajusta su altura al contenido.\nAgrega más líneas para probar el comportamiento.',
  },
  parameters: {
    docs: {
      description: { story: '`autoResize=true` expande el textarea según el contenido. Combinar con `resize="none"` para ocultar el handle manual.' },
    },
  },
};

export const ResizeModes: Story = {
  parameters: {
    docs: {
      description: { story: 'Comparación de los 4 modos de resize manual. `both` es el default del navegador. Usar `none` cuando el alto es fijo o se usa `autoResize`.' },
    },
  },
  render: () => (
    <JPanel gap="md" className="w-72">
      {(['none', 'vertical', 'horizontal', 'both'] as const).map((r) => (
        <JPanel key={r} gap="xs">
          <JLabel size="xs" color="muted">resize: {r}</JLabel>
          <JTextArea resize={r} defaultValue={`resize="${r}"`} rows={2} />
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Contador de caracteres en tiempo real. `onChange` recibe el `value` primero (patrón JONA). El estado de error se calcula en el padre.' },
      source: {
        code: `const [value, setValue] = useState('');
const max = 200;

<JTextArea
  placeholder="Escribe tu mensaje..."
  value={value}
  autoResize
  hasError={value.length > max}
  onChange={(v) => setValue(v)}
/>`,
      },
    },
  },
  render: (args) => {
    const [value, setValue] = useState('');
    const max = 200;
    const over = value.length > max;
    return (
      <JPanel gap="xs" className="w-80">
        <JTextArea
          placeholder="Escribe tu mensaje..."
          value={value}
          autoResize
          resize="none"
          hasError={over}
          onChange={(v, e) => { args.onChange?.(v, e); setValue(v); }}
          onBlur={args.onBlur}
          onFocus={args.onFocus}
        />
        <JLabel size="xs" className={`text-right ${over ? 'text-danger-500' : 'text-neutral-400'}`}>
          {value.length}/{max}
        </JLabel>
        {over && <JLabel size="xs" color="danger">Has superado el límite de {max} caracteres</JLabel>}
      </JPanel>
    );
  },
};
