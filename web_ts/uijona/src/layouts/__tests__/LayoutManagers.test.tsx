import { render, screen } from '@testing-library/react';
import { PanelAtom } from '../../atoms/PanelAtom';
import { BoxLayout } from '../BoxLayout';
import { CardLayout } from '../CardLayout';
import { FlowLayout } from '../FlowLayout';
import { GridLayout } from '../GridLayout';

describe('layout manager components', () => {
  it('renders FlowLayout with wrapping flow classes', () => {
    render(
      <FlowLayout gap="sm" data-testid="flow">
        <span>One</span>
      </FlowLayout>
    );

    expect(screen.getByTestId('flow')).toHaveClass('flex', 'flex-row', 'flex-wrap', 'gap-2');
  });

  it('renders BoxLayout with configurable direction', () => {
    render(
      <BoxLayout direction="column" gap="xs" data-testid="box">
        <span>One</span>
      </BoxLayout>
    );

    expect(screen.getByTestId('box')).toHaveClass('flex', 'flex-col', 'flex-nowrap', 'gap-1');
  });

  it('wraps BoxLayout rows by default for narrow containers', () => {
    render(
      <BoxLayout data-testid="box-row">
        <span>One</span>
        <span>Two</span>
      </BoxLayout>
    );

    expect(screen.getByTestId('box-row')).toHaveClass('flex', 'flex-row', 'flex-wrap');
  });

  it('renders GridLayout with column templates', () => {
    render(
      <GridLayout columns={2} data-testid="grid">
        <span>One</span>
      </GridLayout>
    );

    expect(screen.getByTestId('grid')).toHaveClass('grid');
    expect(screen.getByTestId('grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    });
  });

  it('uses responsive auto-fit columns by default in GridLayout', () => {
    render(
      <GridLayout data-testid="responsive-grid">
        <span>One</span>
      </GridLayout>
    );

    expect(screen.getByTestId('responsive-grid')).toHaveStyle({
      gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
    });
  });

  it('renders CardLayout showing only the active card', () => {
    render(
      <CardLayout activeCard="second" data-testid="cards">
        <PanelAtom data-testid="first" data-panel-card="first">
          First
        </PanelAtom>
        <PanelAtom data-testid="second" data-panel-card="second">
          Second
        </PanelAtom>
      </CardLayout>
    );

    expect(screen.getByTestId('cards')).toHaveClass('w-full', 'max-w-full', 'min-w-0');
    expect(screen.getByTestId('first')).toHaveStyle({ display: 'none' });
    expect(screen.getByTestId('second')).not.toHaveStyle({ display: 'none' });
    expect(screen.getByTestId('second')).toHaveStyle({
      width: '100%',
      maxWidth: '100%',
      minWidth: '0',
    });
  });
});
