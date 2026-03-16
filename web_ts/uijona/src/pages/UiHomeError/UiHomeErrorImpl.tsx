// UiHomeErrorImpl.tsx — JONA Layer: Implementation (applies defaults)
import React from 'react';
import { InterUiHomeError, UI_HOME_ERROR_DEFAULTS } from './InterUiHomeError';
import { UiHomeErrorView } from './UiHomeErrorView';

export const UiHomeErrorImpl: React.FC<InterUiHomeError> = (props) => {
  const merged: InterUiHomeError = { ...UI_HOME_ERROR_DEFAULTS, ...props };
  return <UiHomeErrorView {...merged} />;
};
