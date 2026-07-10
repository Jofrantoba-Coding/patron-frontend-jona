import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  JBadge,
  JButton,
  JOptionPane,
  JSectionHeading,
  JTable,
  JTableBody,
  JTableCell,
  JTableHead,
  JTableHeader,
  JTableRow,
  type JBadgeVariant,
} from 'uijona-4ngular';
import type { Planilla } from '../../core/models';

const NUM = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2 });

type Accion = 'validar' | 'cifrar' | 'enviar' | 'reintentar-envio' | 'cancelar';
export interface AccionDef {
  label: string;
  accion: Accion;
  variant: 'default' | 'outline' | 'destructive';
  confirm?: boolean;
}

const BADGE: Record<string, JBadgeVariant> = {
  GENERADA: 'secondary',
  VALIDADA: 'secondary',
  PENDIENTE_CIFRADO: 'outline',
  CIFRADA: 'default',
  PENDIENTE_ENVIO: 'outline',
  ENVIADA: 'default',
  RESPUESTA_RECIBIDA: 'default',
  PROCESADA: 'default',
  PROCESADA_PARCIAL: 'outline',
  RECHAZADA: 'destructive',
  ERROR: 'destructive',
  ERROR_CIFRADO: 'destructive',
  ANULADA: 'ghost',
};

const ACCIONES: Record<string, AccionDef[]> = {
  GENERADA: [
    { label: 'Validar', accion: 'validar', variant: 'default' },
    { label: 'Anular', accion: 'cancelar', variant: 'destructive', confirm: true },
  ],
  VALIDADA: [
    { label: 'Cifrar', accion: 'cifrar', variant: 'default' },
    { label: 'Anular', accion: 'cancelar', variant: 'destructive', confirm: true },
  ],
  PENDIENTE_CIFRADO: [{ label: 'Cifrar', accion: 'cifrar', variant: 'default' }],
  CIFRADA: [
    { label: 'Enviar', accion: 'enviar', variant: 'default', confirm: true },
    { label: 'Anular', accion: 'cancelar', variant: 'destructive', confirm: true },
  ],
  PENDIENTE_ENVIO: [{ label: 'Enviar', accion: 'enviar', variant: 'default', confirm: true }],
  ENVIADA: [{ label: 'Reintentar', accion: 'reintentar-envio', variant: 'outline' }],
};

@Component({
  selector: 'app-planillas-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JSectionHeading, JTable, JTableHeader, JTableBody, JTableRow, JTableHead, JTableCell, JBadge, JButton, JOptionPane],
  templateUrl: './planillas-view.component.html',
})
export class PlanillasViewComponent {
  protected readonly rows = signal<Planilla[]>([]);
  protected readonly loading = signal(false);
  protected readonly confirm = signal<{ title: string; desc: string; planilla: Planilla; def: AccionDef } | null>(null);
  protected readonly canSendSignal = signal(false);

  protected readonly canSend = () => this.canSendSignal();

  protected readonly num = (value: number) => NUM.format(value);
  protected run(_p: Planilla, _a: AccionDef): void {}
  protected doConfirmed(): void {}

  protected badge(estado: string): JBadgeVariant {
    return BADGE[estado] ?? 'secondary';
  }

  protected acciones(estado: string): AccionDef[] {
    return ACCIONES[estado] ?? [];
  }
}
