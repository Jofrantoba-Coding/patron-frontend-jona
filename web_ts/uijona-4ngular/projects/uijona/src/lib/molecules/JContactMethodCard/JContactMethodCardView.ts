// JContactMethodCardView.ts — JONA View (template puro)
export const J_CONTACT_METHOD_CARD_TEMPLATE = `
    <div [class]="classes()">
      <span class="text-3xl leading-none" aria-hidden="true">{{ icon() }}</span>
      <strong class="text-base font-bold text-neutral-900">{{ label() }}</strong>
      <p class="text-sm leading-relaxed text-neutral-500">{{ description() }}</p>
      @if (actionLabel(); as al) {
        <a
          [href]="href()"
          class="mt-2 inline-flex min-h-11 w-fit items-center justify-center rounded-md bg-primary-600 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          >{{ al }}</a
        >
      } @else {
        <a
          [href]="href()"
          class="mt-2 inline-flex w-fit items-center text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >{{ href() }}</a
        >
      }
    </div>
  `;

