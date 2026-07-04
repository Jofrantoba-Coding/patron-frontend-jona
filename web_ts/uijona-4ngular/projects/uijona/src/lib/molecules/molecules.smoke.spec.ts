import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  JAccordion,
  JCombobox,
  JDataTable,
  JDialog,
  JTabs,
  JTabsContent,
  JTabsList,
  JTabsTrigger,
} from '../../public-api';

@Component({
  standalone: true,
  imports: [JTabs, JTabsList, JTabsTrigger, JTabsContent, JAccordion, JDataTable, JCombobox, JDialog],
  template: `
    <j-tabs [(value)]="tab">
      <j-tabs-list>
        <j-tabs-trigger value="a">A</j-tabs-trigger>
        <j-tabs-trigger value="b">B</j-tabs-trigger>
      </j-tabs-list>
      <j-tabs-content value="a"><p class="tab-a">Panel A</p></j-tabs-content>
      <j-tabs-content value="b"><p class="tab-b">Panel B</p></j-tabs-content>
    </j-tabs>

    <j-accordion [items]="items" />

    <j-data-table [columns]="cols" [data]="rows" [rowKey]="rowKey" [showFilter]="true" />

    <j-combobox [options]="opts" [(value)]="combo" />

    <j-dialog [open]="dialogOpen" title="Hola">Contenido</j-dialog>
  `,
})
class Host {
  tab = 'a';
  combo = '';
  dialogOpen = true;
  items = [
    { value: 'i1', title: 'Uno', content: 'Contenido uno' },
    { value: 'i2', title: 'Dos', content: 'Contenido dos' },
  ];
  cols = [
    { key: 'name', header: 'Nombre', sortable: true },
    { key: 'age', header: 'Edad', sortable: true, align: 'right' as const },
  ];
  rows = [
    { name: 'Ana', age: 30 },
    { name: 'Beto', age: 25 },
  ];
  rowKey = (r: Record<string, unknown>) => String(r['name']);
  opts = [
    { value: 'pe', label: 'Perú' },
    { value: 'cl', label: 'Chile' },
  ];
}

describe('uijona-4ngular molecules smoke', () => {
  it('renders interactive/data/overlay molecules', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    // JTabs: only active panel A visible
    expect(el.querySelector('.tab-a')).toBeTruthy();
    expect(el.querySelector('.tab-b')).toBeFalsy();
    expect(el.querySelector('j-tabs-trigger button[aria-selected="true"]')).toBeTruthy();

    // JAccordion: two triggers
    expect(el.querySelectorAll('[id^="jaccordion-trigger-"]').length).toBe(2);

    // JDataTable: header + 2 rows
    expect(el.querySelectorAll('thead th').length).toBe(2);
    expect(el.querySelectorAll('tbody tr').length).toBe(2);

    // JCombobox trigger present
    expect(el.querySelector('button[role="combobox"]')).toBeTruthy();

    // JDialog open -> dialog role rendered
    expect(el.querySelector('[role="dialog"][aria-modal="true"]')).toBeTruthy();
  });

  it('JTabs switches active panel on trigger click', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const triggers = el.querySelectorAll('j-tabs-trigger button');
    (triggers[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el.querySelector('.tab-b')).toBeTruthy();
    expect(el.querySelector('.tab-a')).toBeFalsy();
  });

  it('JDataTable sorts by column on header click', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const ageHeader = el.querySelectorAll('thead th')[1] as HTMLElement;
    ageHeader.click();
    fixture.detectChanges();
    const firstRowFirstCell = el.querySelector('tbody tr td') as HTMLElement;
    // asc by age -> Beto (25) first
    expect(firstRowFirstCell.textContent?.trim()).toBe('Beto');
  });
});
