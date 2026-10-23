import { PERMISSION_FLAGS } from '../../src/domain/permissions';

/**
 * R-REG-9: every entry with a `formId` needs its 13 permission flags in
 * `permissions.json`, and every entry with a `menu` its node in `menu.json`
 * (right parent and label). Each problem names the catalog and the formId.
 */
export function menuPermissionProblems(entries: any[], menu: any[], permissions: Record<string, any>): string[] {
  const problems: string[] = [];
  for (const entry of entries.filter((e) => e.formId)) {
    const { slug, formId } = entry;
    const grant = permissions[formId];
    if (!grant) problems.push(`${slug}: formId "${formId}" has no permissions.json grant`);
    else for (const flag of PERMISSION_FLAGS) if (typeof grant[flag] !== 'boolean') problems.push(`${slug}: formId "${formId}" lacks the permission flag "${flag}"`);
    if (!entry.menu) continue;
    const node = menu.find((n) => n.nombre === formId);
    if (!node) {
      problems.push(`${slug}: formId "${formId}" has no menu.json node`);
      continue;
    }
    const parent = menu.find((n) => n.id_menu === node.id_menu_padre);
    if (parent?.nombre !== entry.menu.parent) problems.push(`${slug}: menu node "${formId}" is not under "${entry.menu.parent}"`);
    if (node.descripcion !== entry.menu.label) problems.push(`${slug}: menu node "${formId}" is labeled "${node.descripcion}", the entry says "${entry.menu.label}"`);
  }
  return problems;
}
