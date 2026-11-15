// @vitest-environment node
import { contratoRepositorio } from './contratoRepositorio';
import { crearRepositorioMemoria } from './crearRepositorioMemoria';

contratoRepositorio('adaptador en memoria', () => crearRepositorioMemoria());
