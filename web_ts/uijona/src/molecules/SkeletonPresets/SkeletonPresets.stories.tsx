import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SkeletonCard, SkeletonUserRow, SkeletonTableRows, SkeletonForm } from './SkeletonPresets';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

const meta: Meta = {
  title: 'Molecules/SkeletonPresets',
  tags: ['autodocs'],
};
export default meta;

export const Card: StoryObj = {
  render: () => <PanelAtom variant="ghost" padding="none" style={{ width: '360px' }}><SkeletonCard /></PanelAtom>,
};

export const UserRow: StoryObj = {
  render: () => <PanelAtom variant="ghost" padding="none" style={{ width: '360px' }}><SkeletonUserRow /></PanelAtom>,
};

export const TableRows: StoryObj = {
  render: () => <PanelAtom variant="ghost" padding="none" style={{ width: '500px' }}><SkeletonTableRows rows={4} /></PanelAtom>,
};

export const Form: StoryObj = {
  render: () => <PanelAtom variant="ghost" padding="none" style={{ width: '360px' }}><SkeletonForm fields={3} /></PanelAtom>,
};

export const Interactive: StoryObj = {
  render: () => {
    const [loaded, setLoaded] = useState(false);
    return (
      <PanelAtom variant="ghost" padding="none" style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loaded ? (
          <PanelAtom variant="ghost" padding="none" style={{ borderRadius: '8px', border: '1px solid #e5e5e5', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <PanelAtom variant="ghost" padding="none" style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#4f46e5' }}>JF</PanelAtom>
              <PanelAtom variant="ghost" padding="none">
                <p style={{ fontWeight: 600, margin: 0, fontSize: '14px' }}>Jonathan Franck</p>
                <p style={{ fontSize: '12px', color: '#a3a3a3', margin: 0 }}>jofrantoba@gmail.com</p>
              </PanelAtom>
            </PanelAtom>
            <p style={{ fontSize: '13px', color: '#525252', margin: 0 }}>Administrador con acceso completo a todos los módulos del sistema.</p>
          </PanelAtom>
        ) : (
          <SkeletonCard />
        )}
        <ButtonAtom variant="outline" onClick={() => setLoaded((l) => !l)}>
          {loaded ? 'Ver skeleton' : 'Simular carga completa'}
        </ButtonAtom>
      </PanelAtom>
    );
  },
};
