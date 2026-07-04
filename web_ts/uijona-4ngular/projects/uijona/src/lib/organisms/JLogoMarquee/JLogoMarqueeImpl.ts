import { J_LOGO_MARQUEE_TEMPLATE } from './JLogoMarqueeView';
import type { JLogoMarqueeSpeed, InterJLogoMarquee } from './InterJLogoMarquee';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';

const SPEED_CLASSES: Record<JLogoMarqueeSpeed, string> = {
  slow: 'animate-[marquee_48s_linear_infinite]',
  normal: 'animate-[marquee_32s_linear_infinite]',
  fast: 'animate-[marquee_20s_linear_infinite]',
};

/** JLogoMarquee — franja de logos/etiquetas en desplazamiento continuo. */
@Component({
  selector: 'j-logo-marquee',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_LOGO_MARQUEE_TEMPLATE,
})
export class JLogoMarquee {
  readonly items = input.required<string[]>();
  readonly label = input<string>();
  readonly speed = input<JLogoMarqueeSpeed>('normal');
  readonly pauseOnHover = input<boolean>(true);
  readonly className = input<string>('');

  protected readonly cn = cn;
  protected readonly doubled = computed(() => [...this.items(), ...this.items()]);
  protected readonly trackClasses = computed(() =>
    cn(
      'flex w-max items-center gap-14 pr-14',
      SPEED_CLASSES[this.speed()],
      this.pauseOnHover() && 'group-hover:[animation-play-state:paused]',
      'motion-reduce:animate-none'
    )
  );
}
