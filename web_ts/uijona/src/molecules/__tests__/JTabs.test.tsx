import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { within } from '@testing-library/react';
import { JTabs, JTabsList, JTabsTrigger, JTabsContent } from '../JTabs';
import { seriousViolations } from '../../__tests__/quality/axe';

function TestTabs({ onChange }: { onChange?: (v: string) => void }) {
  return (
    <JTabs value="tab1" onChange={onChange}>
      <JTabsList>
        <JTabsTrigger value="tab1">Tab 1</JTabsTrigger>
        <JTabsTrigger value="tab2">Tab 2</JTabsTrigger>
        <JTabsTrigger value="tab3" disabled>Tab 3</JTabsTrigger>
      </JTabsList>
      <JTabsContent value="tab1">Content 1</JTabsContent>
      <JTabsContent value="tab2">Content 2</JTabsContent>
    </JTabs>
  );
}

describe('JTabs', () => {
  it('renders tab triggers', () => {
    render(<TestTabs />);
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
  });

  it('shows active tab content', () => {
    render(<TestTabs />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('calls onChange when a tab is clicked', () => {
    const onChange = vi.fn();
    render(<TestTabs onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('marks active tab with aria-selected', () => {
    render(<TestTabs />);
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'false');
  });

  it('disabled tab is not clickable', () => {
    render(<TestTabs />);
    expect(screen.getByRole('tab', { name: 'Tab 3' })).toBeDisabled();
  });
});

function Counter() {
  const [count, setCount] = useState(0);
  return <button type="button" onClick={() => setCount(count + 1)}>Clics {count}</button>;
}

function KeptTabs({ keepMounted }: { keepMounted?: boolean }) {
  const [value, setValue] = useState('general');
  return (
    <JTabs value={value} onChange={setValue} keepMounted={keepMounted}>
      <JTabsList>
        <JTabsTrigger value="general">General</JTabsTrigger>
        <JTabsTrigger value="direcciones">Direcciones</JTabsTrigger>
      </JTabsList>
      <JTabsContent value="general"><Counter /></JTabsContent>
      <JTabsContent value="direcciones">Contenido de direcciones</JTabsContent>
    </JTabs>
  );
}

describe('JTabs keepMounted (R-CHR-5)', () => {
  it('S-CHR-19: inactive contents stay mounted and hidden, and keep their state', () => {
    render(<KeptTabs keepMounted />);

    const hiddenPanel = screen.getByText('Contenido de direcciones');
    expect(hiddenPanel).toHaveAttribute('hidden');
    expect(hiddenPanel).toHaveAttribute('role', 'tabpanel');

    fireEvent.click(screen.getByRole('button', { name: 'Clics 0' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Direcciones' }));
    expect(screen.getByText('Contenido de direcciones')).not.toHaveAttribute('hidden');
    expect(screen.getByRole('button', { name: 'Clics 1', hidden: true }).closest('[role="tabpanel"]')).toHaveAttribute('hidden');

    fireEvent.click(screen.getByRole('tab', { name: 'General' }));
    expect(screen.getByRole('button', { name: 'Clics 1' })).toBeVisible();
  });

  it('S-CHR-19: without the prop an inactive content is unmounted, as in 1.5.1', () => {
    render(<KeptTabs />);

    expect(screen.queryByText('Contenido de direcciones')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clics 0' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Direcciones' }));
    fireEvent.click(screen.getByRole('tab', { name: 'General' }));
    expect(screen.getByRole('button', { name: 'Clics 0' })).toBeInTheDocument();
  });
});

function IndicatorTabs(props: { invalid?: boolean; invalidLabel?: string; count?: number }) {
  return (
    <JTabs value="general">
      <JTabsList>
        <JTabsTrigger value="general">General</JTabsTrigger>
        <JTabsTrigger value="direcciones" {...props}>Direcciones</JTabsTrigger>
      </JTabsList>
      <JTabsContent value="general">General</JTabsContent>
    </JTabs>
  );
}

describe('JTabsTrigger indicators (R-MD-1 lib contract)', () => {
  it('invalid adds the description "Con errores" and keeps the name', () => {
    render(<IndicatorTabs invalid />);

    const tab = screen.getByRole('tab', { name: 'Direcciones' });
    expect(tab).toHaveAccessibleName('Direcciones');
    expect(tab).toHaveAccessibleDescription('Con errores');
    expect(screen.getByRole('tab', { name: 'General' })).not.toHaveAttribute('aria-describedby');
  });

  it('invalidLabel replaces the description; without invalid there is none', () => {
    const { rerender } = render(<IndicatorTabs invalid invalidLabel="Revise esta pestaña" />);
    expect(screen.getByRole('tab', { name: 'Direcciones' })).toHaveAccessibleDescription('Revise esta pestaña');

    rerender(<IndicatorTabs invalid={false} />);
    expect(screen.getByRole('tab', { name: 'Direcciones' })).not.toHaveAttribute('aria-describedby');
  });

  it('count shows next to the label, outside the name, as the description', () => {
    render(<IndicatorTabs count={3} invalid />);

    const tab = screen.getByRole('tab', { name: 'Direcciones' });
    expect(tab).toHaveAccessibleName('Direcciones');
    expect(within(tab).getByText('3')).toBeVisible();
    expect(tab).toHaveAccessibleDescription('Con errores 3');
  });

  it('a count of 0 still shows', () => {
    render(<IndicatorTabs count={0} />);

    expect(screen.getByRole('tab', { name: 'Direcciones' })).toHaveAccessibleDescription('0');
  });

  it('has no serious axe violations', async () => {
    const { container } = render(<IndicatorTabs invalid count={2} />);

    expect(await seriousViolations(container)).toEqual([]);
  });
});
