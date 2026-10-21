import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { JDataTable } from './JDataTableImpl';

@Component({
  standalone: true,
  imports: [JDataTable],
  template: `
    <j-data-table
      responsiveMode="cards"
      [columns]="columns"
      [data]="rows"
      [rowKey]="rowKey"
      mobileActionLabel="Ver detalle"
      (rowClick)="selected($event)"
    />
  `,
})
class Host {
  readonly columns = [
    { key: 'code', header: 'Codigo', mobilePriority: 1 },
    { key: 'status', header: 'Estado', mobilePriority: 2 },
  ];
  readonly rows = [{ code: 'OP-1', status: 'PENDIENTE' }];
  readonly rowKey = (row: Record<string, unknown>) => String(row['code']);
  readonly selected = vi.fn();
}

describe('JDataTable mobile cards', () => {
  it('renders explicit labels and a primary row action without removing the desktop table', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('table')).toBeTruthy();
    expect(element.querySelector('thead')?.className).toContain('max-md:hidden');
    expect(element.querySelector('td[data-label="Codigo"]')).toBeTruthy();

    const action = element.querySelector('[data-testid="mobile-row-action"]') as HTMLButtonElement;
    expect(action.textContent?.trim()).toBe('Ver detalle');
    action.click();
    expect(fixture.componentInstance.selected).toHaveBeenCalledWith({
      row: fixture.componentInstance.rows[0],
      index: 0,
    });
  });
});