// Layer: public entry. Wires the Impl hook to the pure View. Mount it to open, unmount on `onClose`.
import type { ListPanelProps } from '../uicrudlist/UiCrudList';
import { UIAUTORIZARSERIES_DEFAULTS } from './InterUiAutorizarSeries';
import { useUiAutorizarSeriesImpl } from './UiAutorizarSeriesImpl';
import { UiAutorizarSeriesView } from './UiAutorizarSeriesView';

/** The Autorizar Series panel of the selected usuario (R-PRM-6): the series grid with Activar and Desactivar. */
export function UiAutorizarSeries(props: ListPanelProps<Record<string, string>>) {
  const impl = useUiAutorizarSeriesImpl(props);
  return <UiAutorizarSeriesView {...UIAUTORIZARSERIES_DEFAULTS} {...impl} />;
}
