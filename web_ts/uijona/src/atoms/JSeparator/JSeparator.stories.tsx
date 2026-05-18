import type { Meta, StoryObj } from '@storybook/react';
import { JSeparator } from './JSeparator';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JSeparator> = {
  title: 'Atoms/JSeparator',
  component: JSeparator,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
};
export default meta;
type Story = StoryObj<typeof JSeparator>;

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  decorators: [(S) => <JPanel variant="ghost" padding="none" style={{ width: 300 }}><S /></JPanel>],
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  decorators: [(S) => (
    <JPanel variant="ghost" padding="none" style={{ display: 'flex', height: 40, alignItems: 'center', gap: 8 }}>
      <JLabel as="span">Izquierda</JLabel>
      <S />
      <JLabel as="span">Derecha</JLabel>
    </JPanel>
  )],
};

export const Interactive: Story = {
  render: () => {
    const sections = ['Información general', 'Facturación', 'Notificaciones', 'Seguridad'];
    return (
      <JPanel variant="ghost" padding="none" style={{ width: 320, display: 'flex', flexDirection: 'column' }}>
        {sections.map((section, i) => (
          <JPanel variant="ghost" padding="none" key={section}>
            <JPanel variant="ghost" padding="none" style={{ padding: '12px 0', fontSize: 14, fontWeight: 500, color: '#404040' }}>
              {section}
            </JPanel>
            {i < sections.length - 1 && <JSeparator />}
          </JPanel>
        ))}
      </JPanel>
    );
  },
};

export const InNav: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="flex items-center gap-3 h-8">
      <JLabel as="span" size="sm">Inicio</JLabel>
      <JSeparator orientation="vertical" />
      <JLabel as="span" size="sm">Productos</JLabel>
      <JSeparator orientation="vertical" />
      <JLabel as="span" size="sm">Contacto</JLabel>
    </JPanel>
  ),
};
