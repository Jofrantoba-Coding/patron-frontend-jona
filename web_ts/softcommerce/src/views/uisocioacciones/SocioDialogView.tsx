// Layer: View. Pure render of the Activar Socio dialog over props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JDialog } from 'jona-ui';
import { CrudGrid } from '../../shared/ui/CrudGrid';
import { DateField } from '../../shared/ui/DateField';
import { NumberField } from '../../shared/ui/NumberField';
import { UppercaseTextField } from '../../shared/ui/UppercaseTextField';
import { GuardedOptionPane } from '../uishell/DialogStackProvider';
import { SOCIODIALOG_DEFAULTS } from './InterUiSocioAcciones';
import type { SocioDialogViewProps, SocioPick } from './SocioDialogImpl';

type ViewProps = SocioDialogViewProps & typeof SOCIODIALOG_DEFAULTS;

const TOUCH = 'min-h-11 sm:min-h-9';

export function SocioDialogView(props: ViewProps) {
  const columns = [
    { key: 'id_socio', header: props.codigoLabel },
    { key: 'numero_doc', header: props.numeroLabel },
    { key: 'descripcion', header: props.descripcionLabel },
  ] satisfies { key: keyof SocioPick & string; header: string }[];
  const footer = (
    <>
      <JButton className={TOUCH} onClick={props.onAgregar}>{props.agregarLabel}</JButton>
      <JButton variant="outline" className={TOUCH} onClick={props.onRefrescar}>{props.refrescarLabel}</JButton>
      <JButton variant="outline" className={TOUCH} onClick={props.onClose}>{props.cancelarLabel}</JButton>
    </>
  );
  return (
    <>
      <JDialog open title={props.title} size="xl" onClose={props.onClose} footer={footer}>
        <div className="grid min-w-0 gap-3">
          <div className="grid min-w-0 gap-3 sm:grid-cols-3">
            <label className="grid gap-1">
              <span>{props.codigoLabel}</span>
              <UppercaseTextField value={props.codigo} maxLength={10} transform={(typed) => typed.replace(/\D/g, '')} className={TOUCH} onChange={props.onCodigoChange} />
            </label>
            <label className="grid gap-1">
              <span>{props.numeroLabel}</span>
              <UppercaseTextField value={props.numero} maxLength={11} transform={(typed) => typed.replace(/\D/g, '')} className={TOUCH} onChange={props.onNumeroChange} />
            </label>
            <label className="grid gap-1">
              <span>{props.descripcionLabel}</span>
              <UppercaseTextField value={props.descripcion} maxLength={100} uppercase className={TOUCH} onChange={props.onDescripcionChange} />
            </label>
          </div>
          {props.status === 'failed' && <JAlert variant="danger" role="alert">{props.loadError}</JAlert>}
          <CrudGrid
            ariaLabel="Socios disponibles"
            columns={columns}
            rows={props.rows}
            idKey="id_socio"
            selectedId={props.selectedId}
            page={1}
            pageCount={1}
            hidePagination
            onRowSelect={props.onSelect}
          />
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <NumberField name="cantidad" label={props.cantidadLabel} scale={1} value={props.cantidad} onChange={props.onCantidadChange} />
            <DateField name="fecha" label={props.fechaLabel} value={props.fecha} onChange={props.onFechaChange} />
          </div>
        </div>
      </JDialog>
      <GuardedOptionPane open={props.notice !== undefined} variant="info" title={props.notice?.title ?? ''} description={props.notice?.message} confirmLabel="Aceptar" cancelLabel="Cerrar" onConfirm={props.onCloseNotice} onClose={props.onCloseNotice} />
    </>
  );
}
