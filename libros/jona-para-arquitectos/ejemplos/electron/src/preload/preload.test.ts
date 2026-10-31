// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

const electron = vi.hoisted(() => ({
  contextBridge: { exposeInMainWorld: vi.fn() },
  ipcRenderer: { invoke: vi.fn() },
}));
vi.mock('electron', () => electron);

describe('preload (sin Electron: contextBridge e ipcRenderer simulados)', () => {
  it('expone window.authIpc, que invoca el canal auth:login con los argumentos del contrato', async () => {
    await import('./preload');
    const [name, bridge] = electron.contextBridge.exposeInMainWorld.mock.calls[0];
    electron.ipcRenderer.invoke.mockResolvedValue({ ok: true, value: 'x' });

    const result = await bridge.login('ana@ejemplo.com', 'secreta123');

    expect(name).toBe('authIpc');
    expect(electron.ipcRenderer.invoke).toHaveBeenCalledWith('auth:login', 'ana@ejemplo.com', 'secreta123');
    expect(result).toEqual({ ok: true, value: 'x' });
  });
});
