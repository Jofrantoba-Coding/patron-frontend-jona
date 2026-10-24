// Typed-code rule of a lookup field (R-LKP-6). Pure.

/**
 * A code shorter than the target's code width and not exactly 8 characters is left-padded with zeros to that width (the desktop
 * `buscarVendedor` / `buscarTransportista` rule for anexo ids; an 8-character code is a DNI and stays as typed). Width 0 means no padding.
 */
export function padTypedCode(code: string, width: number): string {
  const typed = code.trim();
  return width > 0 && typed.length > 0 && typed.length < width && typed.length !== 8 ? typed.padStart(width, '0') : typed;
}
