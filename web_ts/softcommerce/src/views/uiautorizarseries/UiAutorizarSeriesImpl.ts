// Layer: Implementation. The series grid of one usuario, Desactivar and the notices of the Autorizar Series panel.
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ListPanelProps } from '../uicrudlist/UiCrudList';
import { useServices } from '../../services/ServicesContext';
import { toFailure } from '../../shared/toFailure';
import { NO_SELECTION } from '../uicrudlist/UiCrudListImpl';
import { useGuardedClose } from '../uishell/DialogStackProvider';
import type { InterUiAutorizarSeries, SerieRow, SeriesNotice } from './InterUiAutorizarSeries';
import { messageOf } from './messageOf';

const FETCH_ALL = { page: 1, pageSize: 1000 };
/** The desktop `JOptionPane.showMessageDialog(null, msg)` has no title: the Swing default is `Mensaje`. */
const MESSAGE_TITLE = 'Mensaje';

export function useUiAutorizarSeriesImpl({ config, row, permissions, onClose }: ListPanelProps<Record<string, string>>): InterUiAutorizarSeries {
  const { children, actions } = useServices();
  const resource = config.resources?.find((r) => r.name === 'series');
  const parentId = String(row[config.idKey]);
  const service = useMemo(() => children(config.catalog), [children, config.catalog]);
  const [rows, setRows] = useState<SerieRow[]>([]);
  const [status, setStatus] = useState<InterUiAutorizarSeries['status']>('loading');
  const [loadError, setLoadError] = useState<string | undefined>();
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [notice, setNotice] = useState<SeriesNotice | undefined>();
  const [activating, setActivating] = useState(false);
  const idKey = String(resource?.config.idKey ?? 'id');
  const guardedClose = useGuardedClose(true, onClose);

  const refresh = useCallback(async () => {
    try {
      const page = await service.list<SerieRow>(parentId, 'series', FETCH_ALL);
      setRows(page.items);
      setStatus('ready');
      setSelectedId((current) => (page.items.some((r) => String(r[idKey]) === current) ? current : undefined));
    } catch (error) {
      setStatus('failed');
      setLoadError(toFailure(error).message);
    }
  }, [service, parentId, idKey]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Each action is gated by the flag it declares; an absent permission fails closed.
  const allowed = (id: string) => {
    const action = resource?.actions?.find((a) => a.id === id);
    return action !== undefined && permissions[action.flag] === true;
  };

  const onDesactivar = async () => {
    if (!allowed('deactivate')) return;
    if (!selectedId) return setNotice(NO_SELECTION);
    try {
      const result = await actions(config.catalog).run({ id: parentId, child: 'series', childId: selectedId }, 'deactivate');
      setNotice({ title: MESSAGE_TITLE, message: result.message ?? '' });
      await refresh();
    } catch (error) {
      setNotice({ title: MESSAGE_TITLE, message: messageOf(error) });
    }
  };

  return {
    catalog: config.catalog,
    parentId,
    trabajador: row.nombre ?? '',
    usuario: row.usuario ?? '',
    columns: (resource?.config.columns ?? []).map(({ key, header }) => ({ key, header })),
    idKey,
    rows,
    selectedId,
    status,
    loadError,
    canActivar: allowed('activate'),
    canDesactivar: allowed('deactivate'),
    notice,
    activating,
    onSelectRow: setSelectedId,
    onActivar: () => allowed('activate') && setActivating(true),
    onDesactivar: () => void onDesactivar(),
    onActivated: (message) => {
      setActivating(false);
      setNotice({ title: MESSAGE_TITLE, message });
      void refresh();
    },
    onCloseActivar: () => setActivating(false),
    onCloseNotice: () => setNotice(undefined),
    onClose: guardedClose,
  };
}
