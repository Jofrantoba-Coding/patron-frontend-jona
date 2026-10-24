import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { REGISTRY } from '../../mock-server/registry/index.js';
import { PERMISSION_FLAGS, type Permissions } from '../domain/permissions';
import { ServicesProvider } from '../services/ServicesContext';
import { SessionProvider } from '../session/SessionProvider';
import { createSessionStore, type Session } from '../session/sessionStore';
import { createAppServicesMock } from '../services/mock/AppServicesMock';
import { seed } from '../services/mock/seed';
import { UiCatalog } from '../views/uicatalog';
import { DialogStackProvider } from '../views/uishell/DialogStackProvider';
import { formRegistry } from '../views/uishell/formRegistry';
import { toCatalogConfig } from './registry';

const granted = Object.fromEntries(PERMISSION_FLAGS.map((f) => [f, true])) as Permissions;

/** The real `items` entry over the demo seed (user 7, empresa 1), against the in-browser mock (R-MST-14, S-MST-1, S-MST-27 to S-MST-29, S-MST-31). */
const DEMO_PARAMS = { IS_ITEM_RESUMEN_PRECIO: true, ISBOTICA: false, IS_BOTICA_SIN_LOTE: false, PORC_IGV: 18 };
function renderItems(params: Record<string, unknown> = DEMO_PARAMS) {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '7', empresaId: '1' }), delayMs: 0, seed });
  const store = createSessionStore(window.localStorage);
  store.setSession({ params } as unknown as Session);
  render(
    <SessionProvider store={store}>
      <ServicesProvider services={services}>
        <DialogStackProvider>
          <UiCatalog config={toCatalogConfig(REGISTRY.bySlug.get('items'), REGISTRY)} permissions={granted} />
        </DialogStackProvider>
      </ServicesProvider>
    </SessionProvider>,
  );
  return userEvent.setup();
}
type User = ReturnType<typeof userEvent.setup>;
const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement;
const selected = (label: string) => select(label).selectedOptions[0]?.textContent;
const box = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement;
const SELECCIONE = '--- Seleccione ---';
const dialog = () => screen.getByRole('dialog');
const optionsOf = (label: string) => [...select(label).querySelectorAll('option')].map((o) => o.textContent);

async function openRegister(user: User, button: 'Agregar' | 'Modificar', row?: string) {
  if (row) await user.click(await screen.findByText(row));
  else await screen.findByText('MANZANA ROJA X KG');
  await user.click(screen.getByRole('button', { name: button }));
  await screen.findByLabelText('Cod. Alterno');
  await waitFor(() => expect(optionsOf('U. Stock').length).toBeGreaterThan(1));
}

describe('R-REG-19 the screen is reachable', () => {
  it('the menu leaf miProducto opens the generic catalog unit', () => {
    expect(formRegistry.miProducto).toBeTruthy();
  });
});

describe('items list and toolbar (S-MST-1)', () => {
  it('lists the active items with the desktop columns and the prices, hides the retired one, and offers no clone', async () => {
    renderItems();
    expect(await screen.findByText('MANZANA ROJA X KG')).toBeTruthy();
    expect(screen.queryByText('ITEM RETIRADO')).toBeNull();
    for (const header of ['COD ALT', 'DESC', 'UM_COMPRA', 'UM_VENTA', 'UM_STOCK', 'FAMILIA', 'SUB_FAMILIA', 'MARCA', 'TARJETA SOL', 'MAYORISTA DOL']) expect(screen.getByText(header)).toBeTruthy();
    for (const name of ['Agregar', 'Modificar', 'Eliminar', 'Detalle']) expect(screen.getByRole('button', { name })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Clonar' })).toBeNull();
  });

  it('S-MST-31 with IS_ITEM_RESUMEN_PRECIO off the list has no price column', async () => {
    renderItems({ ...DEMO_PARAMS, IS_ITEM_RESUMEN_PRECIO: false });
    await screen.findByText('MANZANA ROJA X KG');
    expect([screen.queryByText('TARJETA SOL'), screen.queryByText('MAYORISTA DOL')]).toEqual([null, null]);
  });
});

describe('items INSERT (S-MST-27)', () => {
  it('names the first tab Datos de Item and opens on the defaults: Producto, No perecible, AFECTO with the company IGV, Kardex on, Item Activo', async () => {
    const user = renderItems();
    await openRegister(user, 'Agregar');
    expect(within(dialog()).getByRole('tab', { name: 'Datos de Item' })).toBeTruthy();
    expect([selected('Tipo'), selected('Afecto a IGV'), field('Porc. IGV').value, box('Kardex').checked, box('Serv.Transporte').checked, box('Item Activo').checked]).toEqual(['Producto', 'AFECTO', '18', true, false, true]);
    expect((screen.getByRole('radio', { name: 'No perecible' }) as HTMLInputElement).checked).toBe(true);
  });

  it('S-MST-27 an empty confirm says the Codigo Alternativo sentence first', async () => {
    const user = renderItems();
    await openRegister(user, 'Agregar');
    await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('Para agregar un Item, debes especificar su Codigo Alternativo.')).toBeTruthy();
  });

  it('S-MST-27 the Familia, Marca, Descripcion and U. Stock sentences follow in order', async () => {
    const user = renderItems();
    await openRegister(user, 'Agregar');
    const confirm = async (sentence: string) => {
      await user.click(within(dialog()).getByRole('button', { name: 'Aceptar' }));
      expect(await screen.findByText(`Para agregar un Item, debes especificar su ${sentence}.`)).toBeTruthy();
    };
    await user.type(field('Cod. Alterno'), 'zz-1');
    await confirm('Familia');
    await user.selectOptions(select('Familia'), '001');
    await confirm('Marca');
    await user.selectOptions(select('Marca'), '001');
    await confirm('Descripcion');
    await user.type(field('Descripción'), 'arroz');
    await confirm('U. Stock');
  });
});

