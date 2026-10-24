/**
 * The 13 permission flags of a form (R-ACT-2). Plain data so the Node server can load it; a test pins it to `PERMISSION_FLAGS` of the domain.
 * @type {readonly string[]}
 */
export const PERMISSION_FLAG_NAMES = Object.freeze([
  'add', 'modify', 'eliminate', 'nullify', 'clone', 'details', 'search',
  'report', 'export', 'print', 'printFast', 'close', 'refresh',
]);
