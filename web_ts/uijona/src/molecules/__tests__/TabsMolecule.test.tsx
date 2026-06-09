import { render, screen, fireEvent } from '@testing-library/react';
import { JTabs, JTabsList, JTabsTrigger, JTabsContent } from '../JTabs';

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
