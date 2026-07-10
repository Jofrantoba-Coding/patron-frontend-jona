import type { JDataTableColumn, JDataTableRow } from 'uijona-4ngular';

export interface BeneficiariosPageContract {
  readonly rows: () => JDataTableRow[];
  readonly columns: JDataTableColumn[];
  readonly rowKey: (row: JDataTableRow) => string;
}
