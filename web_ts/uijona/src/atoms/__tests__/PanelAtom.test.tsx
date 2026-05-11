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
});
