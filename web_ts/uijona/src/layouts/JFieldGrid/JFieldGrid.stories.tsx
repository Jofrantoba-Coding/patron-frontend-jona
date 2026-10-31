import type { Meta, StoryObj } from '@storybook/react';
import { JFieldGrid, JFIELDGRID_DEFAULTS } from './JFieldGrid';
import { JField } from '../../molecules/JField';
import { JTextBox } from '../../atoms/JTextBox';
import { JTextArea } from '../../atoms/JTextArea';

const meta: Meta<typeof JFieldGrid> = {
  title: 'Layouts/JFieldGrid',
  component: JFieldGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JFieldGrid dispone los `JField` en 12 columnas desde `md` (768 px). Cada campo toma su `span` (3, 4, 6 o 12; 6 por defecto, es decir 2 columnas). Debajo de `md` todos ocupan las 12 columnas: una sola columna.',
      },
    },
  },
  argTypes: {
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      table: { defaultValue: { summary: JFIELDGRID_DEFAULTS.gap } },
    },
    children: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof JFieldGrid>;

export const RegisterForm: Story = {
  render: (args) => (
    <JFieldGrid {...args}>
      <JField id="codigo" label="Código" required span={3}>
        {(aria) => <JTextBox {...aria} defaultValue="0002" />}
      </JField>
      <JField id="descripcion" label="Descripción" required span={6} error="Ingrese Descripción">
        {(aria) => <JTextBox {...aria} />}
      </JField>
      <JField id="abreviatura" label="Abreviatura" span={3}>
        {(aria) => <JTextBox {...aria} />}
      </JField>
      <JField id="ruc" label="RUC" span={4} description="11 dígitos">
        {(aria) => <JTextBox {...aria} />}
      </JField>
      <JField id="telefono" label="Teléfono" span={4}>
        {(aria) => <JTextBox {...aria} />}
      </JField>
      <JField id="correo" label="Correo" span={4}>
        {(aria) => <JTextBox {...aria} type="email" />}
      </JField>
      <JField id="direccion" label="Dirección" span={6}>
        {(aria) => <JTextBox {...aria} />}
      </JField>
      <JField id="referencia" label="Referencia" span={6}>
        {(aria) => <JTextBox {...aria} />}
      </JField>
      <JField id="observacion" label="Observación" span={12} description="Opcional">
        {(aria) => <JTextArea {...aria} rows={3} />}
      </JField>
    </JFieldGrid>
  ),
};

export const TwoColumns: Story = {
  render: (args) => (
    <JFieldGrid {...args}>
      <JField id="usuario" label="Usuario" required>
        {(aria) => <JTextBox {...aria} />}
      </JField>
      <JField id="clave" label="Clave" required>
        {(aria) => <JTextBox {...aria} type="password" />}
      </JField>
    </JFieldGrid>
  ),
};
