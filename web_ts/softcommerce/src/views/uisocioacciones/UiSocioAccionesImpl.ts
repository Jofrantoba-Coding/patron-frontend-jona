// Layer: Implementation. The working copy of both lists, the guards of Activar/Desactivar and the atomic save of the Socio acciones screen.
import { useEffect, useState } from 'react';
import { isoToDisplay } from '../../../mock-server/core/dates.js';
import type { AccionPrecioRow, AccionSocioRow, PrecioOp, SocioAccionesBody } from '../../services/InterSocioAccionesService';
import { useServices } from '../../services/ServicesContext';
import { useGuardedClose } from '../uishell/DialogStackProvider';
import { messageOf } from '../uiautorizarseries/messageOf';
import type {
  InterUiSocioAcciones,
  Notice,
  PrecioDone,
  PrecioGridRow,
  SocioAccionesDialog,
  SocioAccionesTab,
  SocioDone,
  SocioGridRow,
} from './InterUiSocioAcciones';

/** The desktop `JOptionPane.showMessageDialog(this, msg)` has no title: the Swing default is `Mensaje`. */
const MESSAGE_TITLE = 'Mensaje';
const PRECIO_TITLE = 'Precio';

/** A price of the working copy: `fresh` rows are not stored yet, `closed` ones were active when loaded and are deactivated here. */
interface PrecioWork extends AccionPrecioRow {
  key: string;
  fresh: boolean;
  closed: boolean;
}

interface SocioWork extends AccionSocioRow {
  key: string;
  fresh: boolean;
}

type Load = { status: 'loading' } | { status: 'ready' } | { status: 'failed'; message: string };

const estadoText = (estado: string) => (estado === 'A' ? 'Activo' : 'Inactivo');

const precioRow = (r: PrecioWork): PrecioGridRow => ({
  key: r.key,
  estado: estadoText(r.estado),
  id: r.fresh ? '' : r.id_accion_precio,
  precio: String(r.precio),
  f_inicio: isoToDisplay(r.fecha_inicio),
  f_fin: isoToDisplay(r.fecha_fin),
});

const socioRow = (r: SocioWork): SocioGridRow => ({
  key: r.key,
  estado: estadoText(r.estado),
  id: r.fresh ? '' : r.id_accion_socio,
  num_doc: r.numero_doc,
  socio: r.socio,
  cantidad: String(r.cantidad),
  precio: String(r.precio),
  f_inicio: isoToDisplay(r.fecha_inicio),
  f_fin: isoToDisplay(r.fecha_fin),
});

/** Only the changes go to the server: the new prices and socios, and the stored prices closed here (`guardarAcciones` sends the rows with an operation). */
const bodyOf = (precios: PrecioWork[], socios: SocioWork[]): SocioAccionesBody => ({
  precios: precios.flatMap((r): PrecioOp[] =>
    r.fresh
      ? [{ op: 'I' as const, precio: r.precio, fecha_inicio: r.fecha_inicio }]
      : r.closed
        ? [{ op: 'A' as const, id: r.id_accion_precio, estado: 'D' as const, fecha_fin: r.fecha_fin }]
        : [],
  ),
  socios: socios.filter((r) => r.fresh).map((r) => ({ op: 'I' as const, id_socio: r.id_socio, cantidad: r.cantidad, fecha_inicio: r.fecha_inicio })),
});

