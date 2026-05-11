import type { Meta, StoryObj } from '@storybook/react';
import { PanelAtom } from './PanelAtom';
import { TextAtom } from '../TextAtom/TextAtom';

const meta: Meta<typeof PanelAtom> = {
  title: 'Atoms/PanelAtom',
  component: PanelAtom,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated', 'flat', 'ghost'],
      description: 'Estilo visual del panel.',
      table: { defaultValue: { summary: 'default' } },
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Espaciado interno del panel.',
      table: { defaultValue: { summary: 'md' } },
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Radio de borde del panel.',
      table: { defaultValue: { summary: 'md' } },
    },
    as: {
      control: 'text',
      description: 'Elemento HTML a renderizar (div, section, article, aside, main…).',
      table: { defaultValue: { summary: 'div' } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PanelAtom>;

const SampleContent = () => (
  <>
    <TextAtom as="h3" size="sm" className="mb-1 font-semibold">Titulo del panel</TextAtom>
    <TextAtom size="sm" color="muted">Contenido de ejemplo dentro del panel. Puede ser cualquier elemento React.</TextAtom>
  </>
);

export const Default: Story = {
  args: { variant: 'default', padding: 'md', radius: 'md' },
  render: (args) => (
    <PanelAtom {...args} className="w-72">
      <SampleContent />
    </PanelAtom>
  ),
};

export const Outlined: Story = {
  args: { variant: 'outlined', padding: 'md', radius: 'md' },
  render: (args) => (
    <PanelAtom {...args} className="w-72">
      <SampleContent />
    </PanelAtom>
  ),
};

export const Elevated: Story = {
  args: { variant: 'elevated', padding: 'md', radius: 'md' },
  render: (args) => (
    <PanelAtom {...args} className="w-72">
      <SampleContent />
    </PanelAtom>
  ),
};

export const Flat: Story = {
  args: { variant: 'flat', padding: 'md', radius: 'md' },
  render: (args) => (
    <PanelAtom {...args} className="w-72">
      <SampleContent />
    </PanelAtom>
  ),
};

export const Ghost: Story = {
  args: { variant: 'ghost', padding: 'md', radius: 'md' },
  render: (args) => (
    <PanelAtom {...args} className="w-72">
      <SampleContent />
    </PanelAtom>
  ),
};

export const PaddingSizes: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-4">
      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((padding) => (
        <PanelAtom key={padding} variant="outlined" padding={padding} className="w-72">
          <TextAtom size="xs" color="muted" className="font-mono">padding="{padding}"</TextAtom>
        </PanelAtom>
      ))}
    </PanelAtom>
  ),
};

export const RadiusSizes: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-4">
      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((radius) => (
        <PanelAtom key={radius} variant="default" radius={radius} className="w-72">
          <TextAtom size="xs" color="muted" className="font-mono">radius="{radius}"</TextAtom>
        </PanelAtom>
      ))}
    </PanelAtom>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-4">
      {(['default', 'outlined', 'elevated', 'flat', 'ghost'] as const).map((variant) => (
        <PanelAtom key={variant} variant={variant} className="w-72">
          <TextAtom size="xs" color="muted" className="font-mono">variant="{variant}"</TextAtom>
        </PanelAtom>
      ))}
    </PanelAtom>
  ),
};

export const AsSemanticElement: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-4 w-80">
      <PanelAtom as="section" variant="outlined" padding="lg">
        <TextAtom as="h2" size="sm" className="mb-1 font-semibold">section</TextAtom>
        <TextAtom size="sm" color="muted">PanelAtom renderizado como &lt;section&gt;</TextAtom>
      </PanelAtom>
      <PanelAtom as="article" variant="elevated" padding="lg">
        <TextAtom as="h2" size="sm" className="mb-1 font-semibold">article</TextAtom>
        <TextAtom size="sm" color="muted">PanelAtom renderizado como &lt;article&gt;</TextAtom>
      </PanelAtom>
      <PanelAtom as="aside" variant="flat" padding="md">
        <TextAtom as="h2" size="sm" className="mb-1 font-semibold">aside</TextAtom>
        <TextAtom size="sm" color="muted">PanelAtom renderizado como &lt;aside&gt;</TextAtom>
      </PanelAtom>
    </PanelAtom>
  ),
};

export const Nested: Story = {
  render: () => (
    <PanelAtom variant="elevated" padding="lg" className="w-96">
      <TextAtom as="h3" size="sm" className="mb-3 font-semibold">Panel externo (elevated)</TextAtom>
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-3">
        <PanelAtom variant="outlined" padding="sm">
          <TextAtom size="xs" color="muted">Panel anidado — outlined</TextAtom>
        </PanelAtom>
        <PanelAtom variant="flat" padding="sm">
          <TextAtom size="xs" color="muted">Panel anidado — flat</TextAtom>
        </PanelAtom>
      </PanelAtom>
    </PanelAtom>
  ),
};
