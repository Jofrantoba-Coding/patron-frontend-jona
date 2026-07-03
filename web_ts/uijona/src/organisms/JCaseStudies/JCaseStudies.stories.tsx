import type { Meta, StoryObj } from '@storybook/react';
import { JCaseStudies } from './JCaseStudies';

const meta: Meta<typeof JCaseStudies> = {
  title: 'Organisms/JCaseStudies',
  component: JCaseStudies,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof JCaseStudies>;

export const Default: Story = {
  args: {
    eyebrow: 'Casos de éxito',
    heading: 'Resultados medibles, no presentaciones',
    description: 'Cada proyecto termina con algo tangible y métricas de éxito acordadas antes de empezar.',
    items: [
      {
        sector: 'Retail',
        title: 'ERP + facturación electrónica SUNAT',
        outcome: 'Unificamos facturación, inventario y tesorería en un solo sistema cloud.',
        metrics: [
          { value: '−40%', label: 'tiempo de cierre contable' },
          { value: '100%', label: 'comprobantes certificados' },
        ],
        tags: ['ERP', 'Cloud', 'SUNAT'],
        href: '#',
      },
      {
        sector: 'Fintech',
        title: 'API Management híbrido Zero Trust',
        outcome: 'Gobernamos APIs B2B con OAuth2, mTLS y observabilidad end-to-end.',
        metrics: [
          { value: '99.9%', label: 'SLO de APIs' },
          { value: '−38%', label: 'MTTR de incidentes' },
        ],
        tags: ['APIs', 'Zero Trust', 'Kubernetes'],
        href: '#',
      },
      {
        sector: 'Logística',
        title: 'DRP ciberresiliente y continuidad',
        outcome: 'Backup inmutable, cyber recovery y simulacros DR periódicos.',
        metrics: [
          { value: '15 min', label: 'RTO objetivo' },
          { value: '0', label: 'pérdida de datos crítica' },
        ],
        tags: ['DRP', 'Seguridad', 'SRE'],
        href: '#',
      },
    ],
  },
};