export function useUiSocioAccionesImpl(): InterUiSocioAcciones {
  const { socioAcciones } = useServices();
  const [open, setOpen] = useState(true);
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [precios, setPrecios] = useState<PrecioWork[]>([]);
  const [socios, setSocios] = useState<SocioWork[]>([]);
  const [tab, setTab] = useState<SocioAccionesTab>('socios');
  const [selectedPrecio, setSelectedPrecio] = useState<string | undefined>();
  const [selectedSocio, setSelectedSocio] = useState<string | undefined>();
  const [dialog, setDialog] = useState<SocioAccionesDialog | undefined>();
  const [confirming, setConfirming] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | undefined>();
  /** Counts the rows added here, so each gets its own key. */
  const [added, setAdded] = useState(0);

  // Every opening reads both lists again (the desktop `cargar`); nothing of an earlier, cancelled session survives.
  useEffect(() => {
    if (!open) return undefined;
    let live = true;
    setLoad({ status: 'loading' });
    socioAcciones.load().then(
      (lists) => {
        if (!live) return;
        setPrecios(lists.precios.map((r) => ({ ...r, key: `p${r.id_accion_precio}`, fresh: false, closed: false })));
        setSocios(lists.socios.map((r) => ({ ...r, key: `s${r.id_accion_socio}`, fresh: false })));
        setSelectedPrecio(undefined);
        setSelectedSocio(undefined);
        setLoad({ status: 'ready' });
      },
      (error) => live && setLoad({ status: 'failed', message: messageOf(error) }),
    );
    return () => {
      live = false;
    };
  }, [socioAcciones, open]);

  // Esc and the close button cancel the screen only when it is the topmost dialog.
  const guardedCancel = useGuardedClose(open, () => setOpen(false));
  const tell = (title: string, message: string) => setNotice({ title, message });
  const activePrecio = precios.find((r) => r.estado === 'A');

  /** Desktop `btnActivarPrecio`: one active price at most. */
  const onActivarPrecio = () => {
    if (precios.some((r) => r.estado === 'A')) return tell(MESSAGE_TITLE, 'No se Puede Agregar mas de un Precio');
    setDialog({ kind: 'precio-activar' });
  };

  /** Desktop `desactivarPrecio`: needs a row, refuses a deactivated one, then asks to confirm before opening the dialog. */
  const onDesactivarPrecio = () => {
    if (precios.length === 0) return;
    const row = precios.find((r) => r.key === selectedPrecio);
    if (!row) return tell(PRECIO_TITLE, 'Seleccionar Fila');
    if (row.estado === 'D') return tell(PRECIO_TITLE, 'Precio Seleccionado ya esta desactivado');
    setConfirming(row.key);
  };

  const onConfirmDesactivar = () => {
    const row = precios.find((r) => r.key === confirming);
    setConfirming(undefined);
    if (row) setDialog({ kind: 'precio-desactivar', precio: String(row.precio), fechaInicio: row.fecha_inicio });
  };

  /** Desktop `setValueSearch(btnActivarPrecio)`: the new price is applied to every active socio row of the table. */
  const activatePrecio = ({ precio, fecha }: PrecioDone) => {
    const key = `n${added}`;
    setAdded(added + 1);
    setPrecios((rows) => [...rows, { key, id_accion_precio: '', fecha_inicio: fecha, fecha_fin: '', estado: 'A', precio, fresh: true, closed: false }]);
    setSocios((rows) => rows.map((r) => (r.estado === 'A' ? { ...r, precio } : r)));
    setDialog(undefined);
  };

  /** Desktop `setValueSearch(btnDesactivarPrecio)`. A price that was never stored is dropped; a stored one is closed with the fecha fin. */
  const deactivatePrecio = ({ fecha }: PrecioDone) => {
    setPrecios((rows) =>
      rows.flatMap((r) => (r.key !== selectedPrecio ? [r] : r.fresh ? [] : [{ ...r, estado: 'D' as const, fecha_fin: fecha, closed: true }])),
    );
    setSelectedPrecio(undefined);
    setDialog(undefined);
  };

  /** Desktop `setValueSearch(btnActivarSocio)`: the new row takes the current price, or 0 when there is none. */
  const activateSocio = ({ socio, cantidad, fecha }: SocioDone) => {
    const key = `n${added}`;
    setAdded(added + 1);
    setSocios((rows) => [
      ...rows,
      { key, id_accion_socio: '', id_socio: socio.id_socio, numero_doc: socio.numero_doc, socio: socio.descripcion, fecha_inicio: fecha, fecha_fin: '', estado: 'A', precio: activePrecio?.precio ?? 0, cantidad, fresh: true },
    ]);
    setDialog(undefined);
  };

  /** Desktop `validar` then `guardarAcciones`: an active price is required; the server answer is shown and the dialog closes. */
  const onAceptar = async () => {
    if (!activePrecio) return tell(MESSAGE_TITLE, 'Ingrese Precio');
    setSaving(true);
    try {
      const { message } = await socioAcciones.save(bodyOf(precios, socios));
      setOpen(false);
      tell(MESSAGE_TITLE, message);
    } catch (error) {
      tell(MESSAGE_TITLE, messageOf(error)); // the dialog stays open with its edits
    } finally {
      setSaving(false);
    }
  };

  return {
    open,
    status: load.status,
    loadError: load.status === 'failed' ? load.message : undefined,
    tab,
    precios: precios.map(precioRow),
    socios: socios.map(socioRow),
    selectedPrecio,
    selectedSocio,
    saving,
    notice,
    dialog,
    confirmDesactivar: confirming !== undefined,
    onTabChange: setTab,
    onSelectPrecio: setSelectedPrecio,
    onSelectSocio: setSelectedSocio,
    onActivarSocio: () => setDialog({ kind: 'socio', activos: socios.filter((r) => r.estado === 'A').map((r) => r.id_socio) }),
    // The desktop button has an empty handler (`FormAccionSocio.actionPerformed`): it does nothing.
    onDesactivarSocio: () => undefined,
    onActivarPrecio,
    onDesactivarPrecio,
    onConfirmDesactivar,
    onCancelConfirmDesactivar: () => setConfirming(undefined),
    onPrecioDone: (done) => (dialog?.kind === 'precio-desactivar' ? deactivatePrecio(done) : activatePrecio(done)),
    onSocioDone: activateSocio,
    onCloseDialog: () => setDialog(undefined),
    onAceptar: () => void onAceptar(),
    onCancelar: guardedCancel,
    onOpen: () => setOpen(true),
    onCloseNotice: () => setNotice(undefined),
  };
}
