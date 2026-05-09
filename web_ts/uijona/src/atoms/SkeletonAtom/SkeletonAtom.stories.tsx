import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonAtom } from './SkeletonAtom';

const meta: Meta<typeof SkeletonAtom> = {
  title: 'Atoms/SkeletonAtom',
  component: SkeletonAtom,
  tags: ['autodocs'],
  argTypes: {
    circle: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof SkeletonAtom>;

export const Line: Story = {
  args: { className: 'h-4 w-48' },
};

export const Circle: Story = {
  args: { circle: true, className: 'h-10 w-10' },
};

export const CardSkeleton: Story = {
  render: () => (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <SkeletonAtom circle className="h-10 w-10" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <SkeletonAtom className="h-4 w-32" />
          <SkeletonAtom className="h-3 w-24" />
        </div>
      </div>
      <SkeletonAtom className="h-4 w-full" />
      <SkeletonAtom className="h-4 w-4/5" />
      <SkeletonAtom className="h-4 w-3/5" />
    </div>
  ),
};
