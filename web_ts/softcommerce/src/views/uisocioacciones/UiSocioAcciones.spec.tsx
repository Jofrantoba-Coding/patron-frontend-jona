import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DENY_ALL } from '../../domain/permissions';
import { ServicesProvider } from '../../services/ServicesContext';
import { createAppServicesMock } from '../../services/mock/AppServicesMock';
import { DialogStackProvider } from '../uishell/DialogStackProvider';
import { UiSocioAcciones } from './UiSocioAcciones';

/** The real screen over the in-browser mock and its seed: one active price (12.5 since 01/06/2026) and one active socio (RAMOS DIAZ LUIS, 100). */
function renderScreen() {
  const services = createAppServicesMock('exitoso', { getSession: () => ({ tenantId: 'demo' }), getRequestContext: () => ({ userId: '1', empresaId: '1' }), delayMs: 0 });
  const save = vi.spyOn(services.socioAcciones, 'save');
  render(
    <ServicesProvider services={services}>
      <DialogStackProvider>
        <UiSocioAcciones permissions={{ ...DENY_ALL }} />
      </DialogStackProvider>
    </ServicesProvider>,
  );
  return { user: userEvent.setup(), services, save };
}
type User = ReturnType<typeof userEvent.setup>;

/** jona-ui gives every dialog the same `aria-labelledby` id, so a nested dialog has the name of the first one: dialogs are found by their own title element. */
const queryTitled = (title: string) =>
  screen.queryAllByRole('dialog').find((el) => [...el.querySelectorAll('[id="jdialog-title"]')].some((h) => h.textContent === title)) ?? null;
const findTitled = (title: string) => waitFor(() => expect(queryTitled(title)).not.toBeNull()).then(() => queryTitled(title) as HTMLElement);
const main = () => queryTitled('Acciones de Socio') as HTMLElement;
const top = () => screen.getAllByRole('dialog').at(-1) as HTMLElement;
const open = async () => {
  const page = renderScreen();
  await screen.findByRole('tab', { name: 'Socios' });
  // The tabs draw while the lists load: wait for the seeded socio row before any step reads them.
  await within(screen.getByRole('tabpanel', { name: 'Socios' })).findByText('RAMOS DIAZ LUIS');
  return page;
};
const toPrecio = async (user: User) => {
  await user.click(screen.getByRole('tab', { name: 'Precio' }));
  return within(screen.getByRole('tabpanel', { name: 'Precio' }));
};
const notice = async (text: string) => {
  expect(await screen.findByText(text)).toBeTruthy();
};
const dismiss = async (user: User) => user.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Aceptar' }));
const TODAY = /^\d\d\/\d\d\/\d{4}$/;

/** Deactivates the active price with today as fecha fin (select the row, confirm, press Desactivar in the dialog). */
async function deactivatePrice(user: User) {
  const precios = await toPrecio(user);
  await user.click(precios.getByText('12.5'));
  await user.click(precios.getByRole('button', { name: 'Desactivar' }));
  await user.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Aceptar' }));
  await user.click(within(await findTitled('Desactivar Precio')).getByRole('button', { name: 'Desactivar' }));
  await waitFor(() => expect(queryTitled('Desactivar Precio')).toBeNull());
  return precios;
}

describe('R-MST-16 the screen is one modal with the tabs Socios and Precio', () => {
  it('lists the socios and the prices as the desktop tables do', async () => {
    const { user } = await open();

    const socios = within(screen.getByRole('tabpanel', { name: 'Socios' }));
    expect(socios.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['ESTADO', 'ID', 'NUM_DOC', 'SOCIO', 'CANTIDAD', 'PRECIO', 'F_INICIO', 'F_FIN']);
    expect(socios.getByText('RAMOS DIAZ LUIS')).toBeTruthy();
    const precios = await toPrecio(user);
    expect(precios.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['ESTADO', 'ID', 'PRECIO', 'F_INICIO', 'F_FIN']);
    expect(precios.getAllByRole('row')).toHaveLength(3);
    expect(within(main()).getByRole('button', { name: 'Aceptar' })).toBeTruthy();
    expect(within(main()).getByRole('button', { name: 'Cancelar' })).toBeTruthy();
  });
});

