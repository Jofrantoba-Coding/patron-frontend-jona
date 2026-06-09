import type { Meta, StoryObj } from '@storybook/react';
import { JContactSteps } from './JContactSteps';

const meta: Meta<typeof JContactSteps> = {
  title: 'Organisms/JContactSteps',
  component: JContactSteps,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof JContactSteps>;

export const Default: Story = {
  args: {
    eyebrow: 'Qué esperar',
    heading: 'Así empieza la conversación',
    steps: [
      {
        num: '01',
        title: 'Cuéntanos tu situación',
        body: 'En 30 minutos nos describes tu contexto, los problemas que enfrentas y tus objetivos de negocio.',
      },
      {
        num: '02',
        title: 'Diagnóstico sin costo',
        body: 'Evaluamos tu arquitectura actual, identificamos las principales brechas y riesgos, y priorizamos junto a ti.',
      },
      {
        num: '03',
        title: 'Propuesta concreta',
        body: 'Recibes una propuesta con alcance, entregables, equipo y cronograma — sin compromisos previos.',
      },
    ],
  },
};
