import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  JBadge,
  JSectionHeading,
  JTable,
  JTableBody,
  JTableCell,
  JTableHead,
  JTableHeader,
  JTableRow,
} from 'uijona-4ngular';
import { ApiService } from '../../core/api.service';
import type { EstructuraArchivo } from '../../core/models';

interface CatalogoRow {
  code: string;
  values: string[];
}

/** Catálogos (parametría) y estructuras de archivo del dominio H2H. */
@Component({
  selector: 'app-catalogos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge],
  template: `
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <j-section-heading eyebrow="Parametría" heading="Catálogos y estructuras" description="Valores de referencia y estructuras de archivo TXT/XML por producto." />

      <section class="flex flex-col gap-3">
        <h3 class="text-sm font-semibold text-neutral-700">Estructuras de archivo</h3>
        <j-table responsiveMode="scroll">
          <j-table-header>
            <j-table-row>
              <j-table-head>Código</j-table-head>
              <j-table-head>Descripción</j-table-head>
              <j-table-head>Producto</j-table-head>
              <j-table-head>Formato</j-table-head>
              <j-table-head>Versión</j-table-head>
            </j-table-row>
          </j-table-header>
          <j-table-body>
            @for (e of estructuras(); track e.ear_v_codigo) {
              <j-table-row>
                <j-table-cell><span class="font-mono text-xs">{{ e.ear_v_codigo }}</span></j-table-cell>
                <j-table-cell>{{ e.ear_v_descripcion }}</j-table-cell>
                <j-table-cell>{{ e.producto }}</j-table-cell>
                <j-table-cell><j-badge variant="secondary">{{ e.formato }}</j-badge></j-table-cell>
                <j-table-cell><span class="font-mono text-xs">{{ e.version }}</span></j-table-cell>
              </j-table-row>
            }
          </j-table-body>
        </j-table>
      </section>

      <section class="flex flex-col gap-3">
        <h3 class="text-sm font-semibold text-neutral-700">Catálogos de referencia</h3>
        <j-table responsiveMode="scroll">
          <j-table-header>
            <j-table-row>
              <j-table-head>Catálogo</j-table-head>
              <j-table-head>Valores</j-table-head>
            </j-table-row>
          </j-table-header>
          <j-table-body>
            @for (c of catalogos(); track c.code) {
              <j-table-row>
                <j-table-cell><span class="font-mono text-xs">{{ c.code }}</span></j-table-cell>
                <j-table-cell>
                  <div class="flex flex-wrap gap-1">
                    @for (v of c.values; track v) {
                      <j-badge variant="outline">{{ v }}</j-badge>
                    }
                  </div>
                </j-table-cell>
              </j-table-row>
            }
          </j-table-body>
        </j-table>
      </section>
    </div>
  `,
})
export class CatalogosPage {
  private readonly api = inject(ApiService);
  protected readonly catalogos = signal<CatalogoRow[]>([]);
  protected readonly estructuras = signal<EstructuraArchivo[]>([]);

  constructor() {
    this.api.catalogs().subscribe((map) => this.catalogos.set(Object.entries(map).map(([code, values]) => ({ code, values }))));
    this.api.estructuras().subscribe((res) => this.estructuras.set(res.items));
  }
}
