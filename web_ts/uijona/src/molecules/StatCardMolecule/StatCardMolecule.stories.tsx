import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { StatCardMolecule } from './StatCardMolecule';
import type { StatCardTone, StatCardTrend } from './InterStatCardMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

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
    <PanelAtom variant="ghost" padding="none" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCardMolecule label="Active users" value="18,240" trend="up" trendLabel="+8%" description="this week" tone="success" />
      <StatCardMolecule label="Open tickets" value="128" trend="down" trendLabel="-3%" description="today" tone="info" />
      <StatCardMolecule label="Failed jobs" value="7" trend="up" trendLabel="+2" description="needs review" tone="danger" />
    </PanelAtom>
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
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-3 w-64">
        <StatCardMolecule label="Ingresos mensuales" {...data} description="vs mes anterior" />
        <button
          onClick={refresh}
          disabled={loading}
          className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
        >
          {loading ? 'Actualizando...' : 'Actualizar métrica'}
        </button>
      </PanelAtom>
    );
  },
};
