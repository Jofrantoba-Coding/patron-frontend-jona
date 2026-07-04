// JSkeletonPresetsView.ts — JONA View (template puro)
export const J_SKELETON_PRESETS_TEMPLATE_1 = `
    <div class="flex items-center gap-3">
      <j-skeleton [circle]="true" className="w-10 h-10 shrink-0" />
      <div class="flex flex-col gap-2 flex-1">
        <j-skeleton className="h-3 w-32" />
        <j-skeleton className="h-3 w-48" />
      </div>
    </div>
  `;

export const J_SKELETON_PRESETS_TEMPLATE_2 = `
    <div class="rounded-lg border border-neutral-200 p-6 space-y-4">
      <div class="space-y-2">
        <j-skeleton className="h-4 w-40 max-w-full" />
        <j-skeleton className="h-3 w-64 max-w-full" />
      </div>
      <div class="space-y-2">
        <j-skeleton className="h-3 w-full" />
        <j-skeleton className="h-3 w-full" />
        <j-skeleton className="h-3 w-3/4" />
      </div>
      <div class="flex gap-2 pt-2">
        <j-skeleton className="h-8 w-20 rounded-md" />
        <j-skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  `;

export const J_SKELETON_PRESETS_TEMPLATE_3 = `
    <div class="space-y-2">
      @for (r of rowsArr(); track r) {
        <div class="flex gap-4">
          @for (c of colsArr(); track c) {
            <j-skeleton className="h-4 flex-1" />
          }
        </div>
      }
    </div>
  `;

export const J_SKELETON_PRESETS_TEMPLATE_4 = `
    <div class="space-y-4">
      @for (f of fieldsArr(); track f) {
        <div class="space-y-1.5">
          <j-skeleton className="h-3 w-24" />
          <j-skeleton className="h-9 w-full rounded-md" />
        </div>
      }
      <j-skeleton className="h-9 w-28 rounded-md" />
    </div>
  `;

