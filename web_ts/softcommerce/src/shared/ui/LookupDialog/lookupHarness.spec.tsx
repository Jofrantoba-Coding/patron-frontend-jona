import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PICKERS } from '../../../../mock-server/registry/pickers.js';
import { ServicesProvider } from '../../../services/ServicesContext';
import type { AppServices } from '../../../services/serviceComposer';
import { DialogStackProvider } from '../../../views/uishell/DialogStackProvider';
import { LookupHarness } from './lookupHarness';

/** Every source answers with one row that holds each column's key as its text. */
const services = {
  catalog: () => ({ list: async () => ({ items: [Object.fromEntries(Object.values<any>(PICKERS).flatMap((p) => p.columns.map((c: { key: string }) => [c.key, c.key])))], pagination: { page: 1, pageSize: 10, total: 1 } }) }),
  lookup: { options: async () => [] },
} as unknown as AppServices;

describe('lookup harness over the seven named pickers (R-LKP-7)', () => {
  it.each(Object.entries<any>(PICKERS))('%s opens with its title, filter labels and column order', async (name, picker) => {
    const user = userEvent.setup();
    render(<DialogStackProvider><ServicesProvider services={services}><LookupHarness /></ServicesProvider></DialogStackProvider>);
    await user.click(screen.getByRole('button', { name }));
    const dialog = await screen.findByRole('dialog');
    if (picker.title) expect(within(dialog).getByText(picker.title)).toBeTruthy();
    for (const filter of picker.filters) expect(within(dialog).getByLabelText(filter.label)).toBeTruthy();
    for (const extra of picker.extras ?? []) expect(within(dialog).getByLabelText(extra.label)).toBeTruthy();
    expect(within(dialog).getByRole('button', { name: picker.pickLabel })).toBeTruthy();
    expect(Boolean(within(dialog).queryByRole('button', { name: 'Refrescar' }))).toBe(Boolean(picker.refresh));
    await screen.findByRole('group', { name: 'Resultados' });
    expect(within(dialog).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(picker.columns.map((c: { header: string }) => c.header));
  });
});
