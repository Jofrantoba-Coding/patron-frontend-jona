// Violación de la regla 4: el sitio se calcula una vez, al cargar el módulo. Es estado de módulo,
// y la prueba que quiera otro SITIO_URL ya no puede pedirlo.
const sitio = { url: process.env.SITIO_URL ?? 'https://catalogo.example', nombre: 'Tienda JONA', idioma: 'es-PE' };

export function crearRaizComposicion() {
  return { sitio };
}
