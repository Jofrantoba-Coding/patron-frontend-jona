// Layer: View. Pure render of the Socio acciones screen over props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JDialog, JTabs, JTabsList, JTabsTrigger } from 'jona-ui';
import { CrudGrid } from '../../shared/ui/CrudGrid';
import { GuardedOptionPane } from '../uishell/DialogStackProvider';
import { UISOCIOACCIONES_DEFAULTS, type InterUiSocioAcciones, type PrecioGridRow, type SocioGridRow } from './InterUiSocioAcciones';
import { PrecioDialog } from './PrecioDialog';
import { SocioDialog } from './SocioDialog';

type ViewProps = InterUiSocioAcciones & typeof UISOCIOACCIONES_DEFAULTS;

/** Floors, not fixed heights: 44px touch target on mobile, compact from `sm`. */
const TOUCH = 'min-h-11 sm:min-h-9';

const PRECIO_COLUMNS: { key: keyof PrecioGridRow & string; header: string }[] = [
  { key: 'estado', header: 'ESTADO' },
  { key: 'id', header: 'ID' },
  { key: 'precio', header: 'PRECIO' },
  { key: 'f_inicio', header: 'F_INICIO' },
  { key: 'f_fin', header: 'F_FIN' },
];

const SOCIO_COLUMNS: { key: keyof SocioGridRow & string; header: string }[] = [
  { key: 'estado', header: 'ESTADO' },
  { key: 'id', header: 'ID' },
  { key: 'num_doc', header: 'NUM_DOC' },
  { key: 'socio', header: 'SOCIO' },
  { key: 'cantidad', header: 'CANTIDAD' },
  { key: 'precio', header: 'PRECIO' },
  { key: 'f_inicio', header: 'F_INICIO' },
  { key: 'f_fin', header: 'F_FIN' },
];

export function UiSocioAccionesView(props: ViewProps) {
  const { dialog, notice } = props;
  const footer = (
    <>
      <JButton className={TOUCH} disabled={props.status !== 'ready' || props.saving} onClick={props.onAceptar}>{props.aceptarLabel}</JButton>
      <JButton variant="outline" className={TOUCH} onClick={props.onCancelar}>{props.cancelarLabel}</JButton>
    </>
  );
  const toolbar = (onActivar: () => void, onDesactivar: () => void) => (
    <div className="flex flex-wrap gap-2">
      <JButton variant="outline" className={TOUCH} onClick={onActivar}>{props.activarLabel}</JButton>
      <JButton variant="outline" className={TOUCH} onClick={onDesactivar}>{props.desactivarLabel}</JButton>
    </div>
  );
  return (
    <section aria-label={props.title} className="grid min-w-0 gap-3">
      {!props.open && <JButton className={`${TOUCH} justify-self-start`} onClick={props.onOpen}>{props.title}</JButton>}
      {!props.open && <p className="m-0 text-neutral-500">{props.closedHint}</p>}
      <JDialog open={props.open} title={props.title} size="xl" onClose={props.onCancelar} footer={footer}>
        <div className="grid min-w-0 gap-3">
          {props.status === 'loading' && <p>{props.loadingLabel}</p>}
          {props.status === 'failed' && <JAlert variant="danger" role="alert">{props.loadError}</JAlert>}
          {/* `JTabs` only draws the triggers; both panels stay mounted and the inactive one is `hidden` (as the master register does). */}
          <JTabs value={props.tab} onChange={(value) => props.onTabChange(value as 'socios' | 'precio')}>
            <JTabsList>
              <JTabsTrigger value="socios">{props.sociosTab}</JTabsTrigger>
              <JTabsTrigger value="precio">{props.precioTab}</JTabsTrigger>
            </JTabsList>
          </JTabs>
          <div role="tabpanel" aria-label={props.sociosTab} hidden={props.tab !== 'socios'} className="grid min-w-0 gap-3">
            {toolbar(props.onActivarSocio, props.onDesactivarSocio)}
            <CrudGrid ariaLabel="Socios" columns={SOCIO_COLUMNS} rows={props.socios} idKey="key" selectedId={props.selectedSocio} page={1} pageCount={1} hidePagination onRowSelect={props.onSelectSocio} />
          </div>
          <div role="tabpanel" aria-label={props.precioTab} hidden={props.tab !== 'precio'} className="grid min-w-0 gap-3">
            {toolbar(props.onActivarPrecio, props.onDesactivarPrecio)}
            <CrudGrid ariaLabel="Precios" columns={PRECIO_COLUMNS} rows={props.precios} idKey="key" selectedId={props.selectedPrecio} page={1} pageCount={1} hidePagination onRowSelect={props.onSelectPrecio} />
          </div>
        </div>
      </JDialog>
      {dialog?.kind === 'socio' && <SocioDialog activos={dialog.activos} onDone={props.onSocioDone} onClose={props.onCloseDialog} />}
      {dialog?.kind === 'precio-activar' && <PrecioDialog mode="activar" precio="" fechaInicio="" onDone={props.onPrecioDone} onClose={props.onCloseDialog} />}
      {dialog?.kind === 'precio-desactivar' && <PrecioDialog mode="desactivar" precio={dialog.precio} fechaInicio={dialog.fechaInicio} onDone={props.onPrecioDone} onClose={props.onCloseDialog} />}
      <GuardedOptionPane
        open={props.confirmDesactivar === true}
        variant="info"
        title="Precio"
        description="Desea Desactivar Precio?"
        confirmLabel="Aceptar"
        cancelLabel="Cancelar"
        onConfirm={props.onConfirmDesactivar}
        onClose={props.onCancelConfirmDesactivar}
      />
      <GuardedOptionPane open={notice !== undefined} variant="info" title={notice?.title ?? ''} description={notice?.message} confirmLabel="Aceptar" cancelLabel="Cerrar" onConfirm={props.onCloseNotice} onClose={props.onCloseNotice} />
    </section>
  );
}
