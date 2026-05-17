import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SkeletonCard, SkeletonUserRow, SkeletonTableRows, SkeletonForm } from './SkeletonPresets';
import { JButton } from '../../atoms/JButton/JButton';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { TextAtom } from '../../atoms/TextAtom/TextAtom';

const meta: Meta = {
  title: 'Molecules/SkeletonPresets',
  tags: ['autodocs'],
};
export default meta;

export const Card: StoryObj = {
  render: () => <JPanel variant="ghost" padding="none" style={{ width: '360px' }}><SkeletonCard /></JPanel>,
};

export const UserRow: StoryObj = {
  render: () => <JPanel variant="ghost" padding="none" style={{ width: '360px' }}><SkeletonUserRow /></JPanel>,
};

export const TableRows: StoryObj = {
  render: () => <JPanel variant="ghost" padding="none" style={{ width: '500px' }}><SkeletonTableRows rows={4} /></JPanel>,
};

export const Form: StoryObj = {
  render: () => <JPanel variant="ghost" padding="none" style={{ width: '360px' }}><SkeletonForm fields={3} /></JPanel>,
};

export const Interactive: StoryObj = {
  render: () => {
    const [loaded, setLoaded] = useState(false);
    return (
      <JPanel variant="ghost" padding="none" style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loaded ? (
          <JPanel variant="ghost" padding="none" style={{ borderRadius: '8px', border: '1px solid #e5e5e5', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <JPanel variant="ghost" padding="none" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <JPanel variant="ghost" padding="none" style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#4f46e5' }}>JF</JPanel>
              <JPanel variant="ghost" padding="none">
                <TextAtom size="sm" className="font-semibold">Jonathan Franck</TextAtom>
                <TextAtom size="xs" className="text-neutral-400">jofrantoba@gmail.com</TextAtom>
              </JPanel>
            </JPanel>
            <TextAtom size="sm" className="text-neutral-600">Administrador con acceso completo a todos los módulos del sistema.</TextAtom>
          </JPanel>
        ) : (
          <SkeletonCard />
        )}
        <JButton variant="outline" onClick={() => setLoaded((l) => !l)}>
          {loaded ? 'Ver skeleton' : 'Simular carga completa'}
        </JButton>
      </JPanel>
    );
  },
};
