import { useEffect, useState } from 'react';
import { BORRADOR_VACIO, borradorDe, type ErroresProducto, type InterProductoRepositorio, type Producto } from '../../../entities/producto';
import type { InterUiFormularioProducto } from './InterUiFormularioProducto';
import { guardarProducto } from './guardarProducto';

type Estado = Omit<InterUiFormularioProducto, 'textoGuardar' | 'textoCancelar' | 'onCancelar'>;

/**
 * Implementación (forma mínima): el estado de la pantalla y su coordinación. Las reglas del
 * producto están en el dominio y la decisión de crear o actualizar en el caso de uso; aquí
 * solo se decide qué mostrar en cada momento. Depende del puerto, nunca de un adaptador.
 */
export function useUiFormularioProductoImpl(
  repositorio: InterProductoRepositorio,
  id: string | undefined,
  onGuardado: (producto: Producto) => void,
): Estado {
  const [borrador, setBorrador] = useState(BORRADOR_VACIO);
  const [errores, setErrores] = useState<ErroresProducto>({});
  const [cargando, setCargando] = useState(id !== undefined);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string>();

  useEffect(() => {
    if (id === undefined) return undefined;
    let vigente = true;
    repositorio
      .obtener(id)
      .then((producto) => {
        if (!vigente) return;
        if (producto) setBorrador(borradorDe(producto));
        else setErrorGeneral('El producto ya no existe');
      })
      .catch(() => vigente && setErrorGeneral('No se pudo cargar el producto'))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [repositorio, id]);

  return {
    borrador,
    errores,
    cargando,
    guardando,
    errorGeneral,
    onCambiar: (campo, valor) => {
      setBorrador((actual) => ({ ...actual, [campo]: valor }));
      setErrores(({ [campo]: _resuelto, ...resto }) => resto);
    },
    onGuardar: async () => {
      setGuardando(true);
      setErrorGeneral(undefined);
      try {
        const resultado = await guardarProducto(repositorio, borrador, id);
        if (resultado.ok) onGuardado(resultado.producto);
        else setErrores(resultado.errores);
      } catch {
        setErrorGeneral('No se pudo guardar. Intente de nuevo.');
      } finally {
        setGuardando(false);
      }
    },
  };
}
