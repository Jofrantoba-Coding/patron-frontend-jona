import type { InterProductoRepositorio, Producto } from '../../../entities/producto';
import { UIFORMULARIOPRODUCTO_DEFAULTS } from '../model/InterUiFormularioProducto';
import { useUiFormularioProductoImpl } from '../model/UiFormularioProductoImpl';
import { UiFormularioProductoView } from './UiFormularioProductoView';

export interface UiFormularioProductoProps {
  /** El puerto: quién lo implementa lo decide app. */
  repositorio: InterProductoRepositorio;
  /** Sin id, el formulario crea; con id, edita. */
  id?: string;
  onGuardado: (producto: Producto) => void;
  onCancelar: () => void;
}

/** Entrada (forma mínima, variante a): compone la Implementación y la vista, y aplica los DEFAULTS. */
export function UiFormularioProducto({ repositorio, id, onGuardado, onCancelar }: UiFormularioProductoProps) {
  const impl = useUiFormularioProductoImpl(repositorio, id, onGuardado);
  return <UiFormularioProductoView {...UIFORMULARIOPRODUCTO_DEFAULTS} {...impl} onCancelar={onCancelar} />;
}
