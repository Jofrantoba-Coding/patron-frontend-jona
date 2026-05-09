import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyStateMolecule } from '../EmptyStateMolecule';

describe('EmptyStateMolecule', () => {
  it('renders title, description and actions', () => {
    const onClick = vi.fn();
    render(
      <EmptyStateMolecule
        title="No projects"
        description="Create your first project."
        actions={[{ label: 'Create project', onClick }]}
      />
    );

    expect(screen.getByText('No projects')).toBeInTheDocument();
    expect(screen.getByText('Create your first project.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Create project' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
