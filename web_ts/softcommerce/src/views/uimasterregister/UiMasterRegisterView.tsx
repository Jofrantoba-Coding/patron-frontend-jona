// Layer: View. Pure render of the master register: the generic register laid out in tabs. Every panel stays mounted (R-MD-1, D10).
import { JTabs, JTabsList, JTabsTrigger } from 'jona-ui';
import { isValidElement, type ReactNode } from 'react';
import { ChildGrid } from '../../shared/ui/ChildGrid';
import { LookupDialog } from '../../shared/ui/LookupDialog';
import { UICRUDREGISTER_DEFAULTS } from '../uicrudregister/InterUiCrudRegister';
import { UiCrudRegister } from '../uicrudregister/UiCrudRegister';
import { UiCrudRegisterView } from '../uicrudregister/UiCrudRegisterView';
import { GuardedOptionPane } from '../uishell/DialogStackProvider';
import { InlineEntry } from './InlineEntry';
import type { InterUiMasterRegister } from './InterUiMasterRegister';

const noop = () => undefined;

export function UiMasterRegisterView({ register, tabs, activeTab, onTabChange, childDialog, pickerDialog, quitarConfirm }: InterUiMasterRegister) {
  // jona-ui `JTabsContent` renders nothing for an inactive tab (JTabsView.tsx:126), which would drop the entered data and the pending rows.
  // So `JTabs` only draws the trigger list and each panel is rendered here, `hidden` when inactive.
  const arrange = (nodes: ReactNode[]) => {
    const byField = new Map(nodes.flatMap((node) => (isValidElement(node) && node.key !== null ? [[String(node.key), node] as const] : [])));
    return (
      <div className="grid min-w-0 gap-3">
        <JTabs value={activeTab} onChange={onTabChange}>
          <JTabsList>
            {tabs.map((tab) => (
              <JTabsTrigger key={tab.key} value={tab.key}>
                {tab.title}
              </JTabsTrigger>
            ))}
          </JTabsList>
        </JTabs>
        {tabs.map((tab) => (
          <div key={tab.key} role="tabpanel" aria-label={tab.title} hidden={tab.key !== activeTab} className="grid min-w-0 gap-3">
            {tab.inline && <InlineEntry {...tab.inline} />}
            {tab.grid ? <ChildGrid {...tab.grid} /> : tab.fields.map((name) => byField.get(name))}
          </div>
        ))}
      </div>
    );
  };
  return (
    <>
      <UiCrudRegisterView {...UICRUDREGISTER_DEFAULTS} {...register} arrange={arrange} />
      {childDialog && (
        <UiCrudRegister mode="INSERT" config={childDialog.config} service={childDialog.service} lookups={childDialog.lookups} lookup={childDialog.lookup} onDone={noop} onClose={childDialog.onClose} />
      )}
      {pickerDialog && <LookupDialog {...pickerDialog} />}
      {quitarConfirm && (
        <GuardedOptionPane open variant="info" title={quitarConfirm.title} description={quitarConfirm.description} confirmLabel={UICRUDREGISTER_DEFAULTS.confirmLabel} cancelLabel={UICRUDREGISTER_DEFAULTS.declineLabel} onConfirm={quitarConfirm.onConfirm} onClose={quitarConfirm.onCancel} />
      )}
    </>
  );
}
