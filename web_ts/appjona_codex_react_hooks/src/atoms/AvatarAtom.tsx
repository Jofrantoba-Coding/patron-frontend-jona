export interface AvatarAtomProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

function getInitials(name: string): string {
  const tokens = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (tokens.length === 0) {
    return '?';
  }

  return tokens.map((token) => token[0]?.toUpperCase() ?? '').join('');
}

export function AvatarAtom({ name, size = 'md' }: AvatarAtomProps) {
  const classes = ['avatar-atom', `avatar-atom--${size}`].join(' ');

  return <div className={classes}>{getInitials(name)}</div>;
}
