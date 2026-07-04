// JProgressView.ts — JONA View (template puro)
export const J_PROGRESS_TEMPLATE = `
    @if (type() === 'circle') {
      <div
        data-jprogress-type="circle"
        [attr.data-jprogress-variant]="variant()"
        [attr.data-jprogress-size]="size()"
        [class]="cn('jprogress inline-flex items-center justify-center', className())"
        [style]="style()"
      >
        <svg
          [attr.width]="sz()"
          [attr.height]="sz()"
          [attr.viewBox]="'0 0 ' + sz() + ' ' + sz()"
          role="progressbar"
          [attr.aria-valuenow]="value()"
          [attr.aria-valuemin]="0"
          [attr.aria-valuemax]="max()"
          [attr.aria-label]="displayLabel()"
        >
          <circle
            [attr.cx]="sz() / 2"
            [attr.cy]="sz() / 2"
            [attr.r]="radius()"
            fill="none"
            stroke="#e5e7eb"
            [attr.stroke-width]="sw()"
          ></circle>
          <circle
            [attr.cx]="sz() / 2"
            [attr.cy]="sz() / 2"
            [attr.r]="radius()"
            fill="none"
            [attr.stroke]="circleColor()"
            [attr.stroke-width]="sw()"
            stroke-linecap="round"
            [attr.stroke-dasharray]="circ()"
            [attr.stroke-dashoffset]="offset()"
            style="transition: stroke-dashoffset 0.35s ease; transform-origin: center;"
            [attr.transform]="'rotate(-90 ' + sz() / 2 + ' ' + sz() / 2 + ')'"
          ></circle>
          @if (showLabel()) {
            <text
              x="50%"
              y="50%"
              dominant-baseline="central"
              text-anchor="middle"
              fill="#6b7280"
              font-weight="600"
              [style.font-size.px]="circleFontSize()"
              style="font-variant-numeric: tabular-nums;"
            >
              {{ displayLabel() }}
            </text>
          }
        </svg>
      </div>
    } @else {
      <div
        data-jprogress-type="bar"
        [attr.data-jprogress-variant]="variant()"
        [attr.data-jprogress-size]="size()"
        [class]="cn('jprogress flex items-center gap-2', className())"
        [style]="style()"
      >
        <div
          role="progressbar"
          [attr.aria-valuenow]="value()"
          [attr.aria-valuemin]="0"
          [attr.aria-valuemax]="max()"
          [attr.aria-label]="displayLabel()"
          [class]="cn('relative flex-1 rounded-full bg-neutral-200 overflow-hidden', barHeight())"
        >
          <div
            [class]="
              cn('h-full rounded-full transition-all duration-300', barFill(), animated() && 'jprogress-bar-shimmer')
            "
            [style.width.%]="pct()"
          ></div>
        </div>
        @if (showLabel()) {
          <span class="text-xs text-neutral-500 tabular-nums w-9 text-right shrink-0">
            {{ displayLabel() }}
          </span>
        }
      </div>
    }
  `;
