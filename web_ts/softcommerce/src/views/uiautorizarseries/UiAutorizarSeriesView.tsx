// Layer: View. Pure render of the Autorizar Series panel over props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JDialog } from 'jona-ui';
import { isoToDisplay } from '../../../mock-server/core/dates.js';
import { CrudGrid } from '../../shared/ui/CrudGrid';
import { GuardedOptionPane } from '../uishell/DialogStackProvider';
import { ActivarSerieDialog } from './ActivarSerieDialog';
import { UIAUTORIZARSERIES_DEFAULTS, type InterUiAutorizarSeries, type SerieRow } from './InterUiAutorizarSeries';

type ViewProps = InterUiAutorizarSeries & typeof UIAUTORIZARSERIES_DEFAULTS;

/** Floors, not fixed heights: 44px touch target on mobile, compact from `sm`. */
const TOUCH = 'min-h-11 sm:min-h-9';

/** The estado reads as the desktop letter's meaning and the dates as dd/MM/yyyy. */
const cell = (row: SerieRow, key: string) => {
  if (key === 'habilitar') return row.habilitar === false ? 'Desactivado' : 'Activo';
  if (key === 'fecha_inicio' || key === 'fecha_fin') return isoToDisplay(row[key]);
  return undefined;
};

export function UiAutorizarSeriesView(props: ViewProps) {
  return (
    <JDialog open title={props.title} size="lg" onClose={props.onClose}>
      <div className="grid min-w-0 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <JButton className={TOUCH} disabled={!props.canActivar} onClick={props.onActivar}>{props.activarLabel}</JButton>
          <JButton className={TOUCH} disabled={!props.canDesactivar} onClick={props.onDesactivar}>{props.desactivarLabel}</JButton>
          <span className="font-semibold">{props.trabajadorLabel}</span>
          <span>{props.trabajador}</span>
          <span className="font-semibold">{props.usuarioLabel}</span>
          <span>{props.usuario}</span>
        </div>
        {props.status === 'failed' && <JAlert variant="danger" role="alert">{props.loadError}</JAlert>}
        <div className="max-w-full overflow-auto">
          <CrudGrid<SerieRow> columns={props.columns} rows={props.rows} idKey={props.idKey} selectedId={props.selectedId} page={1} pageCount={1} hidePagination renderCell={cell} onRowSelect={props.onSelectRow} />
        </div>
      </div>
      {props.activating && <ActivarSerieDialog catalog={props.catalog} parentId={props.parentId} onDone={props.onActivated} onClose={props.onCloseActivar} />}
      <GuardedOptionPane open={props.notice !== undefined} variant="info" title={props.notice?.title ?? ''} description={props.notice?.message} confirmLabel={props.closeLabel} cancelLabel="Cerrar" onConfirm={props.onCloseNotice} onClose={props.onCloseNotice} />
    </JDialog>
  );
}
