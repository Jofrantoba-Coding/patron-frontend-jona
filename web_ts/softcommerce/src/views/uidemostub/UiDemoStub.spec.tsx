import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DENY_ALL } from '../../domain/permissions';
import { UiDemoStub } from './UiDemoStub';

describe('UiDemoStub', () => {
  it('keeps what is typed in the filter', async () => {
    const user = userEvent.setup();
    render(<UiDemoStub permissions={DENY_ALL} />);
    const filter = screen.getByLabelText('Filtro') as HTMLInputElement;

    await user.type(filter, 'lim');

    expect(filter.value).toBe('lim');
  });

  it('lists the granted actions it received, in flag order', () => {
    render(<UiDemoStub permissions={{ ...DENY_ALL, refresh: true, add: true }} />);

    expect(screen.getByText('Acciones permitidas: add, refresh').tagName).toBe('P');
  });

  it('says there are no allowed actions when every flag is denied', () => {
    render(<UiDemoStub permissions={DENY_ALL} />);

    expect(screen.getByText('Acciones permitidas: ninguna')).toBeTruthy();
  });
});
