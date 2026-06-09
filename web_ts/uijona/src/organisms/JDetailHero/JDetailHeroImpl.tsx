// JDetailHeroImpl.tsx — JONA Implementation
import React from 'react';
import { InterJDetailHero, JDETAIL_HERO_DEFAULTS } from './InterJDetailHero';
import { JDetailHeroView } from './JDetailHeroView';

export const JDetailHeroImpl: React.FC<InterJDetailHero> = (props) => (
  <JDetailHeroView {...JDETAIL_HERO_DEFAULTS} {...props} />
);
