// JDataTableView.ts — JONA View (template puro)
export const J_DATA_TABLE_TEMPLATE = `
    <div [class]="cn('flex w-full flex-col gap-3', className())">
      @if (showFilter()) {
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <svg class="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              [value]="effectiveFilter()"
              [placeholder]="filterPlaceholder()"
              [attr.aria-label]="filterPlaceholder()"
              (input)="onFilter($event)"
              class="h-9 w-full rounded-md border border-neutral-300 bg-white pl-8 pr-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      }

      <div class="relative max-w-full overflow-auto rounded-md border border-neutral-200">
        <table class="w-full min-w-max caption-bottom text-sm">
          <thead [class]="cn('bg-neutral-50 [&_tr]:border-b', stickyHeader() && 'sticky top-0 z-10')">
            <tr>
              @for (col of columns(); track col.key) {
                <th
                  [style.width]="col.width"
                  (click)="onHeaderClick(col)"
                  [attr.aria-sort]="ariaSort(col)"
                  [class]="headerClasses(col)"
                >
                  <span class="inline-flex items-center">
                    {{ col.header }}
                    @if (col.sortable) {
                      <svg class="ml-1 inline-block h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                        <polyline points="6 9 12 3 18 9" [class]="dirFor(col) === 'asc' ? 'text-primary-600' : 'text-neutral-300'" />
                        <polyline points="6 15 12 21 18 15" [class]="dirFor(col) === 'desc' ? 'text-primary-600' : 'text-neutral-300'" />
                      </svg>
                    }
                  </span>
                </th>
              }
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            @if (loading()) {
              <tr>
                <td [attr.colspan]="columns().length" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-2 text-neutral-400">
                    <svg class="h-6 w-6 animate-spin text-primary-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span class="text-sm">Cargando...</span>
                  </div>
                </td>
              </tr>
            } @else if (rows().length === 0) {
              <tr>
                <td [attr.colspan]="columns().length" class="px-4 py-12 text-center">
                  <div class="flex flex-col items-center gap-1 text-neutral-400">
                    <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p class="text-sm font-medium text-neutral-600">{{ emptyTitle() }}</p>
                    <p class="text-xs text-neutral-400">{{ emptyDescription() }}</p>
                  </div>
                </td>
              </tr>
            } @else {
              @for (row of rows(); track rowKey()(row, $index); let ri = $index) {
                <tr
                  (click)="onRowClick(row, ri)"
                  class="border-b border-neutral-100 transition-colors cursor-pointer hover:bg-neutral-50"
                >
                  @for (col of columns(); track col.key) {
                    <td [class]="cellClasses(col)">{{ cellText(col, row, ri) }}</td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `;

