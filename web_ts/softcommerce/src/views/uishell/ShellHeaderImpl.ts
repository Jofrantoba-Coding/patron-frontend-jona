// Layer: Implementation. Reads the active session for the header; logout clears it (the guard returns to step 1).
import { useSession } from '../../session/SessionProvider';
import type { InterShellHeader } from './InterShellHeader';

/** `yyyy-MM-dd` to `dd/MM/yyyy`. */
const toDisplayDate = (iso: string) => iso.split('-').reverse().join('/');

export const formatPeriod = ({ fechaInicio, fechaFin }: { fechaInicio: string; fechaFin: string }) =>
  `${toDisplayDate(fechaInicio)} – ${toDisplayDate(fechaFin)}`;

export function useShellHeaderImpl(): InterShellHeader {
  const { session, logout } = useSession();
  return {
    userName: session?.user.nombre ?? '',
    empresaName: session?.empresa.name ?? '',
    puntoVentaName: session?.puntoVenta.name ?? '',
    period: session ? formatPeriod(session.periodo) : '',
    onLogout: logout,
  };
}
