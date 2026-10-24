// Layer: Implementation. Loads the flags of one form (or of every form) for a perfil, keeps the edits and saves the changed cells.
import { useEffect, useState } from 'react';
import type { Permissions } from '../../../domain/permissions';
import { useServices } from '../../../services/ServicesContext';
import { toFailure } from '../../../shared/toFailure';
import { useGuardedClose } from '../../uishell/DialogStackProvider';
import type { PerfilRow } from '../InterUiSeguridadPerfil';
import { changedCells, type InterPermisosDialog, type PermisoRow } from './InterPermisosDialog';

export interface PermisosTarget {
  perfil: PerfilRow;
  /** The option whose form is edited; absent for the matrix of every form. */
  node?: { descripcion: string; nombre: string };
}

export const SAVED = 'Permisos actualizados correctamente';

export function usePermisosDialogImpl({ perfil, node }: PermisosTarget, onClose: () => void): InterPermisosDialog {
  const { perfilGrants } = useServices();
  const [stored, setStored] = useState<PermisoRow[]>([]);
  const [edited, setEdited] = useState<PermisoRow[]>([]);
  const [status, setStatus] = useState<InterPermisosDialog['status']>('loading');
  const [loadError, setLoadError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<InterPermisosDialog['message']>();
  const guardedClose = useGuardedClose(true, onClose);
  const id = perfil.id_tipo_perfil;

  const show = (rows: PermisoRow[]) => {
    setStored(rows);
    setEdited(rows);
  };
  const rowsOf = (forms: ({ formId: string } & Permissions)[]): PermisoRow[] => forms.map(({ formId, ...flags }) => ({ formId, flags }));

  useEffect(() => {
    let live = true;
    const read = node ? perfilGrants.permiso(id, node.nombre).then((flags): PermisoRow[] => [{ formId: node.nombre, flags }]) : perfilGrants.permisos(id).then(rowsOf);
    read.then(
      (rows) => {
        if (!live) return;
        show(rows);
        setStatus('ready');
      },
      (error) => {
        if (!live) return;
        setLoadError(toFailure(error).message);
        setStatus('failed');
      },
    );
    return () => {
      live = false;
    };
  }, [perfilGrants, id, node]);

  const onSave = async () => {
    const changes = changedCells(stored, edited);
    setSaving(true);
    try {
      show(node ? [{ formId: node.nombre, flags: await perfilGrants.savePermiso(id, node.nombre, changes) }] : rowsOf(await perfilGrants.savePermisos(id, changes)));
      setMessage({ kind: 'ok', text: SAVED });
    } catch (error) {
      setMessage({ kind: 'error', text: toFailure(error).message }); // the edits stay
    } finally {
      setSaving(false);
    }
  };

  return {
    title: `Perfil ${perfil.descripcion}`,
    header: node ? `OPCION: ${node.descripcion.toUpperCase()}` : undefined,
    rows: edited,
    matrix: node === undefined,
    status,
    loadError,
    saving,
    message,
    onToggle: (formId, flag, value) => setEdited((rows) => rows.map((row) => (row.formId === formId ? { ...row, flags: { ...row.flags, [flag]: value } } : row))),
    onSave,
    onClose: guardedClose,
  };
}
