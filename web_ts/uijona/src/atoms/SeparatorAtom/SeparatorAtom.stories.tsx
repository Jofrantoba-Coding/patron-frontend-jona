import type { Meta, StoryObj } from '@storybook/react';
import { SeparatorAtom } from './SeparatorAtom';


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
  decorators: [(Story) => <div style={{ width: '300px' }}><Story /></div>],
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  decorators: [(Story) => (
    <div style={{ display: 'flex', height: '40px', alignItems: 'center', gap: '8px' }}>
      <span>Izquierda</span>
      <Story />
      <span>Derecha</span>
    </div>
  )],
};

export const Interactive: Story = {
  render: () => {
    const sections = ['Información general', 'Facturación', 'Notificaciones', 'Seguridad'];
    return (
      <div style={{ width: '320px', display: 'flex', flexDirection: 'column' }}>
        {sections.map((section, i) => (
          <div key={section}>
            <div style={{ padding: '12px 0', fontSize: '14px', fontWeight: 500, color: '#404040' }}>
              {section}
            </div>
            {i < sections.length - 1 && <SeparatorAtom />}
          </div>
        ))}
      </div>
    );
  },
};
