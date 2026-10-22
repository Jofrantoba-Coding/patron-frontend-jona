import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DENY_ALL, PERMISSION_FLAGS, type Permissions } from '../../domain/permissions';
import { ApiError } from '../../services/ApiError';
import type { InterShellService } from '../../services/InterShellService';
import { FormHost } from './FormHost';

const granted = (flags: Partial<Permissions>): Permissions => ({ ...DENY_ALL, ...flags });

function fakeShell(permissions: InterShellService['permissions']): InterShellService {
  return { menu: vi.fn(async () => []), permissions: vi.fn(permissions) };
}

/** Child that shows the flags it received, as a form toolbar would consume them. */
const showFlags = (permissions: Permissions) => (
  <output aria-label="flags">{PERMISSION_FLAGS.filter((flag) => permissions[flag]).join(',') || 'none'}</output>
);

describe('FormHost permissions', () => {
  it('S-SHELL-7 requests the permissions once and exposes the 13 flags to the form', async () => {
    const received: Permissions[] = [];
    const service = fakeShell(async () => granted({ add: true, export: true }));
    const { rerender } = render(
      <FormHost formId="mi_localidad" service={service}>
        {(permissions) => (received.push(permissions), showFlags(permissions))}
      </FormHost>,
    );

    expect((await screen.findByLabelText('flags')).textContent).toBe('add,export');
    rerender(
      <FormHost formId="mi_localidad" service={service}>
        {(permissions) => (received.push(permissions), showFlags(permissions))}
      </FormHost>,
    );

    expect(service.permissions).toHaveBeenCalledTimes(1);
    expect(service.permissions).toHaveBeenCalledWith('mi_localidad');
    expect(Object.keys(received.at(-1)!)).toEqual([...PERMISSION_FLAGS]);
  });

  it('asks for the permissions of the form it hosts, not a fixed one', async () => {
    const service = fakeShell(async (formId) => granted({ modify: formId === 'demo_stub' }));

    render(<FormHost formId="demo_stub" service={service}>{showFlags}</FormHost>);

    expect((await screen.findByLabelText('flags')).textContent).toBe('modify');
    expect(service.permissions).toHaveBeenCalledWith('demo_stub');
  });

  it('shows a loading message and no form until the permissions arrive', async () => {
    let resolve!: (value: Permissions) => void;
    const service = fakeShell(() => new Promise<Permissions>((r) => (resolve = r)));
    render(<FormHost formId="demo_stub" service={service}>{showFlags}</FormHost>);

    expect(screen.getByText('Cargando permisos...')).toBeTruthy();
    expect(screen.queryByLabelText('flags')).toBeNull();

    resolve(granted({ add: true }));
    expect((await screen.findByLabelText('flags')).textContent).toBe('add');
    expect(screen.queryByText('Cargando permisos...')).toBeNull();
  });

  it('S-SHELL-9 shows the error with its trace id and gives the form every flag denied', async () => {
    const service = fakeShell(async () => {
      throw new ApiError(500, { code: 'INTERNAL_ERROR', message: 'Unexpected server error', details: [], traceId: 'trace-77' });
    });

    render(<FormHost formId="mi_localidad" service={service}>{showFlags}</FormHost>);

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Unexpected server error');
    expect(alert.textContent).toContain('trace-77');
    expect(screen.getByLabelText('flags').textContent).toBe('none');
  });
});
