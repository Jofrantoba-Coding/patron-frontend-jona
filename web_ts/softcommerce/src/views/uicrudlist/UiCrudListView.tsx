// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JTextBox } from 'jona-ui';
import { CrudGrid } from '../../shared/ui/CrudGrid';
import { CrudToolbar } from '../../shared/ui/CrudToolbar';
import { UICRUDLIST_DEFAULTS, type InterUiCrudList } from './InterUiCrudList';

type UiCrudListViewProps<T> = InterUiCrudList<T> & typeof UICRUDLIST_DEFAULTS;

export function UiCrudListView<T>(props: UiCrudListViewProps<T>) {
  const { title, filterLabel, loadingLabel, emptyLabel, retryLabel, truncatedLabel, status, matchCount } = props;
  return (
    <section style={{ display: 'grid', gap: 12 }} aria-label={title}>
      <CrudToolbar actions={props.actions} permissions={props.permissions} selectedId={props.selectedId} onAction={props.onAction} />
      <JTextBox aria-label={filterLabel} value={props.filterText} onChange={props.onFilterChange} />
      {status === 'loading' && <p>{loadingLabel}</p>}
      {status === 'failed' && (
        <JAlert variant="danger" role="alert">
          <span>{props.errorMessage}</span>
          {props.errorTraceId ? <small> Código de seguimiento: {props.errorTraceId}</small> : null}
          <JButton variant="outline" className="min-h-11 sm:min-h-9" onClick={props.onRetry}>
            {retryLabel}
          </JButton>
        </JAlert>
      )}
      {status === 'ready' && props.truncated && <JAlert variant="warning">{truncatedLabel}</JAlert>}
      {status === 'ready' && matchCount === 0 && <p>{emptyLabel}</p>}
      {status === 'ready' && matchCount > 0 && (
        <CrudGrid
          columns={props.columns}
          rows={props.rows}
          idKey={props.idKey}
          selectedId={props.selectedId}
          sort={props.sort}
          page={props.page}
          pageCount={props.pageCount}
          onRowSelect={props.onRowSelect}
          onRowOpen={props.onRowOpen}
          onSortChange={props.onSortChange}
          onPageChange={props.onPageChange}
        />
      )}
    </section>
  );
}
