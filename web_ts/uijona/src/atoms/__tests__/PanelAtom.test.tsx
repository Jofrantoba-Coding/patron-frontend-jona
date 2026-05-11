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

    expect(screen.getByTestId('panel')).toHaveClass('flex', 'flex-row', 'flex-wrap');
  });

  it('keeps box layout columns without wrapping by default', () => {
    render(
      <PanelAtom layout="box" direction="column" data-testid="panel">
        Content
      </PanelAtom>
    );

    expect(screen.getByTestId('panel')).toHaveClass('flex', 'flex-col', 'flex-nowrap');
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
    expect(screen.getByTestId('border-panel').className).toContain("md:[grid-template-areas:'top_top_top'_'left_center_right'_'bottom_bottom_bottom']");
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
});
