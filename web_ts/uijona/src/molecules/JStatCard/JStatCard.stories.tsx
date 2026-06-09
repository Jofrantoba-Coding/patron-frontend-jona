import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JStatCard } from './JStatCard';
import type { StatCardTone, StatCardTrend } from './InterJStatCard';
import { JButton } from '../../atoms/JButton/JButton';
import { JPanel } from '../../atoms/JPanel/JPanel';

const meta: Meta<typeof JStatCard> = {
  title: 'Molecules/JStatCard',
  component: JStatCard,
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
type Story = StoryObj<typeof JStatCard>;

export const Default: Story = {};

export const DashboardGrid: Story = {
  render: () => (
    <JPanel variant="ghost" padding="none" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <JStatCard label="Active users" value="18,240" trend="up" trendLabel="+8%" description="this week" tone="success" />
      <JStatCard label="Open tickets" value="128" trend="down" trendLabel="-3%" description="today" tone="info" />
      <JStatCard label="Failed jobs" value="7" trend="up" trendLabel="+2" description="needs review" tone="danger" />
    </JPanel>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<{ value: string; trend: StatCardTrend; trendLabel: string; tone: StatCardTone }>({
      value: '$42,800',
      trend: 'up',
      trendLabel: '+12.4%',
      tone: 'success',
    });
    const refresh = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      const newVal = Math.floor(Math.random() * 80000) + 10000;
      const base = 42800;
      const diff = (((newVal - base) / base) * 100).toFixed(1);
      const up = newVal > base;
      setData({
        value: `$${newVal.toLocaleString()}`,
        trend: up ? 'up' : 'down',
        trendLabel: `${up ? '+' : ''}${diff}%`,
        tone: up ? 'success' : 'danger',
      });
      setLoading(false);
    };
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-3 w-64">
        <JStatCard label="Ingresos mensuales" {...data} description="vs mes anterior" />
        <JButton variant="outline" size="sm" disabled={loading} loading={loading} onClick={refresh}>
          {loading ? 'Actualizando...' : 'Actualizar métrica'}
        </JButton>
      </JPanel>
    );
  },
};
