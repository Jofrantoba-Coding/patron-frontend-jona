// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JDialog } from 'jona-ui';
import { CrudGrid } from '../CrudGrid';
import { DependentSelect } from '../DependentSelect';
import { NumberField } from '../NumberField';
import { UppercaseTextField } from '../UppercaseTextField';
import type { LookupDialogViewProps } from './LookupDialogImpl';

export function LookupDialogView(p: LookupDialogViewProps) {
  const { config, load } = p;
  const footer = (
    <>
      {config.refresh && <JButton variant="outline" className="min-h-11 sm:min-h-9" onClick={p.onRefresh}>{p.refreshLabel}</JButton>}
      <JButton className="min-h-11 sm:min-h-9" disabled={p.selectedId === undefined} onClick={p.onPick}>{config.pickLabel}</JButton>
      <JButton ref={p.cancelRef} variant="outline" className="min-h-11 sm:min-h-9" onClick={p.onClose}>{p.cancelLabel}</JButton>
    </>
  );
  return (
    <JDialog open size="xl" title={config.title} onClose={p.onClose} footer={footer}>
      <div style={{ display: 'grid', gap: 12 }}>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.filters.map((filter, index) =>
            filter.type === 'select' ? (
              <DependentSelect
                key={filter.field}
                ref={p.registerFilter(index)}
                name={filter.field}
                label={filter.label}
                parents={filter.dependsOn ? [filter.dependsOn] : []}
                values={p.filters}
                load={(filters) => p.loadOptions(filter.source!, filters)}
                onChange={(value) => p.onFilterChange(filter.field, value)}
              />
            ) : (
              <label key={filter.field} style={{ display: 'grid', gap: 4 }}>
                <span>{filter.label}</span>
                <UppercaseTextField
                  ref={p.registerFilter(index)}
                  value={p.filters[filter.field] ?? ''}
                  maxLength={filter.max}
                  uppercase={filter.upper}
                  transform={filter.digits ? (typed) => typed.replace(/\D/g, '') : undefined}
                  className="min-h-11 sm:min-h-9"
                  onEnterPress={() => p.onFilterEnter(index)}
                  onChange={(value) => p.onFilterChange(filter.field, value)}
                />
              </label>
            ),
          )}
          {(config.extras ?? []).map((extra) => (
            <NumberField key={extra.name} name={extra.name} label={extra.label} scale={1} value={p.extras[extra.name]} onChange={(value) => p.onExtraChange(extra.name, value)} onBlur={() => p.onExtraBlur(extra.name)} />
          ))}
        </div>
        {p.vetoMessage && <JAlert variant="danger" role="alert">{p.vetoMessage}</JAlert>}
        {load.status === 'loading' && <p>{p.loadingLabel}</p>}
        {load.status === 'failed' && (
          <JAlert variant="danger" role="alert">
            <span>{p.errorLabel}</span>
            <JButton variant="outline" className="min-h-11 sm:min-h-9" onClick={p.onRetry}>{p.retryLabel}</JButton>
          </JAlert>
        )}
        {load.status === 'ready' && load.rows.length === 0 && <p>{p.emptyLabel}</p>}
        {load.status === 'ready' && load.rows.length > 0 && (
          <div ref={p.gridRef} role="group" aria-label={p.resultsLabel} tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && p.onGridEnter()}>
            <CrudGrid
              columns={config.columns}
              rows={load.rows}
              idKey={p.idKey}
              selectedId={p.selectedId}
              page={p.page}
              pageCount={p.pageCount}
              onRowSelect={p.onRowSelect}
              onRowOpen={p.onRowOpen}
              onPageChange={p.onPageChange}
            />
          </div>
        )}
      </div>
    </JDialog>
  );
}
