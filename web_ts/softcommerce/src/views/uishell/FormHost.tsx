// Layer: shell service. Loads a form's permissions on mount and hands them to its toolbar (R-SHELL-3).
import { JAlert } from 'jona-ui';
import { useEffect, useState, type ReactNode } from 'react';
import { DENY_ALL, type Permissions } from '../../domain/permissions';
import type { InterShellService } from '../../services/InterShellService';
import { toFailure } from '../../shared/toFailure';

type Load =
  | { status: 'loading' }
  | { status: 'ready'; permissions: Permissions }
  | { status: 'failed'; message: string; traceId?: string };

export interface FormHostProps {
  formId: string;
  service: InterShellService;
  /** Receives the 13 flags; on a failed load, every flag is `false` (fail closed). */
  children: (permissions: Permissions) => ReactNode;
}

export function FormHost({ formId, service, children }: FormHostProps) {
  const [load, setLoad] = useState<Load>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setLoad({ status: 'loading' });
    service
      .permissions(formId)
      .then((permissions) => active && setLoad({ status: 'ready', permissions }))
      .catch((error: unknown) => active && setLoad({ status: 'failed', ...toFailure(error) }));
    return () => {
      active = false;
    };
  }, [service, formId]);

  if (load.status === 'loading') return <p>Cargando permisos...</p>;
  if (load.status === 'ready') return <>{children(load.permissions)}</>;
  return (
    <>
      <JAlert variant="danger" role="alert">
        <span>{load.message}</span>
        {load.traceId ? <small> Código de seguimiento: {load.traceId}</small> : null}
      </JAlert>
      {children(DENY_ALL)}
    </>
  );
}
