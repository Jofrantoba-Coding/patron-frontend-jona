// Violación: el organismo pide sus filas al servidor; la tabla debía recibirlas.
import { useEffect, useState } from 'react';

export function JTableImpl() {
  const [filas, setFilas] = useState<unknown[]>([]);
  useEffect(() => {
    fetch('/api/productos').then((r) => r.json()).then(setFilas);
  }, []);
  return filas.length;
}
