import { render, screen } from '@testing-library/react';
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
});
