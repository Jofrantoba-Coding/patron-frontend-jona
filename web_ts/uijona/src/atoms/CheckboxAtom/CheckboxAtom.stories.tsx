import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { CheckboxAtom } from './CheckboxAtom';

const meta: Meta<typeof CheckboxAtom> = {
  title: 'Atoms/CheckboxAtom',
  component: CheckboxAtom,
  tags: ['autodocs'],
  args: { onCheckedChange: fn() },
  argTypes: {
    checked:  { control: 'boolean' },
    hasError: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof CheckboxAtom>;

export const Default: Story = {
  args: { checked: false },
};

export const Checked: Story = {
  args: { checked: true },
};

export const WithError: Story = {
  args: { checked: false, hasError: true },
};

export const Disabled: Story = {
  args: { disabled: true, checked: false },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};
