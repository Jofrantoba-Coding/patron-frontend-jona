import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { validateRegistry } from '../../../mock-server/registry/schema.js';
import { toCatalogConfig } from '../../catalogs/registry';
import type { CatalogConfig } from '../../catalogs/CatalogConfig';
import type { InterCatalogService } from '../../services/InterCatalogService';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiCrudRegister } from './UiCrudRegister';

type Row = Record<string, string>;
const registry = validateRegistry([
  {
    slug: 'nota', idKey: 'id_nota', codeWidth: 0, entity: 'una nota', scope: 'tenant', seed: 'nota', messages: { style: 'M1' },
    fields: [
      { name: 'titulo', kind: 'text', label: 'Titulo', max: 20 },
      { name: 'comentario', kind: 'textarea', label: 'Comentario', max: 10, normalize: ['upper'], required: true, message: 'Ingrese Comentario' },
      { name: 'detalle', kind: 'textarea', label: 'Detalle', rows: 6, max: 30 },
    ],
    columns: [{ key: 'titulo', header: 'T' }],
  },
]);
const config = toCatalogConfig(registry.bySlug.get('nota'), registry) as CatalogConfig<Row>;
const RECORD: Row = { id_nota: '7', titulo: 'T', comentario: 'UNO\nDOS', detalle: '' };

async function open(mode: 'INSERT' | 'UPDATE' | 'DETAIL' = 'INSERT') {
  const user = userEvent.setup();
  const service = { get: vi.fn(async () => RECORD), create: vi.fn(async (v: object) => ({ id_nota: '9', ...v })), update: vi.fn(async (id: string, v: object) => ({ id, ...v })) } as unknown as InterCatalogService<Row>;
  render(
    <DialogStackProvider>
      <UiCrudRegister config={config} service={service} mode={mode} id={mode === 'INSERT' ? undefined : '7'} onDone={vi.fn()} onClose={vi.fn()} />
    </DialogStackProvider>,
  );
  await waitFor(() => expect(screen.queryByText('Cargando...')).toBeNull());
  return { user, service };
}
const area = (label: string) => screen.getByLabelText(label) as HTMLTextAreaElement;

describe('registry adapter for a textarea field (R-REG-13)', () => {
  it('is a multi-line text for the core: the same validation and normalization as a text', () => {
    expect(config.fields.find((f) => f.name === 'comentario')).toMatchObject({ kind: 'text', multiline: true, maxLength: 10, uppercase: true, required: true, message: 'Ingrese Comentario' });
    expect(config.fields.find((f) => f.name === 'detalle')).toMatchObject({ kind: 'text', multiline: true, rows: 6 });
  });
});

describe('UiCrudRegister textarea field (R-CRUD-18, S-CRUD-46)', () => {
  it('renders a multi-line input, 4 rows unless the entry says otherwise', async () => {
    await open();
    expect([area('Comentario').tagName, area('Comentario').rows, area('Detalle').rows]).toEqual(['TEXTAREA', 4, 6]);
  });

  it('S-CRUD-46 Enter inserts a line break and does not submit the register', async () => {
    const { user, service } = await open();
    await user.type(area('Comentario'), 'uno{Enter}dos');
    expect(area('Comentario').value).toBe('UNO\nDOS');
    expect(screen.queryByRole('button', { name: 'Confirmar' })).toBeNull();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('S-CRUD-46 the character past the max is ignored, typed or pasted', async () => {
    const { user } = await open();
    await user.type(area('Comentario'), 'abcdefghijk');
    expect(area('Comentario').value).toBe('ABCDEFGHIJ');
    await user.clear(area('Comentario'));
    await user.click(area('Comentario'));
    await user.paste('a'.repeat(11));
    expect(area('Comentario').value).toBe('');
  });

  it('S-CRUD-46 the payload is the trimmed string, upper-cased as typed', async () => {
    const { user, service } = await open();
    await user.type(area('Comentario'), '  uno{Enter}dos ');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    await user.click(await screen.findByRole('button', { name: 'Confirmar' }));
    await waitFor(() => expect(service.create).toHaveBeenCalledWith({ titulo: '', comentario: 'UNO\nDOS', detalle: '' }));
  });

  it('a blank required textarea blocks the submit with its message', async () => {
    const { user, service } = await open();
    await user.type(area('Comentario'), '  {Enter} ');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Ingrese Comentario')).toBeTruthy();
    expect(service.create).not.toHaveBeenCalled();
  });

  it('UPDATE restores the multi-line value; DETAIL shows it read-only', async () => {
    const { user } = await open('UPDATE');
    expect(area('Comentario').value).toBe('UNO\nDOS');
    await user.type(area('Detalle'), 'x');
    expect(area('Detalle').value).toBe('x');
  });

  it('DETAIL shows the value and takes no edits', async () => {
    const { user } = await open('DETAIL');
    expect(area('Comentario').readOnly).toBe(true);
    await user.type(area('Comentario'), 'zz');
    expect(area('Comentario').value).toBe('UNO\nDOS');
  });
});
