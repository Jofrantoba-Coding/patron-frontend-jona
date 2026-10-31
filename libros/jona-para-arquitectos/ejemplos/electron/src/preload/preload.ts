// preload.ts: expone el canal de IPC al renderizador. Solo datos planos cruzan contextBridge.
import { contextBridge, ipcRenderer } from 'electron';
import { AUTH_LOGIN, type AuthIpcBridge } from '../shared/ipcContract';

const authIpc: AuthIpcBridge = {
  login: (email, password) => ipcRenderer.invoke(AUTH_LOGIN, email, password),
};

contextBridge.exposeInMainWorld('authIpc', authIpc);
