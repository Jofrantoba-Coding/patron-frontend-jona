// Layer: Implementation. The Activar Socio dialog (`FormAccionSocioAgregar`): the socio picker with its three filters, the cantidad and the Fecha Inicio.
import { useEffect, useMemo, useState } from 'react';
import { displayToIso, isoToDisplay, todayIso } from '../../../mock-server/core/dates.js';
import { useServices } from '../../services/ServicesContext';
import { toFailure } from '../../shared/toFailure';
import { useGuardedClose } from '../uishell/DialogStackProvider';
import type { InterSocioDialog, Notice } from './InterUiSocioAcciones';

const FETCH_ALL = { page: 1, pageSize: 1000 };
const MESSAGE_TITLE = 'Mensaje';

/** A row of the W2 `socios` catalog. */
export interface SocioPick {
  id_socio: string;
  numero_doc: string;
  descripcion: string;
  activo?: boolean;
}

type Load = { status: 'loading' } | { status: 'ready'; rows: SocioPick[] } | { status: 'failed'; message: string };

export interface SocioDialogViewProps {
  rows: SocioPick[];
  status: Load['status'];
  loadError?: string;
  codigo: string;
  numero: string;
  descripcion: string;
  cantidad: string;
  fecha: string;
  selectedId?: string;
  notice?: Notice;
  onCodigoChange: (value: string) => void;
  onNumeroChange: (value: string) => void;
  onDescripcionChange: (value: string) => void;
  onCantidadChange: (value: string) => void;
  onFechaChange: (value: string) => void;
  onSelect: (id: string) => void;
  onAgregar: () => void;
  onRefrescar: () => void;
  onCloseNotice: () => void;
  onClose: () => void;
}

/** Desktop `getFilter`: each filled box is a contains regex over its column, all together. */
const filterRows = (rows: SocioPick[], codigo: string, numero: string, descripcion: string) =>
  rows.filter((r) => r.id_socio.includes(codigo) && r.numero_doc.includes(numero) && r.descripcion.includes(descripcion));

export function useSocioDialogImpl({ activos, onDone, onClose }: InterSocioDialog): SocioDialogViewProps {
  const { catalog } = useServices();
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [reloads, setReloads] = useState(0);
  const [codigo, setCodigo] = useState('');
  const [numero, setNumero] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState(isoToDisplay(todayIso()));
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [notice, setNotice] = useState<Notice | undefined>();
  const guardedClose = useGuardedClose(true, onClose);
  const tell = (message: string) => setNotice({ title: MESSAGE_TITLE, message });

  useEffect(() => {
    let live = true;
    setLoad({ status: 'loading' });
    catalog<SocioPick>('socios')
      .list(FETCH_ALL)
      .then(
        (page) => live && setLoad({ status: 'ready', rows: page.items.filter((r) => r.activo !== false).map((r) => ({ ...r, id_socio: String(r.id_socio), numero_doc: r.numero_doc ?? '' })) }),
        (error) => live && setLoad({ status: 'failed', message: toFailure(error).message }),
      );
    return () => {
      live = false;
    };
  }, [catalog, reloads]);

  const all = load.status === 'ready' ? load.rows : [];
  const rows = useMemo(() => filterRows(all, codigo, numero, descripcion), [all, codigo, numero, descripcion]);

  /** Desktop `verificarValido` then the Agregar body: cantidad, then a socio already active, then the selection. */
  const onAgregar = () => {
    if (cantidad.trim() === '' || Number.isNaN(Number(cantidad))) return tell('Ingrese Cantidad');
    const socio = all.find((r) => r.id_socio === selectedId);
    if (socio && activos.includes(socio.id_socio)) return tell('Socio ya esta activado');
    if (!socio) return tell('Seleccione un registro de la tabla');
    const iso = displayToIso(fecha);
    if (iso === null) return tell('Fecha Inicio no es valida');
    onDone({ socio, cantidad: Number(cantidad), fecha: iso });
  };

  return {
    rows,
    status: load.status,
    loadError: load.status === 'failed' ? load.message : undefined,
    codigo,
    numero,
    descripcion,
    cantidad,
    fecha,
    selectedId,
    notice,
    onCodigoChange: setCodigo,
    onNumeroChange: setNumero,
    onDescripcionChange: setDescripcion,
    onCantidadChange: setCantidad,
    onFechaChange: setFecha,
    onSelect: setSelectedId,
    onAgregar,
    onRefrescar: () => setReloads((n) => n + 1),
    onCloseNotice: () => setNotice(undefined),
    onClose: guardedClose,
  };
}
