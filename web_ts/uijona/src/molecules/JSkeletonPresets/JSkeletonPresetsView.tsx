// JSkeletonPresetsView.tsx — JONA View (render puro)
import React from 'react';
import { JSkeleton } from '../../atoms/JSkeleton';
import { InterSkeletonTableRows, InterSkeletonForm } from './InterJSkeletonPresets';
import { JPanel } from '../../atoms/JPanel/JPanel';

export const SkeletonUserRowView: React.FC = () => (
  <JPanel variant="ghost" padding="none" radius="none" className="flex items-center gap-3">
    <JSkeleton circle className="w-10 h-10 shrink-0" />
    <JPanel variant="ghost" padding="none" radius="none" className="flex flex-col gap-2 flex-1">
      <JSkeleton className="h-3 w-32" />
      <JSkeleton className="h-3 w-48" />
    </JPanel>
  </JPanel>
);

export const SkeletonCardView: React.FC = () => (
  <JPanel variant="ghost" padding="none" radius="none" className="rounded-lg border border-neutral-200 p-6 space-y-4">
    <JPanel variant="ghost" padding="none" radius="none" className="space-y-2">
      <JSkeleton className="h-4 w-40" />
      <JSkeleton className="h-3 w-64" />
    </JPanel>
    <JPanel variant="ghost" padding="none" radius="none" className="space-y-2">
      <JSkeleton className="h-3 w-full" />
      <JSkeleton className="h-3 w-full" />
      <JSkeleton className="h-3 w-3/4" />
    </JPanel>
    <JPanel variant="ghost" padding="none" radius="none" className="flex gap-2 pt-2">
      <JSkeleton className="h-8 w-20 rounded-md" />
      <JSkeleton className="h-8 w-20 rounded-md" />
    </JPanel>
  </JPanel>
);

export const SkeletonTableRowsView: React.FC<InterSkeletonTableRows> = ({ rows = 4, cols = 4 }) => (
  <JPanel variant="ghost" padding="none" radius="none" className="space-y-2">
    {Array.from({ length: rows }).map((_, r) => (
      <JPanel variant="ghost" padding="none" radius="none" key={r} className="flex gap-4">
        {Array.from({ length: cols }).map((_, c) => <JSkeleton key={c} className="h-4 flex-1" />)}
      </JPanel>
    ))}
  </JPanel>
);

export const SkeletonFormView: React.FC<InterSkeletonForm> = ({ fields = 3 }) => (
  <JPanel variant="ghost" padding="none" radius="none" className="space-y-4">
    {Array.from({ length: fields }).map((_, i) => (
      <JPanel variant="ghost" padding="none" radius="none" key={i} className="space-y-1.5">
        <JSkeleton className="h-3 w-24" />
        <JSkeleton className="h-9 w-full rounded-md" />
      </JPanel>
    ))}
    <JSkeleton className="h-9 w-28 rounded-md" />
  </JPanel>
);
