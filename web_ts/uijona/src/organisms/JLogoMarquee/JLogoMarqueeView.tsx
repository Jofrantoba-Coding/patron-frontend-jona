// JLogoMarqueeView.tsx — JONA View (render puro, Tailwind autocontenido)
import React from 'react';
import { cn } from '../../lib/cn';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';
import { InterJLogoMarquee, JLogoMarqueeSpeed } from './InterJLogoMarquee';

const speedClasses: Record<JLogoMarqueeSpeed, string> = {
  slow:   'animate-[marquee_48s_linear_infinite]',
  normal: 'animate-[marquee_32s_linear_infinite]',
  fast:   'animate-[marquee_20s_linear_infinite]',
};

export const JLogoMarqueeView: React.FC<InterJLogoMarquee> = ({
  items,
  label,
  speed = 'normal',
  pauseOnHover = true,
  as = 'section',
  className,
}) => {
  const Tag = as;
  return (
    <Tag className={cn('w-full py-10', className)}>
      {label && (
        <JLabel as="p" className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
          {label}
        </JLabel>
      )}
      <JPanel
        variant="ghost"
        padding="none"
        radius="none"
        className={cn(
          'group relative overflow-hidden',
          '[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
        )}
      >
        <JPanel
          variant="ghost"
          padding="none"
          radius="none"
          className={cn(
            'flex w-max items-center gap-14 pr-14',
            speedClasses[speed],
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
            'motion-reduce:animate-none',
          )}
        >
          {[...items, ...items].map((item, i) => (
            <JPanel
              key={i}
              variant="ghost"
              padding="none"
              radius="none"
              className="flex shrink-0 items-center text-neutral-400 grayscale transition-colors"
              aria-hidden={i >= items.length ? true : undefined}
            >
              {item}
            </JPanel>
          ))}
        </JPanel>
      </JPanel>
    </Tag>
  );
};
