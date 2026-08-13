import type { ContactMethodData, InterJContactMethods } from './InterJContactMethods';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import { JContactMethodCard } from '../../molecules/JContactMethodCard';
/** JContactMethods — grilla de medios de contacto. */
@Component({
  selector: 'j-contact-methods',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JContactMethodCard],
  host: { class: 'contents' },
  templateUrl: './JContactMethodsView.html',
})
export class JContactMethods {
  readonly methods = input.required<ContactMethodData[]>();
  readonly className = input<string>('');
  protected readonly cn = cn;
}
