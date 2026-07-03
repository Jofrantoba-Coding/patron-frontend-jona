// JGlyphImpl.tsx — JONA Implementation
import React from 'react';
import { InterJGlyph, JGLYPH_DEFAULTS } from './InterJGlyph';
import { JGlyphView } from './JGlyphView';

export const JGlyphImpl: React.FC<InterJGlyph> = (props) => <JGlyphView {...JGLYPH_DEFAULTS} {...props} />;

JGlyphImpl.displayName = 'JGlyph';
