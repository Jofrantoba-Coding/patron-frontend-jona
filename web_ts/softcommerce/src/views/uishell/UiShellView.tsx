// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
// JSidebarLayout owns the drawer: permanent sidebar from `lg`, an Esc-closable drawer with its own toggle on phones.
import { JAlert, JButton, JSidebarLayout, JTabs, JTabsList, JTabsTrigger, type SidebarRenderApi } from 'jona-ui';
import type { MenuItem } from '../../domain/menuTree';
import { MenuTree } from '../../shared/ui/MenuTree';
import { GuardedOptionPane } from './DialogStackProvider';
import type { InterUiShell } from './InterUiShell';

// Floors, not fixed heights: 44px touch target on mobile, compact from `sm`.
const TOUCH_TARGET = 'min-h-11 min-w-11 sm:min-h-9 sm:min-w-9';
// Fills the space below the session header instead of the layout's own full-screen height.
const LAYOUT_CLASS = 'min-h-0 flex-1 bg-white';

export function UiShellView({
  emptyMessage,
  menuLoadingMessage,
  retryLabel,
  closeTabLabel,
  noticeConfirmLabel,
  noticeCloseLabel,
  menuStatus,
  menuItems,
  menuError,
  menuErrorTraceId,
  tabs,
  activeId,
  notice,
  renderForm,
  onLeafSelect,
  onTabSelect,
  onTabClose,
  onMenuRetry,
  onNoticeClose,
}: InterUiShell) {
  const close = () => onNoticeClose?.();
  // A leaf closes the phone drawer before the Impl opens its tab or notice.
  const renderMenu = ({ close: closeDrawer }: SidebarRenderApi) => {
    const selectLeaf = (item: MenuItem) => {
      closeDrawer();
      onLeafSelect?.(item);
    };
    return (
      <>
        {menuStatus === 'loading' ? <p style={{ padding: 12 }}>{menuLoadingMessage}</p> : null}
        {menuStatus === 'error' ? (
          <div style={{ display: 'grid', gap: 8 }}>
            <JAlert variant="danger" role="alert">
              <span>{menuError}</span>
              {menuErrorTraceId ? <small> Código de seguimiento: {menuErrorTraceId}</small> : null}
            </JAlert>
            <JButton variant="outline" className={TOUCH_TARGET} onClick={onMenuRetry}>
              {retryLabel}
            </JButton>
          </div>
        ) : null}
        {menuStatus === 'ready' ? <MenuTree items={menuItems} onLeafSelect={selectLeaf} /> : null}
      </>
    );
  };
  return (
    <>
      <JSidebarLayout collapsible={false} className={LAYOUT_CLASS} renderSidebar={renderMenu}>
        {tabs.length === 0 ? (
          <p>{emptyMessage}</p>
        ) : (
          <JTabs value={activeId ?? ''} variant="line" onChange={onTabSelect}>
            <JTabsList>
              {tabs.map(({ formId, title }) => (
                <span key={formId} style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                  <JTabsTrigger value={formId}>{title}</JTabsTrigger>
                  <button
                    type="button"
                    aria-label={`${closeTabLabel} ${title}`}
                    className={TOUCH_TARGET}
                    onClick={() => onTabClose?.(formId)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </JTabsList>
            {/* Every panel stays mounted (hidden when inactive) so a tab keeps its state. */}
            {tabs.map(({ formId, title }) => (
              <div key={formId} role="tabpanel" aria-label={title} hidden={formId !== activeId}>
                {renderForm(formId)}
              </div>
            ))}
          </JTabs>
        )}
      </JSidebarLayout>
      <GuardedOptionPane
        open={notice !== undefined}
        variant="info"
        title={notice?.title ?? ''}
        description={notice?.description}
        confirmLabel={noticeConfirmLabel}
        cancelLabel={noticeCloseLabel}
        onConfirm={close}
        onClose={close}
      />
    </>
  );
}
