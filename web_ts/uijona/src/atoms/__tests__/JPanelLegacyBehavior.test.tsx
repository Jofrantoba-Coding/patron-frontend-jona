import type React from 'react';
import { render, screen } from '@testing-library/react';
import { JPanel } from '../JPanel';

describe('JPanel', () => {
  it('renders the semantic element passed through as', () => {
    render(
      <JPanel as="section" aria-label="Panel">
        Content
      </JPanel>
    );

    expect(screen.getByLabelText('Panel').tagName).toBe('SECTION');
  });

  it('falls back to div when as is an empty string', () => {
    render(
      <JPanel as={'' as React.ElementType} data-testid="panel">
        Content
      </JPanel>
    );

    expect(screen.getByTestId('panel').tagName).toBe('DIV');
  });

  it('applies flow layout classes with wrapping and gap', () => {
    render(
      <JPanel layout="flow" gap="sm" data-testid="panel">
        Content
      </JPanel>
    );

    const panel = screen.getByTestId('panel');

    expect(panel).toHaveClass('jpanel');
    expect(panel).toHaveAttribute('data-jpanel-layout', 'flow');
    expect(panel.style.getPropertyValue('--jpanel-gap')).toBe('0.5rem');
    expect(panel.style.getPropertyValue('--jpanel-wrap')).toBe('wrap');
  });

  it('keeps box layout columns without wrapping by default', () => {
    render(
      <JPanel layout="box" data-testid="panel">
        Content
      </JPanel>
    );

    const panel = screen.getByTestId('panel');

    expect(panel).toHaveAttribute('data-jpanel-layout', 'box');
    expect(panel.style.getPropertyValue('--jpanel-direction')).toBe('column');
    expect(panel.style.getPropertyValue('--jpanel-wrap')).toBe('nowrap');
  });

  it('keeps box layout columns without wrapping by default', () => {
    render(
      <JPanel layout="box" direction="column" data-testid="panel">
        Content
      </JPanel>
    );

    const panel = screen.getByTestId('panel');

    expect(panel).toHaveAttribute('data-jpanel-layout', 'box');
    expect(panel.style.getPropertyValue('--jpanel-direction')).toBe('column');
    expect(panel.style.getPropertyValue('--jpanel-wrap')).toBe('nowrap');
  });

  it('builds grid templates from numeric and string props', () => {
    render(
      <JPanel layout="grid" columns={3} rows="auto 1fr" data-testid="panel">
        Content
      </JPanel>
    );

    const panel = screen.getByTestId('panel');

    expect(panel).toHaveClass('jpanel');
    expect(panel).toHaveAttribute('data-jpanel-layout', 'grid');
    expect(panel).toHaveAttribute('data-jpanel-placement', 'responsive');
    expect(panel.style.gridTemplateColumns).toBe('');
    expect(panel.style.gridTemplateRows).toBe('');
    expect(panel.style.getPropertyValue('--jpanel-columns')).toBe('repeat(3, minmax(0, 1fr))');
    expect(panel.style.getPropertyValue('--jpanel-rows')).toBe('auto 1fr');
  });

  it('uses responsive grid columns by default', () => {
    render(
      <JPanel layout="grid" data-testid="panel">
        Content
      </JPanel>
    );

    const panel = screen.getByTestId('panel');

    expect(panel).toHaveClass('jpanel');
    expect(panel).toHaveAttribute('data-jpanel-layout', 'grid');
    expect(panel).toHaveAttribute('data-jpanel-placement', 'responsive');
    expect(panel.style.gridTemplateColumns).toBe('');
    expect(panel.style.getPropertyValue('--jpanel-auto-fit-min')).toBe('12rem');
    expect(panel.style.getPropertyValue('--jpanel-columns')).toBe('');
  });

  it('can apply grid templates immediately with fixed placement', () => {
    render(
      <JPanel layout="grid" placement="fixed" columns={2} data-testid="panel">
        Content
      </JPanel>
    );

    const panel = screen.getByTestId('panel');

    expect(panel).toHaveAttribute('data-jpanel-placement', 'fixed');
    expect(panel.style.getPropertyValue('--jpanel-columns')).toBe('repeat(2, minmax(0, 1fr))');
  });

  it('maps border layout children into named grid areas', () => {
    render(
      <JPanel layout="border" data-testid="border-panel">
        <JPanel data-testid="top" data-panel-area="top">
          Top
        </JPanel>
      </JPanel>
    );

    expect(screen.getByTestId('border-panel')).toHaveAttribute('data-jpanel-layout', 'border');
    expect(screen.getByTestId('border-panel')).toHaveAttribute('data-jpanel-tablet-layout', 'border');
    expect(screen.getByTestId('top')).toHaveStyle({ gridArea: 'top' });
  });

  it('shows only the active child in card layout', () => {
    render(
      <JPanel layout="card" activeCard="security">
        <JPanel data-testid="profile" data-panel-card="profile">
          Profile
        </JPanel>
        <JPanel data-testid="security" data-panel-card="security">
          Security
        </JPanel>
      </JPanel>
    );

    expect(screen.getByTestId('profile')).toHaveAttribute('data-jpanel-card-state', 'hidden');
    expect(screen.getByTestId('security')).toHaveAttribute('data-jpanel-card-state', 'active');
  });

  it('supports GridBag constraints with mobile-first placement', () => {
    render(
      <JPanel layout="gridbag" columns={3} data-testid="panel">
        <JPanel data-testid="item" data-gridbag-column="1" data-gridbag-row="2" data-gridbag-column-span="2">
          Item
        </JPanel>
      </JPanel>
    );

    const panel = screen.getByTestId('panel');
    const item = screen.getByTestId('item');

    expect(panel).toHaveAttribute('data-jpanel-layout', 'gridbag');
    expect(panel).toHaveAttribute('data-jpanel-placement', 'responsive');
    expect(panel).toHaveAttribute('data-jpanel-dense', 'true');
    expect(panel.style.getPropertyValue('--jpanel-columns')).toBe('repeat(3, minmax(0, 1fr))');
    expect(item).toHaveAttribute('data-jpanel-gridbag-item');
    expect(item).toHaveAttribute('data-jona-gridbag-item');
    expect(item.style.getPropertyValue('--jpanel-gridbag-column')).toBe('1');
    expect(item.style.getPropertyValue('--jpanel-gridbag-row')).toBe('2');
    expect(item.style.getPropertyValue('--jpanel-gridbag-column-span')).toBe('2');
  });

  it('supports Group constraints from JPanel', () => {
    render(
      <JPanel layout="group" columns={2} mode="parallel" data-testid="panel">
        <JPanel data-testid="item" data-group-span="2">
          Item
        </JPanel>
      </JPanel>
    );

    const panel = screen.getByTestId('panel');
    const item = screen.getByTestId('item');

    expect(panel).toHaveAttribute('data-jpanel-layout', 'group');
    expect(panel).toHaveAttribute('data-jpanel-placement', 'responsive');
    expect(panel).toHaveAttribute('data-jpanel-mode', 'parallel');
    expect(panel.style.getPropertyValue('--jpanel-columns')).toBe('repeat(2, minmax(0, 1fr))');
    expect(item).toHaveAttribute('data-jpanel-group-item');
    expect(item).toHaveAttribute('data-jona-group-item');
    expect(item.style.getPropertyValue('--jpanel-group-span')).toBe('2');
  });

  it('supports Spring constraints without breaking mobile-first defaults', () => {
    render(
      <JPanel layout="spring" minHeight="18rem" data-testid="panel">
        <JPanel data-testid="item" data-spring-left="1rem" data-spring-top="2rem" data-spring-width="10rem">
          Item
        </JPanel>
      </JPanel>
    );

    const panel = screen.getByTestId('panel');
    const item = screen.getByTestId('item');

    expect(panel).toHaveAttribute('data-jpanel-layout', 'spring');
    expect(panel).toHaveAttribute('data-jpanel-placement', 'responsive');
    expect(panel.style.getPropertyValue('--jpanel-spring-min-height')).toBe('18rem');
    expect(item).toHaveAttribute('data-jpanel-spring-item');
    expect(item).toHaveAttribute('data-jona-spring-item');
    expect(item.style.getPropertyValue('--jpanel-spring-left')).toBe('1rem');
    expect(item.style.getPropertyValue('--jpanel-spring-top')).toBe('2rem');
    expect(item.style.getPropertyValue('--jpanel-spring-width')).toBe('10rem');
  });
});
