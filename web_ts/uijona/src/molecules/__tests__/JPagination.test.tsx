import { render, screen } from '@testing-library/react';
import { JPagination } from '../JPagination';
import { seriousViolations } from '../../__tests__/quality/axe';

describe('JPagination rows info (R-DAT-7)', () => {
  it('S-DAT-22: without showRowsInfo the output is the 1.5.1 markup', () => {
    const { container } = render(<JPagination currentPage={3} totalPages={10} totalRows={200} pageSize={20} />);

    expect(container.innerHTML).toMatchSnapshot();
    expect(screen.queryByText(/ de /)).toBeNull();
  });

  it('S-DAT-22: page 1 of 134 rows by 20 shows 1–20 de 134', () => {
    render(<JPagination currentPage={1} totalPages={7} totalRows={134} pageSize={20} showRowsInfo />);

    expect(screen.getByText('1–20 de 134')).toBeVisible();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('S-DAT-22: the last page shows 121–134 de 134', () => {
    render(<JPagination currentPage={7} totalPages={7} totalRows={134} pageSize={20} showRowsInfo />);

    expect(screen.getByText('121–134 de 134')).toBeVisible();
  });

  it('S-DAT-22: no rows shows 0 de 0, even with a single page and no page buttons', () => {
    render(<JPagination currentPage={1} totalPages={1} totalRows={0} pageSize={20} showRowsInfo />);

    expect(screen.getByText('0 de 0')).toBeVisible();
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('takes a custom rows info label', () => {
    render(
      <JPagination
        currentPage={2}
        totalPages={7}
        totalRows={134}
        pageSize={20}
        showRowsInfo
        rowsInfoLabel={(first, last, total) => `Filas ${first} a ${last} de ${total}`}
      />,
    );

    expect(screen.getByText('Filas 21 a 40 de 134')).toBeVisible();
  });

  it('has no serious axe violations with the rows info', async () => {
    const { container } = render(
      <JPagination currentPage={1} totalPages={7} totalRows={134} pageSize={20} showRowsInfo />,
    );

    expect(await seriousViolations(container)).toEqual([]);
  });
});
