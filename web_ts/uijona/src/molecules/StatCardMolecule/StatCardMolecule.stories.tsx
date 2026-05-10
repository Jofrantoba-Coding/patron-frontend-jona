import type { Meta, StoryObj } from '@storybook/react';
import { StatCardMolecule } from './StatCardMolecule';

const meta: Meta<typeof StatCardMolecule> = {
  title: 'Molecules/StatCardMolecule',
  component: StatCardMolecule,
  tags: ['autodocs'],
  args: {
    label: 'Monthly revenue',
    value: '$42,800',
    trend: 'up',
    trendLabel: '+12.4%',
    description: 'vs last month',
    tone: 'success',
  },
  argTypes: {
    tone:  { control: 'select', options: ['neutral', 'success', 'warning', 'danger', 'info'] },
    trend: { control: 'select', options: ['up', 'down', 'flat'] },
  },
};

export default meta;
type Story = StoryObj<typeof StatCardMolecule>;

export const Default: Story = {};

export const DashboardGrid: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCardMolecule label="Active users" value="18,240" trend="up" trendLabel="+8%" description="this week" tone="success" />
      <StatCardMolecule label="Open tickets" value="128" trend="down" trendLabel="-3%" description="today" tone="info" />
      <StatCardMolecule label="Failed jobs" value="7" trend="up" trendLabel="+2" description="needs review" tone="danger" />
    </div>
  ),
};
