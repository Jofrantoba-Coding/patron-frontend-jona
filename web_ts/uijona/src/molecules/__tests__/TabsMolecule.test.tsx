import { render, screen, fireEvent } from '@testing-library/react';
import { TabsMolecule, TabsList, TabsTrigger, TabsContent } from '../TabsMolecule';

function TestTabs({ onChange }: { onChange?: (v: string) => void }) {
  return (
    <TabsMolecule value="tab1" onChange={onChange}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3" disabled>Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </TabsMolecule>
  );
}

describe('TabsMolecule', () => {
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
