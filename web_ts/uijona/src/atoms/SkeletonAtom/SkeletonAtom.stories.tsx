import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
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

export const Interactive: Story = {
  render: () => {
    const [loaded, setLoaded] = useState(false);
    return (
      <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loaded ? (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', border: '1px solid #e5e5e5', borderRadius: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#4f46e5', fontSize: '14px' }}>JF</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '14px', margin: 0 }}>Jonathan Franck</p>
              <p style={{ fontSize: '12px', color: '#a3a3a3', margin: 0 }}>jofrantoba@gmail.com</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', border: '1px solid #e5e5e5', borderRadius: '8px' }}>
            <SkeletonAtom circle className="h-10 w-10" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <SkeletonAtom className="h-4 w-32" />
              <SkeletonAtom className="h-3 w-48" />
            </div>
          </div>
        )}
        <button
          onClick={() => setLoaded((l) => !l)}
          style={{ borderRadius: '6px', border: '1px solid #d4d4d4', padding: '6px 12px', fontSize: '14px', cursor: 'pointer' }}
        >
          {loaded ? 'Mostrar skeleton' : 'Simular carga completa'}
        </button>
      </div>
    );
  },
};
