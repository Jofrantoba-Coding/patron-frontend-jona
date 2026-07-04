import { J_TIMER_TEMPLATE } from './JTimerView';
import type { JTimerMode, JTimerStatus, JTimerVariant, JTimerSize, JTimerTone, InterJTimer } from './InterJTimer';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { cn } from '../../core/cn';

const VARIANT_CLASSES: Record<JTimerVariant, string> = {
  plain: 'bg-transparent',
  card: 'rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5',
  inline: 'inline-flex items-center gap-3',
};

const SIZE_CLASSES: Record<JTimerSize, { display: string; label: string; button: string }> = {
  sm: { display: 'text-xl', label: 'text-xs', button: 'h-8 px-3 text-xs' },
  md: { display: 'text-3xl', label: 'text-sm', button: 'h-9 px-3 text-sm' },
  lg: { display: 'text-5xl', label: 'text-base', button: 'h-10 px-4 text-sm' },
};

const TONE_CLASSES: Record<JTimerTone, string> = {
  neutral: 'text-neutral-900',
  success: 'text-success-700',
  warning: 'text-warning-700',
  danger: 'text-danger-700',
  info: 'text-primary-700',
};

const pad = (n: number, len = 2) => String(n).padStart(len, '0');

/**
 * JTimer — temporizador visual (cuenta regresiva o cronómetro) con controles.
 */
@Component({
  selector: 'j-timer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_TIMER_TEMPLATE,
})
export class JTimer implements OnInit {
  readonly mode = input<JTimerMode>('countdown');
  readonly durationMs = input<number>(60_000);
  readonly maxMs = input<number>();
  readonly autoStart = input<boolean>(false);
  readonly tickIntervalMs = input<number>(1000);
  readonly controls = input<boolean>(true);
  readonly loop = input<boolean>(false);
  readonly showHours = input<boolean>(true);
  readonly showMilliseconds = input<boolean>(false);
  readonly padHours = input<boolean>(true);
  readonly label = input<string>();
  readonly completedLabel = input<string>();
  readonly startLabel = input<string>('Iniciar');
  readonly pauseLabel = input<string>('Pausar');
  readonly resumeLabel = input<string>('Continuar');
  readonly resetLabel = input<string>('Reiniciar');
  readonly variant = input<JTimerVariant>('card');
  readonly size = input<JTimerSize>('md');
  readonly tone = input<JTimerTone>('neutral');
  readonly className = input<string>('');

  readonly completed = output<void>();
  readonly statusChange = output<JTimerStatus>();

  protected readonly cn = cn;
  protected readonly status = signal<JTimerStatus>('idle');
  private readonly valueMs = signal(0);
  private handle: ReturnType<typeof setInterval> | null = null;
  private readonly destroyRef = inject(DestroyRef);

  protected readonly sizeCls = computed(() => SIZE_CLASSES[this.size()]);
  protected readonly toneCls = computed(() => TONE_CLASSES[this.tone()]);

  protected readonly containerClasses = computed(() =>
    cn(
      'min-w-0',
      VARIANT_CLASSES[this.variant()],
      this.variant() !== 'inline' && 'flex flex-col gap-3',
      this.className()
    )
  );

  protected readonly canStart = computed(() => this.status() === 'idle' || this.status() === 'completed');
  protected readonly canPause = computed(() => this.status() === 'running');
  protected readonly canResume = computed(() => this.status() === 'paused');

  protected readonly display = computed(() => {
    const total = this.valueMs();
    const hours = Math.floor(total / 3_600_000);
    const minutes = Math.floor((total % 3_600_000) / 60_000);
    const seconds = Math.floor((total % 60_000) / 1000);
    const ms = total % 1000;
    const parts: string[] = [];
    if (this.showHours()) parts.push(this.padHours() ? pad(hours) : String(hours));
    parts.push(pad(minutes));
    parts.push(pad(seconds));
    let out = parts.join(':');
    if (this.showMilliseconds()) out += '.' + pad(ms, 3);
    return out;
  });

  ngOnInit(): void {
    this.valueMs.set(this.initialValue());
    if (this.autoStart()) this.start();
    this.destroyRef.onDestroy(() => this.clear());
  }

  private initialValue(): number {
    return this.mode() === 'countdown' ? this.durationMs() : 0;
  }

  private setStatus(s: JTimerStatus): void {
    this.status.set(s);
    this.statusChange.emit(s);
  }

  start(): void {
    this.valueMs.set(this.initialValue());
    this.run();
  }

  resume(): void {
    this.run();
  }

  pause(): void {
    this.clear();
    this.setStatus('paused');
  }

  reset(): void {
    this.clear();
    this.valueMs.set(this.initialValue());
    this.setStatus('idle');
  }

  private run(): void {
    this.clear();
    this.setStatus('running');
    const step = this.tickIntervalMs();
    this.handle = setInterval(() => this.tick(step), step);
  }

  private tick(step: number): void {
    if (this.mode() === 'countdown') {
      const next = this.valueMs() - step;
      if (next <= 0) {
        this.valueMs.set(0);
        this.onComplete();
      } else {
        this.valueMs.set(next);
      }
    } else {
      const next = this.valueMs() + step;
      const max = this.maxMs();
      if (max !== undefined && next >= max) {
        this.valueMs.set(max);
        this.onComplete();
      } else {
        this.valueMs.set(next);
      }
    }
  }

  private onComplete(): void {
    this.clear();
    this.setStatus('completed');
    this.completed.emit();
    if (this.loop()) this.start();
  }

  private clear(): void {
    if (this.handle !== null) {
      clearInterval(this.handle);
      this.handle = null;
    }
  }

  protected primaryBtn(): string {
    return cn(
      'rounded-md bg-primary-600 font-medium text-white transition-colors hover:bg-primary-700',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
      this.sizeCls().button
    );
  }
  protected secondaryBtn(): string {
    return cn(
      'rounded-md border border-neutral-300 bg-white font-medium text-neutral-700 transition-colors hover:bg-neutral-50',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
      this.sizeCls().button
    );
  }
}
