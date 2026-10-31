import type { Meta, StoryObj } from '@storybook/react';
import { JFormSection, JFORMSECTION_DEFAULTS } from './JFormSection';
import { JField } from '../JField';
import { JFieldGrid } from '../../layouts/JFieldGrid';
import { JTextBox } from '../../atoms/JTextBox';

const meta: Meta<typeof JFormSection> = {
  title: 'Molecules/JFormSection',
  component: JFormSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JFormSection agrupa campos bajo un título (`role="group"` nombrado por el título, con el estilo de sección). Su `error` es de un conjunto de campos, por ejemplo un rango de fechas, y forma parte de la descripción del grupo.',
      },
    },
  },
  args: { title: 'Período' },
  argTypes: {
    headingLevel: {
      control: 'inline-radio',
      options: [2, 3, 4],
      table: { defaultValue: { summary: String(JFORMSECTION_DEFAULTS.headingLevel) } },
    },
    children: { control: false },
  },
  render: (args) => (
    <JFormSection {...args}>
      <JFieldGrid>
        <JField id="desde" label="Desde" required>{(aria) => <JTextBox {...aria} defaultValue="01/01/2026" />}</JField>
        <JField id="hasta" label="Hasta" required>{(aria) => <JTextBox {...aria} defaultValue="31/12/2025" />}</JField>
      </JFieldGrid>
    </JFormSection>
  ),
};
export default meta;
type Story = StoryObj<typeof JFormSection>;

export const Default: Story = {
  args: { description: 'Rango de fechas del reporte' },
};

export const WithGroupError: Story = {
  args: { description: 'Rango de fechas del reporte', error: 'La fecha final es menor a la inicial' },
};
