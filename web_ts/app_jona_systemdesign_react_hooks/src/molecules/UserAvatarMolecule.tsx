// UserAvatarMolecule.tsx — Level 2: Molecule
// Avatar initials + user info. Inspired by natds-rn Avatar usage.
import React from 'react';
import { cn } from '../lib/cn';
import { TextAtom } from '../atoms/TextAtom';

type AvatarSize = 'sm' | 'md' | 'lg';

interface UserAvatarMoleculeProps {
  name: string;
  email?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, { avatar: string; text: string }> = {
  sm: { avatar: 'w-7 h-7 text-xs',  text: 'text-xs' },
  md: { avatar: 'w-10 h-10 text-sm', text: 'text-sm' },
  lg: { avatar: 'w-14 h-14 text-base', text: 'text-base' },
};

export const UserAvatarMolecule: React.FC<UserAvatarMoleculeProps> = ({
  name,
  email,
  size = 'md',
  className,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0',
          sizeClasses[size].avatar
        )}
        aria-label={`Avatar of ${name}`}
      >
        {initials || '?'}
      </div>
      <div className="min-w-0">
        <TextAtom as="span" size="sm" color="default" className="block font-medium truncate">
          {name}
        </TextAtom>
        {email && (
          <TextAtom as="span" size="xs" color="muted" className="block truncate">
            {email}
          </TextAtom>
        )}
      </div>
    </div>
  );
};
