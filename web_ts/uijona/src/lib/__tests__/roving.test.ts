import { nextRovingIndex } from '../roving';

describe('nextRovingIndex (roving focus math)', () => {
  const horizontal = { orientation: 'horizontal' as const };
  const vertical = { orientation: 'vertical' as const, pageStep: 10 };

  it('moves to the next and previous index along its orientation', () => {
    expect(nextRovingIndex(0, 4, 'ArrowRight', horizontal)).toBe(1);
    expect(nextRovingIndex(2, 4, 'ArrowLeft', horizontal)).toBe(1);
    expect(nextRovingIndex(1, 25, 'ArrowDown', vertical)).toBe(2);
    expect(nextRovingIndex(3, 25, 'ArrowUp', vertical)).toBe(2);
  });

  it('does not handle the keys of the other orientation or unrelated keys', () => {
    expect(nextRovingIndex(0, 4, 'ArrowDown', horizontal)).toBeNull();
    expect(nextRovingIndex(0, 25, 'ArrowRight', vertical)).toBeNull();
    expect(nextRovingIndex(0, 25, 'a', vertical)).toBeNull();
    expect(nextRovingIndex(0, 4, 'PageDown', horizontal)).toBeNull();
  });

  it('stays put at the bounds: the key is handled but the index does not change', () => {
    expect(nextRovingIndex(3, 4, 'ArrowRight', horizontal)).toBe(3);
    expect(nextRovingIndex(0, 4, 'ArrowLeft', horizontal)).toBe(0);
    expect(nextRovingIndex(24, 25, 'ArrowDown', vertical)).toBe(24);
  });

  it('jumps to the first and last index with Home and End', () => {
    expect(nextRovingIndex(2, 25, 'Home', vertical)).toBe(0);
    expect(nextRovingIndex(0, 25, 'End', vertical)).toBe(24);
  });

  it('pages by the page step and stops at the bounds', () => {
    expect(nextRovingIndex(0, 25, 'PageDown', vertical)).toBe(10);
    expect(nextRovingIndex(20, 25, 'PageDown', vertical)).toBe(24);
    expect(nextRovingIndex(4, 25, 'PageUp', vertical)).toBe(0);
    expect(nextRovingIndex(14, 25, 'PageUp', vertical)).toBe(4);
  });

  it('skips the indexes that are not enabled', () => {
    const enabled = [true, false, true, true, false];
    const options = { ...horizontal, isEnabled: (index: number) => enabled[index] };

    expect(nextRovingIndex(0, 5, 'ArrowRight', options)).toBe(2);
    expect(nextRovingIndex(2, 5, 'ArrowLeft', options)).toBe(0);
    expect(nextRovingIndex(3, 5, 'ArrowRight', options)).toBe(3);
    expect(nextRovingIndex(0, 5, 'End', options)).toBe(3);
    expect(nextRovingIndex(3, 5, 'Home', { ...options, isEnabled: (index: number) => index > 1 })).toBe(2);
  });

  it('enters from no focus (-1) and handles nothing in an empty list', () => {
    expect(nextRovingIndex(-1, 3, 'ArrowDown', vertical)).toBe(0);
    expect(nextRovingIndex(-1, 3, 'ArrowUp', vertical)).toBe(0);
    expect(nextRovingIndex(0, 0, 'ArrowDown', vertical)).toBeNull();
  });
});
