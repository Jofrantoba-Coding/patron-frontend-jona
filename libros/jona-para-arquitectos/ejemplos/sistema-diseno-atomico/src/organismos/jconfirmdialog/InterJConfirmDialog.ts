// Contrato de UI del diálogo de confirmación: un organismo. Pregunta y avisa la respuesta;
// qué se confirma (borrar un producto, cerrar un pedido) lo decide la aplicación.
import type { ReactNode } from 'react';

export interface InterJConfirmDialog {
  /** Estado: lo decide quien usa el diálogo, nunca los DEFAULTS. */
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Mientras la aplicación procesa la confirmación, los botones quedan deshabilitados. */
  busy?: boolean;
  onConfirm: () => void;
  /** También con la tecla Escape. */
  onCancel: () => void;
}

/** Lo que dibuja la vista: el contrato más los identificadores que asocian título, mensaje y foco. */
export interface InterJConfirmDialogVista extends InterJConfirmDialog {
  titleId: string;
  messageId: string;
  cancelId: string;
}

/** Solo textos de presentación; `open` es estado y no tiene default. */
export const JCONFIRMDIALOG_DEFAULTS = {
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
} as const satisfies Required<Pick<InterJConfirmDialog, 'confirmLabel' | 'cancelLabel'>>;
