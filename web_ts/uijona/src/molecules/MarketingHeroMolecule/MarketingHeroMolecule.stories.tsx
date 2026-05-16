import type { Meta, StoryObj } from '@storybook/react';
import { MarketingHeroMolecule } from './MarketingHeroMolecule';

const meta: Meta<typeof MarketingHeroMolecule> = {
  title: 'Molecules/MarketingHeroMolecule',
  component: MarketingHeroMolecule,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof MarketingHeroMolecule>;

const metricsSlot = (
  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
    {[
      { value: '+50', label: 'proyectos' },
      { value: '18', label: 'servicios' },
      { value: '30 min', label: 'diagnóstico' },
    ].map((m) => (
      <div
        key={m.label}
        style={{
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '12px 20px',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{m.value}</p>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>{m.label}</p>
      </div>
    ))}
  </div>
);

export const WithMetrics: Story = {
  args: {
    eyebrow: 'Consultoría tecnológica',
    title: 'De la app al cloud, del dato a la decisión',
    subtitle: 'Ayudamos a empresas peruanas a ordenar, escalar y rentabilizar su tecnología.',
    ctas: [
      { label: 'Agendar diagnóstico gratuito', href: '/contacto', variant: 'primary' },
      { label: 'Ver servicios', href: '#servicios', variant: 'outline' },
    ],
    metrics: metricsSlot,
  },
};

export const WithVisual: Story = {
  args: {
    title: 'Arquitectura de software que escala',
    subtitle: 'Diseñamos sistemas que crecen con tu negocio.',
    ctas: [{ label: 'Empezar ahora', href: '/contacto', variant: 'primary' }],
    visual: (
      <div
        style={{
          width: '400px',
          height: '300px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '14px',
        }}
      >
        Visual slot
      </div>
    ),
  },
};

export const Minimal: Story = {
  args: {
    title: 'Transforma tu tecnología',
    ctas: [{ label: 'Contactar', href: '/contacto', variant: 'primary' }],
  },
};
