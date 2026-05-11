import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TimerMolecule } from './TimerMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

const meta: Meta<typeof TimerMolecule> = {
  title: 'Molecules/TimerMolecule',
  component: TimerMolecule,
  tags: ['autodocs'],
  args: {
    label: 'Timer',
    mode: 'countdown',
    durationMs: 300_000,
    tickIntervalMs: 1000,
    controls: true,
    variant: 'card',
    size: 'md',
    tone: 'neutral',
    onChange: fn(),
    onTick: fn(),
    onStart: fn(),
    onPause: fn(),
    onResume: fn(),
    onReset: fn(),
    onComplete: fn(),
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['countdown', 'stopwatch'] },
    variant: { control: 'inline-radio', options: ['plain', 'card', 'inline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'inline-radio', options: ['neutral', 'success', 'warning', 'danger', 'info'] },
    durationMs: { control: { type: 'number', min: 0, step: 1000 } },
    defaultValueMs: { control: { type: 'number', min: 0, step: 1000 } },
    maxMs: { control: { type: 'number', min: 0, step: 1000 } },
    tickIntervalMs: { control: { type: 'number', min: 16, step: 100 } },
  },
  decorators: [(Story) => <PanelAtom variant="ghost" padding="none" className="w-full max-w-sm"><Story /></PanelAtom>],
};

export default meta;
type Story = StoryObj<typeof TimerMolecule>;

export const Countdown: Story = {
  args: {
    label: 'Cuenta regresiva',
    durationMs: 90_000,
    completedLabel: 'Tiempo finalizado',
    tone: 'info',
  },
};

export const Stopwatch: Story = {
  args: {
    mode: 'stopwatch',
    label: 'Cronometro',
    defaultValueMs: 0,
    tickIntervalMs: 250,
    tone: 'success',
  },
};

export const WithMilliseconds: Story = {
  args: {
    mode: 'stopwatch',
    label: 'Alta precision',
    tickIntervalMs: 50,
    showMilliseconds: true,
    showHours: false,
    size: 'lg',
  },
};

export const AutoStartLoop: Story = {
  args: {
    label: 'Pomodoro corto',
    durationMs: 10_000,
    autoStart: true,
    loop: true,
    completedLabel: 'Reiniciando',
    tone: 'warning',
  },
};

export const Inline: Story = {
  args: {
    variant: 'inline',
    mode: 'stopwatch',
    label: undefined,
    size: 'sm',
    showHours: false,
  },
};

export const CustomFormatter: Story = {
  args: {
    mode: 'countdown',
    durationMs: 125_000,
    label: 'Formato custom',
    formatter: ({ minutes, seconds }) => `${minutes} min ${seconds} sec`,
  },
};
