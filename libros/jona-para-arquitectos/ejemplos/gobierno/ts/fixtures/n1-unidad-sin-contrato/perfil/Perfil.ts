import { crearPerfilImpl } from './PerfilImpl';
import { PerfilView } from './PerfilView';

export const Perfil = () => PerfilView(crearPerfilImpl());
