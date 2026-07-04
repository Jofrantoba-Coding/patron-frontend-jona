// JDashboardPreviewView.ts — JONA View (template puro)
export const J_DASHBOARD_PREVIEW_TEMPLATE = `
    <div [class]="cn('relative', className())">
      <div class="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary-100/60 to-transparent blur-2xl" aria-hidden="true"></div>
      <div class="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_24px_70px_-24px_rgba(15,23,42,0.25)]">
        <div class="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50/60 px-4 py-3">
          <span class="h-2.5 w-2.5 rounded-full bg-neutral-300"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-neutral-300"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-neutral-300"></span>
          <span class="ml-2 text-xs font-medium text-neutral-500">{{ title() }}</span>
          @if (statusLabel(); as sl) {
            <span class="ml-auto inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-medium text-success-700">
              <span class="h-1.5 w-1.5 rounded-full bg-success-500"></span> {{ sl }}
            </span>
          }
        </div>
        <div class="grid grid-cols-2 gap-3 p-4">
          @for (s of stats(); track s.label) {
            <div [class]="cn('rounded-xl border p-3', s.accent ? 'border-primary-200 bg-primary-50/50' : 'border-neutral-200 bg-white')">
              <span class="block text-[11px] font-medium text-neutral-500">{{ s.label }}</span>
              <strong class="mt-1 block text-xl font-black text-neutral-900">{{ s.value }}</strong>
              @if (s.delta) {
                <span class="block text-[11px] font-medium text-primary-600">{{ s.delta }}</span>
              }
            </div>
          }
          @if (chart().length) {
            <div class="col-span-2 rounded-xl border border-neutral-200 p-3">
              @if (chartLabel(); as cl) {
                <span class="mb-2 block text-[11px] font-medium text-neutral-500">{{ cl }}</span>
              }
              <div class="flex h-16 items-end gap-1.5">
                @for (h of chart(); track $index) {
                  <span class="flex-1 rounded-t bg-gradient-to-t from-primary-500 to-primary-300" [style.height.%]="h"></span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `;

