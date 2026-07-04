// JTableView.ts — JONA View (template puro)
export const J_TABLE_TEMPLATE_1 = `
    <div [class]="cn(outer(), wrapperClassName())">
      <div [class]="inner()">
        <table [class]="tableClasses()" [style]="style()"><ng-content /></table>
      </div>
    </div>
  `;

export const J_TABLE_TEMPLATE_2 = `<caption [class]="cn('mt-4 text-sm text-neutral-500', className())"><ng-content /></caption>`;

export const J_TABLE_TEMPLATE_3 = `<thead [class]="classes()"><ng-content /></thead>`;

export const J_TABLE_TEMPLATE_4 = `<tbody [class]="classes()"><ng-content /></tbody>`;

export const J_TABLE_TEMPLATE_5 = `<tfoot [class]="classes()"><ng-content /></tfoot>`;

export const J_TABLE_TEMPLATE_6 = `<tr [class]="classes()"><ng-content /></tr>`;

export const J_TABLE_TEMPLATE_7 = `
    <th
      [attr.colspan]="colSpan()"
      [attr.scope]="scope()"
      [attr.aria-sort]="ariaSort()"
      [class]="classes()"
      [style.width]="width()"
    >
      <div [class]="cn('flex min-w-0 items-center gap-2', groupHeader() && 'justify-center')">
        @if (sortable() && !groupHeader()) {
          <button
            type="button"
            class="inline-flex min-w-0 items-center gap-1 rounded-sm text-left font-medium text-inherit outline-none hover:text-neutral-800 focus-visible:ring-2 focus-visible:ring-primary-500"
            (click)="onSort($event)"
          >
            <span class="truncate"><ng-content /></span>
            <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <polyline points="6 9 12 3 18 9" [class]="sortDirection() === 'asc' ? 'text-primary-600' : 'text-neutral-300'" />
              <polyline points="6 15 12 21 18 15" [class]="sortDirection() === 'desc' ? 'text-primary-600' : 'text-neutral-300'" />
            </svg>
          </button>
        } @else {
          <span class="truncate"><ng-content /></span>
        }
      </div>
    </th>
  `;

export const J_TABLE_TEMPLATE_8 = `
    <td [attr.colspan]="colSpan()" [attr.data-label]="dataLabel()" [class]="classes()">
      <ng-content />
    </td>
  `;

