import React from 'react';
import { InterJStatCard, JSTAT_CARD_DEFAULTS } from './InterJStatCard';
import { JStatCardView } from './JStatCardView';

export const JStatCardImpl: React.FC<InterJStatCard> = (props) => {
  const resolved = { ...JSTAT_CARD_DEFAULTS, ...props };
  return <JStatCardView {...resolved} />;
};

JStatCardImpl.displayName = 'JStatCard';
