import type React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { JPanel, JPANEL_BREAKPOINTS, JPANEL_LAYOUT_DEFAULTS } from '../JPanel';

describe('JPanel', () => {
  it('renders as a neutral mobile-first vertical panel by default', () => {
    render(<JPanel data-testid="panel">Content</JPanel>);

    const panel = screen.getByTestId('panel');

    expect(panel).toHaveClass('jpanel', 'bg-transparent', 'p-0', 'rounded-none');
    expect(panel).toHaveAttribute('data-jpanel-layout', 'box');
    expect(panel.style.getPropertyValue('--jpanel-direction')).toBe('column');
    expect(panel.style.getPropertyValue('--jpanel-gap')).toBe('0');
  });

  it('exports the default contract for every layout', () => {
    expect(JPANEL_BREAKPOINTS).toEqual({
      mobileSmall: '0px',
      mobileLarge: '480px',
      tablet: '640px',
      desktop: '1024px',
      tv: '1920px',
    });
    expect(JPANEL_LAYOUT_DEFAULTS.box.defaults.direction).toBe('column');
    expect(JPANEL_LAYOUT_DEFAULTS.grid.defaults.autoFitMin).toBe('12rem');
    expect(JPANEL_LAYOUT_DEFAULTS.border.required[0]).toContain('area');
    expect(JPANEL_LAYOUT_DEFAULTS.card.required[0]).toContain('activeCard');
    expect(JPANEL_LAYOUT_DEFAULTS.spring.required[0]).toContain('spring');
  });

  it('renders the semantic element passed through as', () => {
    render(
      <JPanel as="main" aria-label="Main panel">
        Content
      </JPanel>
    );

    expect(screen.getByLabelText('Main panel').tagName).toBe('MAIN');
  });

  it('falls back to div when as is an empty string', () => {
    render(
      <JPanel as={'' as React.ElementType} data-testid="panel">
        Content
      </JPanel>
    );

    expect(screen.getByTestId('panel').tagName).toBe('DIV');
  });

  it('sets mobile small, mobile large, tablet, desktop and tv overrides without redefining every prop', () => {
    render(
      <JPanel
        data-testid="panel"
        layout="box"
        gap="sm"
        mobileSmall={{ gap: 'xs' }}
        mobileLarge={{ direction: 'row', gap: 'sm' }}
        tablet={{ layout: 'grid', columns: 2, gap: 'md' }}
        desktop={{ columns: 4, gap: 'lg' }}
        tv={{ columns: 6, gap: 'xl' }}
      >
        Content
      </JPanel>
    );

    const panel = screen.getByTestId('panel');

    expect(panel).toHaveAttribute('data-jpanel-layout', 'box');
    expect(panel).toHaveAttribute('data-jpanel-mobile-small-layout', 'box');
    expect(panel).toHaveAttribute('data-jpanel-mobile-large-layout', 'box');
    expect(panel).toHaveAttribute('data-jpanel-tablet-layout', 'grid');
    expect(panel).toHaveAttribute('data-jpanel-desktop-layout', 'grid');
    expect(panel).toHaveAttribute('data-jpanel-tv-layout', 'grid');
    expect(panel.style.getPropertyValue('--jpanel-gap')).toBe('0.25rem');
    expect(panel.style.getPropertyValue('--jpanel-mobile-large-direction')).toBe('row');
    expect(panel.style.getPropertyValue('--jpanel-mobile-large-gap')).toBe('0.5rem');
    expect(panel.style.getPropertyValue('--jpanel-tablet-columns')).toBe('repeat(2, minmax(0, 1fr))');
    expect(panel.style.getPropertyValue('--jpanel-tablet-gap')).toBe('1rem');
    expect(panel.style.getPropertyValue('--jpanel-desktop-columns')).toBe('repeat(4, minmax(0, 1fr))');
    expect(panel.style.getPropertyValue('--jpanel-desktop-gap')).toBe('1.5rem');
    expect(panel.style.getPropertyValue('--jpanel-tv-columns')).toBe('repeat(6, minmax(0, 1fr))');
    expect(panel.style.getPropertyValue('--jpanel-tv-gap')).toBe('2rem');
  });

  it('supports border layout with the area prop', () => {
    render(
      <JPanel layout="border" data-testid="panel">
        <JPanel area="top" data-testid="top">Top</JPanel>
        <JPanel area="center" data-testid="center">Center</JPanel>
      </JPanel>
    );

    expect(screen.getByTestId('panel')).toHaveAttribute('data-jpanel-layout', 'border');
    expect(screen.getByTestId('top')).toHaveAttribute('data-panel-area', 'top');
    expect(screen.getByTestId('top')).toHaveStyle({ gridArea: 'top' });
    expect(screen.getByTestId('center')).toHaveStyle({ gridArea: 'center' });
  });

  it('supports card layout with the card prop', () => {
    render(
      <JPanel layout="card" activeCard="security">
        <JPanel card="profile" data-testid="profile">Profile</JPanel>
        <JPanel card="security" data-testid="security">Security</JPanel>
      </JPanel>
    );

    expect(screen.getByTestId('profile')).toHaveAttribute('data-jpanel-card-state', 'hidden');
    expect(screen.getByTestId('security')).toHaveAttribute('data-jpanel-card-state', 'active');
  });

  it('supports GridBag, Group and Spring layout constraint props', () => {
    render(
      <JPanel layout="gridbag" tablet={{ columns: 4 }} data-testid="gridbag">
        <JPanel gridBagColumn={1} gridBagRow={2} gridBagColumnSpan={3} data-testid="gridbag-item">A</JPanel>
      </JPanel>
    );

    const gridbag = screen.getByTestId('gridbag');
    const item = screen.getByTestId('gridbag-item');

    expect(gridbag).toHaveAttribute('data-jpanel-layout', 'gridbag');
    expect(gridbag.style.getPropertyValue('--jpanel-tablet-columns')).toBe('repeat(4, minmax(0, 1fr))');
    expect(item).toHaveAttribute('data-jpanel-gridbag-item');
    expect(item.style.getPropertyValue('--jpanel-gridbag-column')).toBe('1');
    expect(item.style.getPropertyValue('--jpanel-gridbag-row')).toBe('2');
    expect(item.style.getPropertyValue('--jpanel-gridbag-column-span')).toBe('3');

    render(
      <JPanel layout="group" data-testid="group">
        <JPanel groupSpan={2} data-testid="group-item">B</JPanel>
      </JPanel>
    );

    expect(screen.getByTestId('group-item')).toHaveAttribute('data-jpanel-group-item');
    expect(screen.getByTestId('group-item').style.getPropertyValue('--jpanel-group-span')).toBe('2');

    render(
      <JPanel layout="spring" data-testid="spring">
        <JPanel springLeft="1rem" springTop="2rem" springWidth="10rem" data-testid="spring-item">C</JPanel>
      </JPanel>
    );

    expect(screen.getByTestId('spring-item')).toHaveAttribute('data-jpanel-spring-item');
    expect(screen.getByTestId('spring-item').style.getPropertyValue('--jpanel-spring-left')).toBe('1rem');
    expect(screen.getByTestId('spring-item').style.getPropertyValue('--jpanel-spring-top')).toBe('2rem');
    expect(screen.getByTestId('spring-item').style.getPropertyValue('--jpanel-spring-width')).toBe('10rem');
  });

  it('logs missing mandatory metadata for layouts that need it', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    try {
      render(
        <JPanel layout="border">
          <JPanel>Missing area</JPanel>
        </JPanel>
      );

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('layout="border" necesita'));

      logSpy.mockClear();

      render(
        <JPanel layout="card" activeCard="billing">
          <JPanel card="profile">Profile</JPanel>
        </JPanel>
      );

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('activeCard="billing"'));

      logSpy.mockClear();

      render(
        <JPanel layout="spring">
          <JPanel>Missing spring constraints</JPanel>
        </JPanel>
      );

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('layout="spring" necesita'));
    } finally {
      logSpy.mockRestore();
    }
  });
});
