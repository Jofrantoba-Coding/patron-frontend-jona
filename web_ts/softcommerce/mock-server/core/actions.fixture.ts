import { validateRegistry } from '../registry/schema.js';
import { ACTION_HOOKS } from './actions.js';
import { actionNotAllowed, validationError } from './errors.js';
import { parentEntry } from './children.fixture';
import { tinySeed } from './test-helpers';
import { rowsOf } from './validators.js';

/**
 * Test-only registry for the W3-6 row actions: `clientes` with an entry action (`cerrar`) and a child `activaciones` with the three shapes of
 * R-MOCK-22: `activar` (collection form: creates a row), `desactivar` (row form) and `avisar` (declared with a server action nobody implements).
 * The hooks below are the test rules the endpoints run; the real anexo rule lands with W3-7.
 */
const text = (name: string, extra: Record<string, any> = {}) => ({ name, kind: 'text', label: name, max: 30, ...extra });

export const ACTION_ENTRIES: Record<string, any>[] = [
  parentEntry('clientes', {
    fields: [{ name: 'id_clientes', kind: 'code', label: 'Codigo' }, text('nombre', { required: true }), text('cerrado', { max: 1 })],
    actions: [
      { id: 'cerrar', label: 'Cerrar', kind: 'immediate', server: 'demoCerrar', placement: 'register' },
      { id: 'rotar', label: 'Rotar', kind: 'deferred', rule: 'demoRotar', placement: 'register' },
    ],
    children: {
      activaciones: {
        tab: 'Activacion', removal: 'none',
        fields: [text('fecha_inicio', { max: 10 }), text('fecha_fin', { max: 10 }), text('motivo')],
        columns: [{ key: 'motivo', header: 'Motivo' }],
        actions: [
          { id: 'activar', label: 'Activar', kind: 'immediate', server: 'demoActivar' },
          { id: 'desactivar', label: 'Desactivar', kind: 'immediate', server: 'demoDesactivar', enabledWhen: { selection: true } },
          { id: 'avisar', label: 'Avisar', kind: 'immediate', server: 'demoNadie' },
          { id: 'diferir', label: 'Diferir', kind: 'deferred', rule: 'demoDiferir' },
        ],
      },
    },
  }),
];

export const ACTION_REGISTRY = validateRegistry(ACTION_ENTRIES);

export const ACTION_SEED = {
  ...tinySeed(),
  clientes: {
    a: [
      { id_clientes: '001', nombre: 'ACME', activo: true, activaciones: [{ id: '1', fecha_inicio: '2026-03-10', fecha_fin: '', motivo: 'INICIO', estado: 'A' }] },
      { id_clientes: '002', nombre: 'BETA', activo: true, activaciones: [{ id: '1', fecha_inicio: '2026-01-01', fecha_fin: '2026-02-01', motivo: 'INICIO', estado: 'D' }] },
      { id_clientes: '003', nombre: 'GONE', activo: false },
    ],
    b: [{ id_clientes: '001', nombre: 'OTRO TENANT', activo: true }],
  },
};

export function installActionHooks(): void {
  ACTION_HOOKS.demoCerrar = ({ row }: any) => {
    if (row.cerrado === 'S') throw actionNotAllowed('Cliente ya Esta Cerrado');
    row.cerrado = 'S';
    return { message: 'Cliente Cerrado' };
  };

  ACTION_HOOKS.demoActivar = ({ store, tenantId, entry, parent, parentRow, input }: any) => {
    const rows = rowsOf(store, tenantId, entry).filter((r: any) => r[entry.parentKey] === parentRow[parent.idKey]);
    if (rows.some((r: any) => r.estado === 'A')) throw actionNotAllowed('Cliente ya Esta Activado');
    if (!input.fecha_inicio) throw validationError([{ field: 'fecha_inicio', code: 'REQUIRED', message: 'Fecha Inicio es requerida' }]);
    const id = String(rowsOf(store, tenantId, entry).reduce((max: number, r: any) => Math.max(max, Number(r.id)), 0) + 1);
    rowsOf(store, tenantId, entry).push({ id, [entry.parentKey]: parentRow[parent.idKey], fecha_inicio: input.fecha_inicio, fecha_fin: '', motivo: input.motivo ?? '', estado: 'A', activo: true });
    return { id, message: 'Cliente Activado' };
  };

  ACTION_HOOKS.demoDesactivar = ({ row, input }: any) => {
    if (row.estado === 'D') throw actionNotAllowed('Cliente ya Esta Desactivado');
    if (String(input.fecha_fin) < row.fecha_inicio) throw validationError([{ field: 'fecha_fin', code: 'RANGE', message: 'Fecha es menor a fecha inicial' }]);
    Object.assign(row, { estado: 'D', fecha_fin: input.fecha_fin });
    return { message: 'Cliente Desactivado' };
  };
}

installActionHooks();
