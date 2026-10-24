// Layer: Implementation. State, period rules, service calls, session creation and navigation of login step 2.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validatePeriod, type PeriodError } from '../../domain/period';
import type { Empresa, InterAuthService, PuntoVenta } from '../../services/InterAuthService';
import type { InterGrantsService } from '../../services/InterGrantsService';
import { useSession } from '../../session/SessionProvider';
import { toFailure } from '../../shared/toFailure';
import type { InterUiContexto } from './InterUiContexto';

const PERIOD_MESSAGES: Record<PeriodError, string> = {
  INVALID_DATE: 'Ingrese fechas válidas (aaaa-mm-dd).',
  BEFORE_ACTIVITY_START: 'La fecha de inicio es anterior al inicio de actividades de la empresa.',
  END_BEFORE_START: 'La fecha fin no puede ser anterior a la fecha de inicio.',
  DIFFERENT_YEAR: 'El período debe estar dentro del mismo año contable.',
};

type Failure = ReturnType<typeof toFailure>;

export function useUiContextoImpl(service: InterAuthService, grantsService?: InterGrantsService): InterUiContexto {
  const { session, pending, startSession } = useSession();
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [puntosVenta, setPuntosVenta] = useState<PuntoVenta[]>([]);
  const [empresaId, setEmpresaId] = useState('');
  const [puntoVentaId, setPuntoVentaId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [errors, setErrors] = useState<Pick<InterUiContexto, 'empresaError' | 'puntoVentaError' | 'periodError'>>({});
  const [failure, setFailure] = useState<Failure | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasPending = pending !== null;
  const hasSession = session !== null;

  // The one place step 2 leaves from. A session (just confirmed, or already open) goes to the shell. Without one,
  // A7: a reload loses the in-memory step-1 result, so step 1 comes back. Confirming clears `pending` as it creates
  // the session, so the session is checked first; a separate navigate('/') on submit would race this redirect.
  useEffect(() => {
    if (hasSession) navigate('/', { replace: true });
    else if (!hasPending) navigate('/login', { replace: true });
  }, [hasSession, hasPending, navigate]);

  useEffect(() => {
    if (!hasPending || hasSession) return;
    let active = true;
    service
      .empresas()
      .then((items) => active && setEmpresas(items))
      .catch((error: unknown) => active && setFailure(toFailure(error)))
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [service, hasPending, hasSession]);

  // S-AUTH-10: puntos de venta follow the empresa; a late response for a previous empresa is ignored.
  useEffect(() => {
    setPuntosVenta([]);
    if (!empresaId) return;
    let active = true;
    service
      .puntosVenta(empresaId)
      .then((items) => active && setPuntosVenta(items))
      .catch((error: unknown) => active && setFailure(toFailure(error)));
    return () => {
      active = false;
    };
  }, [service, empresaId]);

  function onEmpresaChange(idEmpresa: string): void {
    setEmpresaId(idEmpresa);
    setPuntoVentaId('');
    setErrors((current) => ({ ...current, empresaError: undefined }));
  }

  function onPuntoVentaChange(idPuntoVenta: string): void {
    setPuntoVentaId(idPuntoVenta);
    setErrors((current) => ({ ...current, puntoVentaError: undefined }));
  }

  function onSubmit(): void {
    if (isSubmitting || !pending) return;
    const empresa = empresas.find((e) => e.id === empresaId);
    const puntoVenta = puntosVenta.find((p) => p.id === puntoVentaId);
    const selectionErrors = {
      empresaError: empresa ? undefined : 'Seleccione una empresa.',
      puntoVentaError: puntoVenta ? undefined : 'Seleccione un punto de venta.',
    };
    setErrors(selectionErrors);
    setFailure(undefined);
    if (!empresa || !puntoVenta) return;

    setIsSubmitting(true);
    service
      .params()
      .then(async (params) => {
        const periodError = validatePeriod({ fechaInicio, fechaFin, inicioActividades: params.INICIO_ACTIVIDADES });
        setErrors({ ...selectionErrors, periodError: periodError ? PERIOD_MESSAGES[periodError] : undefined });
        if (periodError) return setIsSubmitting(false);
        // The menu and the flags of the user's perfil are taken once, here (R-AUTH-11).
        const grants = await grantsService?.snapshot();
        startSession({
          tenantId: pending.tenantId,
          token: pending.result.token,
          user: pending.result.user,
          empresa,
          puntoVenta,
          periodo: { fechaInicio, fechaFin },
          params,
          ...(grants ? { grants } : {}),
        });
      })
      .catch((error: unknown) => {
        setFailure(toFailure(error));
        setIsSubmitting(false);
      });
  }

  return {
    ...errors,
    empresaOptions: empresas.map((e) => ({ value: e.id, label: e.name })),
    puntoVentaOptions: puntosVenta.map((p) => ({ value: p.id, label: p.name })),
    empresaId,
    puntoVentaId,
    fechaInicio,
    fechaFin,
    submitError: failure?.message,
    submitErrorTraceId: failure?.traceId,
    isLoading,
    isSubmitting,
    onEmpresaChange,
    onPuntoVentaChange,
    onFechaInicioChange: setFechaInicio,
    onFechaFinChange: setFechaFin,
    onSubmit,
  };
}
