// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JLabel, JSelectField } from 'jona-ui';
import { DateField } from '../../shared/ui/DateField';
import { PERIOD_ERROR_ID, type InterUiContexto } from './InterUiContexto';

export function UiContextoView({
  title,
  submitLabel,
  empresaOptions,
  puntoVentaOptions,
  empresaId,
  puntoVentaId,
  fechaInicio,
  fechaFin,
  empresaError,
  puntoVentaError,
  periodError,
  submitError,
  submitErrorTraceId,
  isLoading,
  isSubmitting,
  onEmpresaChange,
  onPuntoVentaChange,
  onFechaInicioChange,
  onFechaFinChange,
  onSubmit,
}: InterUiContexto) {
  return (
    <form
      noValidate
      aria-label={title}
      style={{ display: 'grid', gap: 12, maxWidth: 380, margin: '4rem auto' }}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      <h1>{title}</h1>
      {submitError ? (
        <JAlert variant="danger" role="alert">
          <span>{submitError}</span>
          {submitErrorTraceId ? <small> Código de seguimiento: {submitErrorTraceId}</small> : null}
        </JAlert>
      ) : null}
      <JSelectField
        id="contexto-empresa"
        label="Empresa"
        placeholder={isLoading ? 'Cargando...' : 'Seleccione'}
        options={empresaOptions}
        value={empresaId}
        errorMessage={empresaError}
        disabled={isLoading || isSubmitting}
        onChange={(value) => onEmpresaChange?.(value)}
      />
      <JSelectField
        id="contexto-punto-venta"
        label="Punto de venta"
        placeholder="Seleccione"
        options={puntoVentaOptions}
        value={puntoVentaId}
        errorMessage={puntoVentaError}
        disabled={!empresaId || isSubmitting}
        onChange={(value) => onPuntoVentaChange?.(value)}
      />
      <DateField
        name="fechaInicio"
        label="Fecha inicio"
        value={fechaInicio}
        readOnly={isSubmitting}
        hasError={!!periodError}
        describedBy={periodError ? PERIOD_ERROR_ID : undefined}
        onChange={(value) => onFechaInicioChange?.(value)}
      />
      <DateField
        name="fechaFin"
        label="Fecha fin"
        value={fechaFin}
        readOnly={isSubmitting}
        hasError={!!periodError}
        describedBy={periodError ? PERIOD_ERROR_ID : undefined}
        onChange={(value) => onFechaFinChange?.(value)}
      />
      {/* Same error text as the selects (JLabel `error`, role="alert"), tied to both dates by id. */}
      <JLabel id={PERIOD_ERROR_ID} variant="error" message={periodError} />
      <JButton type="submit" loading={isSubmitting}>
        {submitLabel}
      </JButton>
    </form>
  );
}
