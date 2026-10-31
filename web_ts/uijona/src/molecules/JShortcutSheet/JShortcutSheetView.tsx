// JShortcutSheetView.tsx — JONA View (pure render)
import React from 'react';
import { cn } from '../../lib/cn';
import { JButton } from '../../atoms/JButton/JButton';
import { JDialog } from '../JDialog/JDialog';
import { FG, FG_MUTED, LINE, SURFACE_MUTED, TEXT_BODY, TEXT_CAPTION, TEXT_SECTION } from '../../theme/tokenClasses';
import { JShortcutGroup } from './InterJShortcutSheet';

export interface JShortcutSheetViewProps {
  open: boolean;
  title: string;
  closeLabel: string;
  groups: JShortcutGroup[];
  groupId: (index: number) => string;
  onClose: () => void;
}

const KBD = cn('inline-flex min-w-[1.75rem] items-center justify-center rounded border px-1.5 py-0.5 font-mono', TEXT_CAPTION, LINE, SURFACE_MUTED, FG);

export const JShortcutSheetView: React.FC<JShortcutSheetViewProps> = ({ open, title, closeLabel, groups, groupId, onClose }) => (
  <JDialog
    open={open}
    title={title}
    size="lg"
    showCloseButton={false}
    onClose={onClose}
    footer={
      <JButton variant="outline" density="auto" onClick={onClose}>
        {closeLabel}
      </JButton>
    }
  >
    <div className="grid gap-6 sm:grid-cols-2">
      {groups.map((group, index) => (
        <div key={group.title} className="min-w-0">
          <h3 id={groupId(index)} className={cn('mb-2', TEXT_SECTION, FG)}>
            {group.title}
          </h3>
          <ul aria-labelledby={groupId(index)} className="flex flex-col">
            {group.items.map((item) => (
              <li
                key={`${item.keys.join('+')}-${item.label}`}
                className={cn('flex items-center justify-between gap-3 border-b py-2 last:border-b-0', LINE)}
              >
                <span className={cn('min-w-0', TEXT_BODY, FG)}>{item.label}</span>
                <span className={cn('flex shrink-0 items-center gap-1', FG_MUTED)}>
                  {item.keys.map((key) => (
                    <kbd key={key} className={KBD}>
                      {key}
                    </kbd>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </JDialog>
);