describe('S-MST-33 the price side', () => {
  it('Activar with an active price says `No se Puede Agregar mas de un Precio` and opens nothing', async () => {
    const { user } = await open();
    const precios = await toPrecio(user);

    await user.click(precios.getByRole('button', { name: 'Activar' }));

    await notice('No se Puede Agregar mas de un Precio');
    expect(queryTitled('Activar Precio')).toBeNull();
  });

  it('Desactivar needs a selected row (`Seleccionar Fila`) and refuses a deactivated price', async () => {
    const { user } = await open();
    const precios = await toPrecio(user);

    await user.click(precios.getByRole('button', { name: 'Desactivar' }));
    await notice('Seleccionar Fila');
    await dismiss(user);
    await user.click(precios.getByText('10'));
    await user.click(precios.getByRole('button', { name: 'Desactivar' }));
    await notice('Precio Seleccionado ya esta desactivado');
  });

  it('Desactivar with a fecha fin not after the inicio says `Fecha es menor a fecha inicial` and nothing changes', async () => {
    const { user } = await open();
    const precios = await toPrecio(user);
    await user.click(precios.getByText('12.5'));
    await user.click(precios.getByRole('button', { name: 'Desactivar' }));
    await user.click(within(await screen.findByRole('alertdialog')).getByRole('button', { name: 'Aceptar' }));

    const dialog = await findTitled('Desactivar Precio');
    expect((within(dialog).getByLabelText('Precio') as HTMLInputElement).readOnly).toBe(true);
    expect((within(dialog).getByLabelText('Fecha Fin') as HTMLInputElement).value).toMatch(TODAY);
    const fecha = within(dialog).getByLabelText('Fecha Fin');
    await user.clear(fecha);
    await user.type(fecha, '01062026');
    await user.click(within(dialog).getByRole('button', { name: 'Desactivar' }));

    await notice('Fecha es menor a fecha inicial');
    await dismiss(user);
    expect(queryTitled('Desactivar Precio')).toBeTruthy();
    expect(precios.getAllByRole('row')[2].textContent).toContain('Activo');
  });

  it('with no active price, Activar Precio with a blank precio says `Ingrese Precio`; a valid price is applied to every active socio row', async () => {
    const { user } = await open();
    const precios = await deactivatePrice(user);

    await user.click(precios.getByRole('button', { name: 'Activar' }));
    const dialog = await findTitled('Activar Precio');
    await user.click(within(dialog).getByRole('button', { name: 'Activar' }));
    await notice('Ingrese Precio');
    await dismiss(user);
    await user.type(within(dialog).getByLabelText('Precio'), '15');
    await user.click(within(dialog).getByRole('button', { name: 'Activar' }));

    await waitFor(() => expect(queryTitled('Activar Precio')).toBeNull());
    expect(precios.getAllByRole('row')).toHaveLength(4);
    await user.click(screen.getByRole('tab', { name: 'Socios' }));
    const row = within(screen.getByRole('tabpanel', { name: 'Socios' })).getByText('RAMOS DIAZ LUIS').closest('tr')!;
    expect(row.textContent).toContain('15');
    expect(row.textContent).not.toContain('12.5');
  });
});

