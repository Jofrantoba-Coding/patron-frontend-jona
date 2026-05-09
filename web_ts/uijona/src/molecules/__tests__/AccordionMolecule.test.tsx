import { render, screen, fireEvent } from '@testing-library/react';
import { AccordionMolecule } from '../AccordionMolecule';

describe('AccordionMolecule', () => {
  const items = [
    { value: 'profile', title: 'Profile', content: 'Profile content' },
    { value: 'security', title: 'Security', content: 'Security content' },
  ];

  it('opens and closes a single item by default', () => {
    const onValueChange = vi.fn();
    render(<AccordionMolecule items={items} onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Profile' }));
    expect(screen.getByText('Profile content')).toBeInTheDocument();
    expect(onValueChange).toHaveBeenLastCalledWith('profile');

    fireEvent.click(screen.getByRole('button', { name: 'Profile' }));
    expect(screen.queryByText('Profile content')).not.toBeInTheDocument();
    expect(onValueChange).toHaveBeenLastCalledWith('');
  });

  it('supports multiple open items', () => {
    render(<AccordionMolecule items={items} multiple />);

    fireEvent.click(screen.getByRole('button', { name: 'Profile' }));
    fireEvent.click(screen.getByRole('button', { name: 'Security' }));

    expect(screen.getByText('Profile content')).toBeInTheDocument();
    expect(screen.getByText('Security content')).toBeInTheDocument();
  });
});
