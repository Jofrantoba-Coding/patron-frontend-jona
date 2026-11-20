// Violación de la regla 4: el usuario de la petición se guarda en el módulo. Con dos peticiones a
// la vez, la segunda pisa a la primera y la API recibe el usuario equivocado.
export function fijarUsuario(usuario: string) {
  usuarioActual = usuario;
}

let usuarioActual: string | undefined;

export function crearRepositorioHttp({ baseUrl }: { baseUrl: string }) {
  return {
    listar: (termino = '') => fetch(`${baseUrl}/productos?q=${termino}`, { headers: { 'X-Usuario': usuarioActual ?? '' } }),
  };
}
