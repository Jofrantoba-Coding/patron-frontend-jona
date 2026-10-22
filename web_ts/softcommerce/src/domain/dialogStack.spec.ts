import { describe, expect, it } from 'vitest';
import { EMPTY_DIALOG_STACK, popDialog, pushDialog, removeDialog, topDialog } from './dialogStack';

describe('dialogStack', () => {
  it('push makes the new dialog the top without mutating the previous stack', () => {
    const one = pushDialog(EMPTY_DIALOG_STACK, 'a');
    const two = pushDialog(one, 'b');

    expect(topDialog(one)).toBe('a');
    expect(topDialog(two)).toBe('b');
    expect(two).toEqual(['a', 'b']);
    expect(EMPTY_DIALOG_STACK).toEqual([]);
  });

  it('top of an empty stack is undefined', () => {
    expect(topDialog(EMPTY_DIALOG_STACK)).toBeUndefined();
  });

  it('pop removes only the top, down to empty', () => {
    const stack = pushDialog(pushDialog(EMPTY_DIALOG_STACK, 'a'), 'b');

    expect(popDialog(stack)).toEqual(['a']);
    expect(popDialog(popDialog(stack))).toEqual([]);
    expect(popDialog(EMPTY_DIALOG_STACK)).toEqual([]);
  });

  it('remove by id drops that dialog wherever it sits and keeps the order', () => {
    const stack = ['a', 'b', 'c'];

    expect(removeDialog(stack, 'b')).toEqual(['a', 'c']);
    expect(removeDialog(stack, 'c')).toEqual(['a', 'b']);
    expect(removeDialog(stack, 'zzz')).toEqual(['a', 'b', 'c']);
  });

  it('push ignores an id that is already open so one dialog never stacks twice', () => {
    expect(pushDialog(['a', 'b'], 'a')).toEqual(['a', 'b']);
  });
});
