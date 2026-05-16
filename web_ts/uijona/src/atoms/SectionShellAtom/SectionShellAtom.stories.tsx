import type { Meta, StoryObj } from '@storybook/react';
import { SectionShellAtom } from './SectionShellAtom';

const meta: Meta<typeof SectionShellAtom> = {
  title: 'Atoms/SectionShellAtom',
  component: SectionShellAtom,
  tags: ['autodocs'],
  argTypes: {
    maxWidth: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl'] },
    as: { control: 'select', options: ['div', 'section', 'article', 'main'] },
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#f1f5f9', minHeight: '100px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SectionShellAtom>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
        Contenido centrado con max-width xl (1280px) y padding horizontal responsive.
      </div>
    ),
  },
};

export const AsSection: Story = {
  args: {
    as: 'section',
    maxWidth: 'lg',
    children: (
      <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
        Elemento semántico section con max-width lg (1024px).
      </div>
    ),
  },
};

export const MaxWidths: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((w) => (
        <SectionShellAtom key={w} maxWidth={w}>
          <div style={{ background: 'white', padding: '8px 12px', borderRadius: '4px', fontSize: '13px' }}>
            maxWidth="{w}"
          </div>
        </SectionShellAtom>
      ))}
    </div>
  ),
};
