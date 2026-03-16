import React from 'react';
import { InterTabsMolecule } from './InterTabsMolecule';
interface TabsContextValue {
    value: string;
    onChange: (v: string) => void;
    onTabFocus?: (v: string) => void;
    onDisabledTabClick?: (v: string) => void;
    variant: 'pill' | 'line';
    orientation: 'horizontal' | 'vertical';
}
export declare const TabsContext: React.Context<TabsContextValue>;
export declare const TabsMoleculeView: React.FC<InterTabsMolecule>;
export declare const TabsListView: React.FC<React.HTMLAttributes<HTMLDivElement>>;
interface TabsTriggerViewProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}
export declare const TabsTriggerView: React.FC<TabsTriggerViewProps>;
interface TabsContentViewProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}
export declare const TabsContentView: React.FC<TabsContentViewProps>;
export {};
