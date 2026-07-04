import type { Meta, StoryObj } from '@storybook/angular';
import { JButton } from '../public-api';

const meta: Meta<JButton> = {
  title: 'Atoms/JButton',
  component: JButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'destructive', 'secondary', 'link', 'accent'],
    },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'icon'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: { variant: 'default', size: 'md', disabled: false, loading: false, fullWidth: false },
  render: (args) => ({
    props: args,
    template: `<j-button [variant]="variant" [size]="size" [disabled]="disabled"
      [loading]="loading" [fullWidth]="fullWidth">Guardar cambios</j-button>`,
  }),
};
export default meta;
type Story = StoryObj<JButton>;

export const Default: Story = {};
export const Accent: Story = { args: { variant: 'accent' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Destructive: Story = { args: { variant: 'destructive' } };
export const Loading: Story = { args: { loading: true } };

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:.5rem; flex-wrap:wrap; align-items:center">
        <j-button variant="default">Default</j-button>
        <j-button variant="accent">Accent</j-button>
        <j-button variant="outline">Outline</j-button>
        <j-button variant="ghost">Ghost</j-button>
        <j-button variant="secondary">Secondary</j-button>
        <j-button variant="destructive">Destructive</j-button>
        <j-button variant="link">Link</j-button>
      </div>`,
  }),
};

export const WithIcon: Story = {
  render: () => ({
    template: `
      <j-button variant="accent">
        <svg jIcon viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5v14" />
        </svg>
        Nuevo
      </j-button>`,
  }),
};
