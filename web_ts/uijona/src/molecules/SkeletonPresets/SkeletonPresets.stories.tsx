import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SkeletonCard, SkeletonUserRow, SkeletonTableRows, SkeletonForm } from './SkeletonPresets';

const meta: Meta = {
  title: 'Molecules/SkeletonPresets',
  tags: ['autodocs'],
};
export default meta;

export const Card: StoryObj = {
  render: () => <div style={{ width: '360px' }}><SkeletonCard /></div>,
};

export const UserRow: StoryObj = {
  render: () => <div style={{ width: '360px' }}><SkeletonUserRow /></div>,
};

export const TableRows: StoryObj = {
  render: () => <div style={{ width: '500px' }}><SkeletonTableRows rows={4} /></div>,
};

export const Form: StoryObj = {
  render: () => <div style={{ width: '360px' }}><SkeletonForm fields={3} /></div>,
};

export const Interactive: StoryObj = {
  render: () => {
    const [loaded, setLoaded] = useState(false);
    return (
      <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loaded ? (
          <div style={{ borderRadius: '8px', border: '1px solid #e5e5e5', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#4f46e5' }}>JF</div>
              <div>
                <p style={{ fontWeight: 600, margin: 0, fontSize: '14px' }}>Jonathan Franck</p>
                <p style={{ fontSize: '12px', color: '#a3a3a3', margin: 0 }}>jofrantoba@gmail.com</p>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#525252', margin: 0 }}>Administrador con acceso completo a todos los módulos del sistema.</p>
          </div>
        ) : (
          <SkeletonCard />
        )}
        <button
          onClick={() => setLoaded((l) => !l)}
          style={{ borderRadius: '6px', border: '1px solid #d4d4d4', padding: '6px 12px', fontSize: '14px', cursor: 'pointer' }}
        >
          {loaded ? 'Ver skeleton' : 'Simular carga completa'}
        </button>
      </div>
    );
  },
};
