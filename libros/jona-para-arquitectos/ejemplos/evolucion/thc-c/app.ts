// Punto de entrada que se empaqueta en la observación 3: la aplicación usa el hook, el hook usa el Composer.
import { useCrearCuenta } from './hooks/useCrearCuenta.js';

const hook = useCrearCuenta();
hook.updateField('email', 'ana@ejemplo.com');
export const registrar = hook.registrar;
