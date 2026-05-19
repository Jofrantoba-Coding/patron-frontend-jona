import { render, screen } from '@testing-library/react';
import { JPanel } from '../../atoms/JPanel';
import { JBoxLayout } from '../JBoxLayout';
import { JCardLayout } from '../JCardLayout';
import { JFlowLayout } from '../JFlowLayout';
import { JGridBagLayout } from '../JGridBagLayout';
import { JGridLayout } from '../JGridLayout';
import { JGroupLayout } from '../JGroupLayout';
import { JSpringLayout } from '../JSpringLayout';

describe('layout manager components', () => {
  it('renders JFlowLayout with wrapping flow behavior', () => {
    render(
      <JFlowLayout gap="sm" data-testid="flow">
        <span>One</span>
      </JFlowLayout>
    );

    const flow = screen.getByTestId('flow');

    expect(flow).toHaveClass('jpanel', 'w-full', 'max-w-full', 'min-w-0');
    expect(flow).toHaveAttribute('data-jpanel-layout', 'flow');
    expect(flow.style.getPropertyValue('--jpanel-direction')).toBe('row');
    expect(flow.style.getPropertyValue('--jpanel-wrap')).toBe('wrap');
    expect(flow.style.getPropertyValue('--jpanel-gap')).toBe('0.5rem');
  });

  it('renders JBoxLayout with configurable direction', () => {
    render(
      <JBoxLayout direction="column" gap="xs" data-testid="box">
        <span>One</span>
      </JBoxLayout>
    );

    const box = screen.getByTestId('box');

    expect(box).toHaveClass('jpanel', 'w-full', 'max-w-full', 'min-w-0');
    expect(box).toHaveAttribute('data-jpanel-layout', 'box');
    expect(box.style.getPropertyValue('--jpanel-direction')).toBe('column');
    expect(box.style.getPropertyValue('--jpanel-wrap')).toBe('nowrap');
    expect(box.style.getPropertyValue('--jpanel-gap')).toBe('0.25rem');
  });

  it('renders JBoxLayout with column nowrap by default', () => {
    render(
      <JBoxLayout data-testid="box-default">
        <span>One</span>
        <span>Two</span>
      </JBoxLayout>
    );

    const box = screen.getByTestId('box-default');

    expect(box).toHaveAttribute('data-jpanel-layout', 'box');
    expect(box.style.getPropertyValue('--jpanel-direction')).toBe('column');
    expect(box.style.getPropertyValue('--jpanel-wrap')).toBe('nowrap');
  });

  it('renders JGridLayout with column templates', () => {
    render(
      <JGridLayout columns={2} data-testid="grid">
        <span>One</span>
      </JGridLayout>
    );

    expect(screen.getByTestId('grid')).toHaveClass('jpanel', 'w-full', 'max-w-full', 'min-w-0');
    expect(screen.getByTestId('grid')).toHaveAttribute('data-jpanel-layout', 'grid');
    expect(screen.getByTestId('grid')).toHaveAttribute('data-jpanel-placement', 'responsive');
    expect(screen.getByTestId('grid').style.gridTemplateColumns).toBe('');
    expect(screen.getByTestId('grid').style.getPropertyValue('--jpanel-columns')).toBe('repeat(2, minmax(0, 1fr))');
  });

  it('uses responsive auto-fit columns by default in JGridLayout', () => {
    render(
      <JGridLayout data-testid="responsive-grid">
        <span>One</span>
      </JGridLayout>
    );

    expect(screen.getByTestId('responsive-grid')).toHaveClass('jpanel');
    expect(screen.getByTestId('responsive-grid')).toHaveAttribute('data-jpanel-layout', 'grid');
    expect(screen.getByTestId('responsive-grid')).toHaveAttribute('data-jpanel-placement', 'responsive');
    expect(screen.getByTestId('responsive-grid').style.gridTemplateColumns).toBe('');
    expect(screen.getByTestId('responsive-grid').style.getPropertyValue('--jpanel-auto-fit-min')).toBe('12rem');
    expect(screen.getByTestId('responsive-grid').style.getPropertyValue('--jpanel-columns')).toBe('');
  });

  it('renders JCardLayout showing only the active card', () => {
    render(
      <JCardLayout activeCard="second" data-testid="cards">
        <JPanel data-testid="first" data-panel-card="first">
          First
        </JPanel>
        <JPanel data-testid="second" data-panel-card="second">
          Second
        </JPanel>
      </JCardLayout>
    );

    expect(screen.getByTestId('cards')).toHaveClass('w-full', 'max-w-full', 'min-w-0');
    expect(screen.getByTestId('cards')).toHaveAttribute('data-jpanel-layout', 'card');
    expect(screen.getByTestId('first')).toHaveAttribute('data-jpanel-card-state', 'hidden');
    expect(screen.getByTestId('second')).toHaveAttribute('data-jpanel-card-state', 'active');
  });

  it('keeps JGridBagLayout mobile-first while exposing desktop constraints', () => {
    render(
      <JGridBagLayout columns={3} data-testid="gridbag">
        <JPanel
          data-testid="gridbag-item"
          data-gridbag-column="1"
          data-gridbag-row="2"
          data-gridbag-column-span="2"
        >
          Item
        </JPanel>
      </JGridBagLayout>
    );

    const gridbag = screen.getByTestId('gridbag');
    const item = screen.getByTestId('gridbag-item');

    expect(gridbag).toHaveClass('jpanel');
    expect(gridbag).toHaveAttribute('data-jpanel-layout', 'gridbag');
    expect(gridbag).toHaveAttribute('data-jpanel-placement', 'responsive');
    expect(gridbag.style.getPropertyValue('--jpanel-columns')).toBe('repeat(3, minmax(0, 1fr))');
    expect(item).toHaveAttribute('data-jpanel-gridbag-item');
    expect(item).toHaveAttribute('data-jona-gridbag-item');
    expect(item.style.getPropertyValue('--jpanel-gridbag-column')).toBe('1');
    expect(item.style.getPropertyValue('--jpanel-gridbag-row')).toBe('2');
    expect(item.style.getPropertyValue('--jpanel-gridbag-column-span')).toBe('2');
  });

  it('renders JGroupLayout with responsive group spans', () => {
    render(
      <JGroupLayout columns={2} data-testid="group">
        <JPanel data-testid="group-item" data-group-span="2">
          Grouped
        </JPanel>
      </JGroupLayout>
    );

    const group = screen.getByTestId('group');
    const item = screen.getByTestId('group-item');

    expect(group).toHaveClass('jpanel');
    expect(group).toHaveAttribute('data-jpanel-layout', 'group');
    expect(group).toHaveAttribute('data-jpanel-placement', 'responsive');
    expect(group.style.getPropertyValue('--jpanel-columns')).toBe('repeat(2, minmax(0, 1fr))');
    expect(item).toHaveAttribute('data-jpanel-group-item');
    expect(item).toHaveAttribute('data-jona-group-item');
    expect(item.style.getPropertyValue('--jpanel-group-span')).toBe('2');
  });

  it('renders JSpringLayout as a mobile grid before constraints are applied', () => {
    render(
      <JSpringLayout data-testid="spring">
        <JPanel
          data-testid="spring-item"
          data-spring-left="1rem"
          data-spring-top="2rem"
          data-spring-width="10rem"
        >
          Spring
        </JPanel>
      </JSpringLayout>
    );

    const spring = screen.getByTestId('spring');
    const item = screen.getByTestId('spring-item');

    expect(spring).toHaveClass('jpanel');
    expect(spring).toHaveAttribute('data-jpanel-layout', 'spring');
    expect(spring).toHaveAttribute('data-jpanel-placement', 'responsive');
    expect(spring.style.getPropertyValue('--jpanel-spring-min-height')).toBe('16rem');
    expect(item).toHaveAttribute('data-jpanel-spring-item');
    expect(item).toHaveAttribute('data-jona-spring-item');
    expect(item.style.getPropertyValue('--jpanel-spring-left')).toBe('1rem');
    expect(item.style.getPropertyValue('--jpanel-spring-top')).toBe('2rem');
    expect(item.style.getPropertyValue('--jpanel-spring-width')).toBe('10rem');
  });
});
