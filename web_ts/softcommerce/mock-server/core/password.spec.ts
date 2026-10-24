import { describe, expect, it } from 'vitest';
import { hashPassword, sha256Hex } from './password.js';

/** `core/password.js` (D16): a sync pure-JS SHA-256, salted with the `id_usuario` of the record. */
describe('sha256Hex', () => {
  it.each([
    ['', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
    ['abc', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
    ['abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq', '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'],
    ['a'.repeat(1000), '41edece42d63e8d9bf515a9ba6932e1c20cbc9f5a5d134645adb5db1b9737ea3'],
  ])('hashes %j to the known vector', (text, hex) => {
    expect(sha256Hex(text)).toBe(hex);
  });

  it('encodes the text as UTF-8 (the same digest as the platform)', async () => {
    const bytes = new TextEncoder().encode('contraseña');
    const platform = Buffer.from(await crypto.subtle.digest('SHA-256', bytes)).toString('hex');
    expect(sha256Hex('contraseña')).toBe(platform);
  });
});

describe('hashPassword', () => {
  it('is deterministic and never holds the plaintext', () => {
    const hash = hashPassword('7', 'secreto1');
    expect(hash).toBe(hashPassword('7', 'secreto1'));
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toContain('secreto1');
  });

  it('is salted with the id: the same password hashes differently for two users', () => {
    expect(hashPassword('1', 'igual')).not.toBe(hashPassword('2', 'igual'));
  });

  it('takes a numeric id like the text one', () => {
    expect(hashPassword(7, 'x')).toBe(hashPassword('7', 'x'));
  });
});
