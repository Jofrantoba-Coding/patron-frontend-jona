// Violación: el dominio depende de React; ya no se prueba ni se reutiliza sin el framework.
import { useState } from 'react';

export function useValidarProducto() {
  return useState<Record<string, string>>({});
}
