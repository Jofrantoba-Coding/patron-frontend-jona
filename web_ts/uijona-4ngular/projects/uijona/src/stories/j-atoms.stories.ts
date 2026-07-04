import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  JAvatar,
  JBadge,
  JChip,
  JDot,
  JLabel,
  JProgress,
  JSkeleton,
  JSpinner,
} from '../public-api';

/**
 * Galería de atoms de presentación de uijona-4ngular.
 */
const meta: Meta = {
  title: 'Atoms/Galería',
  decorators: [
    moduleMetadata({
      imports: [JBadge, JLabel, JProgress, JAvatar, JSpinner, JChip, JDot, JSkeleton],
    }),
  ],
};
export default meta;
type Story = StoryObj;

export const Badges: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:.5rem; flex-wrap:wrap">
        <j-badge>Default</j-badge>
        <j-badge variant="secondary">Secondary</j-badge>
        <j-badge variant="destructive">Destructive</j-badge>
        <j-badge variant="outline">Outline</j-badge>
        <j-badge variant="ghost">Ghost</j-badge>
      </div>`,
  }),
};

export const Labels: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:.5rem">
        <j-label variant="heading" as="h3">Encabezado</j-label>
        <j-label>Texto de cuerpo por defecto.</j-label>
        <j-label variant="description">Descripción auxiliar neutra.</j-label>
        <j-label variant="error">Campo requerido.</j-label>
        <j-label variant="link" href="#">Enlace primario</j-label>
      </div>`,
  }),
};

export const Progress: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:1rem; max-width:320px">
        <j-progress [value]="35" [showLabel]="true" />
        <j-progress [value]="70" variant="success" [showLabel]="true" [animated]="true" />
        <div style="display:flex; gap:1rem">
          <j-progress type="circle" [value]="25" [showLabel]="true" />
          <j-progress type="circle" [value]="60" variant="warning" [showLabel]="true" />
          <j-progress type="circle" [value]="90" variant="danger" size="lg" [showLabel]="true" />
        </div>
      </div>`,
  }),
};

export const Avatars: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:.75rem; align-items:center">
        <j-avatar initials="JD" size="xs" />
        <j-avatar initials="JD" size="sm" />
        <j-avatar initials="JD" size="md" />
        <j-avatar initials="AB" size="lg" shape="square" />
        <j-avatar initials="XY" size="xl" />
      </div>`,
  }),
};

export const SpinnersAndDots: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:1rem; align-items:center">
        <j-spinner size="sm" color="primary" />
        <j-spinner size="md" color="primary" />
        <j-spinner size="lg" color="primary" />
        <j-dot tone="success" [pulse]="true" ariaLabel="online" />
        <j-dot tone="warning" />
        <j-dot tone="danger" />
      </div>`,
  }),
};

export const Chips: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:.5rem; flex-wrap:wrap">
        <j-chip>Default</j-chip>
        <j-chip variant="primary">Primary</j-chip>
        <j-chip variant="success">Success</j-chip>
        <j-chip variant="warning" [removable]="true">Removible</j-chip>
        <j-chip variant="danger">Danger</j-chip>
      </div>`,
  }),
};

export const Skeletons: Story = {
  render: () => ({
    template: `
      <div style="display:flex; flex-direction:column; gap:.5rem; max-width:280px">
        <j-skeleton className="h-4 w-1/2" />
        <j-skeleton className="h-4 w-full" />
        <j-skeleton className="h-4 w-3/4" variant="wave" />
        <j-skeleton [circle]="true" className="h-12 w-12" />
      </div>`,
  }),
};
