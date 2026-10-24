// Layer: public entry. The inline entry of a child (R-MD-3): its fields above the grid and an Agregar that validates them in place.
// The Impl is the unchanged register hook, embedded in its host (no dialog, no question); the View is the register View without its dialog.
import { JButton } from 'jona-ui';
import { useState } from 'react';
import { UICRUDREGISTER_DEFAULTS } from '../uicrudregister/InterUiCrudRegister';
import { useUiCrudRegisterImpl } from '../uicrudregister/UiCrudRegisterImpl';
import { UiCrudRegisterView } from '../uicrudregister/UiCrudRegisterView';
import type { MasterInlineEntry } from './InterUiMasterRegister';

const noop = () => undefined;

function Entry({ config, service, lookups, lookup, onAdded }: MasterInlineEntry & { onAdded: () => void }) {
  const register = useUiCrudRegisterImpl(config, service, 'INSERT', undefined, { lookups, lookup, onDone: noop, onClose: onAdded }, { embedded: true });
  return (
    <div className="grid min-w-0 gap-2">
      <UiCrudRegisterView {...UICRUDREGISTER_DEFAULTS} {...register} inline />
      <div>
        <JButton variant="outline" className="min-h-11 sm:min-h-9" disabled={!register.canSubmit} onClick={register.onSubmit}>
          Agregar
        </JButton>
      </div>
    </div>
  );
}

/** A valid add hands the row to the grid and remounts the entry, so its fields start again from their defaults. */
export function InlineEntry(props: MasterInlineEntry) {
  const [round, setRound] = useState(0);
  return <Entry key={round} {...props} onAdded={() => setRound((current) => current + 1)} />;
}
