/** Stack of open dialog ids (top is last). Esc closes only the top one; every function returns a new stack. */

export type DialogStack = readonly string[];

export const EMPTY_DIALOG_STACK: DialogStack = [];

/** Opening a dialog that is already on the stack keeps the stack as is. */
export function pushDialog(stack: DialogStack, id: string): DialogStack {
  return stack.includes(id) ? stack : [...stack, id];
}

export function popDialog(stack: DialogStack): DialogStack {
  return stack.slice(0, -1);
}

export function topDialog(stack: DialogStack): string | undefined {
  return stack[stack.length - 1];
}

export function removeDialog(stack: DialogStack, id: string): DialogStack {
  return stack.filter((open) => open !== id);
}