describe('items units follow the U. Stock (S-MST-28)', () => {
  it('choosing the U. Stock sets U. Compra and U. Venta to it and both are read-only', async () => {
    const user = renderItems();
    await openRegister(user, 'Agregar');
    expect([select('U. Compra').disabled, select('U. Venta').disabled, select('U. Stock').disabled]).toEqual([true, true, false]);
    await user.selectOptions(select('U. Stock'), '002');
    expect([selected('U. Stock'), selected('U. Compra'), selected('U. Venta')]).toEqual(['KG', 'KG', 'KG']);
    await user.selectOptions(select('U. Stock'), '004');
    expect([selected('U. Compra'), selected('U. Venta')]).toEqual(['CJ', 'CJ']);
  });
});

describe('items tipo (S-MST-28)', () => {
  it('Transporte sets Serv.Transporte on, Kardex off and hides the perecible panel; Producto brings Kardex and the panel back', async () => {
    const user = renderItems();
    await openRegister(user, 'Agregar');
    await user.selectOptions(select('Tipo'), 'T');
    expect([box('Kardex').checked, box('Serv.Transporte').checked, screen.queryByRole('radio', { name: 'No perecible' }), screen.queryByLabelText('dias |')]).toEqual([false, true, null, null]);
    await user.selectOptions(select('Tipo'), 'C');
    expect([box('Kardex').checked, box('Serv.Transporte').checked]).toEqual([false, false]);
    await user.selectOptions(select('Tipo'), 'P');
    expect([box('Kardex').checked, box('Serv.Transporte').checked]).toEqual([true, false]);
    expect([screen.getByRole('radio', { name: 'No perecible' }), screen.getByLabelText('dias |')]).toHaveLength(2);
  });

  it('Kardex and Serv.Transporte are read-only', async () => {
    const user = renderItems();
    await openRegister(user, 'Agregar');
    expect([box('Kardex').disabled, box('Serv.Transporte').disabled]).toEqual([true, true]);
  });

  it('changing the tipo resets Perecible to No perecible and the dias to 0', async () => {
    const user = renderItems();
    await openRegister(user, 'Agregar');
    await user.click(screen.getByRole('radio', { name: 'Perecible' }));
    await user.clear(field('dias |'));
    await user.type(field('dias |'), '12');
    await user.selectOptions(select('Tipo'), 'C');
    await user.selectOptions(select('Tipo'), 'P');
    expect([(screen.getByRole('radio', { name: 'No perecible' }) as HTMLInputElement).checked, field('dias |').value]).toEqual([true, '0']);
  });
});

describe('items familia chain and clase SUNAT (S-MST-29)', () => {
  it('the subfamilia is disabled until a familia is chosen, loads for it and clears when the familia changes', async () => {
    const user = renderItems();
    await openRegister(user, 'Agregar');
    expect(select('SubFamilia').disabled).toBe(true);
    await user.selectOptions(select('Familia'), '001');
    await waitFor(() => expect(optionsOf('SubFamilia')).toEqual([SELECCIONE, 'FRUTAS', 'VERDURAS']));
    await user.selectOptions(select('SubFamilia'), '001');
    await user.selectOptions(select('Familia'), '002');
    await waitFor(() => expect(optionsOf('SubFamilia')).toEqual([SELECCIONE, 'LECHE']));
    expect(selected('SubFamilia')).toBe(SELECCIONE);
  });

  it('the Codigo Sunat options follow the SUNAT code of the subfamilia and are empty without one', async () => {
    const user = renderItems();
    await openRegister(user, 'Agregar');
    await user.selectOptions(select('Familia'), '001');
    await waitFor(() => expect(optionsOf('SubFamilia')).toHaveLength(3));
    await user.selectOptions(select('SubFamilia'), '001');
    await waitFor(() => expect(optionsOf('Codigo Sunat')).toEqual([SELECCIONE, 'MANZANAS', 'PERAS']));
    await user.selectOptions(select('Familia'), '003');
    await user.selectOptions(select('Familia'), '001');
    await waitFor(() => expect(optionsOf('SubFamilia')).toHaveLength(3));
    expect(optionsOf('Codigo Sunat')).toEqual([SELECCIONE]);
  });
});

