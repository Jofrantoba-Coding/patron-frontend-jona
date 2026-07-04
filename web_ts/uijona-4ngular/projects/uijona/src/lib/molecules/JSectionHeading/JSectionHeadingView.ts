// JSectionHeadingView.ts — JONA View (template puro)
export const J_SECTION_HEADING_TEMPLATE = `
    <div [class]="classes()">
      @if (eyebrow(); as e) {
        <span class="text-xs font-semibold uppercase tracking-wide text-primary-600">{{ e }}</span>
      }
      <h2 class="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">{{ heading() }}</h2>
      @if (description(); as d) {
        <p class="max-w-prose text-base leading-relaxed text-neutral-600">{{ d }}</p>
      }
    </div>
  `;

