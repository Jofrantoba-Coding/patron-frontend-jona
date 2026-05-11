import { render, screen } from '@testing-library/react';
import { PanelAtom } from '../../atoms/PanelAtom';
import { BoxLayout } from '../BoxLayout';
import { CardLayout } from '../CardLayout';
import { FlowLayout } from '../FlowLayout';
import { GridBagLayout } from '../GridBagLayout';
import { GridLayout } from '../GridLayout';
import { GroupLayout } from '../GroupLayout';
import { SpringLayout } from '../SpringLayout';

describe('layout manager components', () => {
  it('renders FlowLayout with wrapping flow classes', () => {
    render(
      <FlowLayout gap="sm" data-testid="flow">
        <span>One</span>
      </FlowLayout>
    );

    expect(screen.getByTestId('flow')).toHaveClass('flex', 'flex-row', 'flex-wrap', 'gap-2', 'w-full', 'max-w-full', 'min-w-0');
  });

  it('renders BoxLayout with configurable direction', () => {
    render(
      <BoxLayout direction="column" gap="xs" data-testid="box">
        <span>One</span>
      </BoxLayout>
    );

    expect(screen.getByTestId('box')).toHaveClass('flex', 'flex-col', 'flex-nowrap', 'gap-1', 'w-full', 'max-w-full', 'min-w-0');
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
    expect(screen.getByTestId('grid')).toHaveClass('jona-layout-mobile-grid', 'w-full', 'max-w-full', 'min-w-0');
    expect(screen.getByTestId('grid')).toHaveAttribute('data-jona-layout-placement', 'responsive');
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe('');
    expect(screen.getByTestId('grid').style.getPropertyValue('--jona-layout-columns')).toBe('repeat(2, minmax(0, 1fr))');
  });

  it('uses responsive auto-fit columns by default in GridLayout', () => {
    render(
      <GridLayout data-testid="responsive-grid">
        <span>One</span>
      </GridLayout>
    );

    expect(screen.getByTestId('responsive-grid')).toHaveClass('jona-layout-mobile-grid');
    expect(screen.getByTestId('responsive-grid')).toHaveAttribute('data-jona-layout-placement', 'responsive');
    expect(screen.getByTestId('responsive-grid').style.gridTemplateColumns).toBe('');
    expect(screen.getByTestId('responsive-grid').style.getPropertyValue('--jona-layout-min')).toBe('12rem');
    expect(screen.getByTestId('responsive-grid').style.getPropertyValue('--jona-layout-columns')).toBe('');
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

  it('keeps GridBagLayout mobile-first while exposing desktop constraints', () => {
    render(
      <GridBagLayout columns={3} data-testid="gridbag">
        <PanelAtom
          data-testid="gridbag-item"
          data-gridbag-column="1"
          data-gridbag-row="2"
          data-gridbag-column-span="2"
        >
          Item
        </PanelAtom>
      </GridBagLayout>
    );

    const gridbag = screen.getByTestId('gridbag');
    const item = screen.getByTestId('gridbag-item');

    expect(gridbag).toHaveClass('jona-layout-mobile-grid', 'jona-gridbag');
    expect(gridbag).toHaveAttribute('data-jona-layout-placement', 'responsive');
    expect(gridbag.style.getPropertyValue('--jona-layout-columns')).toBe('repeat(3, minmax(0, 1fr))');
    expect(item).toHaveAttribute('data-jona-gridbag-item');
    expect(item.style.getPropertyValue('--jona-gridbag-column')).toBe('1');
    expect(item.style.getPropertyValue('--jona-gridbag-row')).toBe('2');
    expect(item.style.getPropertyValue('--jona-gridbag-column-span')).toBe('2');
  });

  it('renders GroupLayout with responsive group spans', () => {
    render(
      <GroupLayout columns={2} data-testid="group">
        <PanelAtom data-testid="group-item" data-group-span="2">
          Grouped
        </PanelAtom>
      </GroupLayout>
    );

    const group = screen.getByTestId('group');
    const item = screen.getByTestId('group-item');

    expect(group).toHaveClass('jona-layout-mobile-grid', 'jona-group-layout');
    expect(group).toHaveAttribute('data-jona-layout-placement', 'responsive');
    expect(group.style.getPropertyValue('--jona-layout-columns')).toBe('repeat(2, minmax(0, 1fr))');
    expect(item).toHaveAttribute('data-jona-group-item');
    expect(item.style.getPropertyValue('--jona-group-span')).toBe('2');
  });

  it('renders SpringLayout as a mobile grid before constraints are applied', () => {
    render(
      <SpringLayout data-testid="spring">
        <PanelAtom
          data-testid="spring-item"
          data-spring-left="1rem"
          data-spring-top="2rem"
          data-spring-width="10rem"
        >
          Spring
        </PanelAtom>
      </SpringLayout>
    );

    const spring = screen.getByTestId('spring');
    const item = screen.getByTestId('spring-item');

    expect(spring).toHaveClass('jona-spring-layout');
    expect(spring).toHaveAttribute('data-jona-layout-placement', 'responsive');
    expect(spring.style.getPropertyValue('--jona-spring-min-height')).toBe('16rem');
    expect(item).toHaveAttribute('data-jona-spring-item');
    expect(item.style.getPropertyValue('--jona-spring-left')).toBe('1rem');
    expect(item.style.getPropertyValue('--jona-spring-top')).toBe('2rem');
    expect(item.style.getPropertyValue('--jona-spring-width')).toBe('10rem');
  });
});
