// JUserAvatarView.ts — JONA View (template puro)
export const J_USER_AVATAR_TEMPLATE = `
    <div [class]="cn('flex items-center gap-3', className())">
      <div [class]="avatarClasses()" [attr.aria-label]="'Avatar de ' + name()" aria-hidden="true">
        {{ initials() }}
      </div>
      <div class="min-w-0">
        <span [class]="cn('block truncate font-medium text-neutral-900', size2().name)">{{ name() }}</span>
        @if (email(); as e) {
          <span [class]="cn('block truncate text-neutral-500', size2().email)">{{ e }}</span>
        }
      </div>
    </div>
  `;

