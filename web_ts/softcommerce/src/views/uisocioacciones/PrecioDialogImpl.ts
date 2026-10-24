// Layer: Implementation. The Activar / Desactivar Precio dialog (`FormAccionPrecioAgregar`): its two fields and its guards.
import { useState } from 'react';
import { displayToIso, isoToDisplay, todayIso } from '../../../mock-server/core/dates.js';
import { useGuardedClose } from '../uishell/DialogStackProvider';
import type { InterPrecioDialog, Notice } from './InterUiSocioAcciones';

const MESSAGE_TITLE = 'Mensaje';

/** The values and handlers the View draws. */
export interface PrecioDialogViewProps {
  title: string;
  mode: InterPrecioDialog['mode'];
  precio: string;
  fecha: string;
  fechaLabel: string;
  notice?: Notice;
  onPrecioChange: (value: string) => void;
  onFechaChange: (value: string) => void;
  onAccept: () => void;
  onCloseNotice: () => void;
  onClose: () => void;
}

export function usePrecioDialogImpl({ mode, precio: stored, fechaInicio, onDone, onClose }: InterPrecioDialog): PrecioDialogViewProps {
  const [precio, setPrecio] = useState(mode === 'activar' ? '' : stored);
  const [fecha, setFecha] = useState(isoToDisplay(todayIso()));
  const [notice, setNotice] = useState<Notice | undefined>();
  const guardedClose = useGuardedClose(true, onClose);
  const tell = (message: string) => setNotice({ title: MESSAGE_TITLE, message });

  /** Desktop `verificarValido`: a blank precio, then (Desactivar) a Fecha Fin that is not after the inicio; the dialog stays open. */
  const onAccept = () => {
    if (precio.trim() === '' || Number.isNaN(Number(precio))) return tell('Ingrese Precio');
    const iso = displayToIso(fecha);
    if (iso === null) return tell(`Fecha ${mode === 'activar' ? 'Inicio' : 'Fin'} no es valida`);
    if (mode === 'desactivar' && !(iso > fechaInicio)) return tell('Fecha es menor a fecha inicial');
    onDone({ precio: Number(precio), fecha: iso });
  };

  return {
    title: `${mode === 'activar' ? 'Activar' : 'Desactivar'} Precio`,
    mode,
    precio,
    fecha,
    fechaLabel: `Fecha ${mode === 'activar' ? 'Inicio' : 'Fin'}`,
    notice,
    onPrecioChange: setPrecio,
    onFechaChange: setFecha,
    onAccept,
    onCloseNotice: () => setNotice(undefined),
    onClose: guardedClose,
  };
}
