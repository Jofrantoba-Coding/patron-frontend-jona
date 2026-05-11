// SkeletonPresetsView.tsx — JONA View (render puro)
import React from 'react';
import { SkeletonAtom } from '../../atoms/SkeletonAtom';
import { InterSkeletonTableRows, InterSkeletonForm } from './InterSkeletonPresets';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

export const SkeletonUserRowView: React.FC = () => (
  <PanelAtom variant="ghost" padding="none" radius="none" className="flex items-center gap-3">
    <SkeletonAtom circle className="w-10 h-10 shrink-0" />
    <PanelAtom variant="ghost" padding="none" radius="none" className="flex flex-col gap-2 flex-1">
      <SkeletonAtom className="h-3 w-32" />
      <SkeletonAtom className="h-3 w-48" />
    </PanelAtom>
  </PanelAtom>
);

export const SkeletonCardView: React.FC = () => (
  <PanelAtom variant="ghost" padding="none" radius="none" className="rounded-lg border border-neutral-200 p-6 space-y-4">
    <PanelAtom variant="ghost" padding="none" radius="none" className="space-y-2">
      <SkeletonAtom className="h-4 w-40" />
      <SkeletonAtom className="h-3 w-64" />
    </PanelAtom>
    <PanelAtom variant="ghost" padding="none" radius="none" className="space-y-2">
      <SkeletonAtom className="h-3 w-full" />
      <SkeletonAtom className="h-3 w-full" />
      <SkeletonAtom className="h-3 w-3/4" />
    </PanelAtom>
    <PanelAtom variant="ghost" padding="none" radius="none" className="flex gap-2 pt-2">
      <SkeletonAtom className="h-8 w-20 rounded-md" />
      <SkeletonAtom className="h-8 w-20 rounded-md" />
    </PanelAtom>
  </PanelAtom>
);

export const SkeletonTableRowsView: React.FC<InterSkeletonTableRows> = ({ rows = 4, cols = 4 }) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className="space-y-2">
    {Array.from({ length: rows }).map((_, r) => (
      <PanelAtom variant="ghost" padding="none" radius="none" key={r} className="flex gap-4">
        {Array.from({ length: cols }).map((_, c) => <SkeletonAtom key={c} className="h-4 flex-1" />)}
      </PanelAtom>
    ))}
  </PanelAtom>
);

export const SkeletonFormView: React.FC<InterSkeletonForm> = ({ fields = 3 }) => (
  <PanelAtom variant="ghost" padding="none" radius="none" className="space-y-4">
    {Array.from({ length: fields }).map((_, i) => (
      <PanelAtom variant="ghost" padding="none" radius="none" key={i} className="space-y-1.5">
        <SkeletonAtom className="h-3 w-24" />
        <SkeletonAtom className="h-9 w-full rounded-md" />
      </PanelAtom>
    ))}
    <SkeletonAtom className="h-9 w-28 rounded-md" />
  </PanelAtom>
);
