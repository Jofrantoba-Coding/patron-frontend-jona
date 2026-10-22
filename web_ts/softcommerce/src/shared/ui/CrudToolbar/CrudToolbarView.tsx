// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JButton } from 'jona-ui';
import type { InterCrudToolbar } from './InterCrudToolbar';

/** Defaults are applied by the entry, so the presentation props arrive resolved. */
type CrudToolbarViewProps = InterCrudToolbar & Required<Pick<InterCrudToolbar, 'ariaLabel' | 'labels' | 'unavailableLabel'>>;

export function CrudToolbarView({ ariaLabel, labels, unavailableLabel, items, onAction }: CrudToolbarViewProps) {
  return (
    // Wraps onto several rows at phone width instead of overflowing.
    <div role="toolbar" aria-label={ariaLabel} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {items.map(({ action, enabled, implemented, shortcut }) => (
        // JButton has no title/aria passthrough: the tooltip and the shortcut live on the wrapper.
        <span
          key={action}
          aria-keyshortcuts={shortcut}
          title={implemented ? (shortcut && `${labels[action]} (${shortcut})`) : unavailableLabel}
        >
          {/* Floors, not fixed heights: 44px touch target on mobile, compact from `sm`. */}
          <JButton variant="outline" className="min-h-11 sm:min-h-9" disabled={!enabled} onClick={() => onAction?.(action)}>
            {labels[action]}
          </JButton>
        </span>
      ))}
    </div>
  );
}
