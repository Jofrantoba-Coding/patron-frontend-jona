// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JDatePicker, JSelectField } from 'jona-ui';
import type { InterUiContexto } from './InterUiContexto';

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
      <JDatePicker placeholder="Fecha inicio" value={fechaInicio} disabled={isSubmitting} onChange={onFechaInicioChange} />
      <JDatePicker placeholder="Fecha fin" value={fechaFin} disabled={isSubmitting} onChange={onFechaFinChange} />
      {periodError ? <small role="alert">{periodError}</small> : null}
      <JButton type="submit" loading={isSubmitting}>
        {submitLabel}
      </JButton>
    </form>
  );
}
