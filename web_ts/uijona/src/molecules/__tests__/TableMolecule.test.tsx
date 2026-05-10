import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import {
  TableMolecule,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../TableMolecule';

function BasicTable({ responsiveMode = 'scroll' }: { responsiveMode?: 'scroll' | 'cards' | 'none' }) {
  return (
    <TableMolecule responsiveMode={responsiveMode}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Jonathan</TableCell>
          <TableCell>jofrantoba@example.com</TableCell>
        </TableRow>
      </TableBody>
    </TableMolecule>
  );
}

describe('TableMolecule', () => {
  it('uses horizontal scroll as the default responsive mode', () => {
    render(<BasicTable />);

    const table = screen.getByRole('table');
    expect(table.parentElement).toHaveClass('overflow-x-auto');
    expect(screen.getByText('Jonathan')).not.toHaveAttribute('data-label');
  });

  it('injects mobile data labels only in card mode', () => {
    render(<BasicTable responsiveMode="cards" />);

    expect(screen.getByText('Jonathan')).toHaveAttribute('data-label', 'Name');
    expect(screen.getByText('jofrantoba@example.com')).toHaveAttribute('data-label', 'Email');
  });

  it('respects manually provided mobile labels', () => {
    render(
      <TableMolecule responsiveMode="cards">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell data-label="Custom">Jonathan</TableCell>
          </TableRow>
        </TableBody>
      </TableMolecule>
    );

    expect(screen.getByText('Jonathan')).toHaveAttribute('data-label', 'Custom');
  });

  it('uses leaf headers as mobile labels when headers are grouped', () => {
    render(
      <TableMolecule responsiveMode="cards">
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2}>Name</TableHead>
            <TableHead colSpan={2} groupHeader>
              Contact
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Jonathan</TableCell>
            <TableCell>jofrantoba@example.com</TableCell>
            <TableCell>+51 999 999 999</TableCell>
          </TableRow>
        </TableBody>
      </TableMolecule>
    );

    expect(screen.getByText('Jonathan')).toHaveAttribute('data-label', 'Name');
    expect(screen.getByText('jofrantoba@example.com')).toHaveAttribute('data-label', 'Email');
    expect(screen.getByText('+51 999 999 999')).toHaveAttribute('data-label', 'Phone');
  });

  it('emits the next sort direction from sortable headers', () => {
    const onSortChange = vi.fn();

    render(
      <TableMolecule>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection={null} onSortChange={onSortChange}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </TableMolecule>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Name' }));

    expect(onSortChange).toHaveBeenCalledWith('asc');
  });

  it('allows grouped headers to behave as one sortable header cell', () => {
    const onSortChange = vi.fn();

    render(
      <TableMolecule>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2} groupHeader sortable sortDirection="desc" onSortChange={onSortChange}>
              Contact
            </TableHead>
          </TableRow>
        </TableHeader>
      </TableMolecule>
    );

    const groupHeader = screen.getByRole('columnheader', { name: 'Contact' });
    expect(groupHeader).toHaveAttribute('scope', 'colgroup');

    fireEvent.click(screen.getByRole('button', { name: 'Contact' }));

    expect(onSortChange).toHaveBeenCalledWith(null);
  });

  it('renders column filters and emits filter changes', () => {
    const onFilterChange = vi.fn();

    render(
      <TableMolecule>
        <TableHeader>
          <TableRow>
            <TableHead filterable filterValue="" filterPlaceholder="Filtrar nombre" onFilterChange={onFilterChange}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </TableMolecule>
    );

    fireEvent.change(screen.getByLabelText('Filtrar nombre'), { target: { value: 'ana' } });

    expect(onFilterChange).toHaveBeenCalledWith('ana');
  });

  it('supports column resizing from the header handle', () => {
    const onColumnResize = vi.fn();

    render(
      <TableMolecule>
        <TableHeader>
          <TableRow>
            <TableHead resizable width={120} minWidth={80} onColumnResize={onColumnResize}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
      </TableMolecule>
    );

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Redimensionar columna' }), { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 150 });
    fireEvent.mouseUp(document);

    expect(onColumnResize).toHaveBeenCalledWith(170);
  });
});
