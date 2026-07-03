// JLogoMarqueeImpl.tsx — JONA Implementation
import React from 'react';
import { InterJLogoMarquee, JLOGO_MARQUEE_DEFAULTS } from './InterJLogoMarquee';
import { JLogoMarqueeView } from './JLogoMarqueeView';

export const JLogoMarqueeImpl: React.FC<InterJLogoMarquee> = (props) => (
  <JLogoMarqueeView {...JLOGO_MARQUEE_DEFAULTS} {...props} />
);

JLogoMarqueeImpl.displayName = 'JLogoMarquee';
