import type { Meta, StoryObj } from '@storybook/react';
import { SeparatorAtom } from './SeparatorAtom';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';


const meta: Meta<typeof SeparatorAtom> = {
  title: 'Atoms/SeparatorAtom',
  component: SeparatorAtom,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
  },
};
export default meta;
type Story = StoryObj<typeof SeparatorAtom>;

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  decorators: [(Story) => <JPanel variant="ghost" padding="none" style={{ width: '300px' }}><Story /></JPanel>],
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  decorators: [(Story) => (
    <JPanel variant="ghost" padding="none" style={{ display: 'flex', height: '40px', alignItems: 'center', gap: '8px' }}>
      <JLabel as="span">Izquierda</JLabel>
      <Story />
      <JLabel as="span">Derecha</JLabel>
    </JPanel>
  )],
};

export const Interactive: Story = {
  render: () => {
    const sections = ['Información general', 'Facturación', 'Notificaciones', 'Seguridad'];
    return (
      <JPanel variant="ghost" padding="none" style={{ width: '320px', display: 'flex', flexDirection: 'column' }}>
        {sections.map((section, i) => (
          <JPanel variant="ghost" padding="none" key={section}>
            <JPanel variant="ghost" padding="none" style={{ padding: '12px 0', fontSize: '14px', fontWeight: 500, color: '#404040' }}>
              {section}
            </JPanel>
            {i < sections.length - 1 && <SeparatorAtom />}
          </JPanel>
        ))}
      </JPanel>
    );
  },
};
