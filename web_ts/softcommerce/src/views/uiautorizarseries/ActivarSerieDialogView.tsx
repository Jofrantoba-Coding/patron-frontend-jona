// Layer: View. Pure render of the Activar dialog over props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JDialog } from 'jona-ui';
import { DateField } from '../../shared/ui/DateField';
import { DependentSelect } from '../../shared/ui/DependentSelect';
import { UppercaseTextField } from '../../shared/ui/UppercaseTextField';
import { ACTIVARSERIEDIALOG_DEFAULTS, type InterActivarSerieDialog } from './InterUiAutorizarSeries';

type ViewProps = InterActivarSerieDialog & typeof ACTIVARSERIEDIALOG_DEFAULTS;

const SERIE_PARENTS = [{ field: 'id_punto_venta', filterKey: 'id_punto_venta' }, { field: 'id_tipo_doc', filterKey: 'id_tipo_doc' }];

export function ActivarSerieDialogView(props: ViewProps) {
  const { values } = props;
  return (
    <JDialog
      open
      title={props.title}
      size="md"
      onClose={props.onClose}
      footer={<JButton className="min-h-11 sm:min-h-9" disabled={props.saving} onClick={props.onSave}>{props.saveLabel}</JButton>}
    >
      <div className="grid min-w-0 gap-3">
        {props.error && <JAlert variant="danger" role="alert">{props.error}</JAlert>}
        <DependentSelect name="id_punto_venta" label={props.puntoLabel} parents={[]} values={{ ...values }} load={props.loadPuntos} onChange={props.onPuntoChange} />
        <DependentSelect name="id_tipo_doc" label={props.tipoLabel} parents={[]} values={{ ...values }} load={props.loadTipos} onChange={props.onTipoChange} />
        <div className="grid min-w-0 gap-3 sm:grid-cols-2">
          <DependentSelect name="id_correlativo" label={props.serieLabel} parents={SERIE_PARENTS} values={{ ...values }} load={props.loadSeries} onChange={props.onSerieChange} />
          <label className="grid gap-1">
            <span>{props.idLabel}</span>
            <UppercaseTextField value={values.id_correlativo} readOnly onChange={() => undefined} />
          </label>
        </div>
        {props.noSerie && <JAlert variant="warning" role="alert">{props.noSerieLabel}</JAlert>}
        <DateField name="fecha_inicio" label={props.fechaLabel} value={values.fecha_inicio} onChange={props.onFechaChange} />
      </div>
    </JDialog>
  );
}
