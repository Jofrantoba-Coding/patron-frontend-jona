import React from 'react';
import { SkeletonAtom } from '../atoms/SkeletonAtom';

export const SkeletonUserRow: React.FC = () => (
  <div className="flex items-center gap-3">
    <SkeletonAtom circle className="w-10 h-10 shrink-0" />
    <div className="flex flex-col gap-2 flex-1">
      <SkeletonAtom className="h-3 w-32" />
      <SkeletonAtom className="h-3 w-48" />
    </div>
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="rounded-lg border border-neutral-200 p-6 space-y-4">
    <div className="space-y-2">
      <SkeletonAtom className="h-4 w-40" />
      <SkeletonAtom className="h-3 w-64" />
    </div>
    <div className="space-y-2">
      <SkeletonAtom className="h-3 w-full" />
      <SkeletonAtom className="h-3 w-full" />
      <SkeletonAtom className="h-3 w-3/4" />
    </div>
    <div className="flex gap-2 pt-2">
      <SkeletonAtom className="h-8 w-20 rounded-md" />
      <SkeletonAtom className="h-8 w-20 rounded-md" />
    </div>
  </div>
);

export const SkeletonTableRows: React.FC<{ rows?: number; cols?: number }> = ({ rows = 4, cols = 4 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4">
        {Array.from({ length: cols }).map((_, c) => <SkeletonAtom key={c} className="h-4 flex-1" />)}
      </div>
    ))}
  </div>
);

export const SkeletonForm: React.FC<{ fields?: number }> = ({ fields = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-1.5">
        <SkeletonAtom className="h-3 w-24" />
        <SkeletonAtom className="h-9 w-full rounded-md" />
      </div>
    ))}
    <SkeletonAtom className="h-9 w-28 rounded-md" />
  </div>
);
