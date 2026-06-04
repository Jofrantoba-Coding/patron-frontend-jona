import { render, screen, fireEvent } from '@testing-library/react';
import { JDropdown } from '../JDropdown';

describe('JDropdown', () => {
  it('notifies when a disabled item is clicked without selecting it', () => {
    const onDisabledItemClick = vi.fn();
    const onItemSelect = vi.fn();
    const itemClick = vi.fn();

    render(
      <JDropdown
        trigger={<button type="button">Open</button>}
        groups={[{ items: [{ label: 'Archived', disabled: true, onClick: itemClick }] }]}
        onDisabledItemClick={onDisabledItemClick}
        onItemSelect={onItemSelect}
      />
    );

    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Archived' }));

    expect(onDisabledItemClick).toHaveBeenCalledWith('Archived');
    expect(onItemSelect).not.toHaveBeenCalled();
    expect(itemClick).not.toHaveBeenCalled();
  });

  it('selects enabled items and closes the menu', () => {
    const onItemSelect = vi.fn();
    const itemClick = vi.fn();

    render(
      <JDropdown
        trigger={<button type="button">Open</button>}
        groups={[{ items: [{ label: 'Profile', onClick: itemClick }] }]}
        onItemSelect={onItemSelect}
      />
    );

    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Profile' }));

    expect(itemClick).toHaveBeenCalledTimes(1);
    expect(onItemSelect).toHaveBeenCalledWith('Profile');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
