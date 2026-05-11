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

  it('keeps none mode responsive with horizontal overflow protection', () => {
    render(<BasicTable responsiveMode="none" />);

    const table = screen.getByRole('table');
    expect(table.parentElement).toHaveClass('overflow-x-auto');
    expect(table).toHaveClass('min-w-max');
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

  it('does not render sorting controls on grouped headers', () => {
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
    expect(screen.queryByRole('button', { name: 'Contact' })).not.toBeInTheDocument();
    expect(onSortChange).not.toHaveBeenCalled();
  });

  it('keeps sorting controls on leaf headers below grouped headers', () => {
    const onSortChange = vi.fn();

    render(
      <TableMolecule>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2} groupHeader>
              Contact
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead sortable sortDirection={null} onSortChange={onSortChange}>
              Email
            </TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
      </TableMolecule>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Email' }));

    expect(onSortChange).toHaveBeenCalledWith('asc');
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

  it('filters table rows automatically when column filters are uncontrolled', () => {
    render(
      <TableMolecule>
        <TableHeader>
          <TableRow>
            <TableHead filterable filterPlaceholder="Filtrar nombre">
              Name
            </TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Jonathan</TableCell>
            <TableCell>jofrantoba@example.com</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ana</TableCell>
            <TableCell>ana@example.com</TableCell>
          </TableRow>
        </TableBody>
      </TableMolecule>
    );

    fireEvent.change(screen.getByLabelText('Filtrar nombre'), { target: { value: 'ana' } });

    expect(screen.queryByText('Jonathan')).not.toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  it('filters table rows automatically when column filters are controlled', () => {
    render(
      <TableMolecule>
        <TableHeader>
          <TableRow>
            <TableHead filterable filterValue="ana" filterPlaceholder="Filtrar nombre">
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Jonathan</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ana</TableCell>
          </TableRow>
        </TableBody>
      </TableMolecule>
    );

    expect(screen.queryByText('Jonathan')).not.toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
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

  it('renders pagination controls and emits pagination changes', () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();

    render(
      <TableMolecule
        pagination={{
          currentPage: 2,
          pageSize: 10,
          totalRows: 32,
          pageSizeOptions: [10, 25],
          onPageChange,
          onPageSizeChange,
        }}
      >
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ana</TableCell>
          </TableRow>
        </TableBody>
      </TableMolecule>
    );

    expect(screen.getByText((_, element) =>
      element?.tagName.toLowerCase() === 'p'
      && element.textContent?.replace(/\s+/g, ' ').trim() === 'Mostrando 11 - 20 de 32 resultados'
    )).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Pagina siguiente' }));
    expect(onPageChange).toHaveBeenCalledWith(3);

    fireEvent.click(screen.getByRole('button', { name: 'Primera pagina' }));
    expect(onPageChange).toHaveBeenCalledWith(1);

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '25' } });
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});
