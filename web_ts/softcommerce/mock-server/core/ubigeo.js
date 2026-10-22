/** INEI code length per level: departamento, provincia, distrito. */
const LEVEL_LENGTHS = [2, 4, 6];

/**
 * Children of a ubigeo node. The child level is derived from the parent code
 * length (S-MOCK-8); an empty parent means departamentos. Unknown or malformed
 * parents and distritos yield an empty list, never an error (S-MOCK-9).
 * @param {{ shared: { ubigeo: { id: string, name: string }[] } }} store
 * @param {string} [parent]
 * @returns {{ items: { id: string, name: string }[] }}
 */
export function childrenOf(store, parent = '') {
  const parentLevel = parent === '' ? -1 : LEVEL_LENGTHS.indexOf(parent.length);
  const childLength = parentLevel === -1 && parent !== '' ? undefined : LEVEL_LENGTHS[parentLevel + 1];
  if (childLength === undefined) return { items: [] };
  const items = store.shared.ubigeo.filter(
    (u) => u.id.length === childLength && u.id.startsWith(parent),
  );
  return { items: structuredClone(items) };
}
