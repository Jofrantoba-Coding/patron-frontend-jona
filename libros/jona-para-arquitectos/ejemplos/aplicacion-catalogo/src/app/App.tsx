import { useState } from 'react';
import type { InterProductoRepositorio } from '../entities/producto';
import { CatalogoPage } from '../pages/catalogo';
import { ProductoPage } from '../pages/producto';

type Pantalla = { nombre: 'catalogo' } | { nombre: 'producto'; id?: string };

/** Capa app: elige la página. El repositorio llega ya creado desde main.tsx (o desde una prueba). */
export function App({ repositorio }: { repositorio: InterProductoRepositorio }) {
  const [pantalla, setPantalla] = useState<Pantalla>({ nombre: 'catalogo' });

  if (pantalla.nombre === 'producto') {
    return <ProductoPage key={pantalla.id ?? 'nuevo'} repositorio={repositorio} id={pantalla.id} onVolver={() => setPantalla({ nombre: 'catalogo' })} />;
  }
  return (
    <CatalogoPage
      repositorio={repositorio}
      onNuevo={() => setPantalla({ nombre: 'producto' })}
      onEditar={(id) => setPantalla({ nombre: 'producto', id })}
    />
  );
}
