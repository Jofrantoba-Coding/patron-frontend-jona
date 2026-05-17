import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SkeletonAtom } from './SkeletonAtom';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { TextAtom } from '../TextAtom/TextAtom';

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
    <JPanel variant="ghost" padding="none" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
      <JPanel variant="ghost" padding="none" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <SkeletonAtom circle className="h-10 w-10" />
        <JPanel variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <SkeletonAtom className="h-4 w-32" />
          <SkeletonAtom className="h-3 w-24" />
        </JPanel>
      </JPanel>
      <SkeletonAtom className="h-4 w-full" />
      <SkeletonAtom className="h-4 w-4/5" />
      <SkeletonAtom className="h-4 w-3/5" />
    </JPanel>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [loaded, setLoaded] = useState(false);
    return (
      <JPanel variant="ghost" padding="none" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loaded ? (
          <JPanel variant="ghost" padding="none" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', border: '1px solid #e5e5e5', borderRadius: '8px' }}>
            <JPanel variant="ghost" padding="none" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#4f46e5', fontSize: '14px' }}>JF</JPanel>
            <JPanel variant="ghost" padding="none">
              <TextAtom size="sm" className="font-semibold">Jonathan Franck</TextAtom>
              <TextAtom size="xs" className="text-neutral-400">jofrantoba@gmail.com</TextAtom>
            </JPanel>
          </JPanel>
        ) : (
          <JPanel variant="ghost" padding="none" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', border: '1px solid #e5e5e5', borderRadius: '8px' }}>
            <SkeletonAtom circle className="h-10 w-10" />
            <JPanel variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <SkeletonAtom className="h-4 w-32" />
              <SkeletonAtom className="h-3 w-48" />
            </JPanel>
          </JPanel>
        )}
        <JButton variant="outline" onClick={() => setLoaded((l) => !l)}>
          {loaded ? 'Mostrar skeleton' : 'Simular carga completa'}
        </JButton>
      </JPanel>
    );
  },
};
