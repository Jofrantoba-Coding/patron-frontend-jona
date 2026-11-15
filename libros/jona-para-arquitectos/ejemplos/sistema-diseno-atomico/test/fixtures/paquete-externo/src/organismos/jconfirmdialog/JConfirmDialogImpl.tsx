// Violación: el organismo depende de un paquete que no es React (aquí, para registrar analítica).
import { track } from 'analytics-sdk';

export const JConfirmDialogImpl = () => {
  track('dialogo-abierto');
  return null;
};
