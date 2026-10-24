import type { ComponentType } from 'react';
import { UiAutorizarSeries } from '../uiautorizarseries';
import type { ListPanelProps } from '../uicrudlist/UiCrudList';

/** The panel a `list-toolbar` action opens, by the client `rule` it names (R-ACT-1, D14). */
export const LIST_PANELS: Record<string, ComponentType<ListPanelProps<any>>> = { autorizarSeries: UiAutorizarSeries };
