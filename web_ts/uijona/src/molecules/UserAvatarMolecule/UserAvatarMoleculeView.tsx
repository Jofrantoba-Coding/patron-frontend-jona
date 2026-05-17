// UserAvatarMoleculeView.tsx — JONA View (render puro)
import React from 'react';
import { cn } from '../../lib/cn';
import { JLabel } from '../../atoms/JLabel';
import { InterUserAvatarMolecule, UserAvatarSize } from './InterUserAvatarMolecule';
import { JPanel } from '../../atoms/JPanel/JPanel';

const sizeClasses: Record<UserAvatarSize, { avatar: string; text: string }> = {
  sm: { avatar: 'w-7 h-7 text-xs',     text: 'text-xs' },
  md: { avatar: 'w-10 h-10 text-sm',   text: 'text-sm' },
  lg: { avatar: 'w-14 h-14 text-base', text: 'text-base' },
};

export const UserAvatarMoleculeView: React.FC<InterUserAvatarMolecule> = ({ name, email, size = 'md', className }) => {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <JPanel variant="ghost" padding="none" radius="none" className={cn('flex items-center gap-3', className)}>
      <JPanel variant="ghost" padding="none" radius="none"
        className={cn('rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0', sizeClasses[size].avatar)}
        aria-label={`Avatar of ${name}`}
      >
        {initials || '?'}
      </JPanel>
      <JPanel variant="ghost" padding="none" radius="none" className="min-w-0">
        <JLabel as="span" size="sm" color="default" className="block font-medium truncate">{name}</JLabel>
        {email && <JLabel as="span" size="xs" color="muted" className="block truncate">{email}</JLabel>}
      </JPanel>
    </JPanel>
  );
};
