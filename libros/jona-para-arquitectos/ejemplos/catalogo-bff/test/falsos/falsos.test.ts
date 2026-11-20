// Los falsos pasan las mismas suites de contrato que los adaptadores HTTP contra los backends.
import { contratoCatalogo } from '../contratos/contratoCatalogo.js';
import { contratoInventario } from '../contratos/contratoInventario.js';
import { crearCatalogoFalso } from './crearCatalogoFalso.js';
import { crearInventarioFalso } from './crearInventarioFalso.js';

contratoCatalogo('falso en memoria', () => crearCatalogoFalso());
contratoInventario('falso en memoria', () => crearInventarioFalso());
