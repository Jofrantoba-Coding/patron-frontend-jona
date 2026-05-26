import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInputMolecule } from '../SearchInputMolecule';
import { NumberInputMolecule } from '../NumberInputMolecule';
import { JFileUpload } from '../JFileUpload';
import { StatCardMolecule } from '../StatCardMolecule';
import { StepperMolecule } from '../StepperMolecule';

describe('Priority 4 app molecules', () => {
  it('SearchInputMolecule emits search and clear events', () => {
    const onSearch = vi.fn();
    const onClear = vi.fn();
    render(<SearchInputMolecule defaultValue="orders" onSearch={onSearch} onClear={onClear} />);

    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('orders', expect.any(Object));

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('NumberInputMolecule increments, decrements and clamps values', () => {
    const onValueChange = vi.fn();
    render(<NumberInputMolecule defaultValue={1} min={0} max={2} onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
    expect(onValueChange).toHaveBeenCalledWith(2, expect.any(Object));

    fireEvent.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(onValueChange).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('JFileUpload reports selected files and supports removal', () => {
    const onFilesChange = vi.fn();
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    render(<JFileUpload label="Upload" onFilesChange={onFilesChange} />);

    const input = screen.getByLabelText('Upload') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFilesChange).toHaveBeenLastCalledWith([file]);

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onFilesChange).toHaveBeenLastCalledWith([]);
  });

  it('StatCardMolecule renders metric content', () => {
    render(<StatCardMolecule label="Revenue" value="$1,200" trendLabel="+4%" description="this week" />);

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,200')).toBeInTheDocument();
    expect(screen.getByText('+4%')).toBeInTheDocument();
  });

  it('StepperMolecule emits step changes when clickable', () => {
    const onStepChange = vi.fn();
    render(
      <StepperMolecule
        steps={[
          { id: 'one', label: 'One' },
          { id: 'two', label: 'Two' },
        ]}
        allowStepClick
        onStepChange={onStepChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Two/ }));
    expect(onStepChange).toHaveBeenCalledWith(1, { id: 'two', label: 'Two' });
  });
});
