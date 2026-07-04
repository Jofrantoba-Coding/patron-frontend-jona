// JSiteFooterView.ts — JONA View (template puro)
export const J_SITE_FOOTER_TEMPLATE = `
    <footer [class]="classes()">
      <span>{{ copyright() }}</span>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
        @for (link of links(); track link.href) {
          <a
            [href]="link.href"
            class="font-medium text-neutral-500 no-underline transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >{{ link.label }}</a
          >
        }
      </div>
    </footer>
  `;

