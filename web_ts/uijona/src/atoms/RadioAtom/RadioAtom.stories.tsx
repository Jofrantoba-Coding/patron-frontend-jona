import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RadioAtom } from './RadioAtom';

const meta: Meta<typeof RadioAtom> = {
  title: 'Atoms/RadioAtom',
  component: RadioAtom,
  tags: ['autodocs'],
  args: { onCheckedChange: fn(), onFocus: fn(), onBlur: fn() },
  argTypes: {
    checked: { control: 'boolean' },
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof RadioAtom>;

export const Default: Story = {
  args: {
    name: 'radio-default',
    value: 'default',
  },
};

export const Checked: Story = {
  args: {
    name: 'radio-checked',
    value: 'checked',
    checked: true,
  },
};

export const Error: Story = {
  args: {
    name: 'radio-error',
    value: 'error',
    hasError: true,
  },
};

export const Disabled: Story = {
  args: {
    name: 'radio-disabled',
    value: 'disabled',
    disabled: true,
  },
};
