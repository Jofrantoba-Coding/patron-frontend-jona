/**
 * Lib titles use the type scale (R-FND-5; S-FND-15): the JDialog and JDrawer
 * headings carry the section style, so they never render as body text.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { JDialog } from '../JDialog';
import { JDrawer } from '../JDrawer';
import { TEXT_SECTION } from '../../theme/tokenClasses';

describe('lib titles on the type scale (S-FND-15)', () => {
  it('JDialog: the h2 named by the title carries the section style', () => {
    render(<JDialog open title="Cliente" />);

    const heading = screen.getByRole('heading', { level: 2, name: 'Cliente' });
    expect(heading).toHaveClass(...TEXT_SECTION.split(' '));
    expect(heading).not.toHaveClass('text-sm');
  });

  it('JDrawer: the h2 named by the title carries the section style', () => {
    render(<JDrawer open title="Direcciones" onClose={() => undefined} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Direcciones' })).toHaveClass(...TEXT_SECTION.split(' '));
  });
});
