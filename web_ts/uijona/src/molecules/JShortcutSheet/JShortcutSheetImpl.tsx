// JShortcutSheetImpl.tsx — JONA Implementation
import React, { useId } from 'react';
import { InterJShortcutSheet, JSHORTCUTSHEET_CLOSE_LABEL, JSHORTCUTSHEET_DEFAULTS } from './InterJShortcutSheet';
import { JShortcutSheetView } from './JShortcutSheetView';

/** A JDialog: its focus trap moves focus in on open and back to the invoker on close; Esc calls `onClose`. */
export const JShortcutSheetImpl: React.FC<InterJShortcutSheet> = ({ open, title, groups, onClose }) => {
  const baseId = useId();
  return (
    <JShortcutSheetView
      open={open}
      title={title ?? JSHORTCUTSHEET_DEFAULTS.title}
      closeLabel={JSHORTCUTSHEET_CLOSE_LABEL}
      groups={groups}
      groupId={(index) => `${baseId}-group-${index}`}
      onClose={onClose}
    />
  );
};

JShortcutSheetImpl.displayName = 'JShortcutSheet';
