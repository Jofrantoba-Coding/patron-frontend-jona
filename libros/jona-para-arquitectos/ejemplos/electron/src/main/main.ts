// Proceso principal: el backend del renderizador. Atiende el canal auth:login con el servicio real.
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { AUTH_LOGIN } from '../shared/ipcContract';
import { createAuthServiceHttp } from '../shared/services/AuthServiceHttp';
import { createLoginHandler } from './loginHandler';

// Por defecto, el servidor mock de ../mock-server; para el backend real solo cambia API_URL.
const service = createAuthServiceHttp({ baseUrl: process.env.API_URL ?? 'http://127.0.0.1:4010' });
const handleLogin = createLoginHandler(service);

ipcMain.handle(AUTH_LOGIN, (_event, email: string, password: string) => handleLogin(email, password));

app.whenReady().then(async () => {
  const window = new BrowserWindow({
    width: 420,
    height: 420,
    webPreferences: { preload: path.join(__dirname, '../preload/preload.cjs'), contextIsolation: true, sandbox: true },
  });
  await window.loadFile(path.join(__dirname, '../renderer/index.html'));
});

app.on('window-all-closed', () => app.quit());
