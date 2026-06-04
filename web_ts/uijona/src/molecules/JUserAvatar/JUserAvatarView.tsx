// JUserAvatarView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { JLabel } from '../../atoms/JLabel';
import { InterJUserAvatar, JUserAvatarSize } from './InterJUserAvatar';

const SIZE: Record<JUserAvatarSize, { avatar: string; text: string }> = {
  sm: { avatar: 'w-7 h-7 text-xs',     text: 'text-xs' },
  md: { avatar: 'w-10 h-10 text-sm',   text: 'text-sm' },
  lg: { avatar: 'w-14 h-14 text-base', text: 'text-base' },
};

export const JUserAvatarView: React.FC<InterJUserAvatar> = ({ name, email, size = 'md', className }) => {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded-full bg-primary-600 font-semibold text-white',
          SIZE[size].avatar,
        )}
        aria-label={`Avatar de ${name}`}
        aria-hidden="true"
      >
        {initials}
      </div>
      <div className="min-w-0">
        <JLabel as="span" size="sm" color="default" className="block truncate font-medium">{name}</JLabel>
        {email && <JLabel as="span" size="xs" color="muted" className="block truncate">{email}</JLabel>}
      </div>
    </div>
  );
};
