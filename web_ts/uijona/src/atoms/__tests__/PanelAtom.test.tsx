import type React from 'react';
import { render, screen } from '@testing-library/react';
import { PanelAtom } from '../PanelAtom';

describe('PanelAtom', () => {
  it('renders the semantic element passed through as', () => {
    render(
      <PanelAtom as="section" aria-label="Panel">
        Content
      </PanelAtom>
    );

    expect(screen.getByLabelText('Panel').tagName).toBe('SECTION');
  });

  it('falls back to div when as is an empty string', () => {
    render(
      <PanelAtom as={'' as React.ElementType} data-testid="panel">
        Content
      </PanelAtom>
    );

    expect(screen.getByTestId('panel').tagName).toBe('DIV');
  });

  it('applies flow layout classes with wrapping and gap', () => {
    render(
      <PanelAtom layout="flow" gap="sm" data-testid="panel">
        Content
      </PanelAtom>
    );

    expect(screen.getByTestId('panel')).toHaveClass('flex', 'flex-row', 'flex-wrap', 'gap-2', 'w-full', 'max-w-full');
  });

  it('wraps box layout rows by default', () => {
    render(
      <PanelAtom layout="box" data-testid="panel">
        Content
      </PanelAtom>
    );

    expect(screen.getByTestId('panel')).toHaveClass('flex', 'flex-row', 'flex-wrap', 'w-full', 'max-w-full');
  });

  it('keeps box layout columns without wrapping by default', () => {
    render(
      <PanelAtom layout="box" direction="column" data-testid="panel">
        Content
      </PanelAtom>
    );

    expect(screen.getByTestId('panel')).toHaveClass('flex', 'flex-col', 'flex-nowrap', 'w-full', 'max-w-full');
  });

  it('builds grid templates from numeric and string props', () => {
    render(
      <PanelAtom layout="grid" columns={3} rows="auto 1fr" data-testid="panel">
        Content
      </PanelAtom>
    );

    expect(screen.getByTestId('panel')).toHaveStyle({
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gridTemplateRows: 'auto 1fr',
    });
  });

  it('uses responsive grid columns by default', () => {
    render(
      <PanelAtom layout="grid" data-testid="panel">
        Content
      </PanelAtom>
    );

    expect(screen.getByTestId('panel')).toHaveClass('grid', 'w-full', 'max-w-full');
    expect(screen.getByTestId('panel')).toHaveStyle({
      gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
    });
  });

  it('maps border layout children into named grid areas', () => {
    render(
      <PanelAtom layout="border" data-testid="border-panel">
        <PanelAtom data-testid="top" data-panel-area="top">
          Top
        </PanelAtom>
      </PanelAtom>
    );

    expect(screen.getByTestId('border-panel').className).toContain("[grid-template-areas:'top'_'left'_'center'_'right'_'bottom']");
    expect(screen.getByTestId('border-panel').className).toContain('[grid-template-rows:auto_auto_auto_auto_auto]');
    expect(screen.getByTestId('border-panel').className).toContain("md:[grid-template-areas:'top_top_top'_'left_center_right'_'bottom_bottom_bottom']");
    expect(screen.getByTestId('border-panel').className).toContain('md:[grid-template-rows:auto_minmax(0,1fr)_auto]');
    expect(screen.getByTestId('border-panel')).toHaveClass('w-full', 'max-w-full');
    expect(screen.getByTestId('top')).toHaveStyle({ gridArea: 'top' });
  });

  it('shows only the active child in card layout', () => {
    render(
      <PanelAtom layout="card" activeCard="security">
        <PanelAtom data-testid="profile" data-panel-card="profile">
          Profile
        </PanelAtom>
        <PanelAtom data-testid="security" data-panel-card="security">
          Security
        </PanelAtom>
      </PanelAtom>
    );

    expect(screen.getByTestId('profile')).toHaveStyle({ display: 'none' });
    expect(screen.getByTestId('security')).not.toHaveStyle({ display: 'none' });
  });

  it('supports GridBag constraints with mobile-first placement', () => {
    render(
      <PanelAtom layout="gridbag" columns={3} data-testid="panel">
        <PanelAtom data-testid="item" data-gridbag-column="1" data-gridbag-row="2" data-gridbag-column-span="2">
          Item
        </PanelAtom>
      </PanelAtom>
    );

    const panel = screen.getByTestId('panel');
    const item = screen.getByTestId('item');

    expect(panel).toHaveClass('jona-layout-mobile-grid', 'jona-gridbag');
    expect(panel).toHaveAttribute('data-jona-layout-placement', 'responsive');
    expect(panel).toHaveAttribute('data-jona-layout-dense', 'true');
    expect(panel.style.getPropertyValue('--jona-layout-columns')).toBe('repeat(3, minmax(0, 1fr))');
    expect(item).toHaveAttribute('data-jona-gridbag-item');
    expect(item.style.getPropertyValue('--jona-gridbag-column')).toBe('1');
    expect(item.style.getPropertyValue('--jona-gridbag-row')).toBe('2');
    expect(item.style.getPropertyValue('--jona-gridbag-column-span')).toBe('2');
  });

  it('supports Group constraints from PanelAtom', () => {
    render(
      <PanelAtom layout="group" columns={2} mode="parallel" data-testid="panel">
        <PanelAtom data-testid="item" data-group-span="2">
          Item
        </PanelAtom>
      </PanelAtom>
    );

    const panel = screen.getByTestId('panel');
    const item = screen.getByTestId('item');

    expect(panel).toHaveClass('jona-layout-mobile-grid', 'jona-group-layout', 'justify-items-stretch');
    expect(panel).toHaveAttribute('data-jona-layout-placement', 'responsive');
    expect(panel).toHaveAttribute('data-jona-layout-mode', 'parallel');
    expect(panel.style.getPropertyValue('--jona-layout-columns')).toBe('repeat(2, minmax(0, 1fr))');
    expect(item).toHaveAttribute('data-jona-group-item');
    expect(item.style.getPropertyValue('--jona-group-span')).toBe('2');
  });

  it('supports Spring constraints without breaking mobile-first defaults', () => {
    render(
      <PanelAtom layout="spring" minHeight="18rem" data-testid="panel">
        <PanelAtom data-testid="item" data-spring-left="1rem" data-spring-top="2rem" data-spring-width="10rem">
          Item
        </PanelAtom>
      </PanelAtom>
    );

    const panel = screen.getByTestId('panel');
    const item = screen.getByTestId('item');

    expect(panel).toHaveClass('jona-spring-layout');
    expect(panel).toHaveAttribute('data-jona-layout-placement', 'responsive');
    expect(panel.style.getPropertyValue('--jona-spring-min-height')).toBe('18rem');
    expect(item).toHaveAttribute('data-jona-spring-item');
    expect(item.style.getPropertyValue('--jona-spring-left')).toBe('1rem');
    expect(item.style.getPropertyValue('--jona-spring-top')).toBe('2rem');
    expect(item.style.getPropertyValue('--jona-spring-width')).toBe('10rem');
  });
});