describe('S-MST-34 the socio side', () => {
  const openActivarSocio = async (user: User) => {
    await user.click(within(screen.getByRole('tabpanel', { name: 'Socios' })).getByRole('button', { name: 'Activar' }));
    return findTitled('Activar Socio');
  };

  it('Activar Socio checks the cantidad, then the selection, then an already active socio', async () => {
    const { user } = await open();
    const dialog = await openActivarSocio(user);
    await within(dialog).findByText('TRANSPORTES ANDINOS SAC');

    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));
    await notice('Ingrese Cantidad');
    await dismiss(user);
    await user.type(within(dialog).getByLabelText('Cantidad'), '5');
    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));
    await notice('Seleccione un registro de la tabla');
    await dismiss(user);
    await user.click(within(dialog).getByText('RAMOS DIAZ LUIS'));
    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));
    await notice('Socio ya esta activado');
  });

  it('a new socio row takes the current price', async () => {
    const { user } = await open();
    const dialog = await openActivarSocio(user);
    await user.click(await within(dialog).findByText('TRANSPORTES ANDINOS SAC'));
    await user.type(within(dialog).getByLabelText('Cantidad'), '5');
    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));

    await waitFor(() => expect(queryTitled('Activar Socio')).toBeNull());
    const row = within(screen.getByRole('tabpanel', { name: 'Socios' })).getByText('TRANSPORTES ANDINOS SAC').closest('tr')!;
    expect(row.textContent).toContain('12.5');
    expect(row.textContent).toContain('5');
  });

  it('filters the socio picker by Código, DNI/RUC and R. Social (contains)', async () => {
    const { user } = await open();
    const dialog = await openActivarSocio(user);
    await within(dialog).findByText('TRANSPORTES ANDINOS SAC');

    await user.type(within(dialog).getByLabelText('R. Social'), 'ramos');

    expect(within(dialog).queryByText('TRANSPORTES ANDINOS SAC')).toBeNull();
    expect(within(dialog).getByText('RAMOS DIAZ LUIS')).toBeTruthy();
  });

  it('Desactivar on the socio tab does nothing, as the desktop button (empty handler)', async () => {
    const { user } = await open();

    await user.click(within(screen.getByRole('tabpanel', { name: 'Socios' })).getByRole('button', { name: 'Desactivar' }));

    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
  });
});

describe('S-MST-35 Aceptar and Cancelar', () => {
  it('with no active price, Aceptar says `Ingrese Precio` and sends nothing', async () => {
    const { user, save } = await open();
    await deactivatePrice(user);

    await user.click(within(main()).getByRole('button', { name: 'Aceptar' }));

    await notice('Ingrese Precio');
    expect(save).not.toHaveBeenCalled();
  });

  it('a price and socios save once, atomically, with the changed ops only; the server message shows and the dialog closes', async () => {
    const { user, save, services } = await open();
    await user.click(within(screen.getByRole('tabpanel', { name: 'Socios' })).getByRole('button', { name: 'Activar' }));
    const dialog = await findTitled('Activar Socio');
    await user.click(await within(dialog).findByText('TRANSPORTES ANDINOS SAC'));
    await user.type(within(dialog).getByLabelText('Cantidad'), '5');
    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));
    await waitFor(() => expect(queryTitled('Activar Socio')).toBeNull());

    await user.click(within(main()).getByRole('button', { name: 'Aceptar' }));

    await notice('Acciones guardadas correctamente');
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0]).toEqual({ precios: [], socios: [{ op: 'I', id_socio: '2', cantidad: 5, fecha_inicio: expect.stringMatching(/^\d{4}-\d\d-\d\d$/) }] });
    expect(queryTitled('Acciones de Socio')).toBeNull();
    expect((await services.socioAcciones.load()).socios).toHaveLength(2);
  });

  it('Cancelar persists nothing and closes', async () => {
    const { user, save, services } = await open();
    await user.click(within(screen.getByRole('tabpanel', { name: 'Socios' })).getByRole('button', { name: 'Activar' }));
    const dialog = await findTitled('Activar Socio');
    await user.click(await within(dialog).findByText('TRANSPORTES ANDINOS SAC'));
    await user.type(within(dialog).getByLabelText('Cantidad'), '5');
    await user.click(within(dialog).getByRole('button', { name: 'Agregar' }));
    await waitFor(() => expect(queryTitled('Activar Socio')).toBeNull());

    await user.click(within(main()).getByRole('button', { name: 'Cancelar' }));

    expect(queryTitled('Acciones de Socio')).toBeNull();
    expect(save).not.toHaveBeenCalled();
    expect((await services.socioAcciones.load()).socios).toHaveLength(1);
  });

  it('a refusal of the server shows its sentence and keeps the dialog and the edits', async () => {
    const { user, services } = await open();
    vi.spyOn(services.socioAcciones, 'save').mockRejectedValueOnce(new Error('boom'));

    await user.click(within(main()).getByRole('button', { name: 'Aceptar' }));

    await notice('boom');
    expect(top()).toBe(main());
  });

  it('the closed screen can open the dialog again from a fresh load', async () => {
    const { user } = await open();
    await user.click(within(main()).getByRole('button', { name: 'Cancelar' }));

    await user.click(screen.getByRole('button', { name: 'Acciones de Socio' }));

    expect(await findTitled('Acciones de Socio')).toBeTruthy();
  });
});
