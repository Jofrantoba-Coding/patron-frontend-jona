import { render, screen, fireEvent } from '@testing-library/react';
import { DialogMolecule } from '../DialogMolecule';

describe('DialogMolecule', () => {
  it('does not render when open is false', () => {
    render(<DialogMolecule open={false} title="Test" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(<DialogMolecule open title="My Dialog" />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('My Dialog')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<DialogMolecule open title="Test" onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close dialog'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when ESC is pressed', () => {
    const onClose = vi.fn();
    render(<DialogMolecule open title="Test" onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('renders children content', () => {
    render(<DialogMolecule open title="Test"><p>Dialog body</p></DialogMolecule>);
    expect(screen.getByText('Dialog body')).toBeInTheDocument();
  });
});
