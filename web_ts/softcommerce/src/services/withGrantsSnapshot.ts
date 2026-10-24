import { DENY_ALL } from '../domain/permissions';
import type { GrantsSnapshot } from './InterGrantsService';
import type { InterShellService } from './InterShellService';

/**
 * The shell service of an open session (R-AUTH-11, [DEVIATION] from the desktop, which reads a form's grants each time it opens): the menu and
 * the flags come from the snapshot taken at login, so a perfil edit applies at the next login. A form the snapshot does not hold is denied.
 * With no snapshot (before login, or a session stored without one) every call goes to the server.
 */
export function withGrantsSnapshot(shell: InterShellService, getGrants: () => GrantsSnapshot | undefined): InterShellService {
  return {
    menu: async () => getGrants()?.menu ?? shell.menu(),
    permissions: async (formId) => {
      const grants = getGrants();
      if (!grants) return shell.permissions(formId);
      return Object.prototype.hasOwnProperty.call(grants.permissions, formId) ? grants.permissions[formId] : { ...DENY_ALL };
    },
  };
}
