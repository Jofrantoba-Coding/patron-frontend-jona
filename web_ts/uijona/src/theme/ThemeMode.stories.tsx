import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import { cn } from '../lib/cn';
import { JonaThemeModeProvider, useThemeMode, type JonaThemeMode } from './ThemeMode';
import {
  FG,
  FG_MUTED,
  FOCUS_RING,
  LINE,
  LINE_STRONG,
  SELECTION,
  SURFACE,
  SURFACE_MUTED,
  SURFACE_RAISED,
  TEXT_BODY,
  TEXT_CAPTION,
  TEXT_PAGE,
  TEXT_SECTION,
} from './tokenClasses';

const OPTIONS: { value: JonaThemeMode; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
];

/** Leaves the Storybook iframe as it found it when the story unmounts. */
const ResetRootOnUnmount: React.FC = () => {
  useEffect(
    () => () => {
      document.documentElement.removeAttribute('data-theme-mode');
      document.documentElement.removeAttribute('data-theme');
    },
    [],
  );
  return null;
};

const Sample: React.FC = () => {
  const { mode, resolved, setMode } = useThemeMode();
  return (
    <div className={cn('min-h-screen p-6', SURFACE, FG, TEXT_BODY)}>
      <h1 className={TEXT_PAGE}>Modo de tema</h1>
      <p className={FG_MUTED}>
        Elección: {mode} · Resuelto: {resolved}
      </p>
      <fieldset className={cn('mt-4 flex flex-row gap-4 rounded-md border p-3', LINE)}>
        <legend className={cn('px-1', TEXT_CAPTION, FG_MUTED)}>Tema</legend>
        {OPTIONS.map((option) => (
          <label key={option.value} className="flex flex-row items-center gap-2">
            <input
              type="radio"
              name="jona-theme-mode"
              checked={mode === option.value}
              onChange={() => setMode(option.value)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
      <section className={cn('mt-6 rounded-lg border p-4', LINE, SURFACE_RAISED)}>
        <h2 className={TEXT_SECTION}>Superficies</h2>
        <div className={cn('mt-3 rounded-md p-3', SURFACE_MUTED)}>surface-muted con texto fg-muted: <span className={FG_MUTED}>Descripción</span></div>
        <div className={cn('mt-2 rounded-md border-l-[3px] border-l-primary-600 p-3', SELECTION)}>Fila seleccionada (selection)</div>
        <button type="button" className={cn('mt-3 rounded-md border px-3 py-2 focus-visible:outline-none focus-visible:ring-2', LINE_STRONG, FOCUS_RING)}>
          Control con borde line-strong y anillo focus
        </button>
      </section>
    </div>
  );
};

const meta: Meta<typeof JonaThemeModeProvider> = {
  title: 'Theme/Theme mode',
  component: JonaThemeModeProvider,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <JonaThemeModeProvider {...args}>
      <ResetRootOnUnmount />
      <Sample />
    </JonaThemeModeProvider>
  ),
};
export default meta;

type Story = StoryObj<typeof JonaThemeModeProvider>;

export const Interactive: Story = { args: { defaultMode: 'system', storageKey: 'jona-theme-mode-story' } };
export const Light: Story = { args: { defaultMode: 'light', storageKey: 'jona-theme-mode-story-light' } };
export const Dark: Story = { args: { defaultMode: 'dark', storageKey: 'jona-theme-mode-story-dark' } };
