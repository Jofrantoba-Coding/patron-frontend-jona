// Test support (not imported by the app, so it never ships): a host that can open every named picker, which proves the four that have no consumer yet.
import { useState } from 'react';
import { PICKERS } from '../../../../mock-server/registry/pickers.js';
import { useLookup, type LookupResult } from './useLookup';

export function LookupHarness() {
  const { open, dialog } = useLookup();
  const [picked, setPicked] = useState<LookupResult | undefined>();
  return (
    <div>
      {Object.keys(PICKERS).map((name) => (
        <button key={name} onClick={() => void open(name).then(setPicked)}>{name}</button>
      ))}
      <output>{picked ? JSON.stringify(picked.row) : ''}</output>
      {dialog}
    </div>
  );
}
