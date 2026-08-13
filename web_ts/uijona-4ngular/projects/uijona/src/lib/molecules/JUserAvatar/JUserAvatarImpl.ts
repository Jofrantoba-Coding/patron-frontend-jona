import type { JUserAvatarSize, InterJUserAvatar } from './InterJUserAvatar';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';
import {
  SIZE,
} from './JUserAvatarStyles';

/**
 * JUserAvatar — avatar con iniciales + nombre y email (metadata de usuario).
 */
@Component({
  selector: 'j-user-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './JUserAvatarView.html',
})
export class JUserAvatar {
  readonly name = input.required<string>();
  readonly email = input<string>();
  readonly size = input<JUserAvatarSize>('md');
  readonly className = input<string>('');

  protected readonly cn = cn;
  protected readonly size2 = computed(() => SIZE[this.size()]);

  protected readonly initials = computed(
    () =>
      this.name()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '?'
  );

  protected readonly avatarClasses = computed(() =>
    cn(
      'flex flex-shrink-0 items-center justify-center rounded-full bg-primary-600 font-semibold text-white',
      SIZE[this.size()].avatar
    )
  );
}