describe('items tax (S-MST-29)', () => {
  it('INAFECTO shows Porc. IGV 0 read-only; AFECTO again shows the company percentage and it is editable', async () => {
    const user = renderItems();
    await openRegister(user, 'Agregar');
    expect(field('Porc. IGV').readOnly).toBe(false);
    await user.selectOptions(select('Afecto a IGV'), 'INAFECTO');
    expect([field('Porc. IGV').value, field('Porc. IGV').readOnly]).toEqual(['0', true]);
    await user.selectOptions(select('Afecto a IGV'), 'AFECTO');
    expect([field('Porc. IGV').value, field('Porc. IGV').readOnly]).toEqual(['18', false]);
  });

  it('the company percentage is the session one: PORC_IGV 10 opens the form on 10', async () => {
    const user = renderItems({ ...DEMO_PARAMS, PORC_IGV: 10 });
    await openRegister(user, 'Agregar');
    expect(field('Porc. IGV').value).toBe('10');
  });

  it('Suj. Percepción and Porc. Perc are read-only', async () => {
    const user = renderItems();
    await openRegister(user, 'Agregar');
    expect([box('Suj. Percepción').disabled, field('Porc. Perc').readOnly]).toEqual([true, true]);
  });
});

describe('items prices behind IS_ITEM_RESUMEN_PRECIO (S-MST-31)', () => {
  it('the six prices show with the parameter on and a blank one leaves 0', async () => {
    const user = renderItems();
    await openRegister(user, 'Agregar');
    const labels = ['Soles - Tarjeta', 'Soles - Publico', 'Soles - Mayor', 'Dolares - Tarjeta', 'Dolares - Publico', 'Dolares - Mayor'].map((l) => `Precio ${l}`);
    expect(labels.map((l) => field(l).value)).toEqual(Array(6).fill('0'));
    await user.clear(field('Precio Soles - Publico'));
    await user.tab();
    expect(field('Precio Soles - Publico').value).toBe('0');
  });

  it('with the parameter off no price is drawn', async () => {
    const user = renderItems({ ...DEMO_PARAMS, IS_ITEM_RESUMEN_PRECIO: false });
    await openRegister(user, 'Agregar');
    expect(screen.queryByLabelText('Precio Soles - Tarjeta')).toBeNull();
  });

  it('Composicion and Funcion show only with ISBOTICA or IS_BOTICA_SIN_LOTE', async () => {
    const user = renderItems({ ...DEMO_PARAMS, IS_BOTICA_SIN_LOTE: true });
    await openRegister(user, 'Agregar');
    expect([screen.getByLabelText('Composicion'), screen.getByLabelText('Funcion')].length).toBe(2);
  });
});

describe('items UPDATE restores what is stored', () => {
  it('shows the stored chain, units, tipo, perecible, tax and prices', async () => {
    const user = renderItems();
    await openRegister(user, 'Modificar', 'MANZANA ROJA X KG');
    await waitFor(() => expect(selected('SubFamilia')).toBe('FRUTAS'));
    expect([selected('Familia'), selected('Marca'), selected('U. Stock'), selected('U. Compra'), selected('Tipo'), selected('Afecto a IGV')]).toEqual(['ABARROTES', 'SONY', 'KG', 'KG', 'Producto', 'AFECTO']);
    expect([(screen.getByRole('radio', { name: 'Perecible' }) as HTMLInputElement).checked, field('dias |').value, field('Porc. IGV').value, field('Precio Soles - Tarjeta').value, box('Kardex').checked]).toEqual([true, '7', '18', '4.5', true]);
    await waitFor(() => expect(selected('Codigo Sunat')).toBe('MANZANAS'));
  });

  it('a stored INAFECTO item restores 0 read-only', async () => {
    const user = renderItems();
    await openRegister(user, 'Modificar', 'SERVICIO DE TRANSPORTE');
    await waitFor(() => expect(selected('Afecto a IGV')).toBe('INAFECTO'));
    expect([field('Porc. IGV').value, field('Porc. IGV').readOnly, box('Serv.Transporte').checked]).toEqual(['0', true, true]);
  });
});
