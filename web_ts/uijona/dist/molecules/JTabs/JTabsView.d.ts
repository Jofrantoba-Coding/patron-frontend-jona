import React from 'react';
import { InterJTabs } from './InterJTabs';
interface JTabsContextValue {
    value: string;
    onChange: (v: string) => void;
    onTabFocus?: (v: string) => void;
    onDisabledTabClick?: (v: string) => void;
    variant: 'pill' | 'line';
    orientation: 'horizontal' | 'vertical';
}
export declare const JTabsContext: React.Context<JTabsContextValue>;
export declare const JTabsView: React.FC<InterJTabs>;
export declare const JTabsListView: React.FC<React.HTMLAttributes<HTMLDivElement>>;
interface JTabsTriggerViewProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}
export declare const JTabsTriggerView: React.FC<JTabsTriggerViewProps>;
interface JTabsContentViewProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}
export declare const JTabsContentView: React.FC<JTabsContentViewProps>;
export {};
