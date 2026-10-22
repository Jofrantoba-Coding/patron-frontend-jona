// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JButton } from 'jona-ui';
import type { InterShellHeader } from './InterShellHeader';

export function ShellHeaderView({
  logoutLabel,
  userLabel,
  empresaLabel,
  puntoVentaLabel,
  periodLabel,
  userName,
  empresaName,
  puntoVentaName,
  period,
  onLogout,
}: InterShellHeader) {
  const fields = [
    [userLabel, userName],
    [empresaLabel, empresaName],
    [puntoVentaLabel, puntoVentaName],
    [periodLabel, period],
  ];
  return (
    <header
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, padding: '8px 16px', borderBottom: '1px solid #e5e5e5' }}
    >
      <dl style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', margin: 0, flex: 1, minWidth: 0 }}>
        {fields.map(([label, value]) => (
          <div key={label} style={{ display: 'flex', gap: 4, minWidth: 0 }}>
            <dt>{label}:</dt>
            <dd style={{ margin: 0, fontWeight: 600 }}>{value}</dd>
          </div>
        ))}
      </dl>
      {/* Floor, not a fixed height: 44px touch target on mobile, compact from `sm`. */}
      <JButton variant="outline" className="min-h-11 sm:min-h-9" onClick={onLogout}>
        {logoutLabel}
      </JButton>
    </header>
  );
}
