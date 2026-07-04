// JTimerView.ts — JONA View (template puro)
export const J_TIMER_TEMPLATE = `
    <div
      [class]="containerClasses()"
      [attr.data-status]="status()"
      [attr.data-mode]="mode()"
    >
      @if ((label() || completedLabel()) && variant() !== 'inline') {
        <div class="min-w-0">
          @if (label(); as l) {
            <p [class]="cn('break-words font-medium text-neutral-500', sizeCls().label)">{{ l }}</p>
          }
          @if (status() === 'completed' && completedLabel()) {
            <p [class]="cn('mt-1 break-words font-medium', sizeCls().label, toneCls())">{{ completedLabel() }}</p>
          }
        </div>
      }

      <div [class]="cn('min-w-0', variant() === 'inline' && 'flex items-center gap-3')">
        <output
          [attr.aria-live]="status() === 'running' ? 'off' : 'polite'"
          aria-label="Timer"
          [class]="cn('block break-words font-mono font-semibold leading-none tabular-nums', sizeCls().display, toneCls())"
        >
          {{ display() }}
        </output>

        @if (controls()) {
          <div [class]="cn('flex flex-wrap items-center gap-2', variant() === 'inline' ? 'ml-1' : 'mt-3')">
            @if (canStart()) {
              <button type="button" [class]="primaryBtn()" (click)="start()">{{ startLabel() }}</button>
            }
            @if (canPause()) {
              <button type="button" [class]="secondaryBtn()" (click)="pause()">{{ pauseLabel() }}</button>
            }
            @if (canResume()) {
              <button type="button" [class]="primaryBtn()" (click)="resume()">{{ resumeLabel() }}</button>
            }
            <button type="button" [class]="secondaryBtn()" (click)="reset()">{{ resetLabel() }}</button>
          </div>
        }
      </div>
    </div>
  `;

