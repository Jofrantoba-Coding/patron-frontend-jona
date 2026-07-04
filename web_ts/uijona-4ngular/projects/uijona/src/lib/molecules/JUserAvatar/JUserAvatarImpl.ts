import { J_USER_AVATAR_TEMPLATE } from './JUserAvatarView';
import type { JUserAvatarSize, InterJUserAvatar } from './InterJUserAvatar';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../../core/cn';

const SIZE: Record<JUserAvatarSize, { avatar: string; name: string; email: string }> = {
  sm: { avatar: 'w-7 h-7 text-xs', name: 'text-sm', email: 'text-xs' },
  md: { avatar: 'w-10 h-10 text-sm', name: 'text-sm', email: 'text-xs' },
  lg: { avatar: 'w-14 h-14 text-base', name: 'text-base', email: 'text-sm' },
};

/**
 * JUserAvatar — avatar con iniciales + nombre y email (metadata de usuario).
 */
@Component({
  selector: 'j-user-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: J_USER_AVATAR_TEMPLATE,
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
