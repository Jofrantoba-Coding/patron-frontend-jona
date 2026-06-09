import React from 'react';
import { InterJDropdown, JDropdownGroup } from './InterJDropdown';
export interface JDropdownViewProps extends InterJDropdown {
    open: boolean;
    menuStyle: React.CSSProperties;
    triggerRef: React.RefObject<HTMLDivElement>;
    menuRef: React.RefObject<HTMLDivElement>;
    onTriggerClick: () => void;
    onItemClick: (item: JDropdownGroup['items'][number]) => void;
}
export declare const JDropdownView: React.FC<JDropdownViewProps>;
