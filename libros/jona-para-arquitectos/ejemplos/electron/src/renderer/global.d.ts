import type { AuthIpcBridge } from "../shared/ipcContract";

declare global {
  interface Window {
    /** Lo expone el preload (src/preload/preload.ts). */
    authIpc?: AuthIpcBridge;
  }
}
