// Layer: View. Pure render of the Activar / Desactivar Precio dialog over props already resolved by the Impl; no state, effects or services.
import { JButton, JDialog } from 'jona-ui';
import { DateField } from '../../shared/ui/DateField';
import { NumberField } from '../../shared/ui/NumberField';
import { GuardedOptionPane } from '../uishell/DialogStackProvider';
import { PRECIODIALOG_DEFAULTS } from './InterUiSocioAcciones';
import type { PrecioDialogViewProps } from './PrecioDialogImpl';

type ViewProps = PrecioDialogViewProps & typeof PRECIODIALOG_DEFAULTS;

export function PrecioDialogView(props: ViewProps) {
  const label = props.mode === 'activar' ? props.activarLabel : props.desactivarLabel;
  return (
    <>
      <JDialog
        open
        title={props.title}
        size="md"
        onClose={props.onClose}
        footer={<JButton className="min-h-11 sm:min-h-9" onClick={props.onAccept}>{label}</JButton>}
      >
        <div className="grid min-w-0 gap-3">
          {/* Decimal field; Desactivar shows the stored price and cannot edit it (the desktop disables the box). */}
          <NumberField name="precio" label={props.precioLabel} scale={1} value={props.precio} readOnly={props.mode === 'desactivar'} onChange={props.onPrecioChange} />
          <DateField name="fecha" label={props.fechaLabel} value={props.fecha} onChange={props.onFechaChange} />
        </div>
      </JDialog>
      <GuardedOptionPane open={props.notice !== undefined} variant="info" title={props.notice?.title ?? ''} description={props.notice?.message} confirmLabel="Aceptar" cancelLabel="Cerrar" onConfirm={props.onCloseNotice} onClose={props.onCloseNotice} />
    </>
  );
}
