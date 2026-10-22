// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JTabs, JTabsList, JTabsTrigger } from 'jona-ui';
import { MenuTree } from '../../shared/ui/MenuTree';
import { GuardedOptionPane } from './DialogStackProvider';
import type { InterUiShell } from './InterUiShell';

// Floors, not fixed heights: 44px touch target on mobile, compact from `sm`.
const TOUCH_TARGET = 'min-h-11 min-w-11 sm:min-h-9 sm:min-w-9';

export function UiShellView({
  emptyMessage,
  menuLoadingMessage,
  retryLabel,
  showMenuLabel,
  hideMenuLabel,
  closeTabLabel,
  noticeConfirmLabel,
  noticeCloseLabel,
  menuStatus,
  menuItems,
  menuError,
  menuErrorTraceId,
  isMenuOpen,
  tabs,
  activeId,
  notice,
  renderForm,
  onLeafSelect,
  onTabSelect,
  onTabClose,
  onMenuRetry,
  onMenuToggle,
  onNoticeClose,
}: InterUiShell) {
  const close = () => onNoticeClose?.();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div className="lg:hidden" style={{ padding: 8 }}>
        <JButton variant="outline" className={TOUCH_TARGET} onClick={onMenuToggle}>
          {isMenuOpen ? hideMenuLabel : showMenuLabel}
        </JButton>
      </div>
      <div className="lg:flex" style={{ flex: 1, minHeight: 0 }}>
        {/* Phone: a drawer above the workspace, toggled by the button. From `lg`: a permanent sidebar. */}
        <aside
          className={isMenuOpen ? 'flex' : 'hidden lg:flex'}
          style={{ flex: '0 0 16rem', flexDirection: 'column', overflowY: 'auto', borderRight: '1px solid #e5e5e5' }}
        >
          {menuStatus === 'loading' ? <p style={{ padding: 12 }}>{menuLoadingMessage}</p> : null}
          {menuStatus === 'error' ? (
            <div style={{ display: 'grid', gap: 8, padding: 8 }}>
              <JAlert variant="danger" role="alert">
                <span>{menuError}</span>
                {menuErrorTraceId ? <small> Código de seguimiento: {menuErrorTraceId}</small> : null}
              </JAlert>
              <JButton variant="outline" className={TOUCH_TARGET} onClick={onMenuRetry}>
                {retryLabel}
              </JButton>
            </div>
          ) : null}
          {menuStatus === 'ready' ? <MenuTree items={menuItems} onLeafSelect={onLeafSelect} /> : null}
        </aside>
        <main style={{ flex: 1, minWidth: 0, padding: 16 }}>
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
        </main>
      </div>
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
    </div>
  );
}
