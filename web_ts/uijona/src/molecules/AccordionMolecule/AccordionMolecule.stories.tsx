import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { AccordionMolecule } from './AccordionMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

const items = [
  {
    value: 'architecture',
    title: 'Arquitectura JONA',
    content: 'Separa contrato, implementacion, vista y template para mantener responsabilidades claras.',
  },
  {
    value: 'events',
    title: 'Eventos Observer',
    content: 'Los componentes interactivos exponen callbacks con datos normalizados y el evento original.',
  },
  {
    value: 'delivery',
    title: 'Entrega app-ready',
    content: 'Incluye exports publicos, stories, tests y build verificable.',
  },
];

const meta: Meta<typeof AccordionMolecule> = {
  title: 'Molecules/AccordionMolecule',
  component: AccordionMolecule,
  tags: ['autodocs'],
  args: { items, onValueChange: fn() },
  argTypes: {
    multiple: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof AccordionMolecule>;

export const Default: Story = {
  args: {
    defaultValue: 'architecture',
  },
};

export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ['architecture', 'events'],
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      ...items,
      {
        value: 'disabled',
        title: 'Seccion bloqueada',
        content: 'Este contenido no deberia abrirse.',
        disabled: true,
      },
    ],
  },
};

export const Interactive: Story = {
  args: {
    onValueChange: fn(),
  },
  render: (args) => {
    const [current, setCurrent] = useState<string>('pregunta-1');
    const faqItems = [
      { value: 'pregunta-1', title: '¿Cómo creo una cuenta?', content: 'Haz clic en "Registrarse" y completa el formulario con tu nombre, correo y contraseña.' },
      { value: 'pregunta-2', title: '¿Cómo funciona la facturación?', content: 'La facturación se realiza mensualmente. Puedes cancelar en cualquier momento desde ajustes.' },
      { value: 'pregunta-3', title: '¿Están seguros mis datos?', content: 'Todos los datos se cifran con AES-256 y cumplimos con el estándar SOC 2 Tipo II.' },
      { value: 'pregunta-4', title: '¿Puedo cambiar de plan?', content: 'Sí, puedes subir o bajar de plan en cualquier momento. Los cambios aplican al siguiente ciclo.' },
    ];
    return (
      <PanelAtom variant="ghost" padding="none" className="w-96 flex flex-col gap-2">
        <AccordionMolecule
          items={faqItems}
          defaultValue={current}
          onValueChange={(v) => { args.onValueChange?.(v); setCurrent(String(v)); }}
        />
        <p className="text-xs text-neutral-400">Última sección abierta: <strong>{current}</strong></p>
      </PanelAtom>
    );
  },
};
