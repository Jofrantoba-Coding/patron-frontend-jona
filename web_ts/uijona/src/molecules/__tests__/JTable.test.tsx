import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import {
  JTable,
  JTableHeader,
  JTableBody,
  JTableRow,
  JTableHead,
  JTableCell,
} from '../JTable';
import { seriousViolations } from '../../__tests__/quality/axe';

function BasicTable({ responsiveMode = 'scroll' }: { responsiveMode?: 'scroll' | 'cards' | 'none' }) {
  return (
    <JTable responsiveMode={responsiveMode}>
      <JTableHeader>
        <JTableRow>
          <JTableHead>Name</JTableHead>
          <JTableHead>Email</JTableHead>
        </JTableRow>
      </JTableHeader>
      <JTableBody>
        <JTableRow>
          <JTableCell>Jonathan</JTableCell>
          <JTableCell>jofrantoba@example.com</JTableCell>
        </JTableRow>
      </JTableBody>
    </JTable>
  );
}

describe('JTable', () => {
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
      <JTable responsiveMode="cards">
        <JTableHeader>
          <JTableRow>
            <JTableHead>Name</JTableHead>
          </JTableRow>
        </JTableHeader>
        <JTableBody>
          <JTableRow>
            <JTableCell data-label="Custom">Jonathan</JTableCell>
          </JTableRow>
        </JTableBody>
      </JTable>
    );

    expect(screen.getByText('Jonathan')).toHaveAttribute('data-label', 'Custom');
  });

  it('uses leaf headers as mobile labels when headers are grouped', () => {
    render(
      <JTable responsiveMode="cards">
        <JTableHeader>
          <JTableRow>
            <JTableHead rowSpan={2}>Name</JTableHead>
            <JTableHead colSpan={2} groupHeader>
              Contact
            </JTableHead>
          </JTableRow>
          <JTableRow>
            <JTableHead>Email</JTableHead>
            <JTableHead>Phone</JTableHead>
          </JTableRow>
        </JTableHeader>
        <JTableBody>
          <JTableRow>
            <JTableCell>Jonathan</JTableCell>
            <JTableCell>jofrantoba@example.com</JTableCell>
            <JTableCell>+51 999 999 999</JTableCell>
          </JTableRow>
        </JTableBody>
      </JTable>
    );

    expect(screen.getByText('Jonathan')).toHaveAttribute('data-label', 'Name');
    expect(screen.getByText('jofrantoba@example.com')).toHaveAttribute('data-label', 'Email');
    expect(screen.getByText('+51 999 999 999')).toHaveAttribute('data-label', 'Phone');
  });

  it('emits the next sort direction from sortable headers', () => {
    const onSortChange = vi.fn();

    render(
      <JTable>
        <JTableHeader>
          <JTableRow>
            <JTableHead sortable sortDirection={null} onSortChange={onSortChange}>
              Name
            </JTableHead>
          </JTableRow>
        </JTableHeader>
      </JTable>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Name' }));

    expect(onSortChange).toHaveBeenCalledWith('asc');
  });

  it('does not render sorting controls on grouped headers', () => {
    const onSortChange = vi.fn();

    render(
      <JTable>
        <JTableHeader>
          <JTableRow>
            <JTableHead colSpan={2} groupHeader sortable sortDirection="desc" onSortChange={onSortChange}>
              Contact
            </JTableHead>
          </JTableRow>
        </JTableHeader>
      </JTable>
    );

    const groupHeader = screen.getByRole('columnheader', { name: 'Contact' });
    expect(groupHeader).toHaveAttribute('scope', 'colgroup');
    expect(screen.queryByRole('button', { name: 'Contact' })).not.toBeInTheDocument();
    expect(onSortChange).not.toHaveBeenCalled();
  });

  it('keeps sorting controls on leaf headers below grouped headers', () => {
    const onSortChange = vi.fn();

    render(
      <JTable>
        <JTableHeader>
          <JTableRow>
            <JTableHead colSpan={2} groupHeader>
              Contact
            </JTableHead>
          </JTableRow>
          <JTableRow>
            <JTableHead sortable sortDirection={null} onSortChange={onSortChange}>
              Email
            </JTableHead>
            <JTableHead>Phone</JTableHead>
          </JTableRow>
        </JTableHeader>
      </JTable>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Email' }));

    expect(onSortChange).toHaveBeenCalledWith('asc');
  });

  it('renders column filters and emits filter changes', () => {
    const onFilterChange = vi.fn();

    render(
      <JTable>
        <JTableHeader>
          <JTableRow>
            <JTableHead filterable filterValue="" filterPlaceholder="Filtrar nombre" onFilterChange={onFilterChange}>
              Name
            </JTableHead>
          </JTableRow>
        </JTableHeader>
      </JTable>
    );

    fireEvent.change(screen.getByLabelText('Filtrar nombre'), { target: { value: 'ana' } });

    expect(onFilterChange).toHaveBeenCalledWith('ana');
  });

  it('filters table rows automatically when column filters are uncontrolled', () => {
    render(
      <JTable>
        <JTableHeader>
          <JTableRow>
            <JTableHead filterable filterPlaceholder="Filtrar nombre">
              Name
            </JTableHead>
            <JTableHead>Email</JTableHead>
          </JTableRow>
        </JTableHeader>
        <JTableBody>
          <JTableRow>
            <JTableCell>Jonathan</JTableCell>
            <JTableCell>jofrantoba@example.com</JTableCell>
          </JTableRow>
          <JTableRow>
            <JTableCell>Ana</JTableCell>
            <JTableCell>ana@example.com</JTableCell>
          </JTableRow>
        </JTableBody>
      </JTable>
    );

    fireEvent.change(screen.getByLabelText('Filtrar nombre'), { target: { value: 'ana' } });

    expect(screen.queryByText('Jonathan')).not.toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  it('filters table rows automatically when column filters are controlled', () => {
    render(
      <JTable>
        <JTableHeader>
          <JTableRow>
            <JTableHead filterable filterValue="ana" filterPlaceholder="Filtrar nombre">
              Name
            </JTableHead>
          </JTableRow>
        </JTableHeader>
        <JTableBody>
          <JTableRow>
            <JTableCell>Jonathan</JTableCell>
          </JTableRow>
          <JTableRow>
            <JTableCell>Ana</JTableCell>
          </JTableRow>
        </JTableBody>
      </JTable>
    );

    expect(screen.queryByText('Jonathan')).not.toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  it('supports column resizing from the header handle', () => {
    const onColumnResize = vi.fn();

    render(
      <JTable>
        <JTableHeader>
          <JTableRow>
            <JTableHead resizable width={120} minWidth={80} onColumnResize={onColumnResize}>
              Name
            </JTableHead>
          </JTableRow>
        </JTableHeader>
      </JTable>
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
      <JTable
        pagination={{
          currentPage: 2,
          pageSize: 10,
          totalRows: 32,
          pageSizeOptions: [10, 25],
          onPageChange,
          onPageSizeChange,
        }}
      >
        <JTableHeader>
          <JTableRow>
            <JTableHead>Name</JTableHead>
          </JTableRow>
        </JTableHeader>
        <JTableBody>
          <JTableRow>
            <JTableCell>Ana</JTableCell>
          </JTableRow>
        </JTableBody>
      </JTable>
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

describe('JTableRow selected (S-DAT-1)', () => {
  function SelectableTable({ selected }: { selected?: boolean }) {
    return (
      <JTable>
        <JTableBody>
          <JTableRow selected={selected} data-testid="row">
            <JTableCell>0002</JTableCell>
            <JTableCell>CUSCO</JTableCell>
          </JTableRow>
        </JTableBody>
      </JTable>
    );
  }

  it('marks the selected row for assistive technology and styling', () => {
    render(<SelectableTable selected />);
    const row = screen.getByTestId('row');

    expect(row).toHaveAttribute('aria-selected', 'true');
    expect(row).toHaveAttribute('data-state', 'selected');
    expect(row).toHaveClass('bg-[rgb(var(--jona-selection))]', 'border-s-[3px]', 'border-s-primary-600');
  });

  it('keeps the selection background while the row is hovered', () => {
    render(<SelectableTable selected />);
    const row = screen.getByTestId('row');

    expect(row).toHaveClass('hover:bg-[rgb(var(--jona-selection))]');
    expect(row).not.toHaveClass('hover:bg-[rgb(var(--jona-surface-muted))]');
  });

  it('renders an unselected row as in 1.5.1', () => {
    const { container, rerender } = render(<SelectableTable />);
    const plain = container.innerHTML;
    rerender(<SelectableTable selected={false} />);
    const row = screen.getByTestId('row');

    expect(row).not.toHaveAttribute('aria-selected');
    expect(row).not.toHaveAttribute('data-state');
    expect(row.className).toBe(
      'transition-colors hover:bg-[rgb(var(--jona-surface-muted))] data-[state=selected]:bg-[rgb(var(--jona-selection))] ' +
        'border-b border-[rgb(var(--jona-line))]',
    );
    expect(container.innerHTML).toBe(plain);
  });
});

describe('JTableRow selected accessibility audit', () => {
  it('has no serious or critical axe violations', async () => {
    const { container } = render(
      <JTable>
        <JTableHeader>
          <JTableRow>
            <JTableHead>Código</JTableHead>
            <JTableHead>Nombre</JTableHead>
          </JTableRow>
        </JTableHeader>
        <JTableBody>
          <JTableRow selected>
            <JTableCell>0002</JTableCell>
            <JTableCell>CUSCO</JTableCell>
          </JTableRow>
          <JTableRow>
            <JTableCell>0003</JTableCell>
            <JTableCell>LIMA</JTableCell>
          </JTableRow>
        </JTableBody>
      </JTable>,
    );

    expect(await seriousViolations(container)).toEqual([]);
  });
});
