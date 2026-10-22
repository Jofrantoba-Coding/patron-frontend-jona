// Layer: Implementation. Filter state of the stub and the actions its permissions grant.
import { useState } from 'react';
import { PERMISSION_FLAGS, type Permissions } from '../../domain/permissions';
import type { InterUiDemoStub } from './InterUiDemoStub';

export function useUiDemoStubImpl(permissions: Permissions): InterUiDemoStub {
  const [filter, setFilter] = useState('');
  return {
    filter,
    grantedActions: PERMISSION_FLAGS.filter((flag) => permissions[flag]),
    onFilterChange: setFilter,
  };
}
