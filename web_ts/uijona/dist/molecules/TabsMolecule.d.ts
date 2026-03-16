import React from 'react';
import { InterEventsTabsMolecule } from './events/InterEventsTabsMolecule';
interface TabsMoleculeProps extends InterEventsTabsMolecule {
    value: string;
    variant?: 'pill' | 'line';
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    children: React.ReactNode;
}
export declare const TabsMolecule: React.FC<TabsMoleculeProps>;
export declare const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>>;
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}
export declare const TabsTrigger: React.FC<TabsTriggerProps>;
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}
export declare const TabsContent: React.FC<TabsContentProps>;
export {};
