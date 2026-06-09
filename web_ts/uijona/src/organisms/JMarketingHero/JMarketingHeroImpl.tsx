// JMarketingHeroImpl.tsx — JONA Implementation
import React from 'react';
import { InterJMarketingHero, JMARKETING_HERO_DEFAULTS } from './InterJMarketingHero';
import { JMarketingHeroView } from './JMarketingHeroView';

export const JMarketingHeroImpl: React.FC<InterJMarketingHero> = (props) => (
  <JMarketingHeroView {...JMARKETING_HERO_DEFAULTS} {...props} />
);
