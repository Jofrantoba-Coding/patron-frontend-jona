// Empaqueta el proceso principal y el preload (el preload aislado no puede importar archivos locales).
import { build } from 'esbuild';

const common = { bundle: true, platform: 'node', format: 'cjs', external: ['electron'], target: 'node22' };
await build({ ...common, entryPoints: ['src/main/main.ts'], outfile: 'dist/main/main.cjs' });
await build({ ...common, entryPoints: ['src/preload/preload.ts'], outfile: 'dist/preload/preload.cjs' });
console.log('main y preload empaquetados en dist/');
