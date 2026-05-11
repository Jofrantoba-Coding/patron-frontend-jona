import type { Meta, StoryObj } from '@storybook/react';
import { SeparatorAtom } from './SeparatorAtom';
import { PanelAtom } from '../PanelAtom/PanelAtom';


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
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" style={{ width: '300px' }}><Story /></PanelAtom>],
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  decorators: [(Story) => (
    <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', height: '40px', alignItems: 'center', gap: '8px' }}>
      <span>Izquierda</span>
      <Story />
      <span>Derecha</span>
    </PanelAtom>
  )],
};

export const Interactive: Story = {
  render: () => {
    const sections = ['Información general', 'Facturación', 'Notificaciones', 'Seguridad'];
    return (
      <PanelAtom variant="ghost" padding="none" style={{ width: '320px', display: 'flex', flexDirection: 'column' }}>
        {sections.map((section, i) => (
          <PanelAtom variant="ghost" padding="none" key={section}>
            <PanelAtom variant="ghost" padding="none" style={{ padding: '12px 0', fontSize: '14px', fontWeight: 500, color: '#404040' }}>
              {section}
            </PanelAtom>
            {i < sections.length - 1 && <SeparatorAtom />}
          </PanelAtom>
        ))}
      </PanelAtom>
    );
  },
};
