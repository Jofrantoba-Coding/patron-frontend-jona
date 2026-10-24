// Layer: Implementation. The Activar dialog of Autorizar Series: the punto de venta / tipo / serie chain, the Fecha de Inicio and Guardar.
import { useState } from 'react';
import { displayToIso, isoToDisplay, todayIso } from '../../../mock-server/core/dates.js';
import { useServices } from '../../services/ServicesContext';
import { useGuardedClose } from '../uishell/DialogStackProvider';
import type { ActivarValues, InterActivarSerieDialog } from './InterUiAutorizarSeries';
import { messageOf } from './messageOf';

export interface ActivarTarget {
  catalog: string;
  parentId: string;
  /** The server message of the created authorization. */
  onDone: (message: string) => void;
  onClose: () => void;
}

const FECHA_INVALIDA = 'Fecha de Inicio no es valida';

export function useActivarSerieDialogImpl({ catalog, parentId, onDone, onClose }: ActivarTarget): InterActivarSerieDialog {
  const { lookup, actions } = useServices();
  const [values, setValues] = useState<ActivarValues>({ id_punto_venta: '', id_tipo_doc: '', id_correlativo: '', fecha_inicio: isoToDisplay(todayIso()) });
  const [noSerie, setNoSerie] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const guardedClose = useGuardedClose(true, onClose);

  // Changing the punto de venta or the tipo clears the serie and its id; the series of the new pair load by themselves (desktop `itemListener`).
  const change = (patch: Partial<ActivarValues>) => {
    setValues((current) => ({ ...current, ...patch, id_correlativo: '' }));
    setNoSerie(false);
  };

  const onSave = async () => {
    const fecha = displayToIso(values.fecha_inicio);
    if (fecha === null) return setError(FECHA_INVALIDA);
    setSaving(true);
    setError(undefined);
    try {
      const { message } = await actions(catalog).run({ id: parentId, child: 'series' }, 'activate', { ...values, fecha_inicio: fecha });
      onDone(message ?? '');
    } catch (failure) {
      setError(messageOf(failure)); // the dialog stays open and the grid is unchanged (S-ACT-9)
      setSaving(false);
    }
  };

  return {
    values,
    noSerie,
    error,
    saving,
    loadPuntos: () => lookup.options('punto-venta'),
    loadTipos: () => lookup.options('tipos-doc-venta'),
    loadSeries: async (filters) => {
      const items = await lookup.options('correlativos', { ...filters, estado: 'A' });
      setNoSerie(items.length === 0);
      return items;
    },
    onPuntoChange: (id_punto_venta) => change({ id_punto_venta }),
    onTipoChange: (id_tipo_doc) => change({ id_tipo_doc }),
    onSerieChange: (id_correlativo) => setValues((current) => ({ ...current, id_correlativo })),
    onFechaChange: (fecha_inicio) => setValues((current) => ({ ...current, fecha_inicio })),
    onSave: () => void onSave(),
    onClose: guardedClose,
  };
}
