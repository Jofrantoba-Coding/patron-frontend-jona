// Violación de la regla 1: la Implementación del cliente crea el adaptador HTTP del servidor.
// El bundle del navegador arrastra el adaptador, la URL de la API y lo que lea del entorno.
import { useState } from 'react';
import { crearRepositorioHttp } from '../../servidor/adaptadores/crearRepositorioHttp';

export function useUiCatalogoImplCliente() {
  const [productos, setProductos] = useState<unknown[]>([]);
  return {
    productos,
    onBuscar: async (termino: string) => setProductos(await crearRepositorioHttp({ baseUrl: 'http://127.0.0.1:4020' }).listar(termino)),
  };
}
