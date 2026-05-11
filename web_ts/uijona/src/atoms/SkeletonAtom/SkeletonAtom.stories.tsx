import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SkeletonAtom } from './SkeletonAtom';
import { ButtonAtom } from '../ButtonAtom/ButtonAtom';
import { PanelAtom } from '../PanelAtom/PanelAtom';

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
    <PanelAtom variant="ghost" padding="none" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
      <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <SkeletonAtom circle className="h-10 w-10" />
        <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <SkeletonAtom className="h-4 w-32" />
          <SkeletonAtom className="h-3 w-24" />
        </PanelAtom>
      </PanelAtom>
      <SkeletonAtom className="h-4 w-full" />
      <SkeletonAtom className="h-4 w-4/5" />
      <SkeletonAtom className="h-4 w-3/5" />
    </PanelAtom>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [loaded, setLoaded] = useState(false);
    return (
      <PanelAtom variant="ghost" padding="none" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loaded ? (
          <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', border: '1px solid #e5e5e5', borderRadius: '8px' }}>
            <PanelAtom variant="ghost" padding="none" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#4f46e5', fontSize: '14px' }}>JF</PanelAtom>
            <PanelAtom variant="ghost" padding="none">
              <p style={{ fontWeight: 600, fontSize: '14px', margin: 0 }}>Jonathan Franck</p>
              <p style={{ fontSize: '12px', color: '#a3a3a3', margin: 0 }}>jofrantoba@gmail.com</p>
            </PanelAtom>
          </PanelAtom>
        ) : (
          <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', border: '1px solid #e5e5e5', borderRadius: '8px' }}>
            <SkeletonAtom circle className="h-10 w-10" />
            <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <SkeletonAtom className="h-4 w-32" />
              <SkeletonAtom className="h-3 w-48" />
            </PanelAtom>
          </PanelAtom>
        )}
        <ButtonAtom variant="outline" onClick={() => setLoaded((l) => !l)}>
          {loaded ? 'Mostrar skeleton' : 'Simular carga completa'}
        </ButtonAtom>
      </PanelAtom>
    );
  },
};
